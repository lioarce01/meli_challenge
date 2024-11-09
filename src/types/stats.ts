export interface Stats {
  count_mutant_dna: number;
  count_human_dna: number;
  ratio: number;
}

export interface StatsResponse extends Stats {}
