import type {UpdateEvents} from '../../common/types';

/**
 * Smartly update the currently loaded view or redirect to a new one.
 *
 * This will only refresh or redirect to in-league URLs (and a couple out of league). Otherwise, the callback is just called immediately.
 *
 * @memberOf ui
 * @param {Array.<string>=} updateEvents Optional array of strings containing information about what caused this update, e.g. "gameSim" or "playerMovement".
 * @param {string=} url Optional URL to redirect to. The current URL is used if this is not defined. If this URL is either undefined or the same as location.pathname, it is considered to be an "refresh" and no entry in the history or stat tracker is made. Otherwise, it's considered to be a new pageview.
 * @param {Object=} raw Optional object passed through to the page.js request context's bbgm property.
 */
async function realtimeUpdate(updateEvents: UpdateEvents = [], url?: string, raw = {}) {
    return new Promise<void>((resolve) => {
        url = url !== undefined ? url : location.pathname + location.search;

        console.log(url);

        const inLeague = url.substr(0, 3) === "/l/"; // Check the URL to be redirected to, not the current league (g.lid)
        const refresh = url === location.pathname && inLeague;

        // Store the update events and raw data in sessionStorage
        if (updateEvents.length > 0 || Object.keys(raw).length > 0) {
            sessionStorage.setItem('bbgm-update', JSON.stringify({
                updateEvents,
                raw,
                timestamp: Date.now()
            }));
        }

        if (refresh) {
            // For refresh, just reload the current page
            window.location.reload();
        } else if (inLeague || url === "/" || url.indexOf("/account") === 0) {
            // For navigation, use window.location
            window.location.href = url;
        } else {
            resolve();
        }
    });
}

export default realtimeUpdate;
