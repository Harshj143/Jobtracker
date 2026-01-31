import React, { useState, useMemo } from 'react';
import startupsData from '../data/yc_startups.json';
import './StartupHub.css';

const StartupHub = ({ sentEmails, onToggleSent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [batchFilter, setBatchFilter] = useState('All');

    const filteredStartups = useMemo(() => {
        return startupsData.filter(item => {
            const matchesSearch =
                item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesBatch = batchFilter === 'All' || item.batch === batchFilter;

            return matchesSearch && matchesBatch;
        });
    }, [searchTerm, batchFilter]);

    const batches = useMemo(() => {
        const set = new Set(startupsData.map(s => s.batch).filter(Boolean));
        return ['All', ...Array.from(set).sort().reverse()];
    }, []);

    const copyToClipboard = (text, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        // Basic feedback could be added here
        const btn = e.currentTarget;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    };

    return (
        <div className="startup-hub">
            <header className="page-header">
                <h1>YC <span className="highlight">Startup Hub</span></h1>
                <p className="subtitle">Outreach to {startupsData.length} YC founders</p>
            </header>

            <div className="hub-controls glass-panel">
                <div className="search-group">
                    <span className="icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by company, founder, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>Batch:</label>
                    <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
                        {batches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
            </div>

            <div className="hub-table-container glass-panel">
                <table className="hub-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Company</th>
                            <th>Founder</th>
                            <th>Batch</th>
                            <th>Contact Info</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStartups.map(startup => (
                            <tr key={startup.id} className={sentEmails.includes(startup.id) ? 'sent-row' : ''}>
                                <td className="status-cell">
                                    <button
                                        className={`sent-toggle ${sentEmails.includes(startup.id) ? 'active' : ''}`}
                                        onClick={() => onToggleSent(startup.id)}
                                        title={sentEmails.includes(startup.id) ? 'Unmark sent' : 'Mark as sent'}
                                    >
                                        {sentEmails.includes(startup.id) ? '📫 Sent' : '⚪ Not Sent'}
                                    </button>
                                </td>
                                <td className="company-cell">
                                    <div className="company-info">
                                        <span className="company-name">{startup.company}</span>
                                        {startup.website && (
                                            <a href={startup.website} target="_blank" rel="noreferrer" className="site-link">
                                                🔗 Visit Website
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td>{startup.fullName}</td>
                                <td><span className="batch-tag">{startup.batch}</span></td>
                                <td className="contact-cell">
                                    {startup.email && startup.email !== 'TBD' ? (
                                        <div className="email-copy-wrapper">
                                            <button
                                                className="copy-btn"
                                                onClick={(e) => copyToClipboard(startup.email, e)}
                                            >
                                                <span>📧 {startup.email}</span>
                                                <span className="copy-icon">📋</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="tbd">TBD</span>
                                    )}
                                </td>
                                <td>
                                    <a
                                        href={`mailto:${startup.email}?subject=Hello from ${startup.fullName}&body=Hi ${startup.firstName},`}
                                        className="mail-btn"
                                        onClick={() => {
                                            if (!sentEmails.includes(startup.id)) {
                                                onToggleSent(startup.id);
                                            }
                                        }}
                                    >
                                        Send Email
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStartups.length === 0 && (
                    <div className="empty-state">No startups found matching your filters.</div>
                )}
            </div>
        </div>
    );
};

export default StartupHub;
