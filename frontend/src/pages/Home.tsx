import { useState } from "react";
import AddTodo from "./AddTodo";
import TodoList from "../components/list/TodoList";
import styles from "./styling/Home.module.scss";

function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Todo Task Manager</h1>

      <button
        className={styles.addButton}
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Cancel" : "+ Add Todo"}
      </button>

      {showForm && <AddTodo onTodoAdded={() => setShowForm(false)} />}

      <TodoList />
    </div>
  );
}

export default Home;
