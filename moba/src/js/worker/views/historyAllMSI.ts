import {g} from '../../common';
import {idb} from '../db';
import type {GetOutput, UpdateEvents} from '../../common/types';

async function updateHistoryMSI(
    inputs: GetOutput,
    updateEvents: UpdateEvents,
): Promise<{[key: string]: any}> {
    if (updateEvents.includes('firstRun') || updateEvents.includes('newPhase')) {
        const [awards, teams] = await Promise.all([
            idb.getCopies.awards(),
            idb.getCopies.teamsPlus({
                attrs: ["tid", "abbrev", "region", "name"],
                seasonAttrs: ["season",
                "playoffRoundsWonMSI",
                "playoffRoundsWonNALCS",
                "playoffRoundsWonEULCS",
                "playoffRoundsWonLCK",
                "playoffRoundsWonLPL",
                "playoffRoundsWonLMS",
                "playoffRoundsWonNALCSPr",
                "playoffRoundsWonNACSPrA",
                "playoffRoundsWonNACSPrB",
                "playoffRoundsWonMSIGr",
                "playoffRoundsWonMSIPlayIn",
                "playoffRoundsWonNALCSStay",
                "playoffRoundsWonNACSStay",
                "playoffRoundsWonNALadderStay",
                "ladderCSLCS",
                "ladderCSLCSStart",
                "pointsSpring",
                "pointsSummer",
                "won", "lost"],
            }),
        ]);

        const seasons = awards.map(a => {
            return {
                season: a.season,
                knockout1Found: false,
                knockout2Found: false,
                knockout1: undefined,
                knockout2: undefined,
                runnerUp: undefined,
                champ: undefined,
            };
        });

        teams.forEach(t => {
            let champRounds = 2;
            let runnerupRounds = 1;
            let knockoutRounds = 0;

            if (g.gameType >= 6) {
                champRounds = 2;
                runnerupRounds = 1;
                knockoutRounds = 0;
            }

            for (let i = 0; i < seasons.length; i++) {
                let found = false;
                let j;
                for (j = 0; j < t.seasonAttrs.length; j++) {
                    if (t.seasonAttrs[j].season === seasons[i].season) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    continue;
                }

                if (t.seasonAttrs[j].playoffRoundsWonMSI === champRounds) {
                    seasons[i].champ = {
                        tid: t.tid,
                        abbrev: t.abbrev,
                        region: t.region,
                        name: t.name,
                        won: t.seasonAttrs[j].won,
                        lost: t.seasonAttrs[j].lost,
                        count: 0,
                    };
                } else if (t.seasonAttrs[j].playoffRoundsWonMSI === runnerupRounds) {
                    seasons[i].runnerUp = {
                        tid: t.tid,
                        abbrev: t.abbrev,
                        region: t.region,
                        name: t.name,
                        won: t.seasonAttrs[j].won,
                        lost: t.seasonAttrs[j].lost,
                    };
                } else if (t.seasonAttrs[j].playoffRoundsWonMSI === knockoutRounds && !seasons[i].knockout1Found) {
                    seasons[i].knockout1Found = true;
                    seasons[i].knockout1 = {
                        tid: t.tid,
                        abbrev: t.abbrev,
                        region: t.region,
                        name: t.name,
                        won: t.seasonAttrs[j].won,
                        lost: t.seasonAttrs[j].lost,
                    };
                } else if (t.seasonAttrs[j].playoffRoundsWonMSI === knockoutRounds && seasons[i].knockout1Found && !seasons[i].knockout2Found) {
                    seasons[i].knockout2Found = true;
                    seasons[i].knockout2 = {
                        tid: t.tid,
                        abbrev: t.abbrev,
                        region: t.region,
                        name: t.name,
                        won: t.seasonAttrs[j].won,
                        lost: t.seasonAttrs[j].lost,
                    };
                }
            }
        });

        // Count up number of championships per team
        const championshipsByTid = new Array(g.numTeams).fill(0);
        for (let i = 0; i < seasons.length; i++) {
            if (seasons[i].champ) {
                championshipsByTid[seasons[i].champ.tid] += 1;
                seasons[i].champ.count = championshipsByTid[seasons[i].champ.tid];
            }
        }

        return {
            seasons,
        };
    }
    return {};
}

export default {
    runBefore: [updateHistoryMSI],
};
