export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export interface Task {
  id: string | number;
  title: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageAdapter {
  createTask(task: Omit<Task, "id">): Promise<Task>;
  getTask(id: string): Promise<Task | null>;
  getAllTasks(): Promise<Task[]>;
  updateTask(id: string, task: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;
}
