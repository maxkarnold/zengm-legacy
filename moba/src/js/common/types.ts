export type AchievementKey = (
    'participation' |
    'eating' |
    'fed' |
    'world_beater' |
    'first_blood' |
    'killing_spree' |
    'rampage' |
    'unstoppable' |
    'dominating' |
    'godlike' |
    'legendary' |
    'ace' |
    'penta_kill' |
    'wood' |
    'bronze' |
    'silver' |
    'gold' |
    'platinum' |
    'diamond' |
    'master' |
    'challenger' |
    'pro' |
    'coach_easy' |
    'coach_medium' |
    'coach_hard' |
    'coach_impossible' |
    'hardware_store' |
    'ladder_climber' |
    'ladder_climber2' |

    /*'fo_fo_fo' |
    'septuawinarian' |
    '98_degrees' |
    'dynasty' |
    'dynasty_2' |
    'dynasty_3' |
    'moneyball' |
    'moneyball_2' |
    'hardware_store' |
    'small_market' |
    'sleeper_pick' |*/
    'hacker'
);

type AwardTeam = {
    tid: number,
    abbrev: string,
    region: string,
    name: string,
    won: number,
    lost: number,
};

type AwardPlayer = {
    pid: number,
    name: string,
    tid: number,
    abbrev: string,
    pts: number,
    trb: number,
    ast: number,
};

type AwardPlayerDefense = {
    pid: number,
    name: string,
    tid: number,
    abbrev: string,
    trb: number,
    blk: number,
    stl: number,
};

export type Awards = {
    season: number,
    bestRecord: AwardTeam,
    bestRecordConfs: [
        AwardTeam,
        AwardTeam,
    ],
    roy: AwardPlayer,
    allRookie: [
        AwardPlayer,
        AwardPlayer,
        AwardPlayer,
        AwardPlayer,
        AwardPlayer,
    ],
    mvp: AwardPlayer,
    regionMVP: AwardPlayer,
	regionAllLeague: [
        {
            title: 'NA League Championship Series',
            players: [
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
            ]
        },
        {
            title: 'EU League Championship Series',
            players: [
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
            ]
        },
        {
            title: 'League Champions Korea',
            players: [
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
            ]
        },
        {
            title: 'Legends Pro League',
            players: [
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
            ]
        },
        {
            title: 'League Masters Series',
            players: [
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
            ]
        },
        {
            title: 'League Wild Card Series',
            players: [
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
            ]
        },
    ],
    smoy: AwardPlayer,
    allLeague: [
        {
            title: 'First Team',
            players: [
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
            ]
        },
        {
            title: 'Second Team',
            players: [
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
            ]
        },
        {
            title: 'Third Team',
            players: [
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
                AwardPlayer,
            ]
        },
    ],
    dpoy: AwardPlayerDefense,
    allDefensive: [
        {
            title: 'First Team',
            players: [
                AwardPlayerDefense,
                AwardPlayerDefense,
                AwardPlayerDefense,
                AwardPlayerDefense,
                AwardPlayerDefense,
            ]
        },
        {
            title: 'Second Team',
            players: [
                AwardPlayerDefense,
                AwardPlayerDefense,
                AwardPlayerDefense,
                AwardPlayerDefense,
                AwardPlayerDefense,
            ]
        },
        {
            title: 'Third Team',
            players: [
                AwardPlayerDefense,
                AwardPlayerDefense,
                AwardPlayerDefense,
                AwardPlayerDefense,
                AwardPlayerDefense,
            ]
        },
    ],
    finalsMvp: AwardPlayer,
};

export type BackboardTx = any;

export type Conditions = {
    hostID?: number;
};

export type Conference = {
    cid: number,
    name: string,
};

export type Division = {
    did: number,
    cid: number,
    name: string,
};

export type DraftOrder = any;

export type DraftPick = {
    dpid: number,
    tid: number,
    originalTid: number,
    round: number,
    season: number,
};

export type DraftPickWithoutDpid = {
    tid: number,
    originalTid: number,
    round: number,
    season: number,
};

export type EventBBGM = any;

export type Game = {
    att: number,
    gid: number,
    lost: {tid: number, pts: number},
    playoffs: boolean,
    season: number,
    teams: [Object, Object],
    won: {tid: number, pts: number},
};

export type GamePlayer = any;

export type GameResults = any;

export type GameProcessed = {
    gid: number,
    home: boolean,
    oppPts: number,
    oppTid: number,
    oppAbbrev: number,
    overtime: string,
    tid?: number,
    pts: number,
    won: boolean,
    seasonSplit?: string,
    seasonSplit2?: string,
    playoffType?: string,
    playoffs?: boolean,
    playoffs2?: string,
};

