import { type StorageAdapter, type Task } from "./StorageAdapter";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export class FileStorageAdapter implements StorageAdapter {
  private filePath: string;

  constructor(filename: string) {
    this.filePath = path.join(process.cwd(), filename);
  }

  private async readFile(): Promise<Task[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      const tasks = JSON.parse(data);
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  private async writeFile(tasks: Task[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(tasks, null, 2));
  }

  async createTask(task: Task): Promise<Task> {
    const tasks = await this.readFile();
    tasks.push(task);
    await this.writeFile(tasks);
    return task;
  }

  async getTask(id: string): Promise<Task | null> {
    const tasks = await this.readFile();
    return tasks.find((task) => task.id === id) || null;
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.readFile();
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const tasks = await this.readFile();
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new Error("Task not found");
    }

    const updatedTask = {
      ...(tasks[index] as Task), // Get the existing task first
      updatedAt: new Date(),
      ...updates, // Apply updates last
    };

    tasks[index] = updatedTask;
    await this.writeFile(tasks);
    return updatedTask as Task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const tasks = await this.readFile();
    const filteredTasks = tasks.filter((task) => task.id !== id);

    if (filteredTasks.length === tasks.length) {
      return false;
    }

    await this.writeFile(filteredTasks);
    return true;
  }

  getId(): string {
    return crypto.randomUUID();
  }
}
