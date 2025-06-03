import DropdownButton from 'react-bootstrap/DropdownButton';
import { Dropdown } from 'react-bootstrap';
import {PLAYER, helpers} from '../../common';
import {getCols, realtimeUpdate, setTitle, toWorker} from '../util';
import {DataTable, Dropdown as CustomDropdown, NewWindowLink, PlayerNameLabels} from '../components';
import { Component } from 'react';
import PropTypes from 'prop-types';

interface WatchListProps {
    players: any[]; // TODO: Define proper player type
    playoffs: 'playoffs' | 'regularSeason';
    statType: 'per36' | 'perGame' | 'totals';
}

interface WatchListState {
    clearing: boolean;
}

class WatchList extends Component<WatchListProps, WatchListState> {
    constructor(props: WatchListProps) {
        super(props);
        this.state = {
            clearing: false,
        };
        this.clearWatchList = this.clearWatchList.bind(this);
    }

    async clearWatchList() {
        this.setState({
            clearing: true,
        });

        await toWorker('clearWatchList');
        realtimeUpdate(["clearWatchList"]);

        this.setState({
            clearing: false,
        });
    }

    render() {
        const {players, playoffs, statType} = this.props;

        setTitle('Watch List');

        const cols = getCols('Name', 'Pos', 'Age', 'Region', 'Team', 'Ovr', 'Pot', 'Contract', 'GP', 'Min', 'K', 'D', 'A', 'KDA','CS').map(col => ({
            ...col,
            title: col.title || ''
        }));

        // Number of decimals for many stats
        const d = statType === "totals" ? 0 : 1;

        const rows = players.map(p => {
            let contract;
            if (p.tid === PLAYER.RETIRED) {
                contract = "Retired";
            } else if (p.tid === PLAYER.UNDRAFTED || p.tid === PLAYER.UNDRAFTED_2 || p.tid === PLAYER.UNDRAFTED_3) {
                contract = `${p.draft.year} Draft Prospect`;
            } else {
                contract = `${helpers.formatCurrency(p.contract.amount, "M")} thru ${p.contract.exp}`;
            }

            return {
                key: p.pid,
                data: [
                    <PlayerNameLabels injury={p.injury} pid={p.pid} skills={p.ratings.skills} watch={p.watch}>{p.name}</PlayerNameLabels>,
                    p.ratings.pos,
                    p.age,
                    p.born.loc,
                    <a href={helpers.leagueUrl(["roster", p.abbrev])}>{p.abbrev}</a>,
                    p.ratings.ovr,
                    p.ratings.pot,
                    contract,
                    p.stats.gp,
                    p.stats.min.toFixed(d),
                    p.stats.fg.toFixed(d),
                    p.stats.fga.toFixed(d),
                    p.stats.fgp.toFixed(d),
                    p.stats.kda.toFixed(d),
                    p.stats.tp.toFixed(d),
                ],
            };
        });

        return <div>
            <CustomDropdown view="watch_list" fields={['statTypes', 'playoffs']} values={[statType, playoffs]} />
            <div className="pull-right">
                <DropdownButton id="dropdown-other-reports" title="Other Reports">
                    <Dropdown.Item href={helpers.leagueUrl(['player_stats', 'watch'])}>Player Stats</Dropdown.Item>
                    <Dropdown.Item href={helpers.leagueUrl(['player_ratings', 'watch'])}>Player Ratings</Dropdown.Item>
                </DropdownButton>
            </div>
            <h1>Watch List <NewWindowLink parts={[]} /></h1>

            <p>Click the watch icon <span className="glyphicon glyphicon-flag" /> next to a player's name to add or remove him from this list.</p>

            <button className="btn btn-danger" disabled={this.state.clearing} onClick={this.clearWatchList}>Clear Watch List</button>

            <p className="clearfix" />

            <DataTable
                cols={cols}
                defaultSort={[0, 'asc']}
                name="WatchList"
                pagination
                rows={rows}
            />
        </div>;
    }
}

WatchList.propTypes = {
    players: PropTypes.arrayOf(PropTypes.object).isRequired,
    playoffs: PropTypes.oneOf(['playoffs', 'regularSeason']).isRequired,
    statType: PropTypes.oneOf(['per36', 'perGame', 'totals']).isRequired,
};

export default WatchList;
