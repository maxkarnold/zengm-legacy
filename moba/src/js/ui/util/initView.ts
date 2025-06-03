import type {GetOutput, PageCtx} from '../../common/types';
import {emitter} from '.';
import { useEffect, useState } from 'react';
import React from 'react';

type InitArgs = {
    Component: React.ComponentType<any>,
    id: string,
    inLeague?: boolean,
    get?: (ctx: PageCtx) => GetOutput | undefined,
};

const initView = (args: InitArgs) => {
    args.inLeague = args.inLeague !== undefined ? args.inLeague : true;
    args.get = args.get !== undefined ? args.get : () => { return {}; };

    if (!args.Component) { throw new Error('Missing arg Component'); }

    const ViewWrapper: React.FC = () => {
        const [data, setData] = useState<GetOutput>({});

        useEffect(() => {
            const ctx: PageCtx = { bbgm: {} };
            ctx.bbgm.handled = true;

            const handleData = (newData: GetOutput) => {
                setData(newData);
            };

            emitter.on('updateData', handleData);
            emitter.emit('get', args, ctx);

            return () => {
                emitter.removeListener('updateData', handleData);
            };
        }, []);

        return React.createElement(args.Component, data);
    };

    return React.createElement(ViewWrapper);
};

export default initView;
