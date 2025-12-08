import { useEffect, useState } from "react";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import type { IStudent } from "../api/Utils";
import { getStudents, getAllCampus } from "../api/StudentsService";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Charts() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [campusOptions, setCampusOptions] = useState<string[]>([]);
    const [campus, setCampus] = useState<string>(""); // '' => Todos

    useEffect(() => {
        (async () => {
            try {
                const res = await getAllCampus();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data = (res as any).data || [];
                setCampusOptions(Array.isArray(data) ? data : []);
            } catch (err: unknown) {
                setCampusOptions([]);
                console.log(err);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getStudents(campus, "", "", "");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data = (res as any).data || [];
                setStudents(data);
            } catch (err: unknown) {
                console.error(err);
                setError("Falha ao carregar dados.");
                setStudents([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [campus]);

    const agg = students.reduce(
        (acc, s) => {
            const key = (s.cotas || "").toUpperCase();
            const qty = typeof s.qtdPessoas === "number" ? s.qtdPessoas : 1;
            if (key === "S") acc.S += qty;
            else if (key === "N") acc.N += qty;
            else acc.O += qty;
            return acc;
        },
        { S: 0, N: 0, O: 0 }
    );

    const total = agg.S + agg.N + agg.O || 0;

    const pieData = {
        labels: ["Cotas: Sim (S)", "Cotas: Não (N)", "Cotas: Outros (O)"],
        datasets: [
            {
                data: [agg.S, agg.N, agg.O],
                backgroundColor: ["#0d6efd", "#198754", "#fd7e14"],
                hoverBackgroundColor: ["#0b5ed7", "#157347", "#e06a00"],
            },
        ],
    };

    const pieOptions = {
        plugins: {
            legend: { position: "bottom" as const },
            tooltip: { enabled: true },
        },
        maintainAspectRatio: false,
    };

    return (
        <>
            <Header title="Gráficos — Distribuição de Cotas">
                <p>
                    Visualização da distribuição de estudantes por situação de cotas (S / N / O).
                    Selecione um campus para filtrar ou deixe em "Todos".
                </p>
            </Header>

            <section className="container py-5">
                {loading ? (
                    <div className="text-center py-5">
                        <span className="spinner-border text-primary" role="status" />
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    <>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Campus</label>
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
                        </div>

                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="card shadow-sm" style={{ height: 360 }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Percentual por cotas</h5>
                                        {total === 0 ? (
                                            <div className="text-center text-muted py-5">Sem dados para o filtro selecionado.</div>
                                        ) : (
                                            <div style={{ height: 260 }}>
                                                <Pie data={pieData} options={pieOptions} key={JSON.stringify(pieData)} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">Resumo</h5>
                                        <dl className="row">
                                            <dt className="col-7">Total de pessoas (soma das quantidades)</dt>
                                            <dd className="col-5 text-end">{total}</dd>

                                            <dt className="col-7">Cotas — Sim (S)</dt>
                                            <dd className="col-5 text-end">
                                                {agg.S} ({total ? ((agg.S / total) * 100).toFixed(1) : "0"}%)
                                            </dd>

                                            <dt className="col-7">Cotas — Não (N)</dt>
                                            <dd className="col-5 text-end">
                                                {agg.N} ({total ? ((agg.N / total) * 100).toFixed(1) : "0"}%)
                                            </dd>

                                            <dt className="col-7">Cotas — Outros (O)</dt>
                                            <dd className="col-5 text-end">
                                                {agg.O} ({total ? ((agg.O / total) * 100).toFixed(1) : "0"}%)
                                            </dd>
                                        </dl>

                                        <hr />

                                        <h6>Notas</h6>
                                        <ul className="small mb-0">
                                            <li>
                                                Os números são obtidos a partir da tabela students. A consulta traz apenas os registros
                                                do campus selecionado (ou todos se "Todos" estiver selecionado).
                                            </li>
                                            <li>
                                                Para bases muito grandes, considere criar um endpoint no backend que retorne os percentuais
                                                já agregados para melhorar desempenho.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </>
    );
}

export default Charts;