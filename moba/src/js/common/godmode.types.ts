export interface GodModeProps extends GodModeAttributes {
    // Additional props specific to the GodMode component
}


export interface GodModeState {
    dirty: boolean;
    disableInjuries: string;
    luxuryPayroll: number;
    luxuryTax: number;
    maxContract: number;
    minContract: number;
    minPayroll: number;
    minRosterSize: number;
    numGames: number;
    quarterLength: number;
    salaryCap: number;
    gameBalance: number;
    importRestriction: number;
    residencyRequirement: number;
    countryConcentration: number;
    ratioEU: number;
    germanRatio: number;
    playoffWins: number;
    customRoster: boolean;
    regionalRestriction: boolean;
}

// God Mode related attributes
export interface GodModeAttributes {
  godMode: boolean;
  godModeInPast: boolean;
  customRoster: boolean;
  regionalRestriction: boolean;
  disableInjuries: boolean;
  numGames: number;
  quarterLength: number;
  minRosterSize: number;
  salaryCap: number;
  minPayroll: number;
  luxuryPayroll: number;
  luxuryTax: number;
  minContract: number;
  maxContract: number;
  gameBalance: number;
  importRestriction: number;
  residencyRequirement: number;
  countryConcentration: number;
  ratioEU: number;
  germanRatio: number;
  playoffWins: number;
  aiPickBanStrength: number;
  maxRosterSize: number;
  customRosterModeStrength: number;
  customRosterMode: boolean;
  prospectSupply: number;
  masterGameSimAdjuster: number;
  ratioNA: number;
  ratioCN: number;
  ratioTW: number;
  ratioOCE: number;
  ratioBR: number;
  ratioSEA: number;
  ratioJP: number;
  ratioCIS: number;
  ratioLatAm: number;
  koreanRatio: number;
  realChampNames: string;
  standardBackground: boolean;
  refuseToLeave: boolean;
  refuseToSign: boolean;
  retirementPlayers: boolean;
  yearPositionChange: boolean;
  alwaysKeep: boolean;
  applyToCoachMode: boolean;
  regionalRestrictions: string;
  femaleOdds: number;
  aiTrades: boolean;
  difficulty: number;
  bothSplits: boolean;
}
