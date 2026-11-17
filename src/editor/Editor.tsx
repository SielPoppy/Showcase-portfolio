import { useEffect, useState, type ChangeEvent } from 'react';
import App from '../App';
import type { Media, PersonalInfo, PortfolioContent, Project } from '../data/portfolio';
import { validatePortfolio } from '../data/validatePortfolio';

const headers = { 'X-Portfolio-Editor': '1' };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/__editor/${path}`, { ...options, headers: { ...headers, ...options.headers } });
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('The local editor is not running.');
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? 'The editor request failed.');
  return data as T;
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="editor-field"><span>{label}</span>{multiline
    ? <textarea value={value} rows={4} onChange={(event) => onChange(event.target.value)} />
    : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function MediaEditor({ label, media, onChange, images = true, onError, onBusy }: { label: string; media: Media[]; onChange: (value: Media[]) => void; images?: boolean; onError: (value: string) => void; onBusy: (value: boolean) => void }) {
  const [uploading, setUploading] = useState(false);
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    if (!files.length) return;
    setUploading(true); onBusy(true);
    // Apply successful uploads even if a subsequent file fails.
    const added: Media[] = [];
    try {
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name} is larger than 10 MB.`);
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Choose PNG, JPEG, or WebP images.');
        const uploaded = await request<{ src: string }>('images', { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
        added.push({ src: uploaded.src, description: file.name.replace(/\.[^.]+$/, '').replace(/-/g, ' ') });
      }
    } catch (error) { onError((error as Error).message); }
    finally { if (added.length) onChange([...media, ...added]); setUploading(false); onBusy(false); }
  }
  return <fieldset className="editor-section" disabled={uploading}>
    <legend>{label}</legend>
    {images && <label className="editor-upload">{uploading ? 'Uploading…' : 'Add pictures from your computer'}<input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={upload} /></label>}
    <p className="editor-help">{images ? 'PNG, JPEG, or WebP, up to 10 MB each. The first project picture is the card preview. Removing an entry keeps its file on disk.' : 'Paste an HTTPS video link. YouTube links can be played in the portfolio demo viewer.'}</p>
    {media.map((item, index) => <div className="editor-media" key={index}>
      {images && item.src && <img src={item.src} alt={item.description || 'Picture preview'} />}
      <Field label={images ? `Picture ${index + 1} path or HTTPS URL` : `Video ${index + 1} URL`} value={item.src} onChange={(src) => onChange(media.map((value, i) => i === index ? { ...value, src } : value))} />
      <Field label="Caption and image description" value={item.description ?? ''} onChange={(description) => onChange(media.map((value, i) => i === index ? { ...value, description } : value))} />
      <div className="editor-actions">
        <button type="button" disabled={index === 0} onClick={() => { const copy = [...media]; [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]; onChange(copy); }}>Move up</button>
        <button type="button" disabled={index === media.length - 1} onClick={() => { const copy = [...media]; [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]]; onChange(copy); }}>Move down</button>
        <button type="button" onClick={() => onChange(media.filter((_, i) => i !== index))}>Remove entry</button>
      </div>
    </div>)}
    <button type="button" onClick={() => onChange([...media, { src: '', description: '' }])}>Add {images ? 'picture URL' : 'video link'}</button>
  </fieldset>;
}

