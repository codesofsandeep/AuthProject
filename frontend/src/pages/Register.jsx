// // src/pages/Register.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import './Register.css'; // import the CSS
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function Register() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const navigate = useNavigate();
//     const { setAccessToken, setUser } = useAuth();

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         try {
//             // 1️⃣ Register
//             const registerRes = await fetch(`${BASE_URL}/auth/register`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, password })
//             });

//             const registerData = await registerRes.json();

//             if (!registerRes.ok) {
//                 setError(registerData.message || "Registration failed");
//                 return;
//             }

//             // 2️⃣ Auto-login after register
//             const loginRes = await fetch(`${BASE_URL}/auth/login`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include',
//                 body: JSON.stringify({ email, password })
//             });

//             const loginData = await loginRes.json();

//             if (!loginRes.ok) {
//                 setError("Registered but login failed");
//                 return;
//             }

//             setAccessToken(loginData.accessToken);
//             setUser(loginData.user);    
//             navigate("/profile");


//         } catch (err) {
//             console.error(err);
//             setError("Something went wrong");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="register-container">
//             <form className="register-form" onSubmit={handleRegister}>
//                 <h2 className="register-title">Register</h2>

//                 {error && <p className="error-text">{error}</p>}

//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />

//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />

//                 <button type="submit" disabled={loading}>
//                     {loading ? "Creating account..." : "Register"}
//                 </button>
//             </form>
//         </div>
//     );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Register.css';

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setAccessToken, setUser } = useAuth();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 1️⃣ REGISTER
            const registerRes = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const registerData = await registerRes.json();
            if (!registerRes.ok) {
                setError(registerData.message || "Registration failed");
                return;
            }

            // 2️⃣ AUTO LOGIN
            const loginRes = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const loginData = await loginRes.json();
            if (!loginRes.ok) {
                setError("Registered but login failed");
                return;
            }

            setAccessToken(loginData.accessToken);
            setUser(loginData.user);
            navigate("/profile");
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                {error && <p className="error-text">{error}</p>}
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
            </form>
        </div>
    );
}
