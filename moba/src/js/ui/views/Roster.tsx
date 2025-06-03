import classNames from 'classnames';
import { Dropdown as BSDropdown, DropdownButton } from 'react-bootstrap';
import {PHASE, g, helpers} from '../../common';
import {logEvent, realtimeUpdate, setTitle, toWorker} from '../util';
import {HelpPopover, NewWindowLink, PlayerNameLabels, RatingWithChange, RecordAndPlayoffs} from '../components';
import clickable from '../wrappers/clickable';
import { Component } from 'react';

interface StyleObject {
    display?: string;
    backgroundImage?: string;
}

interface RosterRowProps {
    clicked?: boolean;
    editable: boolean;
    i: number;
    p: any; // TODO: Define proper player type
    season: number;
    selectedPid?: number;
    showTradeFor: boolean;
    toggleClicked?: () => void;
}

interface RosterState {
    selectedPid?: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

interface RosterProps {
    abbrev: string;
    editable: boolean;
    payroll?: number;
    players: any[]; // TODO: Define proper player type
    salaryCap: number;
    season: number;
    showTradeFor: boolean;
    t: any; // TODO: Define proper team type
    godMode: boolean;
    maxRosterSize: number;
}

interface CustomDropdownProps {
    view: string;
    fields: string[];
    values: (string | number)[];
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ view, fields, values }) => {
    return (
        <BSDropdown>
            <BSDropdown.Toggle>
                {view}
            </BSDropdown.Toggle>
            <BSDropdown.Menu>
                {fields.map((field, i) => (
                    <BSDropdown.Item key={field} href={helpers.leagueUrl([field, values[i]])}>
                        {field}
                    </BSDropdown.Item>
                ))}
            </BSDropdown.Menu>
        </BSDropdown>
    );
};

const ptStyles = {
    0: {
        backgroundColor: '#a00',
        color: '#fff',
    },
    0.75: {
        backgroundColor: '#ff0',
        color: '#000',
    },
    1: {
        backgroundColor: '#ccc',
        color: '#000',
    },
    1.25: {
        backgroundColor: '#0f0',
        color: '#000',
    },
    1.75: {
        backgroundColor: '#070',
        color: '#fff',
    },
};

const handleAutoSort = async () => {
    await toWorker('autoSortRoster');

    realtimeUpdate(["playerMovement"]);
};

const handleRelease = async p => {
    // If a player was just drafted by his current team and the regular season hasn't started, then he can be released without paying anything
    const justDrafted = p.tid === p.draft.tid && ((p.draft.year === g.season && g.phase >= g.PHASE.DRAFT) || (p.draft.year === g.season - 1 && g.phase < g.PHASE.REGULAR_SEASON));

    let releaseMessage;
    if (justDrafted) {
        releaseMessage = `Are you sure you want to release ${p.name}?  He will become a free agent and no longer take up a roster spot on your team. Because you just drafted him and the regular season has not started yet, you will not have to pay his contract.`;
    } else {
        releaseMessage = `Are you sure you want to release ${p.name}?  He will become a free agent and no longer take up a roster spot on your team, but you will still have to pay his salary (and have it count against the salary cap) until his contract expires in ${p.contract.exp}.`;
    }

    if (window.confirm(releaseMessage)) {
        const errorMsg = await toWorker('releasePlayer', p.pid, justDrafted);
        if (errorMsg) {
            logEvent({
                type: 'error',
                text: errorMsg,
                saveToDb: false,
            });
        } else {
            realtimeUpdate(["playerMovement"]);
        }
    }
};

const handlePtChange = async (p, event) => {
    const ptModifier = parseFloat(event.target.value);

    if (isNaN(ptModifier)) {
        return;
    }

    // NEVER UPDATE AI TEAMS
    // This shouldn't be necessary, but just in case...
    if (p.tid !== g.userTid) {
        return;
    }

    await toWorker('updatePlayingTime', p.pid, ptModifier);

    realtimeUpdate(["playerMovement"]);
};

const PlayingTime = ({p}) => {
    const ptModifiers = [
        {text: "0", ptModifier: "0"},
        {text: "-", ptModifier: "0.75"},
        {text: " ", ptModifier: "1"},
        {text: "+", ptModifier: "1.25"},
        {text: "++", ptModifier: "1.75"},
    ];

    return <select
        className="form-control pt-modifier-select"
        value={p.ptModifier}
        onChange={event => handlePtChange(p, event)}
        style={ptStyles[String(p.ptModifier)]}
    >
        {ptModifiers.map(({text, ptModifier}) => {
            return <option key={ptModifier} value={ptModifier}>{text}</option>;
        })}
    </select>;
};

