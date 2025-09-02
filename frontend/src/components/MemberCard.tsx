import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import type { IMember } from '../api/Utils';
import { API_URI } from '../api/MembersService';

function MemberCard({ name, photoUrl, description, lattes, email }: IMember) {
    return (
        <div className="card h-100 shadow-sm mx-auto" style={{ maxWidth: 350 }}>
            <img src={API_URI + "/image/" + photoUrl} alt={name} className="card-img-top" style={{ objectFit: 'cover', height: '280px' }} />
            <div className="card-body text-center">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
            </div>
            <div className="card-footer bg-white border-0 text-center">
                <a href={lattes} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm me-2">
                    <i className="bi bi-mortarboard"></i> Currículo Lattes
                </a>
                <a href={`mailto:${email}`} className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-envelope"></i> E-mail
                </a>
            </div>
        </div>
    );
}

export default MemberCard;