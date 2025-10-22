import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { getMemberByToken } from '../api/MembersService';

function Navbar() {
    const [highContrast, setHighContrast] = useState<boolean>(() => localStorage.getItem('highContrast') === '1')
    const [fontScale, setFontScale] = useState<number>(() => Number(localStorage.getItem('fontScale') || 100))
    const [memberName, setMemberName] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        // apply persisted settings
        document.body.classList.toggle('high-contrast', highContrast)
        document.documentElement.style.fontSize = `${fontScale}%`
        localStorage.setItem('highContrast', highContrast ? '1' : '0')
        localStorage.setItem('fontScale', String(fontScale))
    }, [highContrast, fontScale])

    useEffect(() => {
        // try to fetch logged member if token present
        const token = sessionStorage.getItem('token') ?? localStorage.getItem('token')
        if (!token) {
            setMemberName(null)
            return
        }

        let mounted = true
        getMemberByToken()
            .then(m => {
                if (mounted && m?.name) setMemberName(m.name)
            })
            .catch(() => {
                if (mounted) setMemberName(null)
            })
        return () => { mounted = false }
    }, [])

    const toggleContrast = () => setHighContrast(h => !h)
    const increaseFont = () => setFontScale(s => Math.min(140, s + 10))
    const decreaseFont = () => setFontScale(s => Math.max(80, s - 10))

    const handleAccessClick = () => {
        const token = sessionStorage.getItem('token') ?? localStorage.getItem('token')
        if (token) navigate('/member')
        else navigate('/login')
    }

    return (
        <nav className="navbar navbar-expand-xl navbar-light border-bottom-0 bg-light sticky-top">
            <div className="container">
                <Link className="navbar-brand text-xl-start text-break" to="/home">
                    <i className="bi bi-pie-chart fs-5"></i>
                    <span className='d-none d-sm-inline ms-2'>Observatório da Vida e Permanência Estudantil</span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="mynavbar">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/multimedia">Espaço Multimídia</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/database">Banco de Dados</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/charts">Gráficos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">Sobre Nós</Link>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-2">
                        <div className="btn-group btn-group-sm me-2" role="group" aria-label="Acessibilidade">
                            <button
                                type="button"
                                className={`btn btn-outline-secondary ${highContrast ? 'active' : ''}`}
                                onClick={toggleContrast}
                                title="Alternar alto contraste"
                                aria-pressed={highContrast}
                            >
                                <i className="bi bi-contrast me-1" /> Contraste
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={decreaseFont}
                                title="Diminuir tamanho do texto"
                                aria-label="Diminuir fonte"
                            >
                                <i className="bi bi-fonts me-1"></i> A-
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={increaseFont}
                                title="Aumentar tamanho do texto"
                                aria-label="Aumentar fonte"
                            >
                                <i className="bi bi-fonts me-1"></i> A+
                            </button>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={handleAccessClick}
                            aria-label={memberName ? `Ir para área do membro ${memberName}` : 'Acesso restrito'}
                        >
                            {memberName ? (
                                <span className="d-flex align-items-center">
                                    <i className="bi bi-person-circle me-1"></i>
                                    <span className="d-none d-md-inline">{memberName}</span>
                                </span>
                            ) : (
                                <span className="d-flex align-items-center">
                                    <i className="bi bi-lock-fill me-1"></i> Acesso restrito
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar