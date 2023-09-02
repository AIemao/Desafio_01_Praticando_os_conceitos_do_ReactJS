import {
  ChangeEvent,
  FormEvent,
  InvalidEvent,
  useEffect,
  useState,
} from "react";

import ClipBoardSvg from "../assets/clipboard.svg";
import styles from "./Task.module.css";
import { v4 as uuidv4 } from "uuid";
import { TaskList } from "./TaskList";

type TaskProps = {
  id: string;
  title: string;
  isComplete?: boolean;
};

const getStoredTasks = (): TaskProps[] => {
  const storedTasks = JSON.parse(localStorage?.getItem("todos") || "[]");
  return Array.isArray(storedTasks) ? storedTasks : [];
};

export function Task() {
  const [tasks, setTasks] = useState<TaskProps[]>(getStoredTasks);
  const [newTask, setNewTask] = useState<TaskProps>({
    id: uuidv4(),
    title: "",
    isComplete: false,
  });
  const [progress, setProgress] = useState<string>('0%')

  const handleAddNewTask = (event: FormEvent) => {
    event.preventDefault();
    if (!newTask.title) return;

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    setNewTask({
      id: uuidv4(),
      title: "",
      isComplete: false,
    });

    document.getElementById("task-textarea")?.focus();
  };

  const handleNewTaskChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.target.setCustomValidity("");
    setNewTask({
      id: uuidv4(),
      title: event.target.value,
      isComplete: false,
    });
  };

  const handleNewTaskInvalid = (event: InvalidEvent<HTMLTextAreaElement>) => {
    event.target.setCustomValidity("Hey, add a task first!");
    document.getElementById("task-textarea")?.focus();
  };

  const deleteTask = (taskToDeleteId: string) => {
    const tasksWithoutDeletedOne = tasks.filter(
      (task) => task.id !== taskToDeleteId
    );
    setTasks(tasksWithoutDeletedOne);

    const progress = calculateProgress(tasksWithoutDeletedOne);
  setProgress(progress);
  };

  const handleToggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isComplete: !task.isComplete } : task
    );
    setTasks(updatedTasks);
  };

  const calculateProgress = (tasks: TaskProps[]) => {
    if (tasks.length === 0) {
      return "0.00";
    }
    const completedTasks = tasks.filter((task) => task.isComplete);

    return ((completedTasks.length / tasks.length) * 100).toFixed(2);
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.getElementById("task-textarea")?.focus();
  }, []);

  useEffect(() => {
    const initialProgress = calculateProgress(tasks);
    setProgress(initialProgress);
  }, [tasks]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleAddNewTask} className={styles.todoForm}>
        <textarea
          id="task-textarea"
          placeholder="Adicione uma nova tarefa"
          value={newTask.title}
          onChange={handleNewTaskChange}
          onInvalid={handleNewTaskInvalid}
          required
        />
        <button type="submit">
          Adicionar tarefa
        </button>
      </form>

      <header className={styles.taskContainer}>
        <div className={styles.taskCreated}>
          <p>Tarefas criadas</p>
          <span>{tasks.length}</span>
        </div>
        <div className={styles.taskDone}>
          <p>Tarefas feitas</p>
          <span>{tasks.filter((task) => task.isComplete).length}</span> de{" "}
          <span>{tasks.length}</span>
        </div>
        <div className={styles.progress}>
          <p>Progresso</p>
          <span style={{ width: progress }}>
            {progress}%
          </span>
        </div>
      </header>

      <main className={styles.taskBox}>
        {tasks.length === 0 ? (
          <div className={styles.taskBoxContent}>
            <img src={ClipBoardSvg} alt="Clipboard icon" />
            <p>
            Você ainda não tem nenhuma tarefa cadastrada. Crie tarefas e organize suas tarefas
            </p>
          </div>
        ) : (
          ""
        )}
        {tasks.map((task) => (
          <TaskList
            key={task.id}
            id={task.id}
            content={task.title}
            isComplete={task.isComplete}
            onCompleted={handleToggleTaskCompletion}
            onDeleteTask={deleteTask}
          />
        ))}
      </main>
    </div>
  );
}
