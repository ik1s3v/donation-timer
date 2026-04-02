import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
	plugins: [pluginReact()],
	html: {
		title: "Widget",
	},
	source: {
		entry: {
			index: "./view/index.tsx",
		},
	},
	output: {
		cleanDistPath: false,
		filenameHash: false,
		distPath: {
			root: "dist/view",
			js: "",
		},
		assetPrefix: "./",
		injectStyles: true,
		copy: [{ from: "manifest.json", to: "../manifest.json" }],
	},
	performance: {
		chunkSplit: {
			strategy: "all-in-one",
		},
	},
});
