import { useState } from "react";
import "./styles/Register.css";
import logo2 from "./assets/logo2.png";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [validated, setValidated] = useState(false);
    const [isUsernameInvalid, setIsUsernameInvalid] = useState(false); // State for username validity
    const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false); // State for password validity

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === "username") {
            setIsUsernameInvalid(false);
        }
        if (name === "password") {
            setIsPasswordIncorrect(false);
        }
    };

    const navigate = useNavigate();
    // Handle form submission
    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        setValidated(true);
        if (form.checkValidity()) {
            try {
                const response = await fetch("http://localhost:4000/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
                const responseData = await response.json();
                if (response.ok) {
                    navigate("/home");
                } else {
                    if (responseData.message === "Account does not exist") {
                        setIsUsernameInvalid(true);
                    } else if (responseData.message === "Incorrect password") {
                        setIsPasswordIncorrect(true);
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };
    return (
        <div className="d-flex align-items-center vh-100">
            <div className="d-flex justify-content-center flex-column vh-100 bg">
                <div className="d-flex align-items-center flex-column">
                    <img src={logo2} />
                    <div className="d-flex align-items-center flex-column title">
                        <h2 className="text-white title-text">
                            BIOSCOPIC DIAGNOSTIC CENTER
                        </h2>
                        <h4 className="text-white">LABORATORY INFORMATION SYSTEM</h4>
                    </div>
                    <span className="text-white">
                        An easy to use application for your laboratory viewing needs
                    </span>
                </div>
            </div>
            <div className="d-flex justify-content-center w-100">
                <div className="col-5">
                    <h1 className="fw-bold mb-3">Welcome!</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                isInvalid={isUsernameInvalid}
                            />
                            <Form.Control.Feedback type="invalid">
                                Account does not exist. Please register an account.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                minLength="8"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={isPasswordIncorrect}
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid password. Please try again.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-between mb-3">
                            <Form.Group>
                                <Form.Check type="checkbox" label="Remember me" id="remember" />
                            </Form.Group>
                            <a href="/">Forgot password?</a>
                        </div>
                        <div className="d-flex justify-content-center mb-3">
                            <Button type="submit" className="btn btn-primary btn-lg">
                                LOGIN
                            </Button>
                        </div>
                    </Form>
                    <div className="text-center">
                        Don&apos;t have an account yet? <a href="register">Register Now</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;
