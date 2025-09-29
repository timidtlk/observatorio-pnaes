import React, { useState, useRef } from 'react';
import type { ILoginCredentials } from '../api/Utils';
import { login } from '../api/AuthService';

// Interface para os toasts
interface ToastNotification {
    id: number;
    message: string;
    type: 'success' | 'danger' | 'warning' | 'info';
}

interface LoginErrors {
    login?: string;
    password?: string;
}

function Login() {
    const [credentials, setCredentials] = useState<ILoginCredentials>({
        login: '',
        password: ''
    });
    const [errors, setErrors] = useState<LoginErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [toasts, setToasts] = useState<
        (ToastNotification & { isHiding?: boolean })[]
    >([]);
    const toastIdCounter = useRef(0);

    // Função para mostrar toast
    const showToast = (
        message: string,
        type: 'success' | 'danger' | 'warning' | 'info' = 'danger'
    ) => {
        const id = toastIdCounter.current++;
        const newToast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Inicia a remoção após 5s
        setTimeout(() => {
            hideToast(id);
        }, 5000);
    };

    // Marca como "saindo" antes de remover
    const hideToast = (id: number) => {
        setToasts(prev =>
            prev.map(toast =>
                toast.id === id ? { ...toast, isHiding: true } : toast
            )
        );
        setTimeout(() => removeToast(id), 300); // espera a animação acabar
    };

    // Remove do estado
    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const validateForm = (): boolean => {
        const newErrors: LoginErrors = {};

        if (!credentials.login) {
            newErrors.login = 'Nome de usuário é obrigatório';
        } else if (credentials.login.length < 3) {
            newErrors.login = 'Nome de usuário deve ter pelo menos 3 caracteres';
        }

        if (!credentials.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (credentials.password.length < 6) {
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                console.log('Tentativa de login com:', credentials);

                const response = await login(credentials);

                const token: string = response.data.token;
                const uuid: string = response.data.uuid;

                if (rememberMe) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('id', uuid);
                } else {
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('id', uuid);
                }
                showToast('Login realizado com sucesso!', 'success');
            } catch (error) {
                console.error('Erro no login:', error);
                showToast('Login ou senha inválidos!');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof LoginErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleRememberMeChange = () => {
        setRememberMe(prev => !prev);
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
            {/* Container de Toasts */}
            <div
                className="toast-container position-fixed top-0 end-0 p-3"
                style={{ zIndex: 1050 }}
            >
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`toast align-items-center text-white bg-${toast.type} border-0 fade ${toast.isHiding ? '' : 'show'
                            }`}
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                    >
                        <div className="d-flex">
                            <div className="toast-body">
                                <i
                                    className={`bi ${toast.type === 'success'
                                            ? 'bi-check-circle-fill'
                                            : 'bi-exclamation-triangle-fill'
                                        } me-2`}
                                ></i>
                                {toast.message}
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white me-2 m-auto"
                                aria-label="Close"
                                onClick={() => hideToast(toast.id)}
                            ></button>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="card shadow-lg"
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <div
                    className="card-header text-center py-4"
                    style={{ backgroundColor: '#4e73df' }}
                >
                    <h2 className="text-white mb-0">Login</h2>
                </div>

                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="login" className="form-label fw-bold">
                                Nome de usuário
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.login ? 'is-invalid' : ''}`}
                                id="login"
                                name="login"
                                value={credentials.login}
                                onChange={handleInputChange}
                                placeholder="Digite seu nome de usuário"
                            />
                            {errors.login && (
                                <div className="invalid-feedback">{errors.login}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-bold">
                                Senha
                            </label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleInputChange}
                                    placeholder="Digite sua senha"
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute end-0 text-decoration-none"
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        top: '50%',               // centraliza verticalmente
                                        transform: 'translateY(-50%)', // corrige o alinhamento
                                        zIndex: 5
                                    }}
                                >
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password && (
                                <div style={{
                                    display: 'block'
                                }} className="invalid-feedback mb-3">{errors.password}</div>
                            )}
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                                Lembrar-me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2 fw-semibold"
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#4e73df', borderColor: '#4e73df' }}
                        >
                            {isSubmitting ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </button>

                        <div className="text-center mt-3">
                            <a href="#forgot-password" className="text-decoration-none">
                                Esqueceu sua senha?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
