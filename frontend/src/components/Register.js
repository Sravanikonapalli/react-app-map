import React, { Component } from "react";
import "../styles/login.css";

class Register extends Component {
    state = {
        username: "",
        email: "",
        password: "",
    };

    changeInputValues = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { username, email, password } = this.state;
            if (!username || !email || !password) {
                alert("Please fill in all fields");
                return;
            }

            const userDetails = { username, email, password };
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userDetails),
            });

            const data = await response.text();

            if (!response.ok) {
                throw new Error(data || "Something went wrong");
            }

            alert("Account created successfully");
            window.location.href = "/login";
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        }
    };

    render() {
        const { username, email, password } = this.state;
        return (
            <div className="login-container">
                <div className="login-form-container">
                    <h1>Sign Up</h1>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="name">USERNAME</label>
                        <input
                            type="text"
                            id="name"
                            name="username"
                            value={username}
                            onChange={this.changeInputValues}
                            placeholder="Enter username..."
                            className="input-field"
                            required
                        />

                        <label htmlFor="email">EMAIL</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={this.changeInputValues}
                            placeholder="Enter Email..."
                            className="input-field"
                            required
                        />

                        <label htmlFor="password">PASSWORD</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={this.changeInputValues}
                            placeholder="password"
                            className="input-field"
                            required
                        />

                        <button type="submit" className="form-btn">
                            Sign Up
                        </button>
                        <p>
                            Already have an account? <a href="/login">LOGIN</a>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;
