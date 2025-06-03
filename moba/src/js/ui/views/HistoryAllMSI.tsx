import {g, helpers} from '../../common';
import {DataTable, NewWindowLink, PlayerNameLabels} from '../components';
import {getCols, setTitle} from '../util';
import React from 'react';

interface Team {
    tid: number;
    count?: number;
    region: string;
    abbrev: string;
    won: number;
    lost: number;
}

interface Award {
    pid: number;
    name: string;
    tid: number;
}

interface Season {
    season: number;
    champ?: Team;
    runnerUp?: Team;
    knockout1?: Team;
    knockout2?: Team;
    finalsMvp?: Award;
    mvp?: Award;
}

interface HistoryAllMSIProps {
    seasons: Season[];
}

const awardName = (award: Award | undefined, season: number) => {
    if (!award) {
        // For old seasons with no Finals MVP
        return 'N/A';
    }

    const ret = <span>
        <PlayerNameLabels pid={award.pid}>{award.name}</PlayerNameLabels> (<a href={helpers.leagueUrl(["roster", g.teamAbbrevsCache[award.tid], season])}>{g.teamAbbrevsCache[award.tid]}</a>)
    </span>;

    // This is our team.
    if (award.tid === g.userTid) {
      //  return {
      //      classNames: 'info',
      //      value: ret,
      //  };
    }
    return ret;
};

const teamName = (t: Team | undefined, season: number) => {
    if (t) {
        return <span>
            <a href={helpers.leagueUrl(["roster", t.abbrev, season])}>{t.region}</a> ({t.won}-{t.lost})
        </span>;
    }

    // This happens if there is missing data, such as from Delete Old Data
    return 'N/A';
};

const HistoryAllMSI: React.FC<HistoryAllMSIProps> = ({seasons}) => {
    setTitle('Spring Split History');

	const bothSplits = g.bothSplits;

    const cols = getCols('', 'League Champion', 'Runner Up', 'Knockout', 'Knockout').map(col => ({
        ...col,
        title: col.title || col.desc || ''
    }));

    const rows = seasons.map(s => {
        let countText;
        let seasonLink;
        if (s.champ) {
            seasonLink = <a href={helpers.leagueUrl(["playoffs2", s.season])}>{s.season}</a>;
            countText = ` - ${helpers.ordinal(s.champ.count)} title`;
        } else {
            // This happens if there is missing data, such as from Delete Old Data
            seasonLink = String(s.season);
            countText = null;
        }

        let champEl = <span>{teamName(s.champ, s.season)}{countText}</span>;
        if (s.champ && s.champ.tid === g.userTid) {
          //  champEl = {
          //      classNames: 'info',
          //      value: champEl,
          //  };
        }

        let runnerUpEl = teamName(s.runnerUp, s.season);
        if (s.runnerUp && s.runnerUp.tid === g.userTid) {
        //    runnerUpEl = {
        //        classNames: 'info',
        //        value: runnerUpEl,
        //    };
        }

        let knockoutEl = teamName(s.knockout1, s.season);
        if (s.knockout1 && s.knockout1.tid === g.userTid) {
        //    knockoutEl = {
        //        classNames: 'info',
        //        value: knockoutEl,
        //    };
        }

        let knockoutE2 = teamName(s.knockout2, s.season);
        if (s.knockout2 && s.knockout2.tid === g.userTid) {
        //    knockoutE2 = {
        //        classNames: 'info',
        //        value: knockoutE2,
        //    };
        }

        return {
            key: s.season,
            data: [
                seasonLink,
                champEl,
                runnerUpEl,
                knockoutEl,
                knockoutE2,
            ],
        };
    });

    return <div>
        <h1>Spring Split History <NewWindowLink parts={[]} /></h1>
        <p>More: <a href={helpers.leagueUrl(['history_all'])}>Summer History</a> | <a href={helpers.leagueUrl(['team_records'])}>Team Records</a> | <a href={helpers.leagueUrl(['awards_records'])}>Awards Records</a></p>

		{!bothSplits ? <p className="text-danger">This league is only the Summer Split. So there will be no results here. Use the Worlds w/ Splits types to play both splits.</p> : null}

        <DataTable
            cols={cols}
            defaultSort={[0, 'desc']}
            name="HistoryAll"
            pagination
            rows={rows}
        />
    </div>;
};

export default HistoryAllMSI;
