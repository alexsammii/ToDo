import { useEffect, useState } from "react";
import AddTodo from "./AddTodo";
import TodoList from "../components/list/TodoList";
import styles from "./styling/Home.module.scss";
import { Link } from "react-router-dom";

function Home() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
  document.title = "Dashboard"
}, [])

  
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Todo Task Manager</h1>
     <div className={styles.topBar}>
  <button className={styles.addButton} onClick={() => setShowForm((prev) => !prev)}>
    {showForm ? "Cancel" : "+ Add Todo"}
  </button>

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
