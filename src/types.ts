export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageAdapter {
  createTask(task: Task): Promise<Task>;
  getTask(id: number): Promise<Task | null>;
  getAllTasks(): Promise<Task[]>;
  updateTask(id: number, task: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<boolean>;
  getNextId(): Promise<number>;
}