export type GameProcessedCompleted = {
    gid: number,
    overtime: string,
    score: string,
    teams: [Object, Object],
    won: boolean,
    seasonSplit: string,
    seasonSplit2: string,
    playoffType: string,
    playoffs: boolean,
    playoffs2: string,
};

export type GetOutput = {[key: string]: string | number};

export type League = {
    lid: number,
    name: string,
    tid: number,
    phaseText: string,
    teamName: string,
    teamRegion: string,
    heartbeatID?: string,
    heartbeatTimestamp?: number,
	bothSplits: boolean,
};

export type Local = {
    autoPlaySeasons: number,
    phaseText: string,
    statusText: string,
};

export type Locks = {
    gameSim: boolean,
    newPhase: boolean,
    stopGameSim: boolean,
}

export type LockName = 'newPhase' | 'gameSim' | 'stopGameSim';

export type LogEventType = (
    'achievement' |
    'award' |
    'changes' |
    'draft' |
    'error' |
    'freeAgent' |
    'gameLost' |
    'gameWon' |
    'hallOfFame' |
    'healed' |
    'injured' |
    'playerFeat' |
    'playoffs' |
    'reSigned' |
    'refuseToSign' |
    'release' |
    'retired' |
    'screenshot' |
    'trade' |
    'tragedy'
);

export type LogEventSaveOptions = {
    type: LogEventType,
    text: string,
    pids?: number[],
    tids?: number[],
};

export type LogEventShowOptions = {
    extraClass?: string,
    persistent: boolean,
    text: string,
    type: string,
};

export type MessageWithoutMid = {
    from: string,
    read: boolean,
    text: string,
    year: number,
};

export type Message = MessageWithoutMid & {mid: number};

export type Negotiation = {
    pid: number,
    tid: number,
    team: {amount: number, years: number},
    player: {amount: number, years: number},
    orig: {amount: number, years: number},
    resigning: boolean,
};

export type Option = {
    id: string,
    label: string,
    url?: string,
};

export type OwnerMoodDeltas = {
    money: number,
    playoffs: number,
    wins: number,
};

export type PageCtx = {[key: string]: any};

export type PartialTopMenu = {
    email: string,
    goldCancelled: boolean,
    goldUntil: number,
    username: string,
};

export type Phase = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Pick = {
    dpid: number,
    originalTid: number,
    round: number,
    season: number,
    tid: number,
};

export type PickRealized = {
    originalTid: number,
    pick: number,
    round: number,
    tid: number,
};

export type PlayerContract = {
    amount: number,
    exp: number,
};

export type PlayerFeat = {
    fid?: number,
    pid: number,
    name: string,
    pos: string,
    season: number,
    tid: number,
    oppTid: number,
    playoffs: boolean,
    gid: number,
    stats: any,
    won: boolean,
    score: string,
    overtimes: number,
};

export type PlayerStatType = 'per36' | 'perGame' | 'totals';

export type PlayerFiltered = any;

export type PlayerInjury = {
    gamesRemaining: number,
    type: string,
};

export type PlayerSkill = '3' | 'A' | 'B' | 'Di' | 'Dp' | 'Po' | 'Ps' | 'R';

export type PlayerRatings = {
    blk: number,
    dnk: number,
    drb: number,
    endu: number,
    fg: number,
    ft: number,
    fuzz: number,
    hgt: number,
    ins: number,
    jmp: number,
    ovr: number,
    pos: string,
    pot: number,
    pss: number,
    reb: number,
    season: number,
    spd: number,
    skills: PlayerSkill[],
    stl: number,
    stre: number,
    tp: number,
};

export type PlayerSalary = {
    amount: number,
    season: number,
};

export type PlayerStats = any;

export type Player = {
    pid: number;
    tid: number;
    name: string;
    pos: string;
    ratings: PlayerRatings[];
    champions?: Array<{
        skill: number;
        name: string;
    }>;
    born: {
        loc: string;
        year: number;
    };
    awards?: {
        season: number;
        type: string;
    }[];
    college?: string;
    contract?: {
        amount: number;
        exp: number;
    };
    diedYear?: number;
    draft?: {
        round: number;
        pick: number;
        tid: number;
        originalTid: number;
        year: number;
        pot: number;
        ovr: number;
        skills: string[];
    };
    face?: any;
    firstName?: string;
    freeAgentMood?: number[];
    gamesUntilTradable?: number;
    hgt?: number;
    hof?: boolean;
    imgURL?: string;
    injury?: {
        gamesRemaining: number;
        type: string;
    };
    lastName?: string;
    ptModifier?: number;
    retiredYear?: number;
    rosterOrder?: number;
    salaries?: Array<{
        amount: number;
        season: number;
    }>;
    statsTids?: number[];
    value?: number;
    valueNoPot?: number;
    valueFuzz?: number;
    valueNoPotFuzz?: number;
    valueWithContract?: number;
    watch?: boolean;
    weight?: number;
    yearsFreeAgent?: number;
};

