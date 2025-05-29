import {g, helpers} from '../../common';
import {getCols, setTitle} from '../util';
import {DataTable, Dropdown, JumpTo, NewWindowLink} from '../components';
import PropTypes from 'prop-types';

const LeagueFinances = ({minPayroll, luxuryPayroll, luxuryTax, salaryCap, season,  championPatch}) => {
    setTitle(`Champion Stats`);

	// issue with chrome for champ pages
    const cols = getCols('Champion','Role','Score','Games Played','Win Rate','Kills','Deaths','Assists','KDA','Creep Score');
    //const cols = getCols('Champion');

    const rows = championPatch.map(t => {


        return {
            key: t.cpid,
            data: [
                t.champion,
                t.role,
                t.score.toFixed(2),
                t.gp2,
                t.winp.toFixed(0),
                t.fg2.toFixed(1),
                t.fga2.toFixed(1),
                t.fgp2.toFixed(1),
                t.kda.toFixed(1),
                t.tp2.toFixed(1),

            ],
        };
    });

    return <div>
            <Dropdown view="champion_stats" fields={["seasons"]} values={[season]} />
        <h1>Champion Stats</h1>


        <DataTable
            cols={cols}
            defaultSort={[3, 'desc']}
//            defaultSort={[0, 'desc']}
            name="LeagueFinances"
            rows={rows}
        />
    </div>;
};

LeagueFinances.propTypes = {
    minPayroll: PropTypes.number.isRequired,
    luxuryPayroll: PropTypes.number.isRequired,
    luxuryTax: PropTypes.number.isRequired,
    salaryCap: PropTypes.number.isRequired,
    season: PropTypes.number.isRequired,
    championPatch: PropTypes.arrayOf(PropTypes.shape({
        champion: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        gp: PropTypes.number.isRequired,
        winp: PropTypes.number.isRequired,
        fg: PropTypes.number.isRequired,
        fg2: PropTypes.number.isRequired,
        fga: PropTypes.number.isRequired,
        fga2: PropTypes.number.isRequired,
        fgp: PropTypes.number.isRequired,
        fgp2: PropTypes.number.isRequired,
        kda: PropTypes.number.isRequired,
        tp: PropTypes.number.isRequired,
        tp2: PropTypes.number.isRequired,

    })).isRequired,
};

export default LeagueFinances;
