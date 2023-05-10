import React from "react";

const LoginForm = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    React.useEffect(() => {
        if (sessionStorage.getItem("token")) {
            window.location.href = "/home";
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("role", data.role);
                alert("Login success");
                window.location.href = "/home";
            }
            )
            .catch((error) => {
                console.error("Error:", error);
                alert("Login failed");
            }
            );
    };


    return (
        <div className="login-form">
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-2">
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="username">Username</label>
                </div>

                <div className="form-floating mb-2">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                </div>

                <button className="w-100 btn btn-lg btn-primary" type="submit">
                    Sign in
                </button>
            </form>
        </div>
    );
};

export default LoginForm;

