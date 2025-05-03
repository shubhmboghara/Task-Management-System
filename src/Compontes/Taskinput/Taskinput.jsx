import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';

const Taskinput = ({
  showForm,
  setShowForm,
  form,
  setForm,
  inputClass,
  errorMessage,
  today,
  users = [],
  editTaskId,
  handleAddOrUpdate,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleUser = (userId) => {
    const updated = form.assignedTo.includes(userId)
      ? form.assignedTo.filter((id) => id !== userId)
      : [...form.assignedTo, userId];

    setForm((prev) => ({ ...prev, assignedTo: updated }));
  };

  const usersList = Array.isArray(users) ? users : [];

  console.log('Users List:', usersList); // Debugging user list

  return (
    <AnimatePresence>
      {showForm && (
        <motion.div
          key="addForm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="bg-gradient-to-br from-[#1e293b] to-[#334155] p-6 rounded-2xl shadow-2xl mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['ProjectName', 'title', 'ClientName', 'description'].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className={inputClass}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="relative" ref={dropdownRef} style={{ zIndex: 50 }}>
              <label className="text-white font-medium">Assign to:</label>
              <div
                className="border p-2 rounded bg-white text-black cursor-pointer dark:bg-slate-700 dark:text-white"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {form.assignedTo.length === 0
                  ? 'Select users'
                  : usersList
                      .filter((u) => form.assignedTo.includes(u.id))
                      .map((u) => u.name)
                      .join(', ')}
              </div>
              {isDropdownOpen && (
                <div className="absolute bg-white dark:bg-slate-800 shadow-lg border rounded mt-1 w-full max-h-48 overflow-y-auto">
                  {usersList.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-600"
                    >
                      <input
                        type="checkbox"
                        checked={form.assignedTo.includes(user.id)}
                        onChange={() => toggleUser(user.id)}
                      />
                      {user.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputClass}
            >
              <option value="NEW">NEW</option>
              <option value="TO DO">TO DO</option>
              <option value="Inprogress">Inprogress</option>
              <option value="In Reviews">In Reviews</option>
              <option value="completed">Completed</option>
            </select>

            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              min={today}
              className={inputClass}
            />

            <select
              value={form.Priority}
              className={inputClass}
              onChange={(e) => setForm({ ...form, Priority: e.target.value })}
            >
              <option value="">Priority</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>}

          <div className="flex justify-between">
            <button
              onClick={handleAddOrUpdate}
              className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
            >
              {editTaskId ? 'Update Task' : 'Add Task'}
            </button>

            <button
              className="bg-indigo-600 text-white hover:bg-indigo-700 mt-4 px-4 py-2 rounded transform hover:scale-110 transition-transform duration-300"
              onClick={() => setShowForm(!showForm)}
              disabled={!!editTaskId}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Taskinput;
