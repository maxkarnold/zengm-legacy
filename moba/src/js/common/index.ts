// Polyfills for Safari
console.log('Loading common/index.ts');
import 'url-search-params-polyfill';
import 'whatwg-fetch';

export * from './constants';
export {default as createLogger} from './createLogger';
export {default as fetchWrapper} from './fetchWrapper';
export {default as g} from './gameAttributes';
export {default as helpers} from './helpers';

console.log('Finished loading common/index.ts');
