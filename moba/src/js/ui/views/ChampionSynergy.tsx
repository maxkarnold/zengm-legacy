import {g, helpers} from '../../common';
import {getCols, setTitle} from '../util';
import {DataTable, Dropdown, JumpTo, NewWindowLink,ChampionNameLabels} from '../components';
import PropTypes from 'prop-types';

const LeagueFinances = ({minPayroll, luxuryPayroll, luxuryTax, salaryCap, season, champion, championPatch, championAdjusted}) => {
    setTitle(`Champion Synergy Info`);

	var cols;
	var colsObject;

	var rowData;
	var rowDataPoint;
	var rows;

	//https://datatables.net/


	cols = []
	colsObject = {
					title: 'Champion',
					desc: 'Champion Name',
					sortType: 'champion',
				};
	cols.push(colsObject);


  //////////////////
  for (let i = 0; i < championAdjusted.length; i++) {
		if (championAdjusted[i].name == champion) {

	colsObject = {
						title: champion,
						desc: 'Champion Synergy',
						sortType: 'champion',
					};
		cols.push(colsObject);
		}
	}

// rows and championAdjust same thing?
//rows = championAdjusted;
    	rows = championAdjusted.map(t => {

            rowData = [];
        		rowDataPoint = t.name;
        		rowData.push(rowDataPoint);

      			rowDataPoint = t.synergy;
      			rowData.push(rowDataPoint);
            return {
        			key: t.hid,
        			data: rowData,
        		};
      });

    return <div>
	<Dropdown view="champion_synergy" fields={["champion"]} values={[champion]} />
        <h1>Champion Synergy</h1>

        <DataTable
            cols={cols}
            defaultSort={[0, 'asc']}
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
	champion: PropTypes.string.isRequired,
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
        role2: PropTypes.string.isRequired,

    })).isRequired,
   championAdjusted: PropTypes.arrayOf(PropTypes.shape({
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
