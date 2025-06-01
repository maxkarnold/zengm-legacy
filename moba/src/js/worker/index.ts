/// <reference lib="webworker" />

console.log('Starting worker initialization');

// import "../common/polyfills.ts";
import api from "./api/index";
import * as common from "../common/index";
import * as core from "./core/index";
import * as db from "./db/index";
import * as util from "./util/index";

console.log('Imports loaded in worker');

declare global {
	interface WorkerGlobalScope {
		bbgm: any;
	}
}

declare const self: WorkerGlobalScope;

self.bbgm = { api, ...common, ...core, ...db, ...util };

console.log('bbgm object initialized');

if (process.env.NODE_ENV === "development") {
	console.log('Loading debug in development mode');
	import("./core/debug/debug").then(({ default: debug }) => {
		self.bbgm.debug = debug;
		console.log('Debug loaded');
	});
}

export type WorkerAPICategory =
	| "actions"
	| "exhibitionGame"
	| "leagueFileUpload"
	| "main"
	| "playMenu"
	| "toolsMenu";

// API functions should have at most 2 arguments. First argument is passed here from toWorker. If you need to pass multiple variables, use an object/array. Second argument is Conditions.

(async () => {
	console.log('Starting worker registration');
	util.promiseWorker.register(([type, name, param], hostID) => {
		const conditions = {
			hostID,
		};

		// @ts-expect-error
		if (!api[type] || !Object.hasOwn(api[type], name)) {
			throw new Error(
				`API call to nonexistant worker function "${type}.${name}"`,
			);
		}

		// https://github.com/microsoft/TypeScript/issues/21732
		return api[type][name](param, conditions);
	});
	console.log('Worker registration complete');
})();
