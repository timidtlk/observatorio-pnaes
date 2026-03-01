import { useEffect, useRef, useState } from "react";
import type { IMember, IPost } from "../api/Utils";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useNavigate } from "react-router-dom";
import { API_URI, getMemberByToken, changePassword, updateMember, updatePhotoById } from "../api/MembersService";
import { getPostsByUser } from "../api/PostsService";
import { logout } from "../api/AuthService";
import '../styles/high-contrast.css';

function MembersArea() {
    const [member, setMember] = useState<IMember | null>(null);
    const [editMember, setEditMember] = useState<IMember | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Carrega dados do membro e posts
    useEffect(() => {
        const fetchMemberAndPosts = async () => {
            setLoading(true);
            try {
                const memberData: IMember = await getMemberByToken() as unknown as IMember;
                setMember(memberData);
                setEditMember(memberData);
                const preview = memberData.photoUrl
                    ? (memberData.photoUrl.startsWith("http")
                        ? memberData.photoUrl
                        : `${API_URI}/image/${memberData.photoUrl}`)
                    : null;
                setPhotoPreview(preview);
                setPosts((await getPostsByUser(memberData.id)).data as unknown as IPost[])
            } catch (err: unknown) {
                console.log(err);
                setMember(null);
                setPosts([]);
            }
            setLoading(false);
        };
        fetchMemberAndPosts();
    }, []);

    // Preview da foto ao selecionar novo arquivo
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    // Atualiza campos do membro editável
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editMember) return;
        const { name } = e.target;
        const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value;
        setEditMember({ ...editMember, [name]: value } as IMember);
    };

    // Salva alterações do membro
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editMember) return;
        setSaving(true);

        try {
            await updateMember(editMember);

            if (photoFile) {
                await updatePhotoById(editMember.id, photoFile);
            }

            setMember(editMember);
            setPhotoFile(null);
        } catch (err: unknown) {
            alert(`Erro ao salvar dados: ${err}`);
        }
        setSaving(false);
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.next.length < 6) {
            alert("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }
        if (passwords.next !== passwords.confirm) {
            alert("A confirmação da senha não confere.");
            return;
        }
        try {
            setChangingPassword(true);
            await changePassword(passwords.current, passwords.next);
            alert("Senha alterada com sucesso.");
            setPasswords({ current: "", next: "", confirm: "" });
        } catch (err: unknown) {
            alert("Não foi possível alterar a senha. Verifique a senha atual e tente novamente.");
        } finally {
            setChangingPassword(false);
        }
    };

    // Logout
    const handleLogout = () => {
        if (!window.confirm("Deseja encerrar a sessão?")) return;
        logout();
        setMember(null);
        navigate("/login");
    };

    // Editar post (redireciona para página de edição)
    const handleEditPost = (postId: string) => {
        window.location.href = `/edit-post/${postId}`;
    };

    // Deletar post
    const handleDeletePost = async (postId: string) => {
        if (!window.confirm("Tem certeza que deseja deletar este post?")) return;
        try {
            await fetch(`/api/posts/${postId}`, { method: "DELETE" });
            setPosts(posts.filter((p) => p.id !== postId));
        } catch (err: unknown) {
            alert(`Erro ao deletar post: ${err}`);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <span className="spinner-border text-primary" role="status"></span>
            </div>
        );
    }

    if (!member || !editMember) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-exclamation-triangle display-1 text-primary mb-4"></i>
                <p>Não foi possível carregar seus dados.</p>
            </div>
        );
    }

    return (
        <>
            <Header title="Área do Membro">
                <p>Gerencie seus dados e suas postagens no Observatório.</p>
                {member.role === 'ADMIN' && (
                    <div className="mt-3">
                        <Link to="/admin" className="btn btn-warning btn-sm">
                            <i className="bi bi-shield-lock me-1"></i> Ferramentas de administrador
                        </Link>
                    </div>
                )}
            </Header>
            <section className="container py-5">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <div className="mb-3">
                                    <img
                                        src={photoPreview || "/default-user.png"}
                                        alt="Foto do membro"
                                        className="rounded-circle border"
                                        style={{ width: 140, height: 140, objectFit: "cover" }}
                                    />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control mb-2"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handlePhotoChange}
                                />
                                <button
                                    className="btn btn-outline-primary btn-sm mb-3"
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <i className="bi bi-camera me-1"></i> Alterar foto
                                </button>
                                <form onSubmit={handleSave}>
                                    <div className="mb-3 text-start">
                                        <label className="form-label fw-bold">Nome</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={editMember.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3 text-start">
                                        <label className="form-label fw-bold">E-mail</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={editMember.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3 text-start">
                                        <label className="form-label fw-bold">Currículo Lattes</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="lattes"
                                            value={editMember.lattes}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3 text-start">
                                        <label className="form-label fw-bold">Descrição</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            rows={3}
                                            value={editMember.description}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-check mb-3 text-start">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="showAbout"
                                            name="showAbout"
                                            checked={!!editMember.showAbout}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="showAbout">
                                            Exibir no "Sobre nós"
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Salvando...
                                            </>
                                        ) : (
                                            "Salvar alterações"
                                        )}
                                    </button>
                                </form>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger w-100 mt-2"
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-box-arrow-right me-1"></i> Sair
                                </button>
                            </div>
                        </div>

                        <div className="card shadow-sm mt-3">
                            <div className="card-header bg-white">
                                <h5 className="mb-0">Trocar senha</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleChangePassword}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Senha atual</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="current"
                                            value={passwords.current}
                                            onChange={handlePasswordInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Nova senha</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="next"
                                            value={passwords.next}
                                            onChange={handlePasswordInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Confirmar nova senha</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="confirm"
                                            value={passwords.confirm}
                                            onChange={handlePasswordInputChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-outline-primary w-100" disabled={changingPassword}>
                                        {changingPassword ? "Alterando..." : "Alterar senha"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white">
                                <h4 className="mb-0">
                                    <i className="bi bi-file-earmark-text me-2"></i>Minhas Postagens
                                </h4>
                            </div>
                            <div className="card-body">
                                {posts.length === 0 ? (
                                    <div className="text-center text-muted py-4">
                                        <i className="bi bi-exclamation-triangle display-4 mb-3"></i>
                                        <p>Nenhuma postagem encontrada.</p>
                                    </div>
                                ) : (
                                    <div className="list-group">
                                        {posts.map((post) => (
                                            <div
                                                key={post.id}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <h5 className="mb-1">{post.title}</h5>
                                                    <small className="text-muted">
                                                        {new Date(post.lastUpdatedOn).toLocaleDateString("pt-BR")}
                                                    </small>
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm me-2"
                                                        onClick={() => handleEditPost(post.id)}
                                                    >
                                                        <i className="bi bi-pencil"></i> Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleDeletePost(post.id)}
                                                    >
                                                        <i className="bi bi-trash"></i> Excluir
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-end mt-3">
                            <Link to="/add-post" className="btn btn-success">
                                <i className="bi bi-plus-circle me-1"></i> Nova Postagem
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default MembersArea;