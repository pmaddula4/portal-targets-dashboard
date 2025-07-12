export interface TransferPlayer {
  id: string;
  name: string;
  position: string;
  height: string;
  previousTeam: string;
  conference: string;
  offensiveRating: number;
  defensiveRating: number;
  usageRate: number;
  efgPercent: number;
  threePtPercent: number;
  ftPercent: number;
  offensiveReboundingPercent: number;
  defensiveReboundingPercent: number;
  blockPercent: number;
  stealPercent: number;
  fitScore: number;
  archetype: string;
  summary: string;
  ppg: number;
  rpg: number;
  apg: number;
  minutes: number;
}

export const positions = ["All", "PG", "G", "G/F", "F/C", "PF", "C"];
export const conferences = ["All", "A-10", "ACC", "AE", "ASun", "Amer", "B10", "B12", "BE", "BSky", "BSth", "BW", "CAA", "CUSA", "Horz", "Ivy", "MAAC", "MAC", "MEAC", "MVC", "MWC",
                            "NEC", "OVC", "Pat", "SB", "SC", "SEC", "SWAC", "SInd", "Sum", "WAC", "WCC"];
export const archetypes = ["All", "Scoring PG", "Pure PG", "PF/C", "Stretch 4", "Combo G", "Wing F", "Wing G", "C"];