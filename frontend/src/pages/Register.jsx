import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
            
            const data = await response.json();

            setMessage(data.message);
            if(response.ok) {
                navigate("/login");
            };

            // console.log(data);
        } catch (error) {
            setMessage("Unable to connect to server")
            console.log("Registration error:", error);
        }
    };
  return (
    <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <input type="text"
            value={name}
            onChange={(e) => setName(e.target.value)} 
        />
            <input type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
        />
            <input type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
        />
            <button type='submit'>Register</button>
            <p>{message}</p>
        </form>
    </div>
  )
}

export default Register;