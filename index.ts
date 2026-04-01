import express from "express";
import cors from "cors";
import { prisma } from "./libs/prisma";

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Routes ---------- */
app.get("/", (req, res) => {
  res.json({ msg: "Hello API running..." });
});

app.get("/tasks", async (req, res) => {
  const tasks = await prisma.todo.findMany({
    orderBy: { id: "desc" },
  });

  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "name is required" });
  }

  const task = await prisma.todo.create({
    data: { name },
  });

  res.status(201).json(task);
});

app.put("/tasks/:id/toggle", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ msg: "Invalid id" });
  }

  const currentTask = await prisma.todo.findUnique({
    where: { id },
  });

  if (!currentTask) {
    return res.status(404).json({ msg: "Task not found" });
  }

  const updatedTask = await prisma.todo.update({
    where: { id },
    data: { done: !currentTask.done },
  });

  res.json(updatedTask);
});

app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ msg: "Invalid id" });
  }

  const task = await prisma.todo.delete({
    where: { id },
  });

  res.json(task);
});

/* ---------- Server ---------- */
app.listen(8800, () => {
    console.log("Hello API at 8800...");
});