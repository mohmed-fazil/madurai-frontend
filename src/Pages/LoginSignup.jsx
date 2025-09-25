import React, { useState, useContext } from "react";
import "./CSS/LoginSignup.css";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [agree, setAgree] = useState(false);

    const { login, register } = useContext(ShopContext);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuthAction = async () => {
        if (state === "Sign Up" && !agree) {
            setError("Please agree to the terms of use & privacy policy.");
            return;
        }
        setLoading(true);
        setError(null);

        let response;
        if (state === "Login") {
            response = await login({ ...formData, role: 'student' });
        } else {
            response = await register({ ...formData, role: 'student' });
        }

        if (response.success) {
            navigate("/");
        } else {
            setError(response.error || "An unknown error occurred.");
        }
        setLoading(false);
    };

    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={changeHandler}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={changeHandler}
                    />
                </div>

                {error && <p className="loginsignup-error">{error}</p>}

                <button onClick={handleAuthAction} disabled={loading}>
                    {loading ? 'Processing...' : 'Continue'}
                </button>

                {state === "Login" ? (
                    <p className="loginsignup-login">
                        Create an account?{" "}
                        <span onClick={() => { setState("Sign Up"); setError(null); }}>Click here</span>
                    </p>
                ) : (
                    <p className="loginsignup-login">
                        Already have an account?{" "}
                        <span onClick={() => { setState("Login"); setError(null); }}>Login here</span>
                    </p>
                )}

                {state === "Sign Up" && (
                    <div className="loginsignup-agree">
                        <input
                            type="checkbox"
                            name="agree"
                            id="agree"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                        />
                        <p>By continuing, I agree to the terms of use & privacy policy.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginSignup;