const RosterRow = clickable((props: RosterRowProps) => {
    const {clicked, editable, i, p, season, selectedPid, showTradeFor, toggleClicked} = props;
    return <tr
        key={p.pid}
        className={classNames({separator: i === 4, warning: clicked})}
        data-pid={p.pid}
    >
        <td onClick={toggleClicked}>
            <PlayerNameLabels
                pid={p.pid}
                injury={p.injury}
                skills={p.ratings.skills}
                watch={p.watch}
            >{p.name}</PlayerNameLabels>
        </td>
        <td onClick={toggleClicked}>{p.ratings.pos}</td>
        <td onClick={toggleClicked}>{p.age}</td>
        <td onClick={toggleClicked}>{p.born.loc}</td>
        <td onClick={toggleClicked}>{p.stats.yearsWithTeam}</td>
        <td onClick={toggleClicked}>{p.ratings.MMR}</td>
        <td onClick={toggleClicked}>
            <RatingWithChange change={p.ratings.dovr}>{p.ratings.ovr}</RatingWithChange>
        </td>
        <td onClick={toggleClicked}>
            <RatingWithChange change={p.ratings.dpot}>{p.ratings.pot}</RatingWithChange>
        </td>
        {season === g.season ? <td>
            {helpers.formatCurrency(p.contract.amount, 'K')} thru {p.contract.exp}
        </td> : null}
        <td onClick={toggleClicked}>{p.stats.gp}</td>
        <td onClick={toggleClicked}>{p.stats.min.toFixed(1)}</td>
        <td onClick={toggleClicked}>{p.stats.kda.toFixed(1)}</td>
        <td onClick={toggleClicked}>{p.stats.trb.toFixed(1)}</td>
        {editable ? <td onClick={toggleClicked}>
            <button
                className="btn btn-default btn-xs"
                disabled={!p.canRelease}
                onClick={() => handleRelease(p)}
            >
                Release
            </button>
        </td> : null}
        {showTradeFor ? <td onClick={toggleClicked} title={p.untradableMsg}>
            <button
                className="btn btn-default btn-xs"
                disabled={p.untradable}
                onClick={() => toWorker('actions.tradeFor', {pid: p.pid})}
            >Trade For</button>
        </td> : null}
        <td onClick={toggleClicked}>{p.ratings.languagesGrouped}</td>
        <td onClick={toggleClicked}>{p.born.country}</td>
    </tr>;
});

class Roster extends Component<RosterProps, RosterState> {
    constructor(props: RosterProps) {
        super(props);
        this.state = {
            selectedPid: undefined,
            sortBy: 'ovr',
            sortDirection: 'desc'
        };
    }

    handleSort = (sortBy: string) => {
        this.setState(prevState => ({
            sortBy,
            sortDirection: prevState.sortBy === sortBy && prevState.sortDirection === 'desc' ? 'asc' : 'desc'
        }));
    }

