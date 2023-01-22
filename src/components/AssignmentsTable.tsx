import type { Assignment } from "../types/assignment";
import { formatDateTime } from "../utils";
import DateBetweenFilter from "./filters/DateBetweenFilter";
import TextFilter from "./filters/TextFilter";
import getSelectionFilter from "./filters/getSelectionFilter";
import { Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { Column, useTable, useFilters, useSortBy } from "react-table";
import Arrow from "./Arrow";

const columns: Column<Assignment>[] = [
  {
    Header: "科目",
    accessor: "courseName",
    Filter: getSelectionFilter(),
    Cell: ({ value }) => <span title={value}>{value}</span>,
  },
  {
    Header: "課題",
    accessor: "name",
    Filter: TextFilter,
    filter: "includes",
    Cell: ({ value }) => <span title={value}>{value}</span>,
  },
  {
    Header: "期限",
    accessor: "dueAt",
    id: "dueAt",
    Cell: ({ value }) => {
      if (Number(value) === Number(new Date("2100"))) return null;
      const text = formatDateTime(value);
      return <span title={text}>{text}</span>;
    },
    sortType: "datetime",
    Filter: DateBetweenFilter,
    filter: (rows, columnIds, filterValue: Date[]) => {
      const start = filterValue[0];
      const end = filterValue[1];
      return rows.filter(
        (row) =>
          (!start || start < row.values.dueAt) &&
          (!end || end > row.values.dueAt)
      );
    },
  },
  {
    Header: "ロック状況",
    id: "isLocked",
    accessor: "isLocked",
    Cell: ({ value }) => (value ? "ロック" : "アンロック"),
    Filter: getSelectionFilter([
      { value: true, text: "ロック" },
      { value: false, text: "アンロック" },
    ]),
    filter: "equals",
  },
  {
    Header: "提出状況",
    id: "isSubmitted",
    accessor: "isSubmitted",
    Cell: ({ value }) => (value ? "提出済" : "未提出"),
    Filter: getSelectionFilter([
      { value: true, text: "提出済" },
      { value: false, text: "未提出" },
    ]),
    filter: "equals",
  },
  {
    id: "hideButton",
    accessor: "" as any,
    Filter: () => <span>⟳</span>,
    Cell: "✕",
  },
];

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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<Assignment>(
      {
        columns,
        data: assignments,
        initialState: {
          sortBy: [
            {
              id: "dueAt",
              desc: false,
            },
          ],
          filters: [
            {
              id: "isSubmitted",
              value: false,
            },
            {
              id: "isLocked",
              value: false,
            },
            {
              id: "dueAt",
              value: (function () {
                const from = new Date();
                from.setHours(0, 0, 0);
                const to = null;
                return [from, to];
              })(),
            },
          ],
        },
        disableSortRemove: true,
      },
      useFilters,
      useSortBy
    );

  useEffect(() => {
    const savedData = localStorage.getItem("hiddenAssignmentIds");
    if (savedData) {
      const ids = JSON.parse(savedData) as number[];
      setHiddenAssignmentIds(ids);
    }
  }, []);

  const handleCellClick = useCallback((columnId: String, row: Assignment) => {
    if (columnId == "courseName") {
      window.open(`courses/${row.courseId}`);
    } else if (columnId == "hideButton") {
      setHiddenAssignmentIds((ids) => {
        const newIds = [...ids, row.id];
        localStorage.setItem("hiddenAssignmentIds", JSON.stringify(newIds));
        return newIds;
      });
    } else {
      window.open(`courses/${row.courseId}/assignments/${row.id}`);
    }
  }, []);

  return (
    <table {...getTableProps()} className="assignments-table">
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <Fragment key={i}>
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={j}
                >
                  <span>{column.render("Header")}</span>
                  <Arrow
                    hidden={!column.isSorted}
                    direction={column.isSortedDesc ? "desc" : "asc"}
                  />
                </th>
              ))}
            </tr>
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th
                  key={j}
                  onClick={
                    column.id == "hideButton"
                      ? () => {
                          localStorage.removeItem("hiddenAssignmentIds");
                          setHiddenAssignmentIds([]);
                        }
                      : undefined
                  }
                >
                  {column.canFilter && column.render("Filter")}
                </th>
              ))}
            </tr>
          </Fragment>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.length == 0 && (
          <tr className="kt-no-data">
            <td colSpan={headerGroups[0].headers.length}>
              該当する課題はありません
            </td>
          </tr>
        )}

        {rows.map((row, i) => {
          prepareRow(row);

          const deadlineDelta =
            row.original.dueAt.getTime() - new Date().getTime();
          const isHighlighted =
            deadlineDelta > 0 && deadlineDelta < 1 * 24 * 60 * 60 * 1000;

          return (
            <tr
              {...row.getRowProps()}
              key={i}
              className={isHighlighted ? "kt-highlighted" : undefined}
            >
              {row.cells.map((cell, j) => (
                <td
                  {...cell.getCellProps()}
                  onClick={() => {
                    handleCellClick(cell.column.id, row.original);
                  }}
                  key={j}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AssignmentsTable;
