import { Conference, Division } from "./types";

// This will get filled by values from IndexedDB. It is initialized by different mechanisms in the ui and worker, but the end result is the same.
const g: GameAttributes = {
    lid: undefined,
};

// Define the base interface with known properties
export interface GameAttributes {
  aiTrades?: boolean;
  bothSplits?: boolean;
  cCache?: any;
  cpCache?: any;
  confs?: Conference[];
  champType?: number;
  daysLeft?: number;
  difficulty?: number;
  disableInjuries?: boolean;
  divs?: Division[];
  fullLadder?: boolean;
  gameOver?: boolean;
  gameType?: number;
  GMCoachType?: number;
  godMode?: boolean;
  godModeInPast?: boolean;
  gracePeriodEnd?: number;
  leagueName?: string;
  lid?: number;
  luxuryPayroll?: number;
  luxuryTax?: number;
  maxContract?: number;
  maxRosterSize?: number;
  minContract?: number;
  minPayroll?: number;
  minRosterSize?: number;
  names?: {
    first: {
      [key: string]: [string, number][],
    },
    last: {
      [key: string]: [string, number][],
    },
  };
  nextPhase?: any;
  numChampions?: number;
  numChampionsPatch?: number;
  numGames?: number;
  numPlayoffRounds?: number;
  numTeams?: number;
  ownerMood?: any;
  ownerType?: number;
  patchType?: number;
  phase?: number;
  PHASE_TEXT?: any;
  PHASE?: any;
  playerChampRatingImpact?: number;
  playoffWins?: number;
  quarterLength?: number;
  realChampNames?: boolean;
  regionType?: number;
  salaryCap?: number;
  season?: number;
  seasonSplit?: number;
  showFirstOwnerMessage?: boolean;
  startingSeason?: number;
  startingSplit?: number;
  teamAbbrevsCache?: string[];
  teamNamesCache?: string[];
  teamRegionsCache?: string[];
  userTid?: number;
  userTids?: number[];
  yearType?: number;
  customRoster?: boolean;
  regionalRestriction?: boolean;
  gameBalance?: number;
  importRestriction?: number;
  residencyRequirement?: number;
  countryConcentration?: number;
  ratioEU?: number;
  germanRatio?: number;
  customRosterMode?: boolean;
  standardBackground?: boolean;
  refuseToLeave?: boolean;
  refuseToSign?: boolean;
  retirementPlayers?: boolean;
  yearPositionChange?: boolean;
  alwaysKeep?: boolean;
  applyToCoachMode?: boolean;
}

export default g;