    render() {
        const {abbrev, editable, payroll, players, salaryCap, season, showTradeFor, t, godMode, maxRosterSize} = this.props;
        const { sortBy, sortDirection } = this.state;

        setTitle(`${t.region} Roster - ${season}`);

        const logoStyle: StyleObject = {};
        if (t.imgURL) {
            logoStyle.display = "inline";
            logoStyle.backgroundImage = `url('${t.imgURL}')`;
        }

        const countryStyle: StyleObject = {};
        if (t.imgURLCountry) {
            countryStyle.display = "inline";
            countryStyle.backgroundImage = `url('${t.imgURLCountry}')`;
        }

        // Sort players based on current sort criteria
        const sortedPlayers = [...players].sort((a, b) => {
            let aValue = a.ratings[sortBy] ?? a.stats[sortBy] ?? a[sortBy];
            let bValue = b.ratings[sortBy] ?? b.stats[sortBy] ?? b[sortBy];

            if (typeof aValue === 'string') {
                return sortDirection === 'desc'
                    ? bValue.localeCompare(aValue)
                    : aValue.localeCompare(bValue);
            }

            return sortDirection === 'desc'
                ? bValue - aValue
                : aValue - bValue;
        });

        return <div>
            <CustomDropdown view="roster" fields={["teams", "seasons"]} values={[abbrev, season]} />
            <div className="pull-right">
                <DropdownButton id="dropdown-more-info" title="More Info">
                    <BSDropdown.Item href={helpers.leagueUrl(['player_stats', abbrev, season])}>Player Stats</BSDropdown.Item>
                    <BSDropdown.Item href={helpers.leagueUrl(['player_ratings', abbrev, season])}>Player Ratings</BSDropdown.Item>
                </DropdownButton>
            </div>

            <h1>{t.region} Roster <NewWindowLink parts={[]} /></h1>
            <p>More: <a href={helpers.leagueUrl(['team_finances', abbrev])}>Finances</a> | <a href={helpers.leagueUrl(['game_log', abbrev, season])}>Game Log</a> | <a href={helpers.leagueUrl(['team_history', abbrev])}>History</a> | <a href={helpers.leagueUrl(['transactions', abbrev])}>Transactions</a></p>
            <div className="team-picture" style={logoStyle} />
            <div className="team-picture" style={countryStyle} />

            <div>
                <h3>
                    Record: <RecordAndPlayoffs
                        abbrev={abbrev}
                        season={season}
                        wonSpring={t.seasonAttrs.wonSpring}
                        lostSpring={t.seasonAttrs.lostSpring}
                        levelStartFull={t.seasonAttrs.levelStart}
                        levelMidFull={t.seasonAttrs.levelMid}
                        won={t.seasonAttrs.wonSummer}
                        lost={t.seasonAttrs.lostSummer}
                        playoffRoundsWon={t.seasonAttrs.playoffRoundsWon}
                        playoffRoundsWonWorldsGr={t.seasonAttrs.playoffRoundsWonWorldsGr}
                        option="noSeason"
                    />
                </h3>

                Region:   {t.country} <br />
                Country:  {t.countrySpecific}

                {season === g.season ? <p>
                    {maxRosterSize - players.length} open roster spots<br />
                    Payroll: {helpers.formatCurrency(payroll, 'K')}<br />
                    Profit: {helpers.formatCurrency(t.seasonAttrs.profit, 'K')}<br />
                    {godMode ? <div><a href={helpers.leagueUrl(['customize_team', t.tid])} className="god-mode god-mode-text">Edit Team</a><br /></div> : null}<br />
                </p> : null}
            </div>

            {editable ? <p><button className="btn btn-default" onClick={handleAutoSort}>Auto sort roster</button></p> : null}

            <div className="table-responsive">
                <table className="table table-striped table-bordered table-condensed table-hover">
                    <thead>
                        <tr>
                            <th onClick={() => this.handleSort('name')}>Name {sortBy === 'name' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('pos')}>Pos {sortBy === 'pos' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('age')}>Age {sortBy === 'age' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('loc')}>Region {sortBy === 'loc' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('yearsWithTeam')}>YWT {sortBy === 'yearsWithTeam' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('MMR')}>MMR {sortBy === 'MMR' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('ovr')}>Ovr {sortBy === 'ovr' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('pot')}>Pot {sortBy === 'pot' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            {season === g.season ? <th>Contract</th> : null}
                            <th onClick={() => this.handleSort('gp')}>GP {sortBy === 'gp' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('min')}>Min {sortBy === 'min' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('kda')}>KDA {sortBy === 'kda' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('trb')}>G(k) {sortBy === 'trb' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            {editable ? <th>Release <HelpPopover placement="left" title="Release Player" style={{ position: 'relative' }}>
                                <p>To free up a roster spot, you can release a player from your team. You will still have to pay his salary (and have it count against the salary cap) until his contract expires (you can view your released players' contracts in your <a href={helpers.leagueUrl(["team_finances"])}>Team Finances</a>).</p>
                                <p>However, if you just drafted a player and the regular season has not started yet, his contract is not guaranteed and you can release him for free.</p>
                            </HelpPopover></th> : null}
                            {showTradeFor ? <th>Trade For</th> : null}
                            <th onClick={() => this.handleSort('languagesGrouped')}>Languages {sortBy === 'languagesGrouped' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                            <th onClick={() => this.handleSort('country')}>Country {sortBy === 'country' && (sortDirection === 'desc' ? '↓' : '↑')}</th>
                        </tr>
                    </thead>
                    <tbody id="roster-tbody">
                        {sortedPlayers.map((p, i) => (
                            <RosterRow
                                key={p.pid}
                                editable={editable}
                                i={i}
                                p={p}
                                season={season}
                                selectedPid={this.state.selectedPid}
                                showTradeFor={showTradeFor}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

export default Roster;
