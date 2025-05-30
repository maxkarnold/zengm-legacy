import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const playerRoutes: RouteObject[] = [
    {
        path: '/l/:lid/player/:pid',
        element: genPage('player')
    },
    {
        path: '/l/:lid/player_ratings',
        element: genPage('playerRatings')
    },
    {
        path: '/l/:lid/player_ratings/:abbrev',
        element: genPage('playerRatings')
    },
    {
        path: '/l/:lid/player_ratings/:abbrev/:season',
        element: genPage('playerRatings')
    },
    {
        path: '/l/:lid/player_stats',
        element: genPage('playerStats')
    },
    {
        path: '/l/:lid/player_stats/:abbrev',
        element: genPage('playerStats')
    },
    {
        path: '/l/:lid/player_stats/:abbrev/:season',
        element: genPage('playerStats')
    },
    {
        path: '/l/:lid/player_stats/:abbrev/:season/:statType',
        element: genPage('playerStats')
    },
    {
        path: '/l/:lid/player_stats/:abbrev/:season/:statType/:playoffs',
        element: genPage('playerStats')
    },
    {
        path: '/l/:lid/player_rating_dists',
        element: genPage('playerRatingDists')
    },
    {
        path: '/l/:lid/player_rating_dists/:season',
        element: genPage('playerRatingDists')
    },
    {
        path: '/l/:lid/player_stat_dists',
        element: genPage('playerStatDists')
    },
    {
        path: '/l/:lid/player_stat_dists/:season',
        element: genPage('playerStatDists')
    },
    {
        path: '/l/:lid/player_shot_locations',
        element: genPage('playerShotLocations')
    },
    {
        path: '/l/:lid/player_shot_locations/:season',
        element: genPage('playerShotLocations')
    },
    {
        path: '/l/:lid/player_feats',
        element: genPage('playerFeats')
    },
    {
        path: '/l/:lid/player_feats/:abbrev',
        element: genPage('playerFeats')
    },
    {
        path: '/l/:lid/player_feats/:abbrev/:season',
        element: genPage('playerFeats')
    },
    {
        path: '/l/:lid/player_feats/:abbrev/:season/:playoffs',
        element: genPage('playerFeats')
    },
    {
        path: '/l/:lid/customize_player',
        element: genPage('customizePlayer')
    },
    {
        path: '/l/:lid/customize_player/:pid',
        element: genPage('customizePlayer')
    }
];

export default playerRoutes;
