import { useState, useRef } from 'react';
import type { ILoginCredentials } from '../api/Utils';
import { login, requestPasswordReset, resetPassword } from '../api/AuthService';
import { useNavigate } from 'react-router-dom';
import '../styles/high-contrast.css';

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

    const [showForgot, setShowForgot] = useState(false);
    const [forgotStep, setForgotStep] = useState<1 | 2>(1);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotData, setForgotData] = useState({
        loginOrEmail: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

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

                if (rememberMe) {
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }
                showToast('Login realizado com sucesso!', 'success');
                navigate("/member");
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

    const handleForgotInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForgotData(prev => ({ ...prev, [name]: value }));
    };

    const closeForgot = () => {
        setShowForgot(false);
        setForgotStep(1);
        setForgotData({ loginOrEmail: '', code: '', newPassword: '', confirmPassword: '' });
    };

    const sendResetCode = async () => {
        if (!forgotData.loginOrEmail) {
            showToast('Informe e-mail ou usuário para enviar o código.', 'warning');
            return;
        }
        setForgotLoading(true);
        try {
            await requestPasswordReset(forgotData.loginOrEmail);
            showToast('Código enviado! Verifique seu e-mail.', 'info');
            setForgotStep(2);
        } catch (err) {
            console.error(err);
            showToast('Não foi possível enviar o código.');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (forgotData.newPassword.length < 6) {
            showToast('A nova senha deve ter pelo menos 6 caracteres.', 'warning');
            return;
        }
        if (forgotData.newPassword !== forgotData.confirmPassword) {
            showToast('A confirmação da nova senha não confere.', 'warning');
            return;
        }
        if (!forgotData.code) {
            showToast('Informe o código recebido por e-mail.', 'warning');
            return;
        }

        setForgotLoading(true);
        try {
            await resetPassword(forgotData.loginOrEmail, forgotData.code, forgotData.newPassword);
            showToast('Senha redefinida! Faça login com a nova senha.', 'success');
            closeForgot();
        } catch (err) {
            console.error(err);
            showToast('Código inválido ou expirado.');
        } finally {
            setForgotLoading(false);
        }
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

            {showForgot && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75" style={{ zIndex: 1200 }}>
                    <div className="card shadow" style={{ width: '90%', maxWidth: '420px' }}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Recuperar senha</h5>
                            <button className="btn btn-sm btn-outline-secondary" onClick={closeForgot}>
                                Fechar
                            </button>
                        </div>
                        <div className="card-body">
                            {forgotStep === 1 ? (
                                <>
                                    <p className="small text-muted">Informe seu e-mail ou nome de usuário para receber um código de 6 dígitos.</p>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">E-mail ou usuário</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="loginOrEmail"
                                            value={forgotData.loginOrEmail}
                                            onChange={handleForgotInputChange}
                                        />
                                    </div>
                                    <button className="btn btn-primary w-100" onClick={sendResetCode} disabled={forgotLoading}>
                                        {forgotLoading ? 'Enviando...' : 'Enviar código'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="small text-muted">Digite o código recebido e a nova senha.</p>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Código</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="code"
                                            value={forgotData.code}
                                            onChange={handleForgotInputChange}
                                            maxLength={6}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Nova senha</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="newPassword"
                                            value={forgotData.newPassword}
                                            onChange={handleForgotInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Confirmar nova senha</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="confirmPassword"
                                            value={forgotData.confirmPassword}
                                            onChange={handleForgotInputChange}
                                        />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-secondary w-100" onClick={() => setForgotStep(1)} disabled={forgotLoading}>
                                            Voltar
                                        </button>
                                        <button className="btn btn-success w-100" onClick={handleResetPassword} disabled={forgotLoading}>
                                            {forgotLoading ? 'Salvando...' : 'Redefinir senha'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                            <button type="button" className="btn btn-link text-decoration-none" onClick={() => setShowForgot(true)}>
                                Esqueceu sua senha?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
