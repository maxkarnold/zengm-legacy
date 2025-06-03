import '../vendor/babel-external-helpers';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import api from './api';
import Controller from './components/Controller';
import {promiseWorker, toWorker} from './util';
import type {Env} from '../common/window.types';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { useEffect } from 'react';
import { setGlobalNavigate } from './util/realtimeUpdate';

// Import CSS
import '../../css/bbgm.scss';

// Add window type definitions
declare global {
    interface Window {
        enableLogging?: boolean;
        inCordova?: boolean;
        tld?: string;
        useSharedWorker?: boolean;
        gtag?: (command: string, action: string, params: any) => void;
        bbgmAds?: {
            cmd: Array<() => void>;
            refresh: () => void;
        };
    }
}

// Error page component
const ErrorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const error = location.state?.error;

    useEffect(() => {
        if (error?.message === 'League not found.') {
            error.message = 'League not found. Create a new league or load an existing league to play!';
        }
    }, [error]);

    return (
        <div>
            <h1>Error</h1>
            <h2>{error?.message || 'Page not found.'}</h2>
            {error?.message === 'League not found.' && (
                <div>
                    <a href="/new_league">Create a new league</a> or <a href="/">load an existing league</a> to play!
                </div>
            )}
        </div>
    );
};

function AppRouter() {
    const navigate = useNavigate();

    // Set up the global navigate function
    useEffect(() => {
        setGlobalNavigate(navigate);
    }, [navigate]);

    const element = useRoutes([
        ...routes,
        {
            path: '*',
            element: <ErrorPage />
        }
    ]);
    return element;
}

createRoot(document.getElementById("content")!).render(
    <BrowserRouter>
        <AppRouter />
    </BrowserRouter>
);

// source-map-support is no longer needed here because no Promise polyfill in the UI, only sometimes in the worker.

promiseWorker.register(([name, ...params]) => {
    if (!api.hasOwnProperty(name)) {
        throw new Error(`API call to nonexistant UI function "${name}" with params ${JSON.stringify(params)}`);
    }

    return api[name](...params);
});

(async () => {
    let heartbeatID = sessionStorage.getItem('heartbeatID');
    if (heartbeatID === null || heartbeatID === undefined) {
        heartbeatID = Math.random().toString(16).slice(2);
        sessionStorage.setItem('heartbeatID', heartbeatID);
    }

    const env: Env = {
        enableLogging: window.enableLogging,
        inCordova: window.inCordova,
        heartbeatID,
        tld: window.tld,
        useSharedWorker: window.useSharedWorker,

        // These are just legacy variables sent to the worker to be stored in idb.meta.attributes
        fromLocalStorage: {
            changesRead: localStorage.getItem('changesRead'),
            lastSelectedTid: localStorage.getItem('lastSelectedTid'),
            nagged: localStorage.getItem('nagged'),
        },
    };

    await toWorker('init', env);

    // Check for stored updates
    const storedUpdate = sessionStorage.getItem('bbgm-update');
    if (storedUpdate) {
        try {
            const { updateEvents, raw, timestamp } = JSON.parse(storedUpdate);
            // Clear the stored update
            sessionStorage.removeItem('bbgm-update');

            // Process the update events
            if (updateEvents && updateEvents.length > 0) {
                await toWorker('processUpdateEvents', updateEvents);
            }

            // Process any raw data
            if (raw && Object.keys(raw).length > 0) {
                await toWorker('processRawData', raw);
            }
        } catch (error) {
            console.error('Error processing stored update:', error);
        }
    }

    // Initialize the app
    const root = document.getElementById('content');
    if (root) {
        createRoot(root).render(<Controller />);
    }

    // Handle analytics and ads
    let initialLoad = true;
    const handleRouteChange = () => {
        if (!initialLoad && window.enableLogging && window.gtag) {
            const pagePath = window.location.pathname.replace(/^\/l\/[0-9]+/, "/l/0");
            window.gtag("event", "page_view", {
                page_path: pagePath,
                page_location: window.location.origin + pagePath,
            });
        }

        if (!initialLoad && window.bbgmAds) {
            window.bbgmAds.cmd.push(() => {
                window.bbgmAds?.refresh();
            });
        } else {
            initialLoad = false;
        }
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
})();

// Legacy code - moved to React Router in generalRoutes.tsx
/*
const Manual = <div>
    <h1>Manual</h1>
    <p><a href="https://basketball-gm.com/manual/" rel="noopener noreferrer" target="_blank">Click here for an overview of MOBA GM.</a></p>
</div>;
*/
