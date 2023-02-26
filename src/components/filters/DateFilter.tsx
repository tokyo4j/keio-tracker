import { FilterComponentProps } from "@tanstack/react-table";
import DatePicker, { registerLocale } from "react-datepicker";
import { ja } from "date-fns/locale";

registerLocale("ja", ja);

interface Props extends FilterComponentProps {}

const DateFilter = ({ column, table }: Props) => {
  const [from, to] = column.getFilterValue() as number[];

  return (
    <div>
      <DatePicker
        locale="ja"
        className="h-8 px-1 cursor-default rounded w-48"
        clearButtonClassName="after:!bg-gray-600"
        dateFormat="MM-dd (ccc)"
        isClearable={true}
        selectsRange={true}
        startDate={from ? new Date(from) : undefined}
        endDate={to ? new Date(to) : undefined}
        onChange={([startDate, endDate]) => {
          if (startDate) startDate.setHours(0, 0, 0, 0);
          if (endDate) endDate.setHours(23, 59, 59, 999);
          column.setFilterValue([startDate?.getTime(), endDate?.getTime()]);
        }}
      />
    </div>
  );
};
export default DateFilter;
