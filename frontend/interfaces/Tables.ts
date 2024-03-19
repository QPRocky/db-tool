interface FKDetails {
  referenceTableName: string;
  referenceColumnName: string;
}

interface ColumnDetails {
  dataType: string;
  isPK: boolean;
  fkDetails: FKDetails | null;
}

interface TableDetails {
  columns: { [key: string]: ColumnDetails };
  rows: Record<string, any>[];
}

interface Tables {
  [key: string]: TableDetails;
}

export type { Tables, TableDetails, ColumnDetails, FKDetails };
