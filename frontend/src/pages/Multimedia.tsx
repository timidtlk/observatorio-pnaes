import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from '../components/Header'

const contentTypes = ["Todos", "Entrevista", "Vídeo", "Podcast"];
const POSTS_PER_PAGE = 10;

interface Post {
    id: number;
    title: string;
    type: string;
    date: string;
    description: string;
    link: string;
}

function Multimedia() {
    const [selectedType, setSelectedType] = useState("Todos");
    const [selectedDate, setSelectedDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async (page: number, type: string, date: string) => {
        setLoading(true)
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', POSTS_PER_PAGE.toString());
            if (type !== "Todos") params.append('type', type);
            if (date) params.append('date', date);

            const response = await fetch(`/api/multimedia?${params.toString()}`);
            const data = await response.json();
            setPosts(data.items);
            setTotalPages(data.totalPages);
        } catch (error: unknown) {
            setPosts([]);
            setTotalPages(1);
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchPosts(currentPage, selectedType, selectedDate);
    }, [currentPage, selectedType, selectedDate]);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, selectedDate]);

    return (
        <>
            <Header title="Espaço Multimídia">
                <p>
                    Explore entrevistas, vídeos, podcasts e outros conteúdos produzidos pelos membros do <strong>Observatório da Vida e Permanência Estudantil</strong>. Este espaço reúne materiais relacionados às pesquisas, debates e experiências sobre permanência estudantil.
                </p>
            </Header>

            <section className="container py-5">
                <div className="row mb-4">
                    <div className="col-md-6 mb-2">
                        <label htmlFor="typeFilter" className="form-label fw-bold">Filtrar por conteúdo:</label>
                        <select
                            id="typeFilter"
                            className="form-select"
                            value={selectedType}
                            onChange={e => setSelectedType(e.target.value)}
                        >
                            {contentTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 mb-2">
                        <label htmlFor="dateFilter" className="form-label fw-bold">Filtrar por data:</label>
                        <input
                            id="dateFilter"
                            type="date"
                            className="form-control"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="list-group">
                    {loading ? (
                        <div className="text-center text-muted py-5">
                            Carregando...
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center text-muted py-5" style={{ marginTop: '3rem' }}>
                            <i
                                className="bi bi-exclamation-triangle display-1 text-primary mb-4"
                                style={{ fontSize: '5rem' }}
                            ></i>
                            <br />
                            <span style={{ fontSize: '1.25rem' }}>
                                Nenhuma postagem encontrada para os filtros selecionados.
                            </span>
                        </div>
                    ) : (
                        posts.map(post => (
                            <a
                                key={post.id}
                                href={post.link}
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-5"
                            >
                                <div>
                                    <h5 className="mb-1">
                                        <i className={
                                            post.type === "Entrevista" ? "bi bi-mic-fill text-primary me-2"
                                            : post.type === "Vídeo" ? "bi bi-camera-video-fill text-danger me-2"
                                            : post.type === "Podcast" ? "bi bi-headphones text-success me-2"
                                            : "bi bi-file-earmark-text me-2"
                                        } />
                                        {post.title}
                                    </h5>
                                    <p className="mb-1">{post.description}</p>
                                </div>
                                <span className="text-muted ms-3">
                                    <i className="bi bi-calendar-event me-1" />
                                    {new Date(post.date).toLocaleDateString('pt-BR')}
                                </span>
                            </a>
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || loading}
                        >
                            <i className="bi bi-chevron-left"></i> Anterior
                        </button>
                        <span>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            className="btn btn-outline-primary ms-2"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || loading}
                        >
                            Próxima <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                )}
            </section>
        </>
    )
}

export default Multimedia;