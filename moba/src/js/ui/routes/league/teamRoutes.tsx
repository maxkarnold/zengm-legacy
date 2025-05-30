import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const teamRoutes: RouteObject[] = [
    {
        path: '/l/:lid/roster',
        element: genPage('roster')
    },
    {
        path: '/l/:lid/roster/:abbrev',
        element: genPage('roster')
    },
    {
        path: '/l/:lid/roster/:abbrev/:season',
        element: genPage('roster')
    },
    {
        path: '/l/:lid/schedule',
        element: genPage('schedule')
    },
    {
        path: '/l/:lid/schedule/:abbrev',
        element: genPage('schedule')
    },
    {
        path: '/l/:lid/team_finances',
        element: genPage('teamFinances')
    },
    {
        path: '/l/:lid/team_finances/:abbrev',
        element: genPage('teamFinances')
    },
    {
        path: '/l/:lid/team_finances/:abbrev/:show',
        element: genPage('teamFinances')
    },
    {
        path: '/l/:lid/team_history',
        element: genPage('teamHistory')
    },
    {
        path: '/l/:lid/team_history/:abbrev',
        element: genPage('teamHistory')
    },
    {
        path: '/l/:lid/team_stats',
        element: genPage('teamStats')
    },
    {
        path: '/l/:lid/team_stats/:season',
        element: genPage('teamStats')
    },
    {
        path: '/l/:lid/team_stat_dists',
        element: genPage('teamStatDists')
    },
    {
        path: '/l/:lid/team_stat_dists/:season',
        element: genPage('teamStatDists')
    },
    {
        path: '/l/:lid/team_shot_locations',
        element: genPage('teamShotLocations')
    },
    {
        path: '/l/:lid/team_shot_locations/:season',
        element: genPage('teamShotLocations')
    },
    {
        path: '/l/:lid/team_records',
        element: genPage('teamRecords')
    },
    {
        path: '/l/:lid/team_records/:byType',
        element: genPage('teamRecords')
    },
    {
        path: '/l/:lid/customize_team',
        element: genPage('customizeTeam')
    },
    {
        path: '/l/:lid/customize_team/:tid',
        element: genPage('customizeTeam')
    }
];

export default teamRoutes;
