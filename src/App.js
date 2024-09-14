import { useState, useEffect } from 'react';
import './App.css';
import { FiSun, FiMoon, FiTrash2, FiCheck } from 'react-icons/fi';
import WeatherWidget from './components/WeatherWidget'; // Import the WeatherWidget

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState(''); // New state for due date
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const [filter, setFilter] = useState('All'); // New filter state

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() !== '') {
      setTasks([...tasks, { text: input, completed: false, dueDate }]); // Include dueDate
      setInput('');
      setDueDate(''); // Reset dueDate after adding
    }
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleComplete = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  return (
    <div className={darkMode ? "dark flex items-center justify-center min-h-screen" : "flex items-center justify-center min-h-screen"}>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:to-gray-700 animate-gradient-bg"></div>
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md transition-transform transform hover:scale-105">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 text-2xl focus:outline-none transition-colors duration-300"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-300 font-sans mb-4">To-Do List</h1>
          <WeatherWidget />
        </div>

        {/* Updated Input Form to Include Due Date */}
        <div className="flex flex-col mb-6 space-y-4">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addTask(); // Trigger addTask on Enter key
              }}
              className="flex-grow p-3 border border-gray-300 dark:border-gray-700 rounded-l-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none transition-all duration-300"
              placeholder="Add a new task"
            />
            <button
              onClick={addTask}
              className="bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-r-xl hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300"
            >
              Add
            </button>
          </div>
          <div className="flex">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-grow p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-4 space-x-2">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1 rounded-full ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} transition-colors duration-300`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Active')}
            className={`px-3 py-1 rounded-full ${filter === 'Active' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} transition-colors duration-300`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('Completed')}
            className={`px-3 py-1 rounded-full ${filter === 'Completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} transition-colors duration-300`}
          >
            Completed
          </button>
        </div>

        <ul className="space-y-3">
          {filteredTasks.map((task, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <div className="flex items-center">
                <span
                  onClick={() => toggleComplete(index)}
                  className={`cursor-pointer flex items-center ${
                    task.completed ? 'line-through text-gray-500 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'
                  } transition-colors duration-300`}
                >
                  <FiCheck className={`mr-2 ${task.completed ? 'text-green-500' : 'text-transparent'} transition-colors duration-300`} />
                  {task.text}
                </span>
              </div>
              <div className="flex items-center mt-2 sm:mt-0">
                {task.dueDate && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-4">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                <button
                  onClick={() => deleteTask(index)}
                  className="text-red-500 dark:text-red-300 text-xl hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
                >
                  <FiTrash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
