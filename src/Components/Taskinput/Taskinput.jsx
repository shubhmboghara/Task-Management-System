import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";


const Taskinput = ({
  showForm,
  setShowForm,
  form,
  setForm,
  inputClass,
  errorMessage,
  today,
  users,
  editTaskId,
  handleAddOrUpdate,
}) => {
  useEffect(() => {
    if (!Array.isArray(form.assignedTo)) {
      setForm((prev) => ({ ...prev, assignedTo: [] }));
    }
  }, [form, setForm]);

  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    if (errorMessage) {
      const requiredFields = ["ProjectName", "title", "ClientName", "description", "status", "deadline", "Priority"];
      const missing = requiredFields.filter(
        (field) => !form[field] || (typeof form[field] === "string" && !form[field].trim())
      );
      setMissingFields(missing);
    } else {
      setMissingFields([]);
    }
  }, [errorMessage, form]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUser = (userKey) => {
    const updated = form.assignedTo.includes(userKey)
      ? form.assignedTo.filter((key) => key !== userKey)
      : [...form.assignedTo, userKey];
    setForm((prev) => ({ ...prev, assignedTo: updated }));
  };

  return (
    <AnimatePresence>
      {showForm && (
        <motion.div
          key="addForm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-gradient-to-br from-[#1e293b] to-[#334155] p-6 rounded-2xl shadow-2xl mb-4"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["ProjectName", "title", "ClientName", "description"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className={`${inputClass} ${missingFields.includes(field) ? 'border-red-500 ring-2 ring-red-400' : ''}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 z-50">
            <div className="relative" ref={dropdownRef} style={{ zIndex: 50 }}>
              <label className="text-white font-medium">Assign to:</label>
              <div
                className={`border p-2 rounded bg-white text-black cursor-pointer dark:bg-slate-700 dark:text-white`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {form.assignedTo.length === 0
                  ? "Select users"
                  : users
                    .filter((u) => form.assignedTo.includes(u.username))
                    .map((u) => u.name)
                    .join(", ")}
              </div>
              {isDropdownOpen && (
                <div className="absolute bg-white dark:bg-slate-800 shadow-lg border rounded mt-1 w-full max-h-48 overflow-y-auto">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <label
                        key={user.username}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-600"
                      >
                        <input
                          type="checkbox"
                          checked={form.assignedTo.includes(user.username)}
                          onChange={() => toggleUser(user.username)}
                        />
                        {user.name}
                      </label>
                    ))
                  ) : (
                    <p className="p-2 text-gray-500">No users available</p>
                  )}
                </div>
              )}
            </div>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={`h-10 ${inputClass} ${missingFields.includes('status') ? 'border-red-500 ring-2 ring-red-400' : ''}`}
            >
              <option value="NEW">NEW</option>
              <option value="TO DO">TO DO</option>
              <option value="Inprogress">Inprogress</option>
              <option value="In Reviews">In Reviews</option>
              <option value="completed">Completed</option>
            </select>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-white mb-1">
                Enter Deadline
              </label>
              <input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                min={today}   // make sure: const today = new Date().toISOString().split('T')[0]
                className={`
                w-full px-4 py-2 rounded-lg bg-gray-800 text-white border
                border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${missingFields.includes('deadline') ? 'border-red-500 ring-2 ring-red-400' : ''}
               `}
              />



            </div>

            <select
              value={form.Priority}
              className={`${inputClass} ${missingFields.includes('Priority') ? 'border-red-500 ring-2 ring-red-400' : ''}`}
              onChange={(e) => setForm({ ...form, Priority: e.target.value })}
            >
              <option value="">Priority</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
            </select>
          </div>


          {errorMessage && (
            <div className="text-red-500 text-sm text-center mb-4 mt-4">{errorMessage}</div>
          )}
          <div className="flex justify-between">
            <button
              onClick={handleAddOrUpdate}
              className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition"
              type="button"
            >
              {editTaskId ? "Update Task" : "Add Task"}
            </button>
            <button
              className="bg-indigo-600 text-white hover:bg-indigo-700 mt-4 px-4 py-2 rounded transform hover:scale-110 transition-transform duration-300"
              onClick={() => setShowForm(false)}
              type="button"
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
