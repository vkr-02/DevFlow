import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            setMessage(data.message);

            if(response.ok) {
                localStorage.setItem("token", data.token);
                navigate("/tasks");
            }
        } catch (error) {
            setMessage("Unable to connect to server");
            console.log("Login error:", error);
            
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                />
                <input type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    )
}

export default Login;