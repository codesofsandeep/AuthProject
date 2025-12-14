import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Profile.css';

export default function Profile() {
    const { logout, axiosPrivate, user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    // useEffect(() => {
    //     const loadProfile = async () => {
    //         try {
    //             const res = await axiosPrivate().get("/profile");
    //             setData(res.data);
    //         } catch (err) {
    //             console.error("Profile load error:", err);
    //         }
    //     };
    //     loadProfile();
    // }, [axiosPrivate]);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const api = axiosPrivate();
                const res = await api.get("/profile");
                setData(res.data);
            } catch (err) {
                console.error("Profile load error:", err);
            }
        };
        loadProfile();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2 className="profile-title">Profile</h2>
                {data ? (
                    <pre className="profile-data">{JSON.stringify(data, null, 2)}</pre>
                ) : (
                    <p className="loading-text">Loading profile...</p>
                )}
                {user?.roles?.includes("admin") && (
                    <p className="admin-badge">Admin Access ✅</p>
                )}
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
