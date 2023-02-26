import AssignmentsTable from "./components/AssignmentsTable";
import useAssignments from "./utils/useAssignments";

const App = () => {
  const [assignments, error] = useAssignments();

  return (
    <>
      <div>
        <h1 className="text-2xl border-gray-300 border-b my-1">
          課題一覧 (赤い課題は24時間以内に提出)
        </h1>
      </div>
      {error ? (
        <div>エラー: {error}</div>
      ) : !assignments ? (
        <div>読み込み中...</div>
      ) : (
        <AssignmentsTable assignments={assignments} />
      )}
    </>
  );
};

export default App;
