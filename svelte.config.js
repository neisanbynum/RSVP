import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true
		},
		alias: {
			"$routes": "src/routes",
			"$route-components": "src/route-components",
			"$remote": "src/lib/remote"
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
