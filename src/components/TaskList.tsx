import styles from './TaskList.module.css';
import { Trash } from 'phosphor-react';
import { useState } from 'react';

export interface TaskListProps {
  id: string;
  content: string;
  isComplete?: boolean;
  onCompleted: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({
  id,
  content,
  isComplete = false,
  onCompleted,
  onDeleteTask,
}: TaskListProps) {
  const [taskIsCompleted, setTaskIsCompleted] = useState(isComplete);

  const handleDeleteTask = () => {
    onDeleteTask(id);
  };

  const handleOnCompletedTask = () => {
    setTaskIsCompleted(!taskIsCompleted);
    onCompleted(id);
  };



  return (
    <div className={styles.taskCard}>
      <div className={styles.rounded}>
        <input
          name="checkbox"
          type="checkbox"
          id={id}
          checked={taskIsCompleted}
          onChange={handleOnCompletedTask}
        />
        <label htmlFor={id}></label>
      </div>
      <span className={taskIsCompleted ? styles.completed : ''}>{content}</span>
      <button type="button" onClick={handleDeleteTask}>
        <Trash size={20} />
      </button>
    </div>
  );
}
