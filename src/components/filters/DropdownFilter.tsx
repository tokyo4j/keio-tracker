import { FilterComponentProps } from "@tanstack/react-table";
import { useMemo } from "react";

const castFromString = (sample: any, val: string) => {
  switch (typeof sample) {
    case "string":
      return val;
    case "number":
      return Number(val);
    case "boolean":
      if (val === "true") return true;
      else if (val === "false") return false;
      return null;
    case "object":
      if (sample instanceof Date) return new Date(val);
    default:
      null;
  }
};

interface Alternative {
  value: any;
  text: string;
}

interface Props extends FilterComponentProps {
  alternatives?: Alternative[];
}

const DropdownFilter = ({
  column,
  table,
  alternatives: optionalAlternatives,
}: Props) => {
  const alternatives = useMemo(() => {
    if (optionalAlternatives) return [...optionalAlternatives];
    else {
      let values = table
        .getCoreRowModel()
        .rows.map((row) => String(row.getValue(column.id)));
      values = Array.from(new Set(values));

      return values.map((value) => ({
        value: value,
        text: String(value),
      }));
    }
  }, [table.getCoreRowModel().rows]);

  return (
    <select
      className="bg-white p-1 h-8 w-full rounded"
      defaultValue={column.getFilterValue() as any}
      onChange={(e) => {
        if (e.target.value === "") column.setFilterValue(undefined);
        else
          column.setFilterValue(
            castFromString(alternatives[0].value, e.target.value)
          );
      }}
    >
      <option value="">全て</option>
      {alternatives.map((alt, i) => (
        <option key={i} value={alt.value}>
          {alt.text}
        </option>
      ))}
    </select>
  );
};
export default DropdownFilter;
