import { useEffect, useState } from "react";
import { getAllTodos, getFilteredTodos, getTodoCount } from "../../services/TodoServices";
import { Todo } from "../../types/Todo";
import styles from "./Dashboard.module.scss";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Link } from "react-router-dom";
import Modal from "../modal/Modal";

function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

useEffect(() => {
  // fetch default todos for display
  getFilteredTodos(false, false, 0, 5)
    .then((data) => {
      setTodos(data.content);
      setTotalCount(data.totalElements);
    })
    .catch(console.error);

  // fetch counts separately
  getTodoCount(false, true).then(setCompletedCount); // completed only
getTodoCount(false, false).then(setUpcomingCount); // upcoming (default)
getTodoCount(true, false).then(setArchivedCount); // archived
getTodoCount(false, false).then(setTotalCount); // total (default, again)

}, []);



  useEffect(() => {
    document.title = "Task Manager";
  }, []);

  const total = todos.length;
  // const completed = todos.filter((t) => t.completed).length;
  // const archived = todos.filter((t) => t.archived).length;
  // const upcoming = todos.filter((t) => !t.completed && !t.archived).length;
  const [completedCount, setCompletedCount] = useState(0);
const [upcomingCount, setUpcomingCount] = useState(0);
const [archivedCount, setArchivedCount] = useState(0);
const [totalCount, setTotalCount] = useState(0);


  const handleCardClick = (type: "completed" | "upcoming" | "archived" | "total") => {
  let modalTitle = "";
  let archived = false;
  let completed = false;

  switch (type) {
    case "completed":
      modalTitle = "Completed Tasks";
      completed = true;
      break;
    case "upcoming":
      modalTitle = "Upcoming Tasks";
      completed = false;
      archived = false;
      break;
    case "archived":
      modalTitle = "Archived Tasks";
      archived = true;
      break;
    case "total":
      modalTitle = "All Tasks";
      break;
  }

  getFilteredTodos(archived, completed, 0, 10).then((data) => {
    setFilteredTodos(data.content);
    setModalTitle(modalTitle);
    setShowModal(true);
  });
};


  return (
    <div className={styles.dashboard}>
      <div className={styles.topBar}>
        <Link to="/tasks" className={styles.backButton}>→ Go to Task Manager</Link>
      </div>

      <h1 className={styles.title}>Todo Dashboard</h1>

      <div className={styles.statsGrid}>
        <div className={`${styles.card} ${styles.green}`} onClick={() => handleCardClick("completed")}>
          <h2>{completedCount}</h2>
          <p>Tasks Completed</p>

        </div>
        <div className={`${styles.card} ${styles.blue}`} onClick={() => handleCardClick("upcoming")}>
          <h2>{upcomingCount}</h2>
          <p>Upcoming Tasks</p>
        </div>
        <div className={`${styles.card} ${styles.red}`} onClick={() => handleCardClick("archived")}>
          <h2>{archivedCount}</h2>
          <p>Archived Tasks</p>
        </div>
        <div className={`${styles.card} ${styles.purple}`} onClick={() => handleCardClick("total")}>
          <h2>{totalCount}</h2>
          <p>Total Tasks</p>
        </div>
      </div>

      <h2 className={styles.subtitle}>Task Calendar</h2>

      <div className={styles.calendarContainer}>
        <FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="timeGridWeek"
  timeZone="Australia/Melbourne"
  headerToolbar={{
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  }}
  height="auto"
events={todos.flatMap((todo) => {
  try {
    if (!todo.dueDate) return [];

    const date = new Date(todo.dueDate);
    const dateStr = date.toISOString().split("T")[0];

    const timeStr =
      todo.time && typeof todo.time === "string"
        ? todo.time
        : "00:00";

    const fullDateTime = `${dateStr}T${timeStr}`;

    return [
      {
        title: todo.task,
        start: fullDateTime,
        allDay: todo.allDay,
        backgroundColor: todo.completed
          ? "#6ccf6d"
          : todo.archived
          ? "#ff6b6b"
          : "#4dabf7",
        borderColor: "transparent",
      },
    ];
  } catch (err) {
    console.warn(`Invalid task date for ${todo.task}`, err);
    return [];
  }
})}

        />
      </div>

      {showModal && (
        <Modal title={modalTitle} onClose={() => setShowModal(false)}>
        <div className={styles.modalTaskGrid}>
  {filteredTodos.map((t) => (
    <div key={t.id} className={styles.taskCard}>
      <h3>{t.name || t.task}</h3>
      <p><strong>Due:</strong> {new Date(t.dueDate).toLocaleDateString("en-GB")}</p>
      <p><strong>Category:</strong> {t.category?.name || "N/A"}</p>
      <p>
        <strong>Status:</strong>{" "}
        {t.archived
          ? "Archived"
          : t.completed
          ? "Completed"
          : "Upcoming"}
      </p>
    </div>
  ))}
</div>

        </Modal>
      )}
    </div>
  );
}

export default Dashboard;
