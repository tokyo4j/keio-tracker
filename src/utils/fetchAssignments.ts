import { NULL_DATE } from ".";
import {
  AssignmentsCanvasResponse,
  Assignment,
  CoursesResponse,
} from "../types/assignment";

const queryForCourseIds = `
{
  allCourses{
    _id
    term{
      endAt
    }
  }
}
`;

const createQueryForAssignments = (courseIds: number[]) => `
fragment f on Course{
  _id
  courseCode
  assignmentsConnection {
    nodes {
      _id
      name
      dueAt
      submissionsConnection {
        nodes {
          submissionStatus
        }
      }
      lockInfo{
        isLocked
      }
    }
  }
}
{
  ${courseIds.map((id) => `course${id}: course(id:${id}){...f}`).join()}
}
`;

const getCsrfToken = () =>
  decodeURIComponent(document.cookie.match(/(^| )_csrf_token=([^;]+)/)![2]);

const getHttpHeaders = () => ({
  "content-type": "application/json",
  "x-requested-with": "XMLHttpRequest",
  "x-csrf-token": getCsrfToken(),
});

const fetchAssignments = async () => {
  const availableCourseIds = await fetch("api/graphql", {
    method: "POST",
    headers: getHttpHeaders(),
    body: JSON.stringify({ query: queryForCourseIds }),
  })
    .then((res) => res.json())
    .then((res: CoursesResponse) => {
      const currentDate = new Date();
      const availableCourseIds = res.data.allCourses
        .filter((course) => currentDate < new Date(course.term.endAt))
        .map((course) => course._id);

      return availableCourseIds as number[];
    });

  return await fetch("api/graphql", {
    method: "POST",
    headers: getHttpHeaders(),
    body: JSON.stringify({
      query: createQueryForAssignments(availableCourseIds),
    }),
  })
    .then((res) => res.json())
    .then((res: AssignmentsCanvasResponse): Assignment[] =>
      Object.values(res.data)
        .map((course) => {
          return course.assignmentsConnection.nodes.map((assignment) => ({
            id: Number(assignment._id),
            courseId: Number(course._id),
            // display shortended course names if possible
            courseName:
              course.courseCode.match(/(?<=　| )[^ \[　]*?(?= \[|$)/)?.[0] ||
              course.courseCode,
            name: assignment.name,
            dueAt: assignment.dueAt
              ? new Date(assignment.dueAt).getTime()
              : NULL_DATE,
            isLocked: assignment.lockInfo.isLocked,
            isSubmitted: Boolean(assignment.submissionsConnection.nodes[0]),
          }));
        })
        .flat()
    );
};
export default fetchAssignments;
