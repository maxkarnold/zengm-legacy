import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const leagueRoutes: RouteObject[] = [
    {
        path: '/l/:lid',
        element: genPage('leagueDashboard')
    },
    {
        path: '/l/:lid/new_team',
        element: genPage('newTeam')
    },
    {
        path: '/l/:lid/inbox',
        element: genPage('inbox')
    },
    {
        path: '/l/:lid/message',
        element: genPage('message')
    },
    {
        path: '/l/:lid/message/:mid',
        element: genPage('message')
    },
    {
        path: '/l/:lid/standings',
        element: genPage('standings')
    },
    {
        path: '/l/:lid/standings/:season',
        element: genPage('standings')
    },
    {
        path: '/l/:lid/standings/:season/:conference',
        element: genPage('standings')
    },
    {
        path: '/l/:lid/playoffs',
        element: genPage('playoffs')
    },
    {
        path: '/l/:lid/playoffs/:season',
        element: genPage('playoffs')
    },
    {
        path: '/l/:lid/playoffs/:season/:playoffsTypeSummer',
        element: genPage('playoffs')
    },
    {
        path: '/l/:lid/playoffs2',
        element: genPage('playoffs2')
    },
    {
        path: '/l/:lid/playoffs2/:season',
        element: genPage('playoffs2')
    },
    {
        path: '/l/:lid/playoffs2/:season/:playoffsTypeSpring',
        element: genPage('playoffs2')
    },
    {
        path: '/l/:lid/league_finances',
        element: genPage('leagueFinances')
    },
    {
        path: '/l/:lid/league_finances/:season',
        element: genPage('leagueFinances')
    }
];

export default leagueRoutes;
