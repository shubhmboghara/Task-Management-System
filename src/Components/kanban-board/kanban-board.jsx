import React, { useState, useEffect } from 'react';
import { useTask } from '../../Context/TaskContext';
import { motion } from 'framer-motion';
import Taskinput from '../Taskinput/Taskinput';

function ErrorToast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
      {message}
    </div>
  );
}

export default function KanbanBoard() {
  const statuses = ['Unassigned', 'TO DO', 'Inprogress', 'In Reviews', 'completed', 'NEW'];
  const statuse = ['', 'TO DO', 'Inprogress', 'In Reviews', 'completed', 'NEW'];

  const today = new Date().toISOString().split('T')[0];
  const [storedUsers] = useState(JSON.parse(localStorage.getItem('users') || '[]'));
  const [adminuser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const users = Array.isArray(storedUsers) ? storedUsers : storedUsers ? [storedUsers] : [];

  const { tasks, addTask, updateTask, removeTask, moveTaskToColumn } = useTask();

  const [editTask, setEditTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [newtask, setNewtask] = useState({
    ProjectName: '',
    title: '',
    ClientName: '',
    description: '',
    assignedTo: [],
    status: 'NEW',
    deadline: '',
    Priority: ''
  });

  const [popup, setPopup] = useState("");

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setPopup(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  useEffect(() => {
    if (editTask) {
      setNewtask({ ...editTask });
      setShowForm(true);
    }
  }, [editTask]);

  const toastError = msg => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleMoveTask = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (
      newStatus !== 'Unassigned' &&
      (!Array.isArray(task.assignedTo) || task.assignedTo.length === 0)
    ) {
      toastError('❌ Please assign this task first using the Edit button.');
      return;
    }

    moveTaskToColumn(taskId, newStatus);
  };

  const handleAddOrUpdate = () => {
    const { ProjectName, title, ClientName, description, assignedTo, status, deadline } = newtask;
    if (!ProjectName.trim() || !title.trim() || !ClientName.trim() || !description.trim() || !status || !deadline) {
      toastError('Please fill out all fields.');
      return;
    }
    if (deadline < today) {
      return;
    }
    if (!assignedTo || assignedTo.length === 0) {
      newtask.status = 'Unassigned';
    }

    if (editTask) {
      updateTask(editTask.id, { ...newtask });
      setEditTask(null);
      setPopup('Task updated successfully!');
    } else {
      addTask({ ...newtask, id: Date.now() });
      setPopup('Task added successfully!');
    }

    setNewtask({
      ProjectName: '',
      title: '',
      ClientName: '',
      description: '',
      assignedTo: [],
      status: 'NEW',
      deadline: '',
      Priority: ''
    });
    setShowForm(false);
    setErrorMessage("")
  };

  const countColor = status => ({
    Unassigned: 'bg-gray-600',
    'TO DO': 'bg-pink-500',
    Inprogress: 'bg-yellow-500',
    'In Reviews': 'bg-blue-500',
    completed: 'bg-green-500',
    NEW: 'bg-indigo-500'
  }[status] || 'bg-gray-500');

  return (
    <div className="p-4 bg-[#0f172a] text-white min-h-screen mt-10">

      {popup && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {popup}
        </div> 
      )}
      {errorMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {errorMessage}
        </div>
      )}

      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">
          🔹Welcome back,{' '}
          <span className="text-indigo-400">{adminuser?.name || 'User'} </span>
        </h1>
        <p className="text-gray-400">
          {adminuser.role === 'admin'
            ? 'Manage your team tasks below 💼.'
            : 'Check your assigned tasks below  📝.'}
        </p>
      </header>

      {adminuser?.role === 'admin' && (
        <div className="mb-4 text-left">
          <button
            className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Task'}
          </button>
        </div>
      )}

      <Taskinput
        showForm={showForm}
        setShowForm={setShowForm}
        form={newtask}
        setForm={setNewtask}
        inputClass="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        errorMessage={errorMessage}
        today={today}
        users={users}
        editTaskId={editTask?.id}
        handleAddOrUpdate={handleAddOrUpdate}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        {statuses.map(status => (
          <div key={status} className="bg-gray-800 p-4 rounded shadow">
            <h2 className="flex justify-between items-center mb-3">
              <span>{status}</span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${countColor(
                  status
                )}`}
              >
                {tasks.filter(t => t.status === status).length}
              </span>
            </h2>

            {tasks
              .filter(
                t =>
                  t.status === status &&
                  (adminuser.role === 'admin' ||
                    (Array.isArray(t.assignedTo) &&
                      t.assignedTo.includes(user.username)))
              )
              .map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-900 p-3 rounded mb-4"
                >
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-400">{task.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Assigned to:{' '}
                    {task.assignedTo.length
                      ? task.assignedTo.join(', ')
                      : '—'}
                  </p>
                  <div className="mt-3 space-x-1">
                    {statuses
                      .filter(s =>
                        s !== task.status &&
                        (adminuser?.role === "admin" || s !== "Unassigned")

                      )
                      .map(s => (
                        <button
                          key={s}
                          className="text-xs bg-gray-800 hover:bg-gray-700 px-1.5 py-0.5 rounded mb-1"
                          onClick={() => handleMoveTask(task.id, s)}
                        >
                          {s}
                        </button>

                      ))}
                  </div>
                  {adminuser.role === 'admin' && (
                    <div className="mt-3 flex space-x-2">
                      <button
                        className="text-blue-400 text-xs underline"
                        onClick={() => setEditTask(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-400 text-xs underline"
                        onClick={() => { removeTask(task.id); setPopup('Task deleted successfully!'); }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
