import { RouteObject } from 'react-router-dom';
import { genPage } from '../../util';

const draftRoutes: RouteObject[] = [
    {
        path: '/l/:lid/draft',
        element: genPage('draft')
    },
    {
        path: '/l/:lid/draft_summary',
        element: genPage('draftSummary')
    },
    {
        path: '/l/:lid/draft_summary/:season',
        element: genPage('draftSummary')
    },
    {
        path: '/l/:lid/draft_scouting',
        element: genPage('draftScouting')
    },
    {
        path: '/l/:lid/draft_scouting/:season',
        element: genPage('draftScouting')
    },
    {
        path: '/l/:lid/fantasy_draft',
        element: genPage('fantasyDraft')
    }
];

export default draftRoutes;
