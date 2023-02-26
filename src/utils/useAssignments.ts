import { useEffect, useState } from "react";
import { Assignment } from "../types/assignment";
import fetchAssignments from "./fetchAssignments";

const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    // use dummy data in development mode
    if (import.meta.hot) {
      import("../utils/dummy-assignments.json").then((mod) => {
        setAssignments([
          ...(mod.default as Assignment[]),
          {
            id: 123456,
            courseId: 54564,
            courseName: "情報と職業",
            name: "KeioTrackerテスト用課題",
            dueAt: new Date().getTime() + 3600000,
            isLocked: false,
            isSubmitted: false,
          },
        ]);
      });
    } else {
      fetchAssignments()
        .then((assignments) => {
          setAssignments(assignments);
        })
        .catch((e) => {
          console.error(e);
          setError(e);
        });
    }
  }, []);

  return [assignments, error] as const;
};
export default useAssignments;
