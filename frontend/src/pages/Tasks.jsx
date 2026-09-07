import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
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

            if(!response.ok) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setTasks(data.tasks);
        });
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        if(response.ok) {
            setTasks((prevTasks) => [...prevTasks, data.task]);
            setTitle("");
            setDescription("");
        }
    }
    return (
        <div>
            <h1>My Tasks</h1>

            <form onSubmit={handleSubmit}>
                <input type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)} />
                <input type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)} />
                <button type="submit">Add Task</button>
            </form>

            {tasks.length === 0 ? (
                <p>No tasks yet</p>
            ) : (
                tasks.map((task) => (
                    <div key={task._id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Tasks;