// components/auth/Login.jsx
import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../api/api';

const Login = () => {
    const { showLogin, setShowLogin, login, setShowRegister } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            login(response);
            setShowLogin(false);
            resetForm();
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: ''
        });
        setError('');
    };

    const handleClose = () => {
        resetForm();
        setShowLogin(false);
    };

    const switchToRegister = () => {
        resetForm();
        setShowLogin(false);
        setShowRegister(true);
    };

    return (
        <Modal show={showLogin} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login to Your Account</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner size="sm" className="me-2" />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <span className="text-muted">Don't have an account? </span>
                    <Button 
                        variant="link" 
                        className="p-0"
                        onClick={switchToRegister}
                        disabled={loading}
                    >
                        Register here
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Login;