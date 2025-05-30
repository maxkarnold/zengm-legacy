import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const championRoutes: RouteObject[] = [
    {
        path: '/l/:lid/champion_basic',
        element: genPage('championBasic')
    },
    {
        path: '/l/:lid/champion_basic/:season',
        element: genPage('championBasic')
    },
    {
        path: '/l/:lid/champion_synergy',
        element: genPage('championSynergy')
    },
    {
        path: '/l/:lid/champion_synergy/:champion',
        element: genPage('championSynergy')
    },
    {
        path: '/l/:lid/champion_counter',
        element: genPage('championCounter')
    },
    {
        path: '/l/:lid/champion_counter/:champion',
        element: genPage('championCounter')
    },
    {
        path: '/l/:lid/champion_stats',
        element: genPage('championStats')
    },
    {
        path: '/l/:lid/champion_stats/:season',
        element: genPage('championStats')
    },
    {
        path: '/l/:lid/edit_champion_info',
        element: genPage('editChampionInfo')
    },
    {
        path: '/l/:lid/edit_champion_patch',
        element: genPage('editChampionPatch')
    }
];

export default championRoutes;
