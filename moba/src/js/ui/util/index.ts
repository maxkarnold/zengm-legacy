import PromiseWorker from 'promise-worker-bi';

const worker = window.useSharedWorker ? new SharedWorker('/gen/worker.js') : new Worker('/gen/worker.js');
export const promiseWorker = new PromiseWorker(worker);
promiseWorker.registerError((e) => {
    if (window.Bugsnag) {
        window.Bugsnag.notifyException(new Error(e.message), 'ErrorInWorker', {
            colno: e.colno,
            lineno: e.lineno,
            groupingHash: JSON.stringify([e.message, e.colno, e.lineno]),
        });
    }
    console.error('Error from worker:');
    console.error(e);
});

export {default as ads} from './ads';
export {default as emitter} from './emitter';
export {default as genStaticPage} from './genStaticPage';
export {default as getCols} from './getCols';
export {default as getScript} from './getScript';
export {default as initView} from './initView';
export {default as logEvent} from './logEvent';
export {default as notify} from './notify';
export {default as realtimeUpdate} from './realtimeUpdate';
export {default as setTitle} from './setTitle';
export {default as toWorker} from './toWorker';

import initView from './initView';
import processInputs from '../processInputs';
import * as views from '../views';

export const genPage = (id: string, inLeague = true) => {
    // Special cases for components with non-standard naming
    if (id === 'historyAllMSI') {
        return initView({
            id,
            inLeague,
            get: processInputs.hasOwnProperty(id) ? processInputs[id] : undefined,
            Component: views.HistoryAllMSI,
        });
    }
    if (id === 'customChampions') {
        return initView({
            id,
            inLeague,
            get: processInputs.hasOwnProperty(id) ? processInputs[id] : undefined,
            Component: views.CustomChampions,
        });
    }
    if (id === 'dashboard') {
        return initView({
            id,
            inLeague,
            get: processInputs.hasOwnProperty(id) ? processInputs[id] : undefined,
            Component: views.Dashboard,
        });
    }

    // Convert camelCase to PascalCase for other components
    const componentName = id.split(/(?=[A-Z])/).map(part =>
        part.charAt(0).toUpperCase() + part.slice(1)
    ).join('');

    if (!views[componentName]) {
        throw new Error(`Component ${componentName} not found in views. Available components: ${Object.keys(views).join(', ')}`);
    }

    return initView({
        id,
        inLeague,
        get: processInputs.hasOwnProperty(id) ? processInputs[id] : undefined,
        Component: views[componentName],
    });
};
