/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import LinkCard from '../components/LinkCard';
import Counter from '../components/Counter';
import Header from '../components/Header';
import { getAllCampus, getAllCursos, getCount } from '../api/StudentsService';
import '../styles/high-contrast.css';

function Home() {
    const [campusCount, setCampusCount] = useState<number | null>(null)
    const [coursesCount, setCoursesCount] = useState<number | null>(null)
    const [rowsCount, setRowsCount] = useState<number | null>(null)

    useEffect(() => {
        (async () => {
            try {
                const campusRes = await getAllCampus()
                const campusData = (campusRes as any).data
                setCampusCount(Array.isArray(campusData) ? campusData.length : (typeof campusData === 'number' ? campusData : null))
            } catch (e: unknown) {
                console.log(e);
                setCampusCount(null)
            }
            
            try {
                const cursosRes = await getAllCursos()
                const cursosData = (cursosRes as any).data
                setCoursesCount(Array.isArray(cursosData) ? cursosData.length : (typeof cursosData === 'number' ? cursosData : null))
            } catch (e: unknown) {
                console.log(e);
                setCoursesCount(null)
            }
            
            try {
                const countRes = await getCount()
                const countData = (countRes as any).data
                setRowsCount(typeof countData === 'number' ? countData : (countData?.count ?? null))
            } catch (e: unknown) {
                console.log(e);
                setRowsCount(null)
            }
        })()
    }, [])

    return (
        <>
            <Header title='Observatório da Vida e Permanência Estudantil'>
                <div className="container text-center">
                    <p className="fs-6 mx-auto mb-3" style={{ maxWidth: 980, lineHeight: 1.5 }}>
                        Plataforma para unificar acesso a bases, análises e materiais multimídia sobre acesso e permanência estudantil no IFSP — bancos de dados, referências, metodologia e ferramentas interativas para avaliação das políticas públicas.
                    </p>

                    <div className="d-flex justify-content-center gap-3 mb-4">
                        <Link to='/database' className='btn btn-primary btn-lg'>
                            <i className="bi bi-database me-2" /> Explorar Dados
                        </Link>
                        <Link to='/multimedia' className='btn btn-outline-light btn-lg'>
                            <i className="bi bi-play-btn me-2" /> Espaço multimídia
                        </Link>
                    </div>
                </div>
            </Header>

            <div className="container py-4">
                <div className="card bg-light border-0 shadow-sm mb-4">
                    <div className="card-body d-flex flex-column flex-md-row align-items-center gap-4">
                        <div className="flex-fill">
                            <h4 className="mb-2">Resumo do projeto</h4>
                            <p className="mb-0 text-muted fs-6" style={{ lineHeight: 1.6 }}>
                                O Observatório sistematiza e publica dados e análises sobre políticas de acesso e permanência estudantil
                                (Lei n. 12.711/2012 e PNAES). Aqui você encontra bancos de dados provenientes do SUAP e Nilo Peçanha,
                                referências bibliográficas, material multimídia e ferramentas para explorar e correlacionar informações.
                            </p>
                        </div>

                        <div className="text-center" style={{ minWidth: 240 }}>
                            <small className="text-uppercase text-muted">Atividades</small>
                            <ul className="list-unstyled mb-0 mt-2">
                                <li className="mb-2"><i className="bi bi-search me-2 text-primary"></i><span className="text-muted">Pesquisar e filtrar registros</span></li>
                                <li className="mb-2"><i className="bi bi-bar-chart-line me-2 text-success"></i><span className="text-muted">Visualizar gráficos e análises</span></li>
                                <li><i className="bi bi-play-btn me-2 text-danger"></i><span className="text-muted">Assistir entrevistas e podcasts</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                    <Counter counter={campusCount ?? 0} description="Campus analisados" />
                    <Counter counter={coursesCount ?? 0} description="Cursos analisados" />
                    <Counter counter={rowsCount ?? 0} description="Linhas no banco de dados" />
                </div>
            </div>

            <section className='container py-4'>
                <div className='row row-cols-1 row-cols-md-3 g-4'>
                    <LinkCard icon="bi-database" title="Banco de dados" text="Acesse os registros extraídos do SUAP e Nilo Peçanha. Filtre por campus, curso, forma de ingresso e cotas." btnText="Acessar" link="/database" />
                    <LinkCard icon="bi-play-btn" title="Espaço multimídia" text="Entrevistas, vídeos e podcasts produzidos pela equipe. Explore e filtre por tipo e data." btnText="Explorar" link="/multimedia" />
                    <LinkCard icon="bi-people" title="Equipe / Membros" text="Conheça os membros do Observatório, suas pesquisas e contribuições." btnText="Ver membros" link="/about" />
                </div>
            </section>

            <section className='container py-4'>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h4>Fundamentação e objetivos</h4>
                        <p className="text-justify">
                            Estudos sobre políticas de ações afirmativas e apoio à permanência têm se intensificado nas últimas décadas.
                            O projeto articula bases de dados, referências bibliográficas, metodologia e ferramentas interativas para
                            apoiar a avaliação da Lei 12.711/2012 e do PNAES no âmbito do IFSP. A plataforma disponibiliza dados,
                            textos explicativos, produção acadêmica e um espaço multimídia para divulgação das iniciativas do grupo.
                        </p>

                        <h5 className="mt-3">Objetivos</h5>
                        <ul>
                            <li>Construir uma plataforma online para sistematização de dados e análises sobre acesso e permanência.</li>
                            <li>Publicizar bancos de dados, referências e material multimídia produzidos pela equipe.</li>
                            <li>Oferecer ferramentas de visualização para a comunidade e gestores públicos.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
