/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import type { IStudent } from "../api/Utils";
import {
    getAllCampus,
    getAllCursos,
    getAllFormasIngresso,
    getStudents,
} from "../api/StudentsService";
import '../styles/high-contrast.css';

function Database() {
    const [campusOptions, setCampusOptions] = useState<string[]>([]);
    const [cursoOptions, setCursoOptions] = useState<string[]>([]);
    const [ingressoOptions, setIngressoOptions] = useState<string[]>([]);

    const [campus, setCampus] = useState<string>("");
    const [curso, setCurso] = useState<string>("");
    const [formaIngresso, setFormaIngresso] = useState<string>("");
    const [cotas, setCotas] = useState<string>(""); // '' => todos, 'S'|'N'|'O'

    const [students, setStudents] = useState<IStudent[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); // controla exibição inicial
    const [lastFilters, setLastFilters] = useState({
        campus: "",
        curso: "",
        formaIngresso: "",
        cotas: "",
    });

    useEffect(() => {
        // carregar opções para selects
        (async () => {
            try {
                const campusRes = await getAllCampus();
                setCampusOptions((campusRes as any).data || []);
            } catch (e: unknown) {
                console.log(e);
                setCampusOptions([]);
            }
            try {
                const cursosRes = await getAllCursos();
                setCursoOptions((cursosRes as any).data || []);
            } catch (e: unknown) {
                console.log(e);
                setCursoOptions([]);
            }
            try {
                const ingressoRes = await getAllFormasIngresso();
                setIngressoOptions((ingressoRes as any).data || []);
            } catch (e: unknown) {
                console.log(e);
                setIngressoOptions([]);
            }
        })();
    }, []);

    const handleSearch = async () => {
        // primeira busca: se todos vazios, solicitar confirmação (base grande)
        if (!campus && !curso && !formaIngresso && !cotas) {
            const ok = window.confirm(
                "O banco de dados contém muitas linhas. Deseja recuperar todos os registros? (pode demorar)"
            );
            if (!ok) return;
        }

        setLoading(true);
        setHasSearched(true);
        try {
            const res = await getStudents(campus, curso, formaIngresso, cotas);
            const data = (res as any).data || [];
            setStudents(data);
            setLastFilters({ campus, curso, formaIngresso, cotas });
        } catch (err) {
            console.error(err);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        setCampus("");
        setCurso("");
        setFormaIngresso("");
        setCotas("");
        setStudents([]);
        setHasSearched(false);
        setLastFilters({ campus: "", curso: "", formaIngresso: "", cotas: "" });
    };

    return (
        <>
            <Header title="Banco de Dados de Estudantes">
                <p>
                    Filtre por campus, curso, forma de ingresso e cotas. Na primeira busca
                    é solicitado que informe filtros para evitar consultas muito grandes.
                </p>
            </Header>

            <section className="container py-5">
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Campus</label>
                                <select
                                    className="form-select"
                                    value={campus}
                                    onChange={(e) => setCampus(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {campusOptions.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Curso</label>
                                <select
                                    className="form-select"
                                    value={curso}
                                    onChange={(e) => setCurso(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {cursoOptions.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold">Forma de ingresso</label>
                                <select
                                    className="form-select"
                                    value={formaIngresso}
                                    onChange={(e) => setFormaIngresso(e.target.value)}
                                >
                                    <option value="">Todas</option>
                                    {ingressoOptions.map((i) => (
                                        <option key={i} value={i}>
                                            {i}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-2">
                                <label className="form-label fw-bold">Cotas</label>
                                <select
                                    className="form-select"
                                    value={cotas}
                                    onChange={(e) => setCotas(e.target.value)}
                                >
                                    <option value="">Todas</option>
                                    <option value="S">Sim</option>
                                    <option value="N">Não</option>
                                    <option value="O">Outros</option>
                                </select>
                            </div>

                            <div className="col-md-1 d-grid">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSearch}
                                    disabled={loading}
                                >
                                    Buscar
                                </button>
                            </div>
                        </div>

                        <div className="mt-3 d-flex justify-content-end">
                            <button className="btn btn-link" onClick={handleResetFilters}>
                                Limpar filtros
                            </button>
                        </div>
                    </div>
                </div>

                {!hasSearched ? (
                    <div className="alert alert-info text-center">
                        Por favor, selecione filtros e clique em "Buscar" para carregar os registros.
                    </div>
                ) : loading ? (
                    <div className="text-center py-5">
                        <span className="spinner-border text-primary" role="status" />
                    </div>
                ) : (
                    <>
                        <div className="mb-3 d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Registros encontrados: </strong> {students.length}
                            </div>
                            <div className="text-muted small">
                                Filtros usados:
                                <span className="ms-2">
                                    campus={lastFilters.campus || "todos"}, curso={lastFilters.curso || "todos"}
                                    , ingresso={lastFilters.formaIngresso || "todos"}, cotas={lastFilters.cotas || "todos"}
                                </span>
                            </div>
                        </div>

                        {students.length === 0 ? (
                            <div className="text-center text-muted py-4">
                                <i className="bi bi-exclamation-triangle display-4 mb-3" />
                                <p>Nenhum registro encontrado com os filtros selecionados.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Campus</th>
                                            <th>Curso</th>
                                            <th>Forma de ingresso</th>
                                            <th className="text-end">Quantidade de pessoas</th>
                                            <th>Cotas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((s) => (
                                            <tr key={`${s.campus}-${s.curso}-${Math.random()}`}>
                                                <td>{s.campus || "—"}</td>
                                                <td>{s.curso || "—"}</td>
                                                <td>{s.formaIngresso || "—"}</td>
                                                <td className="text-end">{s.qtdPessoas ?? "—"}</td>
                                                <td>{s.cotas || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    );
}

export default Database;