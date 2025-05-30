import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const tradeRoutes: RouteObject[] = [
    {
        path: '/l/:lid/free_agents',
        element: genPage('freeAgents')
    },
    {
        path: '/l/:lid/upcoming_free_agents',
        element: genPage('upcomingFreeAgents')
    },
    {
        path: '/l/:lid/upcoming_free_agents/:season',
        element: genPage('upcomingFreeAgents')
    },
    {
        path: '/l/:lid/trade',
        element: genPage('trade')
    },
    {
        path: '/l/:lid/trading_block',
        element: genPage('tradingBlock')
    },
    {
        path: '/l/:lid/transactions',
        element: genPage('transactions')
    },
    {
        path: '/l/:lid/transactions/:abbrev',
        element: genPage('transactions')
    },
    {
        path: '/l/:lid/transactions/:abbrev/:season',
        element: genPage('transactions')
    },
    {
        path: '/l/:lid/transactions/:abbrev/:season/:eventType',
        element: genPage('transactions')
    }
];

export default tradeRoutes;
