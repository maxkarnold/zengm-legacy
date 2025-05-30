import type {GetOutput, PageCtx} from '../../common/types';
import {emitter} from '.';
import { useEffect } from 'react';
import React from 'react';

type InitArgs = {
    Component: React.ComponentType,
    id: string,
    inLeague?: boolean,
    get?: (ctx: PageCtx) => GetOutput | undefined,
};

const initView = (args: InitArgs) => {
    args.inLeague = args.inLeague !== undefined ? args.inLeague : true;
    args.get = args.get !== undefined ? args.get : () => { return {}; };

    if (!args.Component) { throw new Error('Missing arg Component'); }

    const ViewWrapper: React.FC = () => {
        useEffect(() => {
            const ctx: PageCtx = { bbgm: {} };
            ctx.bbgm.handled = true;
            emitter.emit('get', args, ctx);
        }, []);

        return React.createElement(args.Component);
    };

    return React.createElement(ViewWrapper);
};

export default initView;
