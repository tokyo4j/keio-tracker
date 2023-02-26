import { Column, RowData, Table } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  export interface ColumnMeta<TData extends RowData, TValue> {
    filterComponent?: FilterComponent;
  }
  export interface FilterComponentProps {
    column: Column<any, unknown>;
    table: Table<any>;
  }
  export type FilterComponent = (props: FilterComponentProps) => any;
}
