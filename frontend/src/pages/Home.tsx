import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import LinkCard from '../components/LinkCard';
import Counter from '../components/Counter';

function Home() {
    return (
        <>
            <section className='container-fluid p-5 bg-dark text-white text-center'>
                <h1 className='display-1'>Observatório do PNAES</h1>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                <Link to='' className='btn btn-primary btn-lg mt-4'>
                    <i className="bi bi-database" /> Explorar Dados
                </Link>
            </section>

            <section className='container py-5'>
                <div className='row g-4'>
                    <LinkCard icon="bi-database" title="Banco de dados" text="Lorem ipsum dolor sit amet consectetur adipisicing elit" btnText="Acessar" link="#" />
                    <LinkCard icon="bi-play-btn" title="Espaço multimídia" text="Lorem ipsum dolor sit amet consectetur adipisicing elit" btnText="Explorar" link="#" />
                    <LinkCard icon="bi-bar-chart" title="Gráficos" text="Lorem ipsum dolor sit amet consectetur adipisicing elit" btnText="Conferir" link="#" />
                </div>
            </section>

            <section className='container py-5'>
                <div className='row g-4'>
                    <Counter counter={256} description='Lorem ipsum' />
                    <Counter counter={512} description='Dolor sit' />
                    <Counter counter={128} description='Amet consectetur' />
                </div>
            </section>
        </>
    )
}

export default Home