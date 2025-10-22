import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from '../components/Header'
import type { IPost } from '../api/Utils'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../api/PostsService'
import '../styles/high-contrast.css';

const contentTypes = ["Entrevista", "Vídeo", "Podcast", "Outros"]

function AddPost() {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [type, setType] = useState(contentTypes[0])
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!title.trim()) {
            setError('Título é obrigatório.')
            return
        }

        let typeEnum: string = "";
        
        switch (type.trim()) {
            case "Entrevista":
                typeEnum = "INTERVIEW";
                break;
            case "Vídeo":
                typeEnum = "VIDEO";
                break;
            case "Podcast":
                typeEnum = "PODCAST";
                break;
            case "Artigo":
                typeEnum = "ARTICLE";
                break;
        }

        setSubmitting(true)
        try {
            const payload: Partial<IPost> = {
                title: title.trim(),
                type: typeEnum.trim(),
                description: description.trim(),
                content: content.trim(),
            }

            createPost(payload);
            setSuccess('Post criado com sucesso.')
            // volta para área do membro (ou página anterior)
            setTimeout(() => navigate(-1), 900)
        } catch (err: unknown) {
            console.error(err)
            setError('Falha ao criar post. Verifique se você está autenticado.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Header title="Nova Postagem">
                <p>Crie uma nova postagem multimídia relacionada às pesquisas do Observatório.</p>
            </Header>

            <section className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <div className="card shadow-sm">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Título</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Tipo de conteúdo</label>
                                            <select
                                                className="form-select"
                                                value={type}
                                                onChange={e => setType(e.target.value)}
                                            >
                                                {contentTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3 mt-3">
                                        <label className="form-label fw-bold">Conteúdo (Link)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={content}
                                            onChange={e => setContent(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Descrição</label>
                                        <textarea
                                            className="form-control"
                                            rows={6}
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate(-1)}
                                            disabled={submitting}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Publicando...
                                                </>
                                            ) : 'Publicar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default AddPost