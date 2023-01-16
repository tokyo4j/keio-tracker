import type {
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from "react-table";

declare module "react-table" {
  export interface TableOptions<D extends object = {}>
    extends UseFiltersOptions<D>,
      UseSortByOptions<D> {}

  export interface TableInstance<D extends object = {}>
    extends UseFiltersInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UseFiltersState<D>,
      UseSortByState<D> {}

  export interface Hooks<D extends object = {}> extends UseSortByHooks<D> {}

  export interface Cell<D extends object = {}, V = any> {}

  export interface ColumnInterface<D extends object = {}>
    extends UseFiltersColumnOptions<D>,
      UseSortByColumnOptions<D> {}

  export interface ColumnInstance<D extends object = {}>
    extends UseFiltersColumnProps<D>,
      UseSortByColumnProps<D> {}

  export interface Row<D extends object = {}> {}
}
