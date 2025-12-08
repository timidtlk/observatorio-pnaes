import { type ReactNode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface Props {
    children?: ReactNode,
    title: string
}

function Header({ children, title }: Props) {
    return (
        <section className='container-fluid p-5 bg-dark text-white text-center'>
            <h1 className='display-3'>{title}</h1>
            {children}
        </section>
    )
}

export default Header