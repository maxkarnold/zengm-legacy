import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { emitter, logEvent, realtimeUpdate, setTitle, toWorker } from '../util';
import { HelpPopover, NewWindowLink } from '../components';
import type { UpdateEvents } from '../../common/types';
import { GodModeProps } from '../../common/godmode.types';
import { GameAttributes } from '../../common/gameAttributes';

interface FormState {
    dirty: boolean;
    disableInjuries: string;
    luxuryPayroll: number;
    luxuryTax: number;
    maxContract: number;
    minContract: number;
    minPayroll: number;
    minRosterSize: number;
    maxRosterSize: number;
    customRosterModeStrength: number;
    numGames: number;
    quarterLength: number;
    salaryCap: number;
    gameBalance: number;
    importRestriction: number;
    residencyRequirement: number;
    countryConcentration: number;
    prospectSupply: number;
    ratioEU: number;
    ratioNA: number;
    ratioCN: number;
    ratioTW: number;
    ratioTR: number;
    ratioOCE: number;
    ratioBR: number;
    ratioSEA: number;
    ratioJP: number;
    ratioCIS: number;
    ratioLatAm: number;
    germanRatio: number;
    koreanRatio: number;
    playoffWins: number;
    realChampNames: string;
    standardBackground: string;
    regionalRestrictions: string;
    refuseToLeave: string;
    refuseToSign: string;
    retirementPlayers: string;
    yearPositionChange: string;
    alwaysKeep: string;
    applyToCoachMode: string;
    aiPickBanStrength: number;
    masterGameSimAdjuster: number;
    femaleOdds: number;
    customRosterMode: string;
    aiTrades: string;
    difficulty: number;
}
// Add a default style for HelpPopover
const defaultHelpPopoverStyle = {
    marginLeft: '4px',
    cursor: 'help'
};

