#!/usr/bin/env node

import { Command } from "commander";
import { TaskManager } from "./TaskManager";
import { FileStorageAdapter } from "./adapters/FileStorageAdapter";
import { TaskStatus } from "./adapters/StorageAdapter";

const program = new Command();
const storage = new FileStorageAdapter("tasks.json");
const taskManager = new TaskManager(storage);

program.name("task-cli").description("CLI Task manager").version("1.0.0");

program
  .command("add")
  .description("Add a new task")
  .argument("<title>", "task title")
  .action(async (title: string) => {
    try {
      const task = await taskManager.addTask(title);
      console.log(`Task added successfully (ID: ${task.id})`);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  });

program
  .command("update")
  .description("Update a task")
  .argument("<id>", "task id")
  .argument("<title>", "new task title")
  .action(async (id: string, title: string) => {
    try {
      await taskManager.updateTask(id, title);
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  });

program
  .command("delete")
  .description("Delete a task")
  .argument("<id>", "task id")
  .action(async (id: string) => {
    try {
      await taskManager.deleteTask(id);
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  });

program
  .command("mark-in-progress")
  .description("Mark a task as in progress")
  .argument("<id>", "task id")
  .action(async (id: string) => {
    try {
      await taskManager.updateTaskStatus(id, TaskStatus.IN_PROGRESS);
      console.log("Task marked as in progress");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  });

program
  .command("mark-done")
  .description("Mark a task as done")
  .argument("<id>", "task id")
  .action(async (id: string) => {
    try {
      await taskManager.updateTaskStatus(id, TaskStatus.DONE);
      console.log("Task marked as done");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  });

program
  .command("list")
  .description("List all tasks or tasks by status")
  .argument("[status]", "filter tasks by status (todo, in-progress, done)")
  .action(async (status?: string) => {
    try {
      const tasks = await taskManager.listTasks(status as TaskStatus);
      if (tasks.length === 0) {
        console.log("No tasks found");
        return;
      }

      tasks.forEach((task) => {
        console.log(`[${task.id}] ${task.title} - ${task.status}`);
      });
    } catch (error) {
      console.error("Error listing tasks:", error);
    }
  });

program.parse();
