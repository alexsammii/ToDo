import { useEffect, useState } from "react";
import {
  getAllTodos,
  getFilteredTodos,
  getTodoCount,
} from "../../services/TodoServices";
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
    getFilteredTodos(false, false, 0, 5)
      .then((data) => {
        setTodos(data.content);
        setTotalCount(data.totalElements);
      })
      .catch(console.error);

    getTodoCount(false, true).then(setCompletedCount);
    getTodoCount(false, false).then(setUpcomingCount);
    getTodoCount(true, false).then(setArchivedCount);
  }, []);

  useEffect(() => {
    document.title = "Task Manager";
  }, []);

  const total = todos.length;
  const [completedCount, setCompletedCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getAllTodos().then((todos) => {
      const completed = todos.filter(
        (todo) => todo.completed && !todo.archived
      );
      const upcoming = todos.filter(
        (todo) => !todo.completed && !todo.archived
      );
      const archived = todos.filter((todo) => todo.archived);

      setCompletedCount(completed.length);
      setUpcomingCount(upcoming.length);
      setArchivedCount(archived.length);
      setTotalCount(todos.length);
    });
  }, []);

  const handleCardClick = (
    type: "completed" | "upcoming" | "archived" | "total"
  ) => {
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

    if (type === "total") {
      getAllTodos().then((data) => {
        setFilteredTodos(data);
        setModalTitle(modalTitle);
        setShowModal(true);
      });
    } else {
      getFilteredTodos(archived, completed, 0, 10).then((data) => {
        setFilteredTodos(data.content);
        setModalTitle(modalTitle);
        setShowModal(true);
      });
    }
  };

  //   getFilteredTodos(archived, completed, 0, 10).then((data) => {
  //     setFilteredTodos(data.content);
  //     setModalTitle(modalTitle);
  //     setShowModal(true);
  //   });
  // };

  //   if (archived === null && completed === null) {
  //   getAllTodos(0, 10).then((data) => {
  //     setFilteredTodos(data.content);
  //     setModalTitle(modalTitle);
  //     setShowModal(true);
  //   });
  // } else {
  //   getFilteredTodos(archived, completed, 0, 10).then((data) => {
  //     setFilteredTodos(data.content);
  //     setModalTitle(modalTitle);
  //     setShowModal(true);
  //   });
  // }

  // full calendar implementation
  const calendarEvents = todos.flatMap((todo) => {
    try {
      if (!todo.dueDate) return [];

      const date = new Date(todo.dueDate);
      const localDate = new Date(todo.dueDate);
      const dateStr = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

      const timeStr =
        todo.time && typeof todo.time === "string" ? todo.time : "00:00";

      const fullDateTime = `${dateStr}T${timeStr}`;

      return [
        {
          title: todo.task,
          start: fullDateTime,
          allDay: todo.allDay ?? false,
          backgroundColor: todo.completed
            ? "#00B894"
            : todo.archived
              ? "#D63031"
              : "#0984E3", // default = blue

          borderColor: "transparent",
        },
      ];
    } catch (err) {
      console.warn(`Invalid task date for ${todo.task}`, err);
      return [];
    }
  });

  return (
    <div className={styles.dashboard}>
      <div className={styles.topBar}>
        <Link to="/tasks" className={styles.backButton}>
          → Go to Task Manager
        </Link>
      </div>

      <h1 className={styles.title}>Todo Dashboard</h1>

      <div className={styles.statsGrid}>
        <div
          className={`${styles.card} ${styles.green}`}
          onClick={() => handleCardClick("completed")}
        >
          <h2>{completedCount}</h2>
          <p>Tasks Completed</p>
        </div>
        <div
          className={`${styles.card} ${styles.blue}`}
          onClick={() => handleCardClick("upcoming")}
        >
          <h2>{upcomingCount}</h2>
          <p>Upcoming Tasks</p>
        </div>
        <div
          className={`${styles.card} ${styles.red}`}
          onClick={() => handleCardClick("archived")}
        >
          <h2>{archivedCount}</h2>
          <p>Archived Tasks</p>
        </div>
        <div
          className={`${styles.card} ${styles.purple}`}
          onClick={() => handleCardClick("total")}
        >
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
            left: "prev next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          events={calendarEvents}
        />
      </div>

      {showModal && (
        <Modal title={modalTitle} onClose={() => setShowModal(false)}>
          <div className={styles.modalTaskGrid}>
            {filteredTodos.map((t) => (
              <div key={t.id} className={styles.taskCard}>
                <h3>{t.name || t.task}</h3>
                <p>
                  <strong>Due:</strong>{" "}
                  {new Date(t.dueDate).toLocaleDateString("en-GB")}
                </p>
                <p>
                  <strong>Category:</strong> {t.category?.name || "N/A"}
                </p>
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
