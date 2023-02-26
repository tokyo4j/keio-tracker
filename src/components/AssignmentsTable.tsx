import type { Assignment } from "../types/assignment";
import { formatDateTime, isDateWithinDay, NULL_DATE } from "../utils";
import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import DropdownFilter from "./filters/DropdownFilter";
import TextFilter from "./filters/TextFilter";
import DateFilter from "./filters/DateFilter";
import { IoMdRefreshCircle, IoMdRemoveCircle } from "react-icons/io";
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti";

const columnHelper = createColumnHelper<Assignment>();

type Props = {
  assignments: Assignment[];
};

const AssignmentsTable = ({ assignments: allAssignments }: Props) => {
  const [hiddenAssignmentIds, setHiddenAssignmentIds] = useState<number[]>([]);
  const assignments = useMemo(
    () =>
      allAssignments.filter((asgmt) => !hiddenAssignmentIds.includes(asgmt.id)),
    [allAssignments, hiddenAssignmentIds]
  );

  const columns: ColumnDef<Assignment, any>[] = useMemo(
    () => [
      columnHelper.accessor("id", {}),
      columnHelper.accessor("courseId", {}),
      columnHelper.accessor("courseName", {
        header: () => <div>コース</div>,
        cell: ({ getValue, row }) => (
          <div
            className={
              "h-full pl-1 " +
              (isDateWithinDay(row.getValue("dueAt"))
                ? "hover:bg-red-300"
                : "hover:bg-gray-300")
            }
            title="コースを開く"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`courses/${row.getValue("courseId")}`);
            }}
          >
            {getValue()}
          </div>
        ),
        meta: {
          filterComponent: ({ table, column }) => (
            <DropdownFilter table={table} column={column} />
          ),
        },
      }),
      columnHelper.accessor("name", {
        header: () => <div>課題</div>,
        cell: ({ getValue }) => <div>{getValue()}</div>,
        meta: {
          filterComponent: ({ table, column }) => (
            <TextFilter column={column} table={table} />
          ),
        },
      }),
      columnHelper.accessor("dueAt", {
        header: () => <div>期限</div>,
        cell: ({ getValue }) => {
          const value = getValue() as number;
          if (value === NULL_DATE) return "";
          const text = formatDateTime(new Date(value));
          return <div className="text-center">{text}</div>;
        },
        filterFn: (row, columnId, filterValue, addMeta) => {
          let value = row.getValue("dueAt") as number;
          const [from, to] = filterValue as (number | null)[];
          return (!from || from < value) && (!to || to > value);
        },
        meta: {
          filterComponent: ({ table, column }) => (
            <DateFilter column={column} table={table} />
          ),
        },
      }),
      columnHelper.accessor("isLocked", {
        header: () => <div className="w-20">ロック状況</div>,
        cell: ({ getValue }) => (
          <div className="text-center">
            {getValue() ? "ロック" : "アンロック"}
          </div>
        ),
        meta: {
          filterComponent: ({ table, column }) => (
            <DropdownFilter
              column={column}
              table={table}
              alternatives={[
                { value: true, text: "ロック" },
                { value: false, text: "アンロック" },
              ]}
            />
          ),
        },
      }),
      columnHelper.accessor("isSubmitted", {
        header: () => <div className="w-20">提出状況</div>,
        cell: ({ getValue }) => (
          <div className="text-center">{getValue() ? "提出済" : "未提出"}</div>
        ),
        meta: {
          filterComponent: ({ table, column }) => (
            <DropdownFilter
              column={column}
              table={table}
              alternatives={[
                { value: true, text: "提出済" },
                { value: false, text: "未提出" },
              ]}
            />
          ),
        },
      }),
    ],
    []
  );

  const table = useReactTable<Assignment>({
    data: assignments,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility: {
        id: false,
        courseId: false,
      },
    },
    initialState: {
      columnFilters: [
        {
          id: "dueAt",
          value: (() => {
            const from = new Date();
            from.setHours(0, 0, 0);
            return [from.getTime(), null];
          })(),
        },
        {
          id: "isLocked",
          value: false,
        },
        {
          id: "isSubmitted",
          value: false,
        },
      ],
      sorting: [
        {
          id: "dueAt",
          desc: false,
        },
      ],
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("hiddenAssignmentIds");
    if (savedData) {
      const ids = JSON.parse(savedData) as number[];
      setHiddenAssignmentIds(ids);
    }
  }, []);

  return (
    <table className="table-fixed h-fit my-2 rounded">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className="bg-gray-200" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th className="first:rounded-tl" key={header.id}>
                <div
                  className="py-1 flex justify-center items-center select-none cursor-pointer hover:bg-gray-300"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanSort() &&
                    ({
                      asc: <TiArrowSortedDown className="text-gray-500" />,
                      desc: <TiArrowSortedUp className="text-gray-500" />,
                    }[header.column.getIsSorted() as string] || (
                      <TiArrowUnsorted className="text-gray-500" />
                    ))}
                </div>
                <div className="my-1 mx-[2px] font-normal">
                  {header.column.columnDef.meta?.filterComponent?.({
                    table: table,
                    column: header.column,
                  })}
                </div>
              </th>
            ))}
            <th className="rounded-tr">
              <div className="py-1">&shy;</div>
              <IoMdRefreshCircle
                className="w-6 h-6 cursor-pointer hover:text-red-500"
                title="表示リセット"
                onClick={() => {
                  localStorage.removeItem("hiddenAssignmentIds");
                  setHiddenAssignmentIds([]);
                }}
              />
            </th>
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.length === 0 && (
          <tr>
            <td
              colSpan={table.getVisibleFlatColumns().length + 1}
              className="text-center bg-gray-50"
            >
              該当する課題はありません
            </td>
          </tr>
        )}
        {table.getRowModel().rows.map((row, rowIdx) => (
          <tr
            key={row.id}
            className={
              // prettier-ignore
              "cursor-pointer " +
                (isDateWithinDay(row.getValue("dueAt")) ? "bg-red-300  hover:bg-red-200"
                                                        : rowIdx % 2 ? "bg-gray-100 hover:bg-gray-200"
                                                                     : "bg-gray-50 hover:bg-gray-200")
            }
            title="課題を開く"
            onClick={(e) => {
              e.stopPropagation();
              // prettier-ignore
              window.open(`courses/${row.getValue("courseId")}/assignments/${row.getValue("id")}`);
            }}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
            <td>
              <div className="text-center">
                <IoMdRemoveCircle
                  className="w-6 h-6 inline-block hover:text-red-500"
                  title="非表示"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHiddenAssignmentIds((ids) => {
                      const newIds = [...ids, row.getValue("id") as number];
                      localStorage.setItem(
                        "hiddenAssignmentIds",
                        JSON.stringify(newIds)
                      );
                      return newIds;
                    });
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default AssignmentsTable;