const GodMode = (props: GodModeProps) => {
    const [formState, setFormState] = useState<FormState>({
        dirty: false,
        disableInjuries: String(props.disableInjuries),
        luxuryPayroll: props.luxuryPayroll,
        luxuryTax: props.luxuryTax,
        maxContract: props.maxContract,
        minContract: props.minContract,
        minPayroll: props.minPayroll,
        minRosterSize: props.minRosterSize,
        maxRosterSize: props.maxRosterSize,
        customRosterModeStrength: props.customRosterModeStrength,
        numGames: props.numGames,
        quarterLength: props.quarterLength,
        salaryCap: props.salaryCap,
        gameBalance: props.gameBalance,
        importRestriction: props.importRestriction,
        residencyRequirement: props.residencyRequirement,
        countryConcentration: props.countryConcentration,
        prospectSupply: props.prospectSupply,
        ratioEU: props.ratioEU,
        ratioNA: props.ratioNA,
        ratioCN: props.ratioCN,
        ratioTW: props.ratioTW,
        ratioTR: 0,
        ratioOCE: props.ratioOCE,
        ratioBR: props.ratioBR,
        ratioSEA: props.ratioSEA,
        ratioJP: props.ratioJP,
        ratioCIS: props.ratioCIS,
        ratioLatAm: props.ratioLatAm,
        germanRatio: props.germanRatio,
        koreanRatio: props.koreanRatio,
        playoffWins: props.playoffWins,
        realChampNames: String(props.realChampNames),
        standardBackground: String(props.standardBackground),
        regionalRestrictions: String(props.regionalRestrictions),
        refuseToLeave: String(props.refuseToLeave),
        refuseToSign: String(props.refuseToSign),
        retirementPlayers: String(props.retirementPlayers),
        yearPositionChange: String(props.yearPositionChange),
        alwaysKeep: String(props.alwaysKeep),
        applyToCoachMode: String(props.applyToCoachMode),
        aiPickBanStrength: props.aiPickBanStrength,
        masterGameSimAdjuster: props.masterGameSimAdjuster,
        femaleOdds: props.femaleOdds,
        customRosterMode: String(props.customRosterMode),
        aiTrades: String(props.aiTrades),
        difficulty: props.difficulty,
    });

    useEffect(() => {
        if (!formState.dirty) {
            setFormState(prev => ({
                ...prev,
                disableInjuries: String(props.disableInjuries),
                luxuryPayroll: props.luxuryPayroll,
                luxuryTax: props.luxuryTax,
                maxContract: props.maxContract,
                minContract: props.minContract,
                minPayroll: props.minPayroll,
                minRosterSize: props.minRosterSize,
                maxRosterSize: props.maxRosterSize,
                customRosterModeStrength: props.customRosterModeStrength,
                numGames: props.numGames,
                quarterLength: props.quarterLength,
                salaryCap: props.salaryCap,
                gameBalance: props.gameBalance,
                importRestriction: props.importRestriction,
                residencyRequirement: props.residencyRequirement,
                countryConcentration: props.countryConcentration,
                prospectSupply: props.prospectSupply,
                ratioEU: props.ratioEU,
                ratioNA: props.ratioNA,
                ratioCN: props.ratioCN,
                ratioTW: props.ratioTW,
                ratioOCE: props.ratioOCE,
                ratioBR: props.ratioBR,
                ratioSEA: props.ratioSEA,
                ratioJP: props.ratioJP,
                ratioCIS: props.ratioCIS,
                ratioLatAm: props.ratioLatAm,
                germanRatio: props.germanRatio,
                koreanRatio: props.koreanRatio,
                playoffWins: props.playoffWins,
                realChampNames: String(props.realChampNames),
                standardBackground: String(props.standardBackground),
                regionalRestrictions: String(props.regionalRestrictions),
                refuseToLeave: String(props.refuseToLeave),
                refuseToSign: String(props.refuseToSign),
                retirementPlayers: String(props.retirementPlayers),
                yearPositionChange: String(props.yearPositionChange),
                alwaysKeep: String(props.alwaysKeep),
                applyToCoachMode: String(props.applyToCoachMode),
                aiPickBanStrength: props.aiPickBanStrength,
                masterGameSimAdjuster: props.masterGameSimAdjuster,
                femaleOdds: props.femaleOdds,
                customRosterMode: String(props.customRosterMode),
                aiTrades: String(props.aiTrades),
                difficulty: props.difficulty,
            }));
        }
    }, [props, formState.dirty]);

    const handleChange = (name: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState(prev => ({
            ...prev,
            dirty: true,
            [name]: e.target.value,
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await toWorker('updateGameAttributes', {
            disableInjuries: formState.disableInjuries === 'true',
            numGames: parseInt(formState.numGames.toString(), 10),
            quarterLength: parseFloat(formState.quarterLength.toString()),
            minRosterSize: parseInt(formState.minRosterSize.toString(), 10),
            maxRosterSize: parseInt(formState.maxRosterSize.toString(), 10),
            customRosterModeStrength: formState.customRosterModeStrength,
            salaryCap: parseInt((formState.salaryCap * 1000000).toString()),
            minPayroll: parseInt((formState.minPayroll * 1000000).toString()),
            luxuryPayroll: parseInt((formState.luxuryPayroll * 1000000).toString()),
            luxuryTax: parseFloat(formState.luxuryTax.toString()),
            minContract: parseInt(formState.minContract.toString()),
            maxContract: parseInt(formState.maxContract.toString()),
            aiTrades: formState.aiTrades === 'true',
            difficulty: parseInt(formState.difficulty.toString()),
            gameBalance: parseInt(formState.gameBalance.toString()),
            importRestriction: parseInt(formState.importRestriction.toString()),
            residencyRequirement: parseInt(formState.residencyRequirement.toString()),
            countryConcentration: parseInt(formState.countryConcentration.toString()),
            prospectSupply: parseFloat(formState.prospectSupply.toString()),
            ratioEU: parseInt(formState.ratioEU.toString()),
            ratioNA: parseInt(formState.ratioNA.toString()),
            ratioCN: parseInt(formState.ratioCN.toString()),
            ratioTW: parseInt(formState.ratioTW.toString()),
            ratioTR: parseInt(formState.ratioTR.toString()),
            ratioOCE: parseInt(formState.ratioOCE.toString()),
            ratioBR: parseInt(formState.ratioBR.toString()),
            ratioSEA: parseInt(formState.ratioSEA.toString()),
            ratioJP: parseInt(formState.ratioJP.toString()),
            ratioCIS: parseInt(formState.ratioCIS.toString()),
            ratioLatAm: parseInt(formState.ratioLatAm.toString()),
            germanRatio: parseInt(formState.germanRatio.toString()),
            koreanRatio: parseInt(formState.koreanRatio.toString()),
            playoffWins: parseInt(formState.playoffWins.toString()),
            realChampNames: formState.realChampNames === 'true',
            standardBackground: formState.standardBackground === 'true',
            regionalRestrictions: formState.regionalRestrictions === 'true',
            refuseToLeave: formState.refuseToLeave === 'true',
            refuseToSign: formState.refuseToSign === 'true',
            retirementPlayers: formState.retirementPlayers === 'true',
            yearPositionChange: formState.yearPositionChange === 'true',
            alwaysKeep: formState.alwaysKeep === 'true',
            aiPickBanStrength: parseInt(formState.aiPickBanStrength.toString()),
            applyToCoachMode: formState.applyToCoachMode === 'true',
            masterGameSimAdjuster: formState.masterGameSimAdjuster,
            femaleOdds: formState.femaleOdds,
            customRosterMode: formState.customRosterMode === 'true',
        });

        setFormState(prev => ({
            ...prev,
            dirty: false,
        }));

        logEvent({
            type: "success",
            text: 'God Mode options successfully updated.',
            saveToDb: false,
        });

        realtimeUpdate(["toggleGodMode" as UpdateEvents[number]]);
        realtimeUpdate(["toggleBothSplits" as UpdateEvents[number]]);
    };

    const handleGodModeToggle = async () => {
        const attrs: GameAttributes = { godMode: !props.godMode };

        if (attrs.godMode) {
            attrs.godModeInPast = true;
        }

        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { godMode: attrs.godMode });
        realtimeUpdate(["toggleGodMode" as UpdateEvents[number]]);
    };

    const handleBothSplitsToggle = async () => {
        const attrs: GameAttributes = { bothSplits: !props.bothSplits };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { bothSplits: attrs.bothSplits });
        realtimeUpdate(["toggleBothSplits" as UpdateEvents[number]]);
    };

    const handleCustomRosterToggle = async () => {
        const attrs: GameAttributes = { customRosterMode: !props.customRosterMode };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { customRosterMode: attrs.customRosterMode });
        realtimeUpdate(["toggleCustomRoster" as UpdateEvents[number]]);
    };

    const handleRegionalRestrictionToggle = async () => {
        const attrs: GameAttributes = { regionalRestriction: !props.regionalRestriction };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { regionalRestriction: attrs.regionalRestriction });
        realtimeUpdate(["toggleRegionalRestriction" as UpdateEvents[number]]);
    };

    const handleRealChampNamesToggle = async () => {
        const attrs: GameAttributes = { realChampNames: !props.realChampNames };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { realChampNames: attrs.realChampNames });
        realtimeUpdate(["toggleRealChampNames" as UpdateEvents[number]]);
    };

    const handleStandardBackgroundToggle = async () => {
        const attrs: GameAttributes = { standardBackground: !props.standardBackground };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { standardBackground: attrs.standardBackground });
        realtimeUpdate(["toggleStandardBackground" as UpdateEvents[number]]);
    };

    const handleRefuseToLeaveToggle = async () => {
        const attrs: GameAttributes = { refuseToLeave: !props.refuseToLeave };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { refuseToLeave: attrs.refuseToLeave });
        realtimeUpdate(["toggleRefuseToLeave" as UpdateEvents[number]]);
    };

    const handleRefuseToSignToggle = async () => {
        const attrs: GameAttributes = { refuseToSign: !props.refuseToSign };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { refuseToSign: attrs.refuseToSign });
        realtimeUpdate(["toggleRefuseToSign" as UpdateEvents[number]]);
    };

    const handleRetirementPlayersToggle = async () => {
        const attrs: GameAttributes = { retirementPlayers: !props.retirementPlayers };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { retirementPlayers: attrs.retirementPlayers });
        realtimeUpdate(["toggleRetirementPlayers" as UpdateEvents[number]]);
    };

    const handleYearPositionChangeToggle = async () => {
        const attrs: GameAttributes = { yearPositionChange: !props.yearPositionChange };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { yearPositionChange: attrs.yearPositionChange });
        realtimeUpdate(["toggleYearPositionChange" as UpdateEvents[number]]);
    };

    const handleAlwaysKeepToggle = async () => {
        const attrs: GameAttributes = { alwaysKeep: !props.alwaysKeep };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { alwaysKeep: attrs.alwaysKeep });
        realtimeUpdate(["toggleAlwaysKeep" as UpdateEvents[number]]);
    };

    const handleApplyToCoachModeToggle = async () => {
        const attrs: GameAttributes = { applyToCoachMode: !props.applyToCoachMode };
        await toWorker('updateGameAttributes', attrs);
        emitter.emit('updateTopMenu', { applyToCoachMode: attrs.applyToCoachMode });
        realtimeUpdate(["toggleApplyToCoachMode" as UpdateEvents[number]]);
    };

    setTitle('God Mode');

    return (
        <div>
            <h1>God Mode <NewWindowLink parts={['god_mode']} /></h1>

            <p>God Mode is a collection of customization features that allow you to kind of do whatever you want. If you enable God Mode, you get access to the following features (which show up in the game as <span className="god-mode god-mode-text">purple text</span>):</p>

            <ul>
                <li>Create custom players by going to Tools &gt; Create A Player</li>
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

            <h2 style={{ marginTop: '1em' }}>God Mode Options</h2>

            <p className="text-danger">These options are not well tested and might make the AI do weird things.</p>

            <form onSubmit={handleFormSubmit}>
                <h4 style={{ marginTop: '1em' }}>Roster Construction</h4>
                <div className="row">
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Min Roster Size</label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('minRosterSize')} value={formState.minRosterSize} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Max Roster Size</label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('maxRosterSize')} value={formState.maxRosterSize} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Regional Restrictions <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Regional Restrictions">
                            When enabled teams must have a certain number of players from the region of the team.
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('regionalRestrictions')} value={formState.regionalRestrictions}>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Residency Requirement <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Residency Requirement">
                            Number of years it takes for a player learn the local language of a team
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('residencyRequirement')} value={formState.residencyRequirement} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Import Restriction <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Import Restriction">
                            How many years a player from another region has to play for a team before his region changes to his current region.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('importRestriction')} value={formState.importRestriction} />
                    </div>
                </div>
                <div className="row">

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Country Concentration<HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Concentration">
                            0 will have the greatest chance at keeping teams together from the same country, 5 is standard, and 30 will ignore country concentration.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('countryConcentration')} value={formState.countryConcentration} />
                    </div>


                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Team Balance <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Team Balance">
                            Not being used yet.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('gameBalance')} value={formState.gameBalance} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Player Retirement <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Player Retirement">
                            Disable player retirement to better use custom rosters. Also, disables adding new prospects.
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('retirementPlayers')} value={formState.retirementPlayers}>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Yearly Position Change <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Yearly Position Change">
                            Disables player position changes from year to year.
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('yearPositionChange')} value={formState.yearPositionChange}>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>



                </div>
                <div className="row">
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Refusing To Leave (user) <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Refusing To Leave (user) ">
                            Players can refuse to resign with the user's team
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('refuseToLeave')} value={formState.refuseToLeave}>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Refusing To Sign (user) <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Refusing To Sign (user) ">
                            Players can refuse to sign with the user's team
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('refuseToSign')} value={formState.refuseToSign}>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Always Keep (AI) <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Always Keep (AI) ">
                            Enables the AI to always keep players after contracts expire.
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('alwaysKeep')} value={formState.alwaysKeep}>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Trades Between AI Teams</label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('aiTrades')} value={formState.aiTrades}>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Difficulty</label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('difficulty')} value={formState.difficulty}>
                            <option value="0">Easy</option>
                            <option value="1">Normal</option>
                            <option value="2">Hard</option>
                            <option value="3">Impossible</option>
                        </select>
                    </div>
                </div>


                <h4 style={{ marginTop: '1em' }}>Finances</h4>
                <div className="row">
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Min Base Contract <HelpPopover placement="left" style={defaultHelpPopoverStyle} title="Min Base Contract.">
                            This is the contract amount before mood, position, and regional import adjustments.
                        </HelpPopover></label>
                        <div className="input-group">
                            <span className="input-group-addon">$</span><input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('minContract')} value={formState.minContract} /><span className="input-group-addon">K</span>
                        </div>
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Max Base Contract <HelpPopover placement="left" style={defaultHelpPopoverStyle} title="Max Base Contract.">
                            This is the contract amount before mood, position, and regional import adjustments.
                        </HelpPopover></label>
                        <div className="input-group">
                            <span className="input-group-addon">$</span><input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('maxContract')} value={formState.maxContract} /><span className="input-group-addon">K</span>
                        </div>
                    </div>



                </div>
                <h4 style={{ marginTop: '1em' }}>Season</h4>
                <div className="row">

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label># Games Per Season <HelpPopover placement="left" style={defaultHelpPopoverStyle} title="# Games Per Season.">
                            This will only apply to seasons that have not started yet. Setting to 0 uses the default number of games, which can vary for each league.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('numGames')} value={formState.numGames} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Playoff Wins <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Playoff wins to advance to next round">
                            Number of wins required to advance to the next round of playoffs.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('playoffWins')} value={formState.playoffWins} />
                    </div>






                </div>

                <h4 style={{ marginTop: '1em' }}>New Prospects</h4>
                <div className="row">
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>NA Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (8 out of 57 teams, for instance). 2 will increase the ratio to 9/58, 3 will be 10/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioNA')} value={formState.ratioNA} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>EU Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (8 out of 57 teams, for instance). 2 will increase the ratio to 9/58, 3 will be 10/59, etc.
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioEU')} value={formState.ratioEU} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>German Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            0 will remove that country/region from the free agent list. 1 will keep the current ratio. 2 will double it and so on.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('germanRatio')} value={formState.germanRatio} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Korean Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (8 out of 57 teams, for instance). 2 will increase the ratio to 9/58, 3 will be 10/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('koreanRatio')} value={formState.koreanRatio} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>China Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (8 out of 57 teams, for instance). 2 will increase the ratio to 9/58, 3 will be 10/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioCN')} value={formState.ratioCN} />
                    </div>

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Taiwan Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (8 out of 57 teams, for instance). 2 will increase the ratio to 9/58, 3 will be 10/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioTW')} value={formState.ratioTW} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Turkey Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (1 out of 57 teams, for instance). 2 will increase the ratio to 2/58, 3 will be 3/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioTR')} value={formState.ratioTR} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Oceanic Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (1 out of 57 teams, for instance). 2 will increase the ratio to 2/58, 3 will be 3/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioOCE')} value={formState.ratioOCE} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Brazil Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (1 out of 57 teams, for instance). 2 will increase the ratio to 2/58, 3 will be 3/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioBR')} value={formState.ratioBR} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>SEA Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (1 out of 57 teams, for instance). 2 will increase the ratio to 2/58, 3 will be 3/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioSEA')} value={formState.ratioSEA} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Japan Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (1 out of 57 teams, for instance). 2 will increase the ratio to 2/58, 3 will be 3/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioJP')} value={formState.ratioJP} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>CIS Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Ratio">
                            1 will keep the current ratio (1 out of 57 teams, for instance). 2 will increase the ratio to 2/58, 3 will be 3/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioCIS')} value={formState.ratioCIS} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>LatAm Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Latin America Ratio">
                            1 will keep the current ratio (1 out of 57 teams, for instance). 2 will increase the ratio to 2/58, 3 will be 3/59, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('ratioLatAm')} value={formState.ratioLatAm} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Prospect Ratio <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Prospect Supply Ratio">
                            1 will keep the current level of prospect generation, 2 will double it, etc.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('prospectSupply')} value={formState.prospectSupply} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Female Odds <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Female Odds">
                            The higher the value the greater chance a player will be female. The default is .001 (.1%), where 0 would be no female players and 1 would be all female players.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('femaleOdds')} value={formState.femaleOdds} />
                    </div>

                </div>
                <h4 style={{ marginTop: '1em' }}>Game Simulation</h4>
                <div className="row">
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Custom Roster Mode <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Custom Roster Mode">
                            For custom roster that have very high ratings that are very close together this brings ratings performance more in line with the standard rosters. It can also be used to make the standard game less random
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('customRosterMode')} value={formState.customRosterMode}>
                            <option value="false">Disabled</option>
                            <option value="true">Enabled</option>
                        </select>
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Custom Roster Mode Strength<HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Custom Roster Mode Strength">
                            1 is no change, greater than 1 makes top teams better relative to bottom teams, less than 1 makes bottom teams better relative to top teams
                        </HelpPopover></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('customRosterModeStrength')} value={formState.customRosterModeStrength} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Master Game Sim Adjuster <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Master Game Sim Adjuster">
                            The lower the value the longer the game and the harder it is to take objectives (and the less gold/exp/time helps). The higher the value the easier objectives are and the more gold/exp/time help.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('masterGameSimAdjuster')} value={formState.masterGameSimAdjuster} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>GM AI Pick/Ban Strength <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="GM AI Pick/Ban Strength">
                            0 will take the top pick always, while 100 will randomly choose any top ranked champ from 0 to 100. The greater the number the greater the game variation.
                        </HelpPopover></label>
                        <label></label>
                        <input type="text" className="form-control" disabled={!props.godMode} onChange={handleChange('aiPickBanStrength')} value={formState.aiPickBanStrength} />
                    </div>
                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Apply To Coach Mode <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Apply AI Pick/Ban Strength To Coach Mode ">
                            Overrides the existing Coach Mode difficulty level and allow you to set the AI pick/ban difficulty level. Currently 0 is impossible, 5 is hard, 20 is medium, and 50 is easy.
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('applyToCoachMode')} value={formState.applyToCoachMode}>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>




                </div>
                <h4 style={{ marginTop: '1em' }}>Display and UI</h4>
                <div className="row">

                    <div className="col-sm-3 col-xs-6 form-group">
                        <label>Real Champ Names <HelpPopover placement="right" style={defaultHelpPopoverStyle} title="Real Champ Names">
                            Turn on real champ names during the draft.
                        </HelpPopover></label>
                        <select className="form-control" disabled={!props.godMode} onChange={handleChange('realChampNames')} value={formState.realChampNames}>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>

                </div>

                <button className="btn btn-primary" id="save-god-mode-options" disabled={!props.godMode}>Save God Mode Options</button>
            </form>
        </div>
    );
};

export default GodMode;
