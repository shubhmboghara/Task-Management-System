import React, { useState } from 'react';
import { useTask } from '../../Context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import Taskinput from '../Taskinput/Taskinput';

const statuses = ['Unassigned', 'TO DO', 'Inprogress', 'In Reviews', 'completed', 'NEW'];
const users = JSON.parse(localStorage.getItem('user'));


export default function KanbanBoard() {
  const today = new Date().toISOString().split('T')[0];
  const [editTask, setEdittask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null)


  const inputClass = 'w-full p-2 mb-2 rounded bg-gray-700 text-white border border-gray-600';

  const [newtask, setNewtask] = useState({
    ProjectName: '',
    title: '',
    ClientName: '',
    description: '',
    assignedTo: [],
    status: 'NEW',
    deadline: ''
  });

  const { tasks, addTask, removeTask, moveTaskToColumn } = useTask();

  const countcolor = (status) => {
    switch (status) {
      case 'Unassigned': return 'bg-gray-600';
      case 'TO DO': return 'bg-pink-500';
      case 'Inprogress': return 'bg-yellow-500';
      case 'In Reviews': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'NEW': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAdd = () => {
    if (editTask) return;
    const { ProjectName, title, ClientName, description, assignedTo, status, deadline } = newtask;

    if (!ProjectName.trim() || !title.trim() || !ClientName.trim() || !description.trim() 
      || !status.trim() || !deadline) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
    if (deadline < today) {
      setErrorMessage('Due Date cannot be in the past.');
      return;
    }
    setErrorMessage('');
    addTask({ ...newtask, id: Date.now() });
    setNewtask({ ProjectName: '', title: '', ClientName: '', description: '', assignedTo:[] , status: 'NEW', deadline: '', Priority: "" });
    setShowForm(false);

  };

  return (
    <div className="p-4 bg-[#0f172a] text-white w-full h-full my-5">
      <span>
        <h1 className=' p-2 text-xl '>Welcome back, {user.name}</h1>
      </span>
      <h1 className="text-3xl font-bold mb-4">Kanban Board</h1>
      {currentUser?.role === 'admin' && (
        <button
          className="bg-indigo-600 text-white rounded hover:bg-indigo-700 py-2 px-4 mb-3 transform hover:scale-110 transition-transform duration-300"
          onClick={() => {
            setShowForm(!showForm);  
            setErrorMessage('');  
            if (editTask) {
              setEdittask(null); 
            }
          }}   disabled={!!editTask}
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      )}

      <Taskinput
        showForm={showForm}
        setShowForm={setShowForm}
        form={newtask}
        setForm={setNewtask}
        inputClass={inputClass}
        errorMessage={errorMessage}
        today={today}
        users={users}         
        editTaskId={editTask?.id}
        handleAddOrUpdate={handleAdd}
      />


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statuses.map(status => (
          <div key={status} className="bg-gray-800 p-4 rounded-md shadow text-white font-semibold  mt-2 ">
            <h2 className="flex items-center justify-between mb-2">
              {status}
              <span className={`${countcolor(status)} text-xs font-bold px-2 py-1 rounded`}>
                {tasks.filter(t => t.status === status).length}
              </span>
            </h2>
            {tasks.filter(t => t.status === status).map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-900 p-3 rounded mb-3  mt-4"
              >
                <h4 className="font-semibold text-xl pb-2">{task.title}</h4>
                <p className="text-sm text-gray-300">{task.description}</p>
                <p className="text-sm text-gray-300 m-1">
                  Assigned to: {Array.isArray(task.assignedTo)
                    ? task.assignedTo.join(', ')
                    : task.assignedTo}
                </p>



                <div className='border my-5 '></div>
                <div className="mt-2 flex flex-wrap gap-2 ">
                  {statuses.filter(s => s !== task.status).map(s => (
                    <button
                      key={s}
                      className="text-xs bg-gray-800 hover:bg-gray-700 px-1.5 py-0.5 rounded mb-1 pointer-coarse:"
                      onClick={() => moveTaskToColumn(task.id, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {currentUser.role === 'admin' && (
                  <button
                    className="mt-2 text-red-400 text-xs underline"
                    onClick={() => removeTask(task.id)}
                  >
                    Remove
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
