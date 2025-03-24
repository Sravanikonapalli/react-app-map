import React, { Component } from "react";
import "../styles/login.css";

class Login extends Component {
    state = {
        username: "",
        password: "",
        errorMessage: "",
    };

    onChangeInputField = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    submitForm = async (event) => {
        event.preventDefault();
        const { username, password } = this.state;

        if (!username || !password) {
            this.setState({ errorMessage: "Both fields are required" });
            return;
        }

        const userDetails = { username, password };

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userDetails),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                localStorage.setItem("token", data.jwtToken);
                window.location.href = "/";
            } else {
                this.setState({ errorMessage: data.message || "Invalid Credentials" });
            }
        } catch (error) {
            this.setState({ errorMessage: "Something went wrong. Try again!" });
        }
    };

    render() {
        const { username, password, errorMessage } = this.state;

        return (
            <div className="login-container">
                <div className="login-form-container">
                    <h1>LOGIN</h1>
                    <label>USERNAME</label>
                    <form onSubmit={this.submitForm} className="login-form">
                        <input
                            type="username"
                            placeholder="username"
                            className="input-field"
                            name="username"
                            value={username}
                            onChange={this.onChangeInputField}
                            required
                        />

                        <label>PASSWORD</label>
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            name="password"
                            value={password}
                            onChange={this.onChangeInputField}
                            required
                        />
                        {errorMessage && <p className="error-text">{errorMessage}</p>}
                        <button type="submit" className="form-btn">
                            Sign In
                        </button>
                    </form>
                    <p>
                        Don’t have an account? <a href="/register">Sign Up</a>
                    </p>
                </div>
            </div>
        );
    }
}

export default Login;
