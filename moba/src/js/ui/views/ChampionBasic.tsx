import {g, helpers} from '../../common';
import {getCols, setTitle} from '../util';
import {DataTable, Dropdown, JumpTo, NewWindowLink} from '../components';
import PropTypes from 'prop-types';

const LeagueFinances = ({minPayroll, luxuryPayroll, luxuryTax, salaryCap, season, championPatch, champions}) => {
    setTitle(`Champion Basic Info`);

//    const cols = getCols('Champion','Role','Games Played','Win Rate','Kills','Deaths','Assists','KDA','Creep Score','Role','Damage','Toughness','Control','Mobility','Utility','Damage','Damage Type');
//    const cols = getCols('Champion','Role','Games Played','Win Rate','Kills','Deaths','Assists','KDA','Creep Score','Role');
//    const cols = getCols('Champion','Role','Games Played','Win Rate','Kills','Deaths','Deaths','Role');
	var cols;
	var rows;
	//EML
	//MRL		MR		SAI		Carry	Support	Nuker	Disabler	Jungler	Durable	Escape	Pusher	Initiator

	if (g.champType == 0) {
		cols = getCols('Champion','Role','Control','Damage','Mobility','Toughness','Utility','Damage Type','EML','TOP','JGL','MID','ADC','SUP');
		rows = champions.map(t => {
			return {
				key: t.hid,
				data: [
					t.name,
					t.role,
					t.ratings.control,
					t.ratings.damage,
					t.ratings.mobility,
					t.ratings.toughness,
					t.ratings.utility,
					t.ratings.damageType,
					t.ratings.earlyMidLate,
					t.TOP,
					t.JGL,
					t.MID,
					t.ADC,
					t.SUP,

				],
			};
		});
	} else {
		cols = getCols('Champion','MR','SAI','Carry','Disabler','Durable','Escape','Initiator','Jungler','Nuker','Pusher','Support','EML','SAFE','OFF','MID','JGL','ROAM');
		rows = champions.map(t => {
			return {
				key: t.hid,
				data: [
					t.name,
					t.ratings.MR,
					t.ratings.SAI,
					t.ratings.carry,
					t.ratings.disabler,
					t.ratings.durable,
					t.ratings.escapeR,
					t.ratings.initiator,
					t.ratings.jungler,
					t.ratings.nuker,
					t.ratings.pusher,
					t.ratings.support,
					t.ratings.earlyMidLate,
					t.SAFE,
					t.OFF,
					t.MID,
					t.JGL,
					t.ROAM,

				],
			};
		});
	}
//    const cols = getCols('Champion','Role');


	// need to update this
//    const rows = championPatch.map(t => {


    return <div>
        <h1>Champion Basic Stats</h1>


        <DataTable
            cols={cols}
            defaultSort={[0, 'desc']}
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
        test1: PropTypes.number.isRequired,
        test2: PropTypes.number.isRequired,
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
   champions: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        champion: PropTypes.string.isRequired,
		ratings: PropTypes.shape({
            control: PropTypes.number.isRequired,
            damage: PropTypes.number.isRequired,
            mobility: PropTypes.number, // Not required for past seasons
            toughness: PropTypes.number.isRequired,
            utility: PropTypes.number.isRequired,
            damageType: PropTypes.string.isRequired,
            earlyMidLate: PropTypes.string.isRequired,
        }).isRequired,
        role: PropTypes.string.isRequired,
        test1: PropTypes.number.isRequired,
        test2: PropTypes.number.isRequired,

    })).isRequired,
};

export default LeagueFinances;
