import React from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-xl navbar-light border-bottom-0 bg-light sticky-top">
            <div className="container">
                <Link className="navbar-brand text-xl-start text-break" to="/"><i className="bi bi-pie-chart fs-5"></i> <p className='d-none d-sm-inline'>Observatório da Vida e Permanência Estudantil</p></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mynavbar">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/multimedia">Espaço Multimídia</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="javascript:void(0)">Banco de Dados</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="javascript:void(0)">Gráficos</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">Sobre Nós</Link>
                    </li>
                </ul>
                <form className="d-flex">
                    <input className="form-control me-2" type="text" placeholder="Buscar..." />
                    <button className="btn btn-primary" type="button"><i className="bi bi-search"></i></button>
                </form>
                </div>
            </div>
        </nav>
    )
}

export default Navbar