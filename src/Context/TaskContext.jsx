import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext()



export const TaskProvider = ({ children }) => {
  


  const currentUser = JSON.parse(localStorage.getItem("user"))
  const [deletedTasksCount,setDeletedTasksCount] = useState( () => { 
      const delcount= localStorage.getItem("deletedTasksCount") || 0
     return delcount?parseInt(delcount,10):0
   }

  )

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    try {
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (err) {
      console.error("Failed to parse tasks from localStorage", err);
      return [];
    }
  });

  const [popup, setPopup] = useState("");

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setPopup(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const addTask = (task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks))
  }

  const removeTask = (taskId) => {
    const taskToRemove = tasks.find(task => task.id === taskId);
    if (!taskToRemove) return;
  
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      const delcount = deletedTasksCount +1
      setDeletedTasksCount(delcount)
      localStorage.setItem("deletedTasksCount", delcount.toString())
  };
  
  

  const updateTask = (taskId, updatedData) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updatedData } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };


  const moveTaskToColumn = (taskId, newstatus) => {

    const updated = tasks.map(task => {
      if (task.id === taskId) {
        if (currentUser?.role != "admin" && newstatus === "completed") {
          return { ...task, status: "In Reviews" };
        }
  
        return { ...task, status: newstatus };
      }
      return task;
    })

    setTasks(updated)
    localStorage.setItem("tasks", JSON.stringify(updated));

  }
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task =>
    ["TO DO", "Inprogress", "Unassigned", "NEW"].includes(task.status)
  ).length;
  
  const completedTasks  = tasks.filter(task => task.status === "completed").length
   


  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      removeTask,
      updateTask,
      moveTaskToColumn,
      totalTasks,
      pendingTasks,
      completedTasks,
      deletedTasksCount,
      popup,
      setPopup
    }}>

      {children}
      {popup && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {popup}
        </div>
      )}
    </TaskContext.Provider>
  )



}
export const useTask = () => useContext(TaskContext)

