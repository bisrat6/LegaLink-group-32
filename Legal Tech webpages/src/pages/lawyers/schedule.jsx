import React, { useState, useEffect } from "react";
import "../../assets/styles/lawyer homepage/schedule.css";
import LawyerNavbar from "../components/lawyerNavbar";

import Footer from '../components/Footer'
const initialAppointments = [
  { id: 1, clientName: "Alice Johnson", date: "2025-08-15T14:00:00Z", status: "pending" },
  { id: 2, clientName: "Bob Smith", date: "2025-08-13T09:30:00Z", status: "active" },
  { id: 3, clientName: "Charlie Davis", date: "2025-08-12T11:00:00Z", status: "cancelled" },
];

export default function Schedule() {
  const [appointments, setAppointments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState("");

  useEffect(() => {
    setAppointments(initialAppointments);
  }, []);

  const toggleAppointment = (id, status) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id
          ? { ...appt, status: status === "cancelled" ? "active" : "cancelled" }
          : appt
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const addTask = () => {
    if (!newTask.trim() || !taskDate) return;
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      date: taskDate,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask("");
    setTaskDate("");
  };

  const toggleTaskCompletion = (id) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  };

  return (
    <>
    <LawyerNavbar />
    
    <div className="scheduleContainer">
      <h2>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments scheduled.</p>
      ) : (
        <ul className="appointmentList">
          {appointments.map(({ id, clientName, date, status }) => (
            <li key={id} className={`appointmentItem ${status}`}>
              <div className="appointmentInfo">
                <strong>{clientName}</strong>
                <span>{formatDate(date)}</span>
                <span className={`statusLabel ${status}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              <button
                className={`toggleButton ${status}`}
                onClick={() => toggleAppointment(id, status)}
              >
                {status === "cancelled" ? "Add Back" : "Cancel"}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="todoContainer">
        <h2>To-Do List</h2>
        <div className="todoInputGroup">
          <input
            type="text"
            placeholder="Enter task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
          <button className="add-task" onClick={addTask}>Add Task</button>
        </div>
        <ul className="taskList">
          {tasks.map(({ id, text, date, completed }) => (
            <li key={id} className={completed ? "completedTask" : ""}>
              <span>
                {text} — <small>{new Date(date).toLocaleDateString()}</small>
              </span>
              <div className="todoActions">
                <button onClick={() => toggleTaskCompletion(id)}>
                  {completed ? "Undo" : "Complete"}
                </button>
                <button onClick={() => removeTask(id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <Footer />
    </>
    
  );
}