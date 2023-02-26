export interface AssignmentsCanvasResponse {
  data: {
    [key: string]: {
      courseCode: string;
      _id: number;
      assignmentsConnection: {
        nodes: {
          name: string;
          _id: string;
          dueAt: string | null;
          submissionsConnection: {
            nodes: {
              attempt: number;
            }[];
          };
          lockInfo: {
            isLocked: boolean;
          };
        }[];
      };
    };
  };
}

export interface CoursesResponse {
  data: {
    allCourses: {
      _id: number;
      term: {
        endAt: string;
      };
    }[];
  };
}

export type Assignment = {
  id: number;
  courseId: number;
  courseName: string;
  name: string;
  dueAt: number;
  isLocked: boolean;
  isSubmitted: boolean;
};
