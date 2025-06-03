import {g} from '../../common';
import {ads, emitter, realtimeUpdate, toWorker} from '../util';
import {Footer, Header, LeagueWrapper, MultiTeamMenu, NagModal, NavBar} from '.';
import type {GetOutput, Option, PageCtx, UpdateEvents} from '../../common/types';
import React, {useEffect, useState, useCallback} from 'react';
import PropTypes from 'prop-types';

type LeagueContentProps = {
    Component: React.ComponentType<any>;
    data: { [key: string]: any };
    topMenu: {
        email?: string;
        godMode: boolean;
        bothSplits: boolean;
        goldUntil: number;
        goldCancelled: boolean;
        hasViewedALeague: boolean;
        lid?: number;
        options: Option[];
        phaseText: string;
        popup: boolean;
        statusText: string;
        username?: string;
        gameType: number;
    };
};

const LeagueContent: React.FC<LeagueContentProps> = React.memo(({Component, data, topMenu}) => {
    return <Component {...data} topMenu={topMenu} />;
});

type Args = {
    Component: React.ComponentType<any>;
    id: string;
    inLeague: boolean;
    get: (ctx: PageCtx) => GetOutput | undefined;
};

type State = {
    Component: React.ComponentType<any> | undefined;
    idLoaded?: string;
    idLoading?: string;
    inLeague: boolean;
    data: { [key: string]: any };
    multiTeam: {
        userTid: number;
        userTids: number[];
    };
    showNagModal: boolean;
    topMenu: {
        email?: string;
        godMode: boolean;
        bothSplits: boolean;
        goldUntil: number;
        goldCancelled: boolean;
        hasViewedALeague: boolean;
        lid?: number;
        options: Option[];
        phaseText: string;
        popup: boolean;
        statusText: string;
        username?: string;
        gameType: number;
    };
};

