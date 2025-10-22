import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';

const currentYear = new Date().getFullYear();

function Footer() {
    return (
        <footer className="bg-dark text-white mt-5">
            <div className="container py-5">
                <div className="row gy-4">
                    <div className="col-12 col-md-4">
                        <h5 className="fw-bold">Observatório da Vida e Permanência Estudantil</h5>
                        <p className="text-muted mb-0" style={{ lineHeight: 1.4 }}>
                            Plataforma para sistematizar e publicizar dados e análises sobre políticas de acesso e permanência estudantil (Lei n.12.711/2012 e PNAES).
                        </p>
                    </div>

                    <div className="col-6 col-md-2">
                        <h6 className="fw-semibold">Navegação</h6>
                        <ul className="list-unstyled">
                            <li><Link to="/database" className="text-white-50 text-decoration-none">Banco de dados</Link></li>
                            <li><Link to="/multimedia" className="text-white-50 text-decoration-none">Multimídia</Link></li> 
                            <li><Link to="/about" className="text-white-50 text-decoration-none">Sobre</Link></li>
                        </ul>
                    </div>

                    <div className="col-6 col-md-3">
                        <h6 className="fw-semibold">Contato</h6>
                        <p className="text-white-50 mb-1">Instituto Federal — Observatório</p>
                        <p className="text-white-50 mb-1">E-mail: <a href="mailto:observatorio@ifsp.edu.br" className="text-white-50 text-decoration-none">observatorio@ifsp.edu.br</a></p>
                        <p className="text-white-50 mb-0">Telefone: (00) 0000-0000</p>
                    </div>

                    <div className="col-12 col-md-3 text-md-end">
                        <div className="mt-3">
                            <a href="#top" className="btn btn-outline-light btn-sm">Voltar ao topo</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-top border-white-10 py-3">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <small className="text-white-50">© {currentYear} Observatório da Vida e Permanência Estudantil. Todos os direitos reservados.</small>
                    <small className="text-white-50">Desenvolvido por <a href='https://github.com/timidtlk'>Gustavo Santos Gil</a></small>
                </div>
            </div>
        </footer>
    )
}

export default Footer