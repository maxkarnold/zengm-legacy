import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const accountRoutes: RouteObject[] = [
    {
        path: '/account',
        element: genPage('account', false)
    },
    {
        path: '/account/login_or_register',
        element: genPage('loginOrRegister', false)
    },
    {
        path: '/account/lost_password',
        element: genPage('lostPassword', false)
    },
    {
        path: '/account/reset_password/:token',
        element: genPage('resetPassword', false)
    },
    {
        path: '/account/update_card',
        element: genPage('accountUpdateCard', false)
    }
];

export default accountRoutes;
