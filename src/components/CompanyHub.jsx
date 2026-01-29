import React, { useState } from 'react';
import './CompanyHub.css';

const CompanyHub = ({ companies, onAddCompany, onDeleteCompany }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newCompany, setNewCompany] = useState({ name: '', careerLink: '' });

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newCompany.name) return;
        onAddCompany({ ...newCompany, id: Date.now().toString() });
        setNewCompany({ name: '', careerLink: '' });
        setShowForm(false);
    };

    return (
        <div className="company-hub">
            <header className="page-header">
                <div className="header-with-action">
                    <h1>Company <span className="highlight">Hub</span></h1>
                    <button className="add-company-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Close' : '+ Add Company'}
                    </button>
                </div>
                <p className="subtitle">Track career pages and corporate websites</p>
            </header>

            {showForm && (
                <form className="quick-add-form glass-panel" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-field">
                            <label>Company Name</label>
                            <input
                                placeholder="e.g. Google"
                                value={newCompany.name}
                                onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <label>Career Page Link</label>
                            <input
                                type="url"
                                placeholder="https://google.com/careers"
                                value={newCompany.careerLink}
                                onChange={e => setNewCompany({ ...newCompany, careerLink: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-rec-btn">Save Company</button>
                </form>
            )}

            <div className="list-controls" style={{ marginTop: '2rem' }}>
                <div className="search-group" style={{ flex: 1 }}>
                    <input
                        type="text"
                        placeholder="Search companies by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            <div className="companies-grid">
                {filteredCompanies.length > 0 ? (
                    filteredCompanies.map(company => (
                        <div key={company.id} className="company-card glass-panel">
                            <div className="company-info">
                                <h3>{company.name}</h3>
                                {company.careerLink ? (
                                    <a href={company.careerLink} target="_blank" rel="noopener noreferrer" className="career-link-btn">
                                        🌐 Career Page
                                    </a>
                                ) : (
                                    <span className="muted-text">No link provided</span>
                                )}
                            </div>
                            <button className="delete-icon-btn" onClick={() => onDeleteCompany(company.id)}>
                                🗑️
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-msg">
                        <p>{searchTerm ? "No companies match your search." : "Start by adding companies you're interested in!"}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyHub;
