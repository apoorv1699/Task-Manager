import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, LogOut, CheckCircle, Circle } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            toast.error('Failed to fetch tasks');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/tasks', {
                title: newTaskTitle,
                description: newTaskDescription,
                status: 'PENDING'
            });
            setTasks([...tasks, response.data]);
            setNewTaskTitle('');
            setNewTaskDescription('');
            setIsAdding(false);
            toast.success('Task created successfully');
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    const handleToggleStatus = async (task) => {
        const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
        try {
            const response = await api.put(`/tasks/${task.id}`, {
                title: task.title,
                description: task.description,
                status: newStatus
            });
            setTasks(tasks.map(t => t.id === task.id ? response.data : t));
            toast.success(`Task marked as ${newStatus.toLowerCase()}`);
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
            toast.success('Task deleted successfully');
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700 font-medium">Hello, {user?.name} {user?.role === 'ADMIN' && '(Admin)'}</span>
                            <button
                                onClick={logout}
                                className="flex items-center text-gray-500 hover:text-gray-900"
                            >
                                <LogOut size={20} className="mr-1" /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} className="mr-1" /> Add Task
                        </button>
                    </div>

                    {isAdding && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Task Title"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Task Description"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                        value={newTaskDescription}
                                        onChange={(e) => setNewTaskDescription(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Save Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {tasks.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">
                                No tasks found. Create one to get started!
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {tasks.map((task) => (
                                    <li key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <button 
                                                    onClick={() => handleToggleStatus(task)}
                                                    className={`mt-1 flex-shrink-0 ${task.status === 'COMPLETED' ? 'text-green-500' : 'text-gray-400 hover:text-blue-500'}`}
                                                >
                                                    {task.status === 'COMPLETED' ? <CheckCircle size={24} /> : <Circle size={24} />}
                                                </button>
                                                <div>
                                                    <h3 className={`text-lg font-medium ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                        {task.title}
                                                    </h3>
                                                    {task.description && (
                                                        <p className="mt-1 text-gray-500">{task.description}</p>
                                                    )}
                                                    {user?.role === 'ADMIN' && (
                                                        <span className="inline-block mt-2 text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                            Owner: {task.ownerName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 ml-4">
                                                <button
                                                    onClick={() => handleDelete(task.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                    title="Delete task"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
