import {
  TaskStatus,
  type Task,
  type StorageAdapter,
} from "./adapters/StorageAdapter";

export class TaskManager {
  constructor(private storage: StorageAdapter) {}

  async addTask(title: string): Promise<Task> {
    const newTask = {
      title,
      status: TaskStatus.TODO,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.storage.createTask(newTask);
  }

  async updateTask(id: string, title: string): Promise<void> {
    const task = await this.storage.getTask(id);
    if (!task) {
      throw new Error("Task not found");
    }

    await this.storage.updateTask(id, { title });
  }

  async deleteTask(id: string): Promise<void> {
    const deleted = await this.storage.deleteTask(id);
    if (!deleted) {
      throw new Error("Task not found");
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
    const task = await this.storage.getTask(id);
    if (!task) {
      throw new Error("Task not found");
    }

    await this.storage.updateTask(id, { status });
  }

  async listTasks(status?: TaskStatus): Promise<Task[]> {
    const tasks = await this.storage.getAllTasks();
    if (!status) {
      return tasks;
    }
    return tasks.filter((task) => task.status === status);
  }
}
