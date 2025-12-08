import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import MemberCard from '../components/MemberCard';
import { getMembers } from '../api/MembersService';
import type { IMember } from '../api/Utils';
import '../styles/high-contrast.css';

const MEMBERS_PER_SLIDE = 3;

function About() {
    const [members, setMembers] = useState<IMember[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const getAllMembers = async () => {
        try {
            const { data } = await getMembers();
            setMembers(data);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllMembers();
    }, [])

    const totalSlides = Math.ceil(members.length / MEMBERS_PER_SLIDE);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    const startIdx = currentSlide * MEMBERS_PER_SLIDE;
    const visibleMembers = members.slice(startIdx, startIdx + MEMBERS_PER_SLIDE);

    return (
        <>
            <Header title='Sobre Nós'>
                <p>
                    O <strong>Observatório da Vida e Permanência Estudantil</strong> é um projeto digital dedicado a reunir, analisar e divulgar dados e informações sobre a trajetória dos estudantes no ensino superior brasileiro. Nosso objetivo é contribuir para o desenvolvimento de políticas públicas e ações institucionais que promovam o acesso, a permanência e o sucesso acadêmico, com base em evidências e análises qualificadas.
                </p>
            </Header>

            <section className="container py-5">
                <h2 className="text-center mb-5"><i className="bi bi-people-fill text-primary"></i> Equipe do Projeto</h2>
                <div className="position-relative">
                    <div className="row justify-content-center">
                        {visibleMembers.map((member, idx) => (
                            <div className="col-md-4 mb-4 d-flex" key={idx}>
                                <MemberCard {...member} />
                            </div>
                        ))}
                    </div>
                
                    <div className="d-flex justify-content-center align-items-center mt-2">
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={handlePrev}
                            aria-label="Anterior"
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <span>
                            {currentSlide + 1} / {totalSlides}
                        </span>
                        <button
                            className="btn btn-outline-primary ms-2"
                            onClick={handleNext}
                            aria-label="Próximo"
                        >
                        <i className="bi bi-chevron-right"></i>
                        </button>
                    </div> 
                </div>
            </section>

            <section className="container pb-5">
                <h3 className="text-center mb-4"><i className="bi bi-bullseye text-primary"></i> Nossa Missão</h3>
                <p className="lead text-center">
                    Promover a democratização do acesso à informação sobre a vida estudantil, apresentando pesquisas, debates e políticas que ajudem a entender as políticas de assistência aos estudantes no ensino superior.
                </p>
            </section>
        </>
    )
}

export default About