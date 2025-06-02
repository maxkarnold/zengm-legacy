import classNames from 'classnames';
import {helpers} from '../../common';
import {emitter, logEvent, realtimeUpdate, setTitle, toWorker} from '../util';
import {HelpPopover, NewWindowLink} from '../components';
import { useState, useEffect } from 'react';
import { GodModeProps, GodModeState } from '../../common/godmode.types';
import { GameAttributes } from '../../common/gameAttributes';

const GodMode: React.FC<GodModeProps> = (props) => {
    const [state, setState] = useState<GodModeState>({
        dirty: false,
        disableInjuries: String(props.disableInjuries),
        luxuryPayroll: props.luxuryPayroll,
        luxuryTax: props.luxuryTax,
        maxContract: props.maxContract,
        minContract: props.minContract,
        minPayroll: props.minPayroll,
        minRosterSize: props.minRosterSize,
        numGames: props.numGames,
        quarterLength: props.quarterLength,
        salaryCap: props.salaryCap,
        gameBalance: props.gameBalance,
        importRestriction: props.importRestriction,
        residencyRequirement: props.residencyRequirement,
        countryConcentration: props.countryConcentration,
        ratioEU: props.ratioEU,
        germanRatio: props.germanRatio,
        playoffWins: props.playoffWins,
        customRoster: props.customRoster,
        regionalRestriction: props.regionalRestriction,
    });

    useEffect(() => {
        if (!state.dirty) {
            setState({
                ...state,
                disableInjuries: String(props.disableInjuries),
                luxuryPayroll: props.luxuryPayroll,
                luxuryTax: props.luxuryTax,
                maxContract: props.maxContract,
                minContract: props.minContract,
                minPayroll: props.minPayroll,
                minRosterSize: props.minRosterSize,
                numGames: props.numGames,
                quarterLength: props.quarterLength,
                salaryCap: props.salaryCap,
                gameBalance: props.gameBalance,
                importRestriction: props.importRestriction,
                residencyRequirement: props.residencyRequirement,
                countryConcentration: props.countryConcentration,
                ratioEU: props.ratioEU,
                germanRatio: props.germanRatio,
                playoffWins: props.playoffWins,
                customRoster: props.customRoster,
                regionalRestriction: props.regionalRestriction,
            });
        }
    }, [props]);

    const handleChange = (name: keyof GodModeState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setState({
            ...state,
            dirty: true,
            [name]: e.target.value,
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updateData: Partial<GameAttributes> = {
            disableInjuries: state.disableInjuries === 'true',
            numGames: parseInt(state.numGames.toString(), 10),
            quarterLength: parseFloat(state.quarterLength.toString()),
            minRosterSize: parseInt(state.minRosterSize.toString(), 10),
            salaryCap: parseInt((state.salaryCap * 1000000).toString()),
            minPayroll: parseInt((state.minPayroll * 1000000).toString()),
            luxuryPayroll: parseInt((state.luxuryPayroll * 1000000).toString()),
            luxuryTax: parseFloat(state.luxuryTax.toString()),
            minContract: parseInt(state.minContract.toString()),
            maxContract: parseInt(state.maxContract.toString()),
            gameBalance: parseInt(state.gameBalance.toString()),
            importRestriction: parseInt(state.importRestriction.toString()),
            residencyRequirement: parseInt(state.residencyRequirement.toString()),
            countryConcentration: parseInt(state.countryConcentration.toString()),
            ratioEU: parseInt(state.ratioEU.toString()),
            germanRatio: parseInt(state.germanRatio.toString()),
            playoffWins: parseInt(state.playoffWins.toString()),
        };

        await toWorker('updateGameAttributes', updateData);

        setState({
            ...state,
            dirty: false,
        });

        logEvent({
            type: "success",
            text: 'God Mode options successfully updated.',
            saveToDb: false,
        });

        realtimeUpdate(["toggleGodMode"], helpers.leagueUrl(["god_mode"]));
    };

    const handleGodModeToggle = async () => {
        const attrs: Partial<GameAttributes> = {godMode: !props.godMode};

        if (attrs.godMode) {
            attrs.godModeInPast = true;
        }

        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', {godMode: attrs.godMode});
        realtimeUpdate(["toggleGodMode"]);
    };

    const handleCustomRosterToggle = async () => {
        const attrs: Partial<GameAttributes> = {customRoster: !props.customRoster};

        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', {customRoster: attrs.customRoster});
        realtimeUpdate(["toggleGodMode"]);
    };

    const handleRegionalRestrictionToggle = async () => {
        const attrs: Partial<GameAttributes> = {regionalRestriction: !props.regionalRestriction};

        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', {regionalRestriction: attrs.regionalRestriction});
        realtimeUpdate(["toggleGodMode"]);
    };

    setTitle('God Mode');

    return (
        <div>
            <h1>God Mode <NewWindowLink parts={[]} /></h1>

            <p>God Mode is a collection of customization features that allow you to kind of do whatever you want. If you enable God Mode, you get access to the following features (which show up in the game as <span className="god-mode god-mode-text">purple text</span>):</p>

            <ul>
                <li>Create custom players by going to Tools {'>'} Create A Player</li>
                <li>Edit any player by going to their player page and clicking Edit Player</li>
                <li>Force any trade to be accepted by checking the Force Trade checkbox before proposing a trade</li>
                <li>You can become the GM of another team at any time</li>
                <li>You will never be fired!</li>
                <li>You will be able to change the options below</li>
            </ul>

            <p>However, if you enable God Mode within a league, you will not get credit for any <a href="/account">Achievements</a>. This persists even if you disable God Mode. You can only get Achievements in a league where God Mode has never been enabled.</p>

            <button
                className={classNames('btn', props.godMode ? 'btn-success' : 'btn-danger')}
                onClick={handleGodModeToggle}
            >
                {props.godMode ? 'Disable God Mode' : 'Enable God Mode'}
            </button>

            <h2 style={{marginTop: '1em'}}>God Mode Options</h2>

            <p className="text-danger">These options are not well tested and might make the AI do weird things.</p>

            <form onSubmit={handleFormSubmit}>
                <div className="row">
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Injuries <HelpPopover placement="right" title="Injuries" style={{}}>
                            This won't heal current injuries, but it will prevent any new ones from occurring.
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('disableInjuries')} value={state.disableInjuries}>
                            <option value="false">Enabled</option>
                            <option value="true">Disabled</option>
                        </select>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label># Games Per Season <HelpPopover placement="left" title="# Games Per Season" style={{}}>
                            This will only apply to seasons that have not started yet.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('numGames')} value={state.numGames} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Quarter Length (minutes)</label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('quarterLength')} value={state.quarterLength} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Min Roster Size</label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('minRosterSize')} value={state.minRosterSize} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Min Contract</label>
                        <div className="input-group">
                            <span className="input-group-addon">$</span><input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('minContract')} value={state.minContract} /><span className="input-group-addon">K</span>
                        </div>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Custom Roster Mode <HelpPopover placement="right" title="Custom Roster Mode" style={{}}>
                            For custom roster that have very high ratings that are very close together this brings ratings performance more in line with the standard rosters. It can also be used to make the standard game less random
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('customRoster')} value={String(state.customRoster)}>
                            <option value="false">Disabled</option>
                            <option value="true">Enabled</option>
                        </select>
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Regional Restrictions <HelpPopover placement="right" title="Regional Restrictions" style={{}}>
                            When enabled teams must have a certain number of players from the region of the team.
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('regionalRestriction')} value={String(state.regionalRestriction)}>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Team Balance</label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('gameBalance')} value={state.gameBalance} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Residency Requirement</label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('residencyRequirement')} value={state.residencyRequirement} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Import Restriction <HelpPopover placement="right" title="Import Restriction" style={{}}>
                            How many years a player from another region has to play for a team before his region changes to his current region.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('importRestriction')} value={state.importRestriction} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Country Concentration<HelpPopover placement="right" title="Concentration" style={{}}>
                            0 will have the greatest chance at keeping teams together from the same country, 5 is standard, and 30 will ignore country concentration.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('countryConcentration')} value={state.countryConcentration} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>EU Ratio<HelpPopover placement="right" title="Ratio" style={{}}>
                            0 will remove that country/region from the free agent list. 1 will keep the current ratio. 2 will double it and so on.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioEU')} value={state.ratioEU} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>German Ratio <HelpPopover placement="right" title="Ratio" style={{}}>
                            0 will remove that country/region from the free agent list. 1 will keep the current ratio. 2 will double it and so on.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('germanRatio')} value={state.germanRatio} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Max Contract</label>
                        <div className="input-group">
                            <span className="input-group-addon">$</span><input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('maxContract')} value={state.maxContract} /><span className="input-group-addon">K</span>
                        </div>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Salary Cap</label>
                        <div className="input-group">
                            <span className="input-group-addon">$</span><input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('salaryCap')} value={state.salaryCap} /><span className="input-group-addon">M</span>
                        </div>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Min Payroll</label>
                        <div className="input-group">
                            <span className="input-group-addon">$</span><input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('minPayroll')} value={state.minPayroll} /><span className="input-group-addon">M</span>
                        </div>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Luxury Tax Threshold</label>
                        <div className="input-group">
                            <span className="input-group-addon">$</span><input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('luxuryPayroll')} value={state.luxuryPayroll} /><span className="input-group-addon">M</span>
                        </div>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Luxury Tax <HelpPopover placement="left" title="Luxury Tax" style={{}}>
                            Take the difference between a team's payroll and the luxury tax threshold. Multiply that by this number. The result is the penalty they have to pay.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('luxuryTax')} value={state.luxuryTax} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Playoff Wins <HelpPopover placement="right" title="Playoff wins to advance to next round" style={{}}>
                            Number of wins required to advance in playoffs
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('playoffWins')} value={state.playoffWins} />
                    </div>
                </div>

                <button className="btn btn-primary" id="save-god-mode-options" disabled={!props.godMode}>Save God Mode Options</button>
            </form>
        </div>
    );
};

export default GodMode;
