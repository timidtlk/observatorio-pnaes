import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';

interface Props {
    icon: string,
    title: string,
    text: string,
    btnText: string,
    link: string
}

function LinkCard({ icon, title, text, btnText, link }: Props) {

    const iconClassName = `bi ${icon} display-4 text-primary mb-3`;

    return (
        <div className='col-md-4'>
            <div className="card feature-card">
                <div className="card-body text-center p-4">
                    <i className={ iconClassName }></i>
                    <h3 className="card-title">{ title }</h3>
                    <p className="card-text">{ text }</p>
                    <Link to={ link } className="btn btn-outline-primary">{ btnText }</Link>
                </div>
            </div>
        </div>
    )
}

export default LinkCard