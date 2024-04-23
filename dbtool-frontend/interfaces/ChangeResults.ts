interface ChangeRowDetails {
  rows: string[];
}

interface ChangeResults {
  inserted: { [key: string]: ChangeRowDetails };
  updated: { [key: string]: ChangeRowDetails };
  deleted: { [key: string]: ChangeRowDetails };
}

export type { ChangeResults, ChangeRowDetails };
