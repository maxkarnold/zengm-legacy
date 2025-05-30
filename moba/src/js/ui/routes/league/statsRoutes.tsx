import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const statsRoutes: RouteObject[] = [
    {
        path: '/l/:lid/leaders',
        element: genPage('leaders')
    },
    {
        path: '/l/:lid/leaders/:season',
        element: genPage('leaders')
    },
    {
        path: '/l/:lid/power_rankings',
        element: genPage('powerRankings')
    },
    {
        path: '/l/:lid/power_rankings/:teamsConferences',
        element: genPage('powerRankings')
    },
    {
        path: '/l/:lid/export_stats',
        element: genPage('exportStats')
    }
];

export default statsRoutes;
