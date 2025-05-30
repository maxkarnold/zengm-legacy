import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const gameRoutes: RouteObject[] = [
    {
        path: '/l/:lid/game_log',
        element: genPage('gameLog')
    },
    {
        path: '/l/:lid/game_log/:abbrev',
        element: genPage('gameLog')
    },
    {
        path: '/l/:lid/game_log/:abbrev/:season',
        element: genPage('gameLog')
    },
    {
        path: '/l/:lid/game_log/:abbrev/:season/:gid',
        element: genPage('gameLog')
    },
    {
        path: '/l/:lid/game_log/:abbrev/:season/:gid/:view',
        element: genPage('gameLog')
    },
    {
        path: '/l/:lid/live',
        element: genPage('live')
    },
    {
        path: '/l/:lid/live_game',
        element: genPage('liveGame')
    }
];

export default gameRoutes;
