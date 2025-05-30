import { RouteObject } from 'react-router-dom';
import generalRoutes from './general';
import accountRoutes from './account';
import leagueRoutes from './league';
import championRoutes from './league/championRoutes';
import playerRoutes from './league/playerRoutes';
import teamRoutes from './league/teamRoutes';
import draftRoutes from './league/draftRoutes';
import gameRoutes from './league/gameRoutes';
import statsRoutes from './league/statsRoutes';
import miscRoutes from './league/miscRoutes';
import tradeRoutes from './league/tradeRoutes';

const routes: RouteObject[] = [
    ...generalRoutes,
    ...accountRoutes,
    ...leagueRoutes,
    ...championRoutes,
    ...playerRoutes,
    ...teamRoutes,
    ...draftRoutes,
    ...gameRoutes,
    ...statsRoutes,
    ...miscRoutes,
    ...tradeRoutes
];

export default routes;
