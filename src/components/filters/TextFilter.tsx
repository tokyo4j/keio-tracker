import { Assignment } from "assignment";
import { FilterProps, Renderer } from "react-table";

const TextFilter: Renderer<FilterProps<Assignment>> = ({
  column: { setFilter },
}) => {
  return (
    <input
      className="kt-text-filter"
      placeholder="検索"
      onChange={(e) => setFilter(e.target.value || "")}
    />
  );
};

export default TextFilter;
