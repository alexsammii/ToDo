import { useEffect, useState } from "react";
import AddTodo from "./AddTodo";
import TodoList from "../components/list/TodoList";
import styles from "./styling/Home.module.scss";
import { Link } from "react-router-dom";
import { getAllTodos } from "../services/TodoServices";
import { Todo } from "../types/Todo";

function Home() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
  document.title = "Dashboard"
}, [])

const [todos, setTodos] = useState<Todo[]>([]);

const refreshTodos = async () => {
  const data = await getAllTodos();
  setTodos(data);
};

useEffect(() => {
  refreshTodos();
}, []);



  
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Todo Task Manager</h1>
     <div className={styles.topBar}>
  <button className={styles.addButton} onClick={() => setShowForm((prev) => !prev)}>
    {showForm ? "Cancel" : "+ Add Todo"}
  </button>

{showForm && (
  <AddTodo
    onTodoAdded={() => {
      refreshTodos();
      setShowForm(false);
    }}
    onCancel={() => setShowForm(false)}
  />
)}

  <div className={styles.linkWrapper}>
    <Link to="/" className={styles.dashboardLink}>
      Go to Dashboard
    </Link>
  </div>
</div>

     
 
    {showForm && (
  <AddTodo
    onTodoAdded={() => setShowForm(false)}
    onCancel={() => setShowForm(false)}
  />
)}

        

      <TodoList />
    </div>
  );
}

export default Home;