const Controller: React.FC = () => {
    const [state, setState] = useState<State>({
        Component: undefined,
        idLoaded: undefined,
        idLoading: undefined,
        inLeague: false,
        data: {},
        multiTeam: {
            userTid: g.userTid,
            userTids: g.userTids,
        },
        showNagModal: false,
        topMenu: {
            email: undefined,
            godMode: !!g.godMode,
            bothSplits: !!g.bothSplits,
            goldUntil: 0,
            goldCancelled: false,
            hasViewedALeague: !!localStorage.getItem('hasViewedALeague'),
            lid: undefined,
            options: [],
            phaseText: '',
            popup: window.location.search === '?w=popup',
            statusText: '',
            username: undefined,
            gameType: Number(g.gameType),
        },
    });

    const closeNagModal = useCallback(() => {
        setState(prev => ({ ...prev, showNagModal: false }));
    }, []);

    const get = useCallback(async (args: Args, ctx: PageCtx) => {
        try {
            const updateEvents = (ctx !== undefined && ctx.bbgm.updateEvents !== undefined) ? ctx.bbgm.updateEvents : [];
            const newLidInt = parseInt(ctx.params.lid, 10);
            const newLid = isNaN(newLidInt) ? undefined : newLidInt;

            await (args.inLeague ? toWorker('beforeViewLeague', newLid, state.topMenu.lid) : toWorker('beforeViewNonLeague', state.topMenu.lid));

            let inputs = args.get(ctx);
            if (!inputs) {
                inputs = {};
            }

            if (typeof inputs.redirectUrl === 'string') {
                await realtimeUpdate([], inputs.redirectUrl);
            } else {
                await updatePage(args, inputs, updateEvents);
            }
        } catch (err) {
            ctx.bbgm.err = err;
        }

        if (ctx !== undefined && ctx.bbgm !== undefined && ctx.bbgm.cb !== undefined) {
            ctx.bbgm.cb();
        }
    }, [state.topMenu.lid]);

    const showAd = useCallback((type: 'modal', autoPlaySeasons: number) => {
        if (type === 'modal') {
            if (!window.enableLogging) {
                return;
            }

            // No ads during multi season auto sim
            if (autoPlaySeasons > 0) {
                return;
            }

            // No ads for Gold members
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (currentTimestamp <= state.topMenu.goldUntil) {
                return;
            }

            const r = Math.random();
            if (r < 0.68) {
                ads.showGcs();
            } else if (r < 0.75) {
                ads.showModal();
            } else {
                const adTimer = localStorage.getItem('adTimer') !== undefined ? parseInt(localStorage.getItem('adTimer'), 10) : 0;
                const now = Date.now();

                // Only show ad once per 60 minutes, at most
                if (now - adTimer > 1000 * 60 * 60) {
                    ads.showSurvata();
                    localStorage.setItem('adTimer', String(now));
                }
            }
        }
    }, [state.topMenu.goldUntil]);

    const updatePage = useCallback(async (args: Args, inputs: GetOutput, updateEvents: UpdateEvents) => {
        let prevData;

        // Reset league content and view model only if it's:
        // (1) if it's not loaded and not loading yet
        // (2) loaded, but loading something else
        if (
            (state.idLoaded !== args.id && state.idLoading !== args.id) ||
            (state.idLoaded === args.id && state.idLoading !== args.id && state.idLoading !== undefined)
        ) {
            updateEvents.push('firstRun');
            prevData = {};
        } else if (state.idLoading === args.id) {
            // If this view is already loading, no need to update (in fact, updating can cause errors because the firstRun updateEvent is not set and thus some first-run-defined view model properties might be accessed).
            return;
        } else {
            prevData = state.data;
        }

        setState(prev => ({ ...prev, idLoading: args.id }));

        const results = await toWorker('runBefore', args.id, inputs, updateEvents, prevData);

        const vars = {
            Component: args.Component,
            inLeague: args.inLeague,
            data: Object.assign(prevData, ...results),
        };

        if (vars.data && vars.data.redirectUrl !== undefined) {
            setState(prev => ({ ...prev, idLoading: undefined }));
            await realtimeUpdate([], vars.data.redirectUrl);
            return;
        }

        setState(prev => ({
            ...prev,
            ...vars,
            idLoaded: args.id,
            idLoading: undefined
        }));

        // Emit the data update event
        emitter.emit('updateData', vars.data);

        if (updateEvents.length === 1 && updateEvents[0] === 'firstRun') {
            window.scrollTo(window.pageXOffset, 0);
        }
    }, [state.idLoaded, state.idLoading, state.data]);

    const updateMultiTeam = useCallback(() => {
        setState(prev => ({
            ...prev,
            multiTeam: {
                userTid: g.userTid,
                userTids: g.userTids,
            },
        }));
    }, []);

    const updateState = useCallback((obj: Partial<State>) => {
        setState(prev => ({ ...prev, ...obj }));
    }, []);

    const updateTopMenu = useCallback((obj: Partial<State['topMenu']>) => {
        setState(prev => ({
            ...prev,
            topMenu: { ...prev.topMenu, ...obj }
        }));
    }, []);

    useEffect(() => {
        emitter.on('get', get);
        emitter.on('showAd', showAd);
        emitter.on('updateMultiTeam', updateMultiTeam);
        emitter.on('updateState', updateState);
        emitter.on('updateTopMenu', updateTopMenu);

        if (state.topMenu.popup && document.body) {
            document.body.style.paddingTop = '0';

            const css = document.createElement("style");
            css.type = "text/css";
            css.innerHTML = ".new_window { display: none }";
            document.body.appendChild(css);
        }

        return () => {
            emitter.removeListener('get', get);
            emitter.removeListener('showAd', showAd);
            emitter.removeListener('updateMultiTeam', updateMultiTeam);
            emitter.removeListener('updateState', updateState);
            emitter.removeListener('updateTopMenu', updateTopMenu);
        };
    }, [get, showAd, updateMultiTeam, updateState, updateTopMenu, state.topMenu.popup]);

    const {Component, data, idLoaded, idLoading, inLeague, multiTeam, topMenu} = state;
    const updating = idLoading !== undefined;

    let contents;
    if (!Component) {
        contents = <h1 style={{textAlign: 'center'}}>Loading...</h1>;
    } else if (!inLeague) {
        contents = <Component {...data} topMenu={topMenu} />;
    } else {
        const pageId = idLoading !== undefined ? idLoading : idLoaded;

        contents = (
            <div>
                <LeagueWrapper bothSplits={topMenu.bothSplits} lid={topMenu.lid} pageId={pageId}>
                    <LeagueContent
                        Component={Component}
                        data={data}
                        topMenu={topMenu}
                    />
                </LeagueWrapper>
                <MultiTeamMenu {...multiTeam} />
            </div>
        );
    }

    return (
        <div className="container">
            <NavBar {...topMenu} updating={updating} gameType={Number(g.gameType)} />
            <Header />
            <div id="screenshot-nonleague" className="main-wrapper" style={{minHeight: '300px'}}>
                {contents}
            </div>
            <Footer />
            <NagModal
                close={closeNagModal}
                show={state.showNagModal}
            />
        </div>
    );
};

Controller.propTypes = {
    Component: PropTypes.func,
    data: PropTypes.object,
    topMenu: PropTypes.object,
};

export default Controller;
