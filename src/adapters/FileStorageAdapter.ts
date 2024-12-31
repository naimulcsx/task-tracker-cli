import { type StorageAdapter, type Task } from "./StorageAdapter";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import crypto from "crypto";

type Schema = {
  tasks: Task[];
  totalTasks: number;
};

export class FileStorageAdapter implements StorageAdapter {
  private db: Low<Schema>;

  constructor(filename: string) {
    const filePath = path.join(process.cwd(), filename);
    const adapter = new JSONFile<Schema>(filePath);
    this.db = new Low(adapter, { tasks: [], totalTasks: 0 });
  }

  private async ensureDb(): Promise<void> {
    await this.db.read();
    this.db.data = this.db.data || { tasks: [], totalTasks: 0 };
  }

  async createTask(task: Omit<Task, "id">): Promise<Task> {
    await this.ensureDb();
    const newTask = {
      ...task,
      id: (this.db.data.totalTasks + 1).toString(),
    };

    this.db.data.tasks.push(newTask);
    this.db.data.totalTasks++;
    await this.db.write();
    return newTask;
  }

  async getTask(id: string): Promise<Task | null> {
    await this.ensureDb();
    return this.db.data.tasks.find((task) => task.id === id) || null;
  }

  async getAllTasks(): Promise<Task[]> {
    await this.ensureDb();
    return this.db.data.tasks;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await this.ensureDb();
    const index = this.db.data.tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new Error("Task not found");
    }

    const updatedTask = {
      ...this.db.data.tasks[index]!,
      updatedAt: new Date(),
      ...updates,
    };

    this.db.data.tasks[index] = updatedTask;
    await this.db.write();
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    await this.ensureDb();
    const initialLength = this.db.data.tasks.length;
    this.db.data.tasks = this.db.data.tasks.filter((task) => task.id !== id);

    if (this.db.data.tasks.length === initialLength) {
      return false;
    }

    this.db.data.totalTasks--;
    await this.db.write();
    return true;
  }
}
