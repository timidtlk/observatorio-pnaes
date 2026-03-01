import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import type { IMember } from "../api/Utils";
import {
    adminCreateMember,
    adminUpdateMember,
    deleteMember,
    getMemberByToken,
    getMembers,
} from "../api/MembersService";
import { replaceStudents } from "../api/StudentsService";
import "../styles/high-contrast.css";

function AdminTools() {
    const [me, setMe] = useState<IMember | null>(null);
    const [members, setMembers] = useState<IMember[]>([]);
    const [loading, setLoading] = useState(true);

    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvPassword, setCsvPassword] = useState("");
    const [csvConfirmed, setCsvConfirmed] = useState(false);
    const [csvStatus, setCsvStatus] = useState<string | null>(null);
    const [csvUploading, setCsvUploading] = useState(false);

    const [newMember, setNewMember] = useState({
        name: "",
        email: "",
        login: "",
        password: "",
        role: "MEMBER",
        description: "",
        lattes: "",
        showAbout: true,
    });

    const [editingMember, setEditingMember] = useState<IMember | null>(null);
    const [savingMember, setSavingMember] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const current = await getMemberByToken();
                setMe(current);
                if (current.role !== "ADMIN") {
                    navigate("/member");
                    return;
                }
                const list = await getMembers();
                setMembers(list.data as IMember[]);
            } catch (err) {
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const refreshMembers = async () => {
        const list = await getMembers();
        setMembers(list.data as IMember[]);
    };

    const handleCsvUpload = async () => {
        if (!csvFile) {
            setCsvStatus("Selecione um arquivo CSV.");
            return;
        }
        if (!csvPassword) {
            setCsvStatus("Informe sua senha para confirmar.");
            return;
        }
        if (!csvConfirmed) {
            setCsvStatus("Confirme que deseja substituir toda a base.");
            return;
        }
        if (!window.confirm("Tem certeza? Essa ação substituirá toda a base de estudantes.")) return;

        setCsvUploading(true);
        setCsvStatus(null);
        try {
            await replaceStudents(csvFile, csvPassword);
            setCsvStatus("Base atualizada com sucesso.");
        } catch (err) {
            console.error(err);
            setCsvStatus("Falha ao substituir base. Confira o CSV e sua senha.");
        } finally {
            setCsvUploading(false);
        }
    };

    const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value;
        setNewMember(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingMember(true);
        try {
            await adminCreateMember(newMember as any);
            setNewMember({ name: "", email: "", login: "", password: "", role: "MEMBER", description: "", lattes: "", showAbout: true });
            await refreshMembers();
            alert("Membro criado com sucesso.");
        } catch (err) {
            alert("Não foi possível criar o membro. Verifique os dados e tente novamente.");
        } finally {
            setSavingMember(false);
        }
    };

    const startEdit = (member: IMember) => {
        setEditingMember({ ...member });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!editingMember) return;
        const { name } = e.target;
        const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value;
        setEditingMember({ ...editingMember, [name]: value } as IMember);
    };

    const handleUpdateMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;
        setSavingMember(true);
        try {
            await adminUpdateMember(editingMember);
            setEditingMember(null);
            await refreshMembers();
            alert("Dados do membro atualizados.");
        } catch (err) {
            alert("Não foi possível atualizar o membro.");
        } finally {
            setSavingMember(false);
        }
    };

    const handleDeleteMember = async (id: string) => {
        if (!window.confirm("Excluir este membro?")) return;
        setSavingMember(true);
        try {
            await deleteMember(id);
            await refreshMembers();
        } catch (err) {
            alert("Não foi possível excluir o membro.");
        } finally {
            setSavingMember(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <span className="spinner-border text-primary" role="status"></span>
            </div>
        );
    }

    if (!me || me.role !== "ADMIN") {
        return (
            <div className="container py-5 text-center">
                <p>Somente administradores podem acessar esta página.</p>
            </div>
        );
    }

    return (
        <>
            <Header title="Ferramentas do Administrador">
                <p>Substitua a base de estudantes via CSV e gerencie membros.</p>
            </Header>
            <section className="container py-5">
                <div className="row g-4">
                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Substituir base (CSV)</h5>
                                <span className="badge bg-danger">Ação crítica</span>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Arquivo CSV</label>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        className="form-control"
                                        onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Senha do administrador</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={csvPassword}
                                        onChange={(e) => setCsvPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="confirmCsv"
                                        checked={csvConfirmed}
                                        onChange={(e) => setCsvConfirmed(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="confirmCsv">
                                        Confirmo que desejo substituir toda a base de estudantes.
                                    </label>
                                </div>
                                <button className="btn btn-danger w-100" onClick={handleCsvUpload} disabled={csvUploading}>
                                    {csvUploading ? "Enviando..." : "Substituir banco de dados"}
                                </button>
                                {csvStatus && <p className="mt-3 small text-muted">{csvStatus}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-white">
                                <h5 className="mb-0">Criar novo membro</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleCreateMember}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Nome</label>
                                            <input className="form-control" name="name" value={newMember.name} onChange={handleNewMemberChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">E-mail</label>
                                            <input className="form-control" name="email" value={newMember.email} onChange={handleNewMemberChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Login</label>
                                            <input className="form-control" name="login" value={newMember.login} onChange={handleNewMemberChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Senha</label>
                                            <input className="form-control" type="password" name="password" value={newMember.password} onChange={handleNewMemberChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Cargo</label>
                                            <select className="form-select" name="role" value={newMember.role} onChange={handleNewMemberChange}>
                                                <option value="MEMBER">Membro</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Currículo Lattes</label>
                                            <input className="form-control" name="lattes" value={newMember.lattes} onChange={handleNewMemberChange} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Descrição</label>
                                            <textarea className="form-control" name="description" rows={2} value={newMember.description} onChange={handleNewMemberChange}></textarea>
                                        </div>
                                        <div className="col-12 form-check mt-2">
                                            <input className="form-check-input" type="checkbox" id="newShowAbout" name="showAbout" checked={newMember.showAbout} onChange={handleNewMemberChange} />
                                            <label className="form-check-label" htmlFor="newShowAbout">Exibir no "Sobre nós"</label>
                                        </div>
                                    </div>
                                    <button className="btn btn-success w-100 mt-3" type="submit" disabled={savingMember}>
                                        {savingMember ? "Salvando..." : "Criar membro"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="card shadow-sm">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Membros</h5>
                                <span className="badge bg-secondary">{members.length}</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-striped mb-0">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Login</th>
                                            <th>Role</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((m) => (
                                            <tr key={m.id}>
                                                <td>{m.name}</td>
                                                <td>{m.login}</td>
                                                <td>{m.role}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => startEdit(m)}>
                                                        Editar
                                                    </button>
                                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteMember(m.id)} disabled={savingMember}>
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {editingMember && (
                            <div className="card shadow-sm mt-3">
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Editar membro</h5>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingMember(null)}>Fechar</button>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleUpdateMember}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">Nome</label>
                                                <input className="form-control" name="name" value={editingMember.name} onChange={handleEditChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">E-mail</label>
                                                <input className="form-control" name="email" value={editingMember.email} onChange={handleEditChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">Login</label>
                                                <input className="form-control" name="login" value={editingMember.login} onChange={handleEditChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">Cargo</label>
                                                <select className="form-select" name="role" value={editingMember.role} onChange={handleEditChange}>
                                                    <option value="MEMBER">Membro</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">Currículo Lattes</label>
                                                <input className="form-control" name="lattes" value={editingMember.lattes || ""} onChange={handleEditChange} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label fw-bold">Descrição</label>
                                                <textarea className="form-control" name="description" rows={2} value={editingMember.description || ""} onChange={handleEditChange}></textarea>
                                            </div>
                                            <div className="col-12 form-check mt-2">
                                                <input className="form-check-input" type="checkbox" id="editShowAbout" name="showAbout" checked={!!editingMember.showAbout} onChange={handleEditChange} />
                                                <label className="form-check-label" htmlFor="editShowAbout">Exibir no "Sobre nós"</label>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2 mt-3">
                                            <button className="btn btn-secondary w-100" type="button" onClick={() => setEditingMember(null)}>
                                                Cancelar
                                            </button>
                                            <button className="btn btn-primary w-100" type="submit" disabled={savingMember}>
                                                {savingMember ? "Salvando..." : "Salvar"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default AdminTools;
