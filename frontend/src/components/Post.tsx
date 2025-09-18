import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import type { IPost } from '../api/Utils';

function Post() {
	const { id } = useParams<{ id: string }>();
	const [post, setPost] = useState<IPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPost = async (postId: string) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/posts/${postId}`);

			if (!response.ok) {
				throw new Error('Post não encontrado');
			}

			const data: IPost = await response.json();
			setPost(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao carregar o post');
			console.error('Erro:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (id) {
			fetchPost(id);
		}
	}, [id]);

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "Entrevista":
				return "bi bi-mic-fill text-primary me-2";
			case "Vídeo":
				return "bi bi-camera-video-fill text-danger me-2";
			case "Podcast":
				return "bi bi-headphones text-success me-2";
			default:
				return "bi bi-file-earmark-text me-2";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	};

	if (loading) {
		return (
			<>
				<Header title="Carregando...">
					<p>
						O conteúdo está sendo carregado...
					</p>
				</Header>
				<section className="container py-5">
					<div className="text-center text-muted py-5">
						<div className="spinner-border text-primary" role="status">
							<span className="visually-hidden">Carregando...</span>
						</div>
						<p className="mt-3">Carregando post...</p>
					</div>
				</section>
			</>
		);
	}

	if (error || !post) {
		return (
			<>
				<Header title="Erro" />
				<section className="container py-5">
					<div className="text-center text-muted py-5">
						<i
							className="bi bi-exclamation-triangle display-1 text-primary mb-4"
							style={{ fontSize: '5rem' }}
						></i>
						<h3 className="text-danger mb-3">Oops! Algo deu errado</h3>
						<p className="mb-4">{error || 'Post não encontrado'}</p>
						<Link to="/multimedia" className="btn btn-primary">
							<i className="bi bi-arrow-left me-2"></i>
							Voltar para a lista
						</Link>
					</div>
				</section>
			</>
		);
	}

	return (
		<>
			<Header title={post.title}>
				<p className="lead">{post.description}</p>
			</Header>

			<section className="container py-5">
				<div className="row justify-content-center">
					<div className="col-lg-10">
						{/* Breadcrumb */}
						<nav aria-label="breadcrumb" className="mb-4">
							<ol className="breadcrumb">
								<li className="breadcrumb-item">
									<Link to="/multimedia">Espaço Multimídia</Link>
								</li>
								<li className="breadcrumb-item active" aria-current="page">
									{post.title}
								</li>
							</ol>
						</nav>

						{/* Post Header */}
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-body">
								<div className="d-flex justify-content-between align-items-start mb-3">
									<span className="badge bg-primary rounded-pill">
										<i className={getTypeIcon(post.type)}></i>
										{post.type}
									</span>
									<span className="text-muted">
										<i className="bi bi-calendar-event me-1"></i>
										{formatDate(post.date)}
									</span>
								</div>

								<h1 className="h2 mb-3">{post.title}</h1>

								{post.member && (
									<div className="d-flex align-items-center mb-4">
										<div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
											style={{ width: '50px', height: '50px' }}>
											<i className="bi bi-person-fill text-muted"></i>
										</div>
										<div>
											<h6 className="mb-0">{post.member.name}</h6>
										</div>
									</div>
								)}

								<p className="lead text-muted">{post.description}</p>
							</div>
						</div>

						{/* Post Content */}
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-body">
								<div
									className="post-content"
									dangerouslySetInnerHTML={{ __html: post.content }}
								/>
							</div>
						</div>

						{/* External Link */}
						{post.link && (
							<div className="card border-0 shadow-sm mb-4">
								<div className="card-body text-center">
									<h5 className="card-title mb-3">Acesse o conteúdo completo</h5>
									<a
										href={post.link}
										target="_blank"
										rel="noopener noreferrer"
										className="btn btn-primary btn-lg"
									>
										<i className="bi bi-box-arrow-up-right me-2"></i>
										Ver conteúdo externo
									</a>
								</div>
							</div>
						)}

						{/* Back Button */}
						<div className="text-center mt-4">
							<Link to="/multimedia" className="btn btn-outline-primary">
								<i className="bi bi-arrow-left me-2"></i>
								Voltar para a lista de posts
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Post;