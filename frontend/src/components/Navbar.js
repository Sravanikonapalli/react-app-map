import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/navbar.css';
const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h2>React Map App</h2>
            <div>
                {isLoggedIn ? (
                    <>
                        <button className ="button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="link">
                            Login
                        </Link>
                        <Link to="/register" className="link">
                            Register
                        </Link>
                        <Link to="/">Dashboard</Link>
                    </>
                )}
            </div>
        </nav>
    );
};


export default Navbar;