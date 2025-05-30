import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const generalRoutes: RouteObject[] = [
    {
        path: '/',
        element: genPage('dashboard', false)
    },
    {
        path: '/new_league',
        element: genPage('newLeague', false)
    },
    {
        path: '/delete_league/:lid',
        element: genPage('deleteLeague', false)
    },
    {
        path: '/manual',
        element: genPage('manual', false)
    },
    {
        path: '/debugging',
        element: genPage('debugging', false)
    },
    {
        path: '/customRosters',
        element: genPage('customRosters', false)
    },
    {
        path: '/customChampions',
        element: genPage('customChampions', false)
    },
    {
        path: '/customChampionPatch',
        element: genPage('customChampionPatch', false)
    },
    {
        path: '/changes',
        element: genPage('changes', false)
    }
];

export default generalRoutes;