export default function Editor() {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [saved, setSaved] = useState('');
  const [revision, setRevision] = useState('');
  const [selected, setSelected] = useState('profile');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [draft, setDraft] = useState<PortfolioContent | null>(null);
  const dirty = content !== null && JSON.stringify(content) !== saved;

  useEffect(() => {
    if (error) document.querySelector('.editor-error')?.scrollIntoView({ block: 'center' });
  }, [error]);

  useEffect(() => {
    request<{ content: PortfolioContent; revision: string }>('content').then((result) => {
      validatePortfolio(result.content);
      setContent(result.content); setSaved(JSON.stringify(result.content)); setRevision(result.revision);
      try {
        const previous = JSON.parse(localStorage.getItem('portfolio-editor-draft') ?? 'null');
        if (previous?.content) { validatePortfolio(previous.content); if (JSON.stringify(previous.content) !== JSON.stringify(result.content)) setDraft(previous.content); }
      } catch { /* An invalid browser draft never replaces the saved portfolio. */ }
    }).catch((error: Error) => setError(`${error.message} Start the editor with “Edit Portfolio.cmd” or “npm run edit”.`));
  }, []);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty || uploading) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, uploading]);

  useEffect(() => {
    if (!content) return;
    try {
      if (dirty) localStorage.setItem('portfolio-editor-draft', JSON.stringify({ content }));
      else if (!draft) localStorage.removeItem('portfolio-editor-draft');
    } catch { /* Saving to disk still works if browser storage is unavailable. */ }
  }, [content, dirty, draft]);

  async function save() {
    if (!content) return;
    setError(''); setNotice('');
    try {
      validatePortfolio(content); setSaving(true);
      const result = await request<{ revision: string }>('content', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'If-Match': revision }, body: JSON.stringify(content) });
      setRevision(result.revision); setSaved(JSON.stringify(content)); setDraft(null);
      try { localStorage.removeItem('portfolio-editor-draft'); } catch { /* Optional browser draft cleanup. */ }
      setNotice('Saved to the portfolio folder. Publish through your usual Cloudflare Pages deployment.');
    } catch (error) { setError((error as Error).message); }
    finally { setSaving(false); }
  }

  function exportDraft() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'portfolio-backup.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function updateProject(update: Partial<Project>) {
    if (!content) return;
    setContent({ ...content, projects: content.projects.map((project) => project.id === selected ? { ...project, ...update } : project) });
  }

  function addProject() {
    if (!content) return;
    const id = `project-${crypto.randomUUID().slice(0, 8)}`;
    setContent({ ...content, projects: [...content.projects, { id, title: 'New project', company: 'Personal Project', role: 'Creator', duration: '2026 - Present', description: 'Describe what you built and why.', type: 'project', skills: [], projectImages: [] }] });
    setSelected(id); setNotice('New project added to your draft. Fill in its details, then save.');
  }

  if (!content) return <main className="portfolio-editor"><h1>Portfolio editor</h1><p role={error ? 'alert' : 'status'}>{error || 'Loading your portfolio…'}</p></main>;
  if (preview) return <><div className="editor-preview-bar"><button onClick={() => setPreview(false)}>Back to editing</button><span>Preview of your {dirty ? 'unsaved changes' : 'saved content'}</span></div><App content={content} /></>;
  const project = content.projects.find((item) => item.id === selected);
  const study = project?.caseStudy ?? { problem: '', contributions: [], approach: '', result: '' };
  const profileFields: [keyof PersonalInfo, string][] = [['name', 'Name'], ['title', 'Professional title'], ['status', 'Availability'], ['heroSummary', 'Introduction'], ['email', 'Primary email'], ['phone', 'Phone'], ['linkedin', 'LinkedIn URL'], ['resumeUrl', 'CV file path or HTTPS URL'], ['contactMessage', 'Contact message']];

  return <main className="portfolio-editor">
    <header className="editor-header"><div><h1>Portfolio editor</h1><p>Change your content and pictures here. Saving updates the files on this computer; deployment publishes them.</p></div>
      <div className="editor-actions"><span role="status">{dirty ? 'Unsaved changes' : 'All changes saved'}</span><button type="button" onClick={() => setPreview(true)} disabled={uploading}>Preview</button><button type="button" disabled={!dirty || uploading || saving} onClick={() => { if (window.confirm('Discard your unsaved changes and return to the last saved content?')) { setContent(JSON.parse(saved)); setSelected('profile'); setDraft(null); localStorage.removeItem('portfolio-editor-draft'); } }}>Discard changes</button><button type="button" className="editor-primary" disabled={saving || uploading || !dirty} onClick={save}>{saving ? 'Saving…' : 'Save changes'}</button></div>
    </header>
    {error && <p className="editor-error" role="alert">{error}</p>}{notice && <p className="editor-notice" role="status">{notice}</p>}
    {draft && <div className="editor-notice"><p>A previous browser draft is available. Your saved files have not been changed.</p><button onClick={() => { setContent(draft); setDraft(null); setSelected('profile'); }}>Restore draft</button><button onClick={() => { setDraft(null); localStorage.removeItem('portfolio-editor-draft'); }}>Dismiss draft</button></div>}
    <div className="editor-layout">
      <nav className="editor-sidebar" aria-label="Editor sections"><button type="button" aria-current={selected === 'profile' ? 'page' : undefined} onClick={() => setSelected('profile')}>Profile and contact</button>
        <h2>Projects</h2>{content.projects.map((item) => <button type="button" key={item.id} aria-current={selected === item.id ? 'page' : undefined} onClick={() => setSelected(item.id)}>{content.featuredProjectIds.includes(item.id) ? '★ ' : ''}{item.title}</button>)}
        <button type="button" onClick={addProject} disabled={uploading}>Add project</button><hr /><button type="button" onClick={exportDraft}>Export backup</button>
        <label className="editor-upload">Import backup<input type="file" accept="application/json,.json" onChange={async (event) => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; try { if (file.size > 2 * 1024 * 1024) throw new Error('Backup exceeds 2 MB.'); const value: unknown = JSON.parse(await file.text()); validatePortfolio(value); setDraft(value); setNotice('Imported backup is ready to restore. Images must also be present in the portfolio folder.'); } catch (error) { setError((error as Error).message); } }} /></label>
      </nav>
      <form className="editor-form" onSubmit={(event) => { event.preventDefault(); void save(); }}>
        <fieldset disabled={saving || uploading}>
          {selected === 'profile' ? <><h2>Profile and contact</h2>{profileFields.map(([key, label]) => <Field key={key} label={label} value={content.personalInfo[key]} multiline={key === 'contactMessage' || key === 'heroSummary'} onChange={(value) => setContent({ ...content, personalInfo: { ...content.personalInfo, [key]: value } })} />)}</> : project && <>
            <h2>{project.title}</h2>
            <label className="editor-checkbox"><input type="checkbox" checked={content.featuredProjectIds.includes(project.id)} onChange={(event) => setContent({ ...content, featuredProjectIds: event.target.checked ? [...content.featuredProjectIds, project.id] : content.featuredProjectIds.filter((id) => id !== project.id) })} />Feature this project</label>
            {(['title', 'company', 'role', 'duration', 'description', 'url'] as const).map((key) => <Field key={key} label={{ title: 'Project title', company: 'Company or context', role: 'Your role', duration: 'Dates', description: 'Short description', url: 'Live website URL' }[key]} value={project[key] ?? ''} multiline={key === 'description'} onChange={(value) => updateProject({ [key]: value })} />)}
            <label className="editor-field"><span>Experience type</span><select value={project.type} onChange={(event) => updateProject({ type: event.target.value })}><option value="project">Project</option><option value="job">Job</option><option value="internship">Internship</option></select></label>
            <fieldset className="editor-section"><legend>Problem and contribution</legend>
              <Field label="The problem" value={study.problem} multiline onChange={(problem) => updateProject({ caseStudy: { ...study, problem } })} />
              <Field label="Your contributions — one bullet per line" value={study.contributions.join('\n')} multiline onChange={(value) => updateProject({ caseStudy: { ...study, contributions: value.split('\n') } })} />
              <Field label="How it works and technical decisions" value={study.approach} multiline onChange={(approach) => updateProject({ caseStudy: { ...study, approach } })} />
              <Field label="Result and impact" value={study.result} multiline onChange={(result) => updateProject({ caseStudy: { ...study, result } })} />
            </fieldset>
            <fieldset className="editor-section"><legend>Skills and how you used them</legend>{project.skills.map((skill, index) => <div className="editor-skill" key={index}><Field label={`Skill ${index + 1}`} value={skill.name} onChange={(name) => updateProject({ skills: project.skills.map((item, i) => i === index ? { ...item, name } : item) })} /><Field label="Your work with this skill" value={skill.usage} onChange={(usage) => updateProject({ skills: project.skills.map((item, i) => i === index ? { ...item, usage } : item) })} /><button type="button" onClick={() => updateProject({ skills: project.skills.filter((_, i) => i !== index) })}>Remove skill</button></div>)}<button type="button" onClick={() => updateProject({ skills: [...project.skills, { name: '', usage: '' }] })}>Add skill</button></fieldset>
            <MediaEditor key={`${project.id}-pictures`} label="Project pictures" media={project.projectImages ?? []} onChange={(projectImages) => updateProject({ projectImages })} onError={setError} onBusy={setUploading} />
            <MediaEditor key={`${project.id}-branding`} label="Branding and other images" media={project.images ?? []} onChange={(images) => updateProject({ images })} onError={setError} onBusy={setUploading} />
            <MediaEditor key={`${project.id}-videos`} label="Video demos" images={false} media={project.projectVideo ?? []} onChange={(projectVideo) => updateProject({ projectVideo })} onError={setError} onBusy={setUploading} />
            {project.videoId && <Field label="Legacy YouTube video ID" value={project.videoId} onChange={(videoId) => updateProject({ videoId: videoId || undefined })} />}
            <div className="editor-actions"><button type="button" onClick={() => { const index = content.projects.findIndex((item) => item.id === project.id); if (index > 0) { const copy = [...content.projects]; [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]; setContent({ ...content, projects: copy }); } }}>Move project earlier</button><button type="button" onClick={() => { if (window.confirm(`Remove “${project.title}” from the portfolio? You can undo this until you save.`)) { setContent({ ...content, projects: content.projects.filter((item) => item.id !== project.id), featuredProjectIds: content.featuredProjectIds.filter((id) => id !== project.id) }); setSelected('profile'); } }}>Remove project</button></div>
          </>}
        </fieldset>
      </form>
    </div>
  </main>;
}
