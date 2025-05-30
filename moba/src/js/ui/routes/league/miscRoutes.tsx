import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const miscRoutes: RouteObject[] = [
    {
        path: '/l/:lid/history',
        element: genPage('history')
    },
    {
        path: '/l/:lid/history/:season',
        element: genPage('history')
    },
    {
        path: '/l/:lid/history_MSI',
        element: genPage('historyMSI')
    },
    {
        path: '/l/:lid/history_MSI/:season',
        element: genPage('historyMSI')
    },
    {
        path: '/l/:lid/hall_of_fame',
        element: genPage('hallOfFame')
    },
    {
        path: '/l/:lid/edit_team_info',
        element: genPage('editTeamInfo')
    },
    {
        path: '/l/:lid/picks_Bans',
        element: genPage('picksBans')
    },
    {
        path: '/l/:lid/negotiation',
        element: genPage('negotiationList')
    },
    {
        path: '/l/:lid/negotiation/:pid',
        element: genPage('negotiation')
    },
    {
        path: '/l/:lid/export_league',
        element: genPage('exportLeague')
    },
    {
        path: '/l/:lid/event_log',
        element: genPage('eventLog')
    },
    {
        path: '/l/:lid/event_log/:abbrev',
        element: genPage('eventLog')
    },
    {
        path: '/l/:lid/event_log/:abbrev/:season',
        element: genPage('eventLog')
    },
    {
        path: '/l/:lid/delete_old_data',
        element: genPage('deleteOldData')
    },
    {
        path: '/l/:lid/watch_list',
        element: genPage('watchList')
    },
    {
        path: '/l/:lid/watch_list/:statType',
        element: genPage('watchList')
    },
    {
        path: '/l/:lid/watch_list/:statType/:playoffs',
        element: genPage('watchList')
    },
    {
        path: '/l/:lid/history_all',
        element: genPage('historyAll')
    },
    {
        path: '/l/:lid/history_all_MSI',
        element: genPage('historyAllMSI')
    },
    {
        path: '/l/:lid/god_mode',
        element: genPage('godMode')
    },
    {
        path: '/l/:lid/options',
        element: genPage('options')
    },
    {
        path: '/l/:lid/god_mode2',
        element: genPage('godMode2')
    },
    {
        path: '/l/:lid/bans_picks',
        element: genPage('bansPicks')
    },
    {
        path: '/l/:lid/multi_team_mode',
        element: genPage('multiTeamMode')
    },
    {
        path: '/l/:lid/awards_records',
        element: genPage('awardsRecords')
    },
    {
        path: '/l/:lid/awards_records/:awardType',
        element: genPage('awardsRecords')
    }
];

export default miscRoutes;
