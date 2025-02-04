"use client";
import { useState, ChangeEvent, useLayoutEffect,useEffect,useCallback } from "react";
import { PlusCircle, Calendar,Pencil,Menu, CheckCircle2, XCircle, LayoutGrid, ListTodo, Clock, CheckCircle, X } from "lucide-react";
import { Task, NewTask } from "@/types/task";

const init: NewTask = {
  title: "",
  description: "",
  dueDate: "",
};
// console.log(init)
export default function Home(){
    const [tasks,setTasks]=useState<Task[]>([]);
            // console.log(tasks)
   const [new_task,setnewtask]=useState<NewTask>(init);
      const [open_box,setopenbox]=useState(false);
    const [task_state,set_task_state]=useState<'all'|'pending'|'completed'>('all');
    // console.log(task_state)
  const [viewMode,setViewMode]=useState<'grid'|'list'>('grid');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sidebar_collapse,setcollapse]=useState<boolean>(false);
  const [sidebar,setsidebar]=useState<boolean>(false);
  useLayoutEffect(()=>{
    fetch("http://localhost:3000/api/tasks/")
      .then(response => response.json())
      .then(data => {
      if (!data.success) {
        console.error("Error fetching tasks:", data.message);
        return;
      }
      console.log(data);
      setTasks(data.tasks);
      })
      .catch(error => console.error("Error fetching tasks:", error));
  },[])
  const handleChange=(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>):void => {
    // console.log(e.target)
    const { id, value }=e.target;
    // console.log(id,value)
    setnewtask((prev)=>({...prev,[id]: value,}));
  };
  const addTask=():void => {
    if (editingId) {
      // Update existing task
      fetch(`http://localhost:3000/api/tasks/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: new_task.title,
          description: new_task.description,
          dueDate: new Date(new_task.dueDate),
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (!data.success) {
            console.error("Error updating task:", data.message);
            return;
          }
          setTasks(prev => prev.map(task => 
            task._id === editingId ? { ...task, ...new_task } : task
          ));
          setnewtask(init);
          setEditingId(null);
          setopenbox(false);
        })
        .catch(error => console.error("Error updating task:", error));
    } else {
    if (!new_task.title.trim()) return;
    fetch("http://localhost:3000/api/tasks/", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
      title: new_task.title,
      description: new_task.description,
      dueDate: new Date(new_task.dueDate),
      }),
    })
      .then(response => response.json())
      .then(data => {
      if (!data.success) {
        console.error("Error adding task:", data.message);
        return;
      }
      const task: Task = {_id:data._id,...new_task,completed:false};
      console.log("Task added successfully:", data.message);
      setTasks((prev) => [...prev, task]);
      setnewtask(init);
      setopenbox(false);
      })
      .catch(error => console.error("Error adding task:", error));
    }
  };

  const toggle_it = (taskId: string): void => {
    console.log(taskId);
  fetch(`http://localhost:3000/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Completed: !tasks.find(task => task._id === taskId)?.completed }),
  })
    .then(response => response.json())
    .then(data => {
    if (!data.success) {
      console.error("Error updating task:", data.message);
      return;
    }
    console.log("Task updated successfully:", data.message);
    })
    .catch(error => console.error("Error updating task:", error));
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string): void => {
    setTasks((prev) => prev.filter((task) => task._id !== taskId));
    console.log(tasks);
    console.log(taskId);
    fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          console.error("Error deleting task:", data.message);
          return;
        }
        console.log("Task deleted successfully:", data.message);
      })
      .catch(error => console.error("Error deleting task:", error));
  };

  const filteredTasks = tasks.filter(task => {
    if (task_state === 'completed') return task.completed;
    if (task_state === 'pending') return !task.completed;
    return true;
    // console.log(stats)
  });

  const stats={
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  };
  // console.log(stats)
  const useMediaQuery = (width:string) =>
    {
      const [targetReached, setTargetReached] = useState(false)
    
      const updateTarget = useCallback((e: MediaQueryListEvent) =>
      {
        if (e.matches) setTargetReached(true)
        else setTargetReached(false)
      }, [])
    
      useEffect(() =>
      {
        const media = window.matchMedia(`(max-width: ${width}px)`)
        media.addEventListener('change', updateTarget)
    
        // Check on mount (callback is not called until a change occurs)
        if (media.matches) setTargetReached(true)
    
        return () => media.removeEventListener('change', updateTarget)
      }, [])
    
      return targetReached
    }
    const s=useMediaQuery('768');
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      {s && sidebar_collapse? (<><Menu className="ml-4 h-6 w-6 mt-8 pointer" onClick={()=>setcollapse(!sidebar_collapse)}/></>):(
      <div className={`w-64 bg-white dark:bg-gray-800 border-r h-screen ${s ? "absolute" : ""} border-gray-200 dark:border-gray-700 p-6`}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {s &&<button onClick={()=>setcollapse(!sidebar_collapse)}><X className="mr-8 mb-8 h-4 w-4"/></button>}Task Master
        </h1>
                <div className="space-y-4">
           <button
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
              task_state === 'all'
                ? 'bg-gray-900 text-white dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => set_task_state('all')}>
                 <div className="flex items-center">
              <LayoutGrid className="mr-2 h-4 w-4" />
              All Tasks
              </div>
            <span className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-600">
              {stats.total}
            </span>
          </button>
             <button
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
              task_state === 'pending'
                ? 'bg-gray-900 text-white dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => set_task_state('pending')}>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Pending
                  </div>
              <span className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-600">
                {stats.pending}
              </span>
          </button>
          
          <button
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
              task_state === 'completed'
                ? 'bg-gray-900 text-white dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => set_task_state('completed')}>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Completed
                  </div>
            <span className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-600">
              {stats.completed}
            </span>
          </button>
        </div>
        <button
          onClick={() =>setopenbox(true)}
          className="w-full mt-8 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </button>
      </div>
      )}
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {task_state === 'all' && 'All Tasks'}
              {task_state === 'pending' && 'Pending Tasks'}
              {task_state === 'completed' && 'Completed Tasks'}
            </h2>
                <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                    <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                <ListTodo className="h-5 w-5" />
              </button>
            </div>
          </div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:[@media(max-width:943px)]:grid-cols-1">
              {filteredTasks.map((task, index) => (
              <div
              key={task._id || index}
              className={`p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg min-w-[300px] ${
              task.completed
                ? "bg-gray-50 dark:bg-gray-800"
                : "bg-white dark:bg-gray-700"
              }`}>
                <div className="flex items-start justify-between mb-4">
                <h3
                className={`text-xl font-semibold ${
                task.completed
                ? "text-gray-500 line-through"
                : "text-gray-900 dark:text-white"
                }`}>
                {task.title}
                </h3>
              <div className="flex space-x-2">
              <button
                  onClick={() => {
                  setnewtask({
                  title: task.title,
                  description: task.description,
                  dueDate: task.dueDate.split('T')[0],
                  });
                  setEditingId(task._id);
                  setopenbox(true);
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                >
                  <Pencil className="h-4 w-4 text-blue-500" />
                </button>
                <button
                onClick={() => toggle_it(task._id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                >
                {task.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                <CheckCircle2 className="h-4 w-4 text-gray-400" />
                )}
                </button>
             <button
                onClick={() => deleteTask(task._id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                >
                <XCircle className="h-4 w-4 text-red-500" />
                </button>
              </div>
              </div>
              <p
              className={`mb-4 ${
                task.completed
                ? "text-gray-500"
                : "text-gray-600 dark:text-gray-300"
              }`}
              >
              {task.description}
              </p>
              <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-md">

              {new Date(task.dueDate).toLocaleDateString("en-IN")}
              </span>
              </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg ${
                    task.completed
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                    <button
                                onClick={() => {
                                  setnewtask({
                                    title: task.title,
                                    description: task.description,
                                    dueDate: task.dueDate.split('T')[0],
                                  });
                                  setEditingId(task._id);
                                  setopenbox(true);
                                }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                              >
                                <Pencil className="h-4 w-4 text-blue-500" />
                              </button>
                      <button
                        onClick={() => toggle_it(task._id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            task.completed
                              ? "text-gray-500 line-through"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-md">
                        {new Date(task.dueDate).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <button
                        onClick={()=>deleteTask(task._id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No tasks found. {task_state === 'all' && "Create your first task to get started!"}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* open_box */}
      {open_box && (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create New Task</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter task title"
                  value={new_task.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter task description"
                  value={new_task.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={new_task.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={addTask}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId?"Edit Task":"Create Task"}
                </button>
                <button
                  onClick={() => setopenbox(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}