import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:5000/api/tasks", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(async (response) => {
            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }
            if (!response.ok) {
                setError(data.message);
                return;
            }

            setTasks(data.tasks);
            setError("");
        })
        .catch((error) => {
            console.log("Network error", error);
            setError("Unable to connect to server");
        });
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/api/tasks", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description
                })
            });
            
            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }
            if (!response.ok) {
                setError(data.message);
                return;
            }
            if (response.ok) {
                setTasks((prevTasks) => [...prevTasks, data.task]);
                setTitle("");
                setDescription("");
                setError("");
            }
        } catch (error) {
            console.log("Create task error", error);
            setError("Unable to connect to server");
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            
            const token = localStorage.getItem("token");
            
            const response = await fetch(
                `http://localhost:5000/api/tasks/${taskId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );
            
            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }
            if (!response.ok) {
                setError(data.message);
                return;
            }
            if (response.ok) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === data.task._id ? data.task : task
                    )
                );
                setError("");
            }
        } catch (error) {
            console.log("Update task error", error);
            setError("Unable to connect to server");
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem("token");
            
            const response = await fetch(
                `http://localhost:5000/api/tasks/${taskId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            const data = await response.json();

            if(response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }
            if (!response.ok) {
                setError(data.message);
                return;
            }
            if (response.ok) {
                setTasks((prevTasks) => 
                    prevTasks.filter((task) =>
                        task._id !== taskId
                    )
                );
                setError("");
            }
        } catch (error) {
            console.log("Delete task error", error);
            setError("Unable to connect to server");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="tasks-page">
            <div className="task-header">
                <h1>My Tasks</h1>
                <button
                className="logout-btn"
                type="button"
                onClick={handleLogout}>Logout</button>
            </div>

            <form className="task-form" onSubmit={handleSubmit}>
                <input
                className="task-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title" />
                <input
                className="task-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description" />
                <button className="add-task-btn" type="submit">Add Task</button>
            </form>

            {error && <p className="error-msg">{error}</p>}

            {tasks.length === 0 ? (
                <p>No tasks yet</p>
            ) : (
                <div className="task-list">
                    {tasks.map((task) => (   
                        <div className="task-card" key={task._id}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                            <div className="task-actions">
                                <select value={task.status}
                                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                >
                                    <option value="todo">Todo</option>
                                    <option value="in-progress">In-progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <button type="button"
                                    onClick={() => deleteTask(task._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
        </div>
    );
}

export default Tasks;