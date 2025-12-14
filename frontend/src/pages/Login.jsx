// // import { useState } from 'react';
// // import { useAuth } from '../context/AuthContext';
// // import { useNavigate } from 'react-router-dom';
// // import './Login.css';

// // export default function Login() {
// //     const { setAccessToken } = useAuth();
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const navigate = useNavigate();

// //     async function submit(e) {
// //         e.preventDefault();

// //         const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// //         const res = await fetch(`${BASE_URL}/auth/login`, {
// //             method: 'POST',
// //             credentials: 'include',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ email, password })
// //         });


// //         if (!res.ok) return alert('Login failed');

// //         const data = await res.json();
// //         setAccessToken(data.accessToken);
// //         setUser(data.user); // ✅ add this
// //         navigate('/profile');
// //     }

// //     return (
// //         <div className="login-container">
// //             <form onSubmit={submit} className="login-form">
// //                 <h2 className="login-title">Login</h2>
// //                 <input
// //                     type="email"
// //                     placeholder="Email"
// //                     value={email}
// //                     onChange={e => setEmail(e.target.value)}
// //                     required
// //                 />
// //                 <input
// //                     type="password"
// //                     placeholder="Password"
// //                     value={password}
// //                     onChange={e => setPassword(e.target.value)}
// //                     required
// //                 />
// //                 <button type="submit">Login</button>
// //             </form>
// //         </div>
// //     );
// // }


// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// export default function Login() {
//     const { setAccessToken, setUser } = useAuth(); // ✅ include setUser
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     async function submit(e) {
//         e.preventDefault();

//         const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//         const res = await fetch(`${BASE_URL}/auth/login`, {
//             method: 'POST',
//             credentials: 'include',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password })
//         });

//         if (!res.ok) return alert('Login failed');

//         const data = await res.json();
//         setAccessToken(data.accessToken);
//         setUser(data.user); // ✅ now it works
//         navigate('/profile');
//     }

//     return (
//         <div className="login-container">
//             <form onSubmit={submit} className="login-form">
//                 <h2 className="login-title">Login</h2>
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Login.css';

export default function Login() {
    const { setAccessToken, setUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Login failed");
                return;
            }

            setAccessToken(data.accessToken);
            setUser(data.user);
            navigate("/profile");
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p className="error-text">{error}</p>}
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            </form>
        </div>
    );
}
