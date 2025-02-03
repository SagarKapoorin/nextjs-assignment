//task
export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
  }
  //new task id->default random string
  export interface NewTask {
    title: string;
    description: string;
    dueDate: string;
  }
  // to get to delete complete and edit
  export interface TaskActionProps {
    taskId: string;
  }
  //delete and toggle functions
  export type TaskToggleFunction = (taskId: string) => void;
  export type TaskDeleteFunction = (taskId: string) => void;