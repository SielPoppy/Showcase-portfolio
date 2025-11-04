// Module declarations for importing image assets in TypeScript
declare module '*.png' { const value: string; export default value; }
declare module '*.jpg' { const value: string; export default value; }
declare module '*.jpeg' { const value: string; export default value; }
declare module '*.svg' { const value: string; export default value; }
declare module '*.webp' { const value: string; export default value; }
// Allow side-effect and module imports of CSS files in TypeScript
declare module '*.css' {
	const content: string;
	export default content;
}
