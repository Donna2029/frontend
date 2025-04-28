import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import{ signupUser } from "../Service/apiService";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [group_name, setGroupName] = useState("");

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await signupUser({username,password,group_name})

            localStorage.setItem("token", response.data.token);
            alert("Signup Successful!");
            navigate("/dashboard");
        } catch (error) {
            alert("Error signing up. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h2 className="text-center">Signup</h2>
                        <form onSubmit={handleSignup}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    placeholder="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="group_name"
                                    className="form-control"
                                    placeholder="Group Name"
                                    onChange={(e) => setGroupName(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100">Signup</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;