export type PlayerWithoutPid = Omit<Player, 'pid'>;

export type PlayerWithStats = Player & {stats: PlayerStats[]};

type PlayoffSeriesTeam = {
    cid: number,
    seed: number,
    tid: number,
    winp: number,
    won: number,
	loss: number,
    placement: string,
};

export type PlayoffSeries = {
    season: number,
    currentRound: number,
    series: {
        home: PlayoffSeriesTeam,
        away: PlayoffSeriesTeam,
    }[][],
};

export type ContractInfo = {
    pid: number,
    firstName: string,
    lastName: string,
    skills: PlayerSkill[],
    injury: PlayerInjury,
    amount: number,
    exp: number,
    released: boolean,
};

export type RatingKey = (
    'blk' |
    'dnk' |
    'drb' |
    'endu' |
    'fg' |
    'ft' |
    'hgt' |
    'ins' |
    'jmp' |
    'pss' |
    'reb' |
    'spd' |
    'stl' |
    'stre' |
    'tp'
);

export type ReleasedPlayer = {
    rid: number,
    pid: number,
    tid: number,
    contract: PlayerContract,
};

export type ReleasedPlayerWithoutRid = {
    pid: number,
    tid: number,
    contract: PlayerContract,
};

export type ScheduleGame = {
    awayTid: number,
    homeTid: number,
};

export type SortOrder = 'asc' | 'desc';

export type SortType = 'currency' | 'draftPick' | 'lastTen' | 'name' | 'number';

export type Team = {
    tid: number,
    cid: number,
    did: number,
    region: string,
    name: string,
    abbrev: string,
    imgURL?: string,
    budget: any,
    strategy: any,
};

export type TeamBasic = {
    tid: number,
    cid: number,
    did: number,
    region: string,
    name: string,
    abbrev: string,
    pop: number,
    popRank?: number,
    imgURL?: string,
};

export type TeamAttr = string;

export type TeamSeasonAttr = string;

export type TeamStatAttr = string;

export type TeamStatType = 'perGame' | 'totals';

export type TeamFiltered = any;

type BudgetItem = {
    amount: number,
    rank: number,
};

export type TeamSeason = {
    tid: number,
    season: number,
    gp: number,
    gpHome: number,
    att: number,
    cash: number,
    won: number,
    lost: number,
    wonHome: number,
    lostHome: number,
    wonAway: number,
    lostAway: number,
    wonDiv: number,
    lostDiv: number,
    wonConf: number,
    lostConf: number,
    lastTen: (0 | 1)[],
    streak: number,
    playoffRoundsWon: number,  // -1: didn't make playoffs. 0: lost in first round. ... N: won championship
    playoffRoundsWonMSI: number,  // -1: didn't make playoffs. 0: lost in first round. ... N: won championship
    hype: number,
    pop: number,
    revenues: {
        luxuryTaxShare: BudgetItem,
        merch: BudgetItem,
        sponsor: BudgetItem,
        ticket: BudgetItem,
        nationalTv: BudgetItem,
        localTv: BudgetItem,
    },
    expenses: {
        salary: BudgetItem,
        luxuryTax: BudgetItem,
        minTax: BudgetItem,
        scouting: BudgetItem,
        coaching: BudgetItem,
        health: BudgetItem,
        facilities: BudgetItem,
    },
    payrollEndOfSeason: number,
};

export type TeamStats = any;

export type TradePickValues = {
    [key: string]: number[],
};

type TradeSummaryTeam = {
    name: string,
    payrollAfterTrade: number,
    picks: {
        dpid: number,
        desc: string,
    }[],
    total: number,
    trade: PlayerFiltered[],
};

export type TradeSummary = {
    teams: [TradeSummaryTeam, TradeSummaryTeam],
    warning: null | string,
};

type TradeTeam = {
    dpids: number[],
    pids: number[],
    tid: number,
};

export type TradeTeams = [TradeTeam, TradeTeam];

export type Trade = {
    rid: 0,
    teams: TradeTeams,
};

export type UpdateEvents = (
    'account' |
    'clearWatchList' |
    'firstRun' |
    'g.userTids' |
    'gameSim' |
    'lock.gameSim' |
    'newPhase' |
    'playerMovement' |
    'toggleGodMode' |
    'watchList'
)[];

export type RunFunction = (
    inputs: GetOutput,
    updateEvents: UpdateEvents,
    state: any,
    setState: (state: any) => void,
    topMenu: any,
) => Promise<void | {[key: string]: any}>;
