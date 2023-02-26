import { FilterComponentProps } from "@tanstack/react-table";

interface Props extends FilterComponentProps {}

const TextFilter = ({ column, table }: Props) => {
  return (
    <input
      className="p-1 h-8 w-full rounded"
      placeholder="検索"
      onChange={(e) => column.setFilterValue(e.target.value)}
    ></input>
  );
};
export default TextFilter;
