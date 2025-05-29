import {g, helpers} from '../../common';
import {getCols, setTitle} from '../util';
import {DataTable,Dropdown, NewWindowLink} from '../components';
import PropTypes from 'prop-types';

const PowerRankings = ({teams,conferences,teamsConferences}) => {
    setTitle('Power Rankings');

    //const cols = getCols('O', 'P', 'T', 'Team', 'W', 'L', 'L10', 'Diff');
    const colsT = getCols('O', 'P', 'T-MMR','T-OVR', 'Team', 'League', 'Region', 'W', 'L', 'L5', 'Diff','# Players');
    colsT[3].width = '100%';

    const rowsT = teams.map(t => {
        const performanceRank = t.stats.gp > 0 ? t.performanceRank : "-";

        return {
            key: t.tid,
            data: [
                t.overallRank,
                performanceRank,
                t.talentRankMMR,
				t.talentRank,
                <a href={helpers.leagueUrl(["roster", t.abbrev])}>{t.region}</a>,
				t.teamConf,
				t.country,
                t.seasonAttrs.won,
                t.seasonAttrs.lost,
                t.seasonAttrs.lastTen,
                <span className={t.diff > 0 ? 'text-success' : 'text-danger'}>{t.diff.toFixed(1)}</span>,
				t.numPlayers,

            ],
            classNames: {
                info: t.tid === g.userTid,
            },
        };
    });

    const colsC = getCols('T-MMR','T-OVR', 'League', 'Region');
    colsC[3].width = '100%';

    const rowsC = conferences.map(t => {

        return {
            key: t.cid,
            data: [
                t.talentRankMMR,
        				t.talentRank,
        				t.teamConf,
        				t.country,

            ],
            classNames: {
                info: t.tid === g.userTid,
            },
        };
    });

   let cols, rows;
   if (teamsConferences == 'teams') {
     cols = colsT;
     rows = rowsT;
   } else {
     cols = colsC;
     rows = rowsC;
   }

    return <div>
	<Dropdown view="power_rankings" fields={["teamsConferences"]} values={[teamsConferences]} />
        <h1>Power Rankings <NewWindowLink /></h1>

        <p>The "Performance" rating is based on tower differential. The "Talent" rating is based on player ratings. The "Overall" rating is a combination of the two.</p>

        <DataTable
            cols={cols}
            defaultSort={[0, 'asc']}
            name="PowerRankings"
            rows={rows}
        />
    </div>;
};

PowerRankings.propTypes = {
    teams: PropTypes.arrayOf(PropTypes.shape({
        abbrev: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        overallRank: PropTypes.number.isRequired,
        performanceRank: PropTypes.number.isRequired,
        region: PropTypes.string.isRequired,
        tid: PropTypes.number.isRequired,
        seasonAttrs: PropTypes.shape({
            lastTen: PropTypes.string.isRequired,
            lost: PropTypes.number.isRequired,
            won: PropTypes.number.isRequired,
        }),
        stats: PropTypes.shape({
            diff: PropTypes.number.isRequired,
        }),
    })).isRequired,
    conferences: PropTypes.array,
    teamsConferences:  PropTypes.bool.isRequired,
};

export default PowerRankings;
