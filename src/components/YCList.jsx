import React, { useState, useMemo } from 'react';
import startupsData from '../data/yc_startups.json';
import './YCList.css';

const YCList = ({ statuses, onUpdateStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [batchFilter, setBatchFilter] = useState('All');
    const [visibleCount, setVisibleCount] = useState(50);

    const filteredStartups = useMemo(() => {
        return startupsData.filter(startup => {
            const matchesSearch =
                startup.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                startup.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                startup.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesBatch = batchFilter === 'All' || startup.batch === batchFilter;

            return matchesSearch && matchesBatch;
        });
    }, [searchTerm, batchFilter]);

    const batches = useMemo(() => {
        const uniqueBatches = [...new Set(startupsData.map(s => s.batch))];
        return ['All', ...uniqueBatches.sort().reverse()];
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Email copied to clipboard!');
    };

    return (
        <div className="yc-hub">
            <header className="page-header">
                <h1>YC Startup <span className="highlight">Hub</span></h1>
                <p className="subtitle">Browse {startupsData.length} YC startups and track your outreach</p>
            </header>

            <div className="list-controls">
                <div className="search-group" style={{ flex: 1, marginRight: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search company, name, or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setVisibleCount(50);
                        }}
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="filter-group">
                    <select value={batchFilter} onChange={(e) => {
                        setBatchFilter(e.target.value);
                        setVisibleCount(50);
                    }}>
                        {batches.map(batch => (
                            <option key={batch} value={batch}>{batch}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="startup-grid">
                {filteredStartups.slice(0, visibleCount).map(startup => {
                    const status = statuses[startup.id] || { emailed: false, followup: false };

                    return (
                        <div key={startup.id} className={`startup-card glass-panel ${status.emailed ? 'emailed' : ''}`}>
                            <div className="startup-info">
                                <div className="startup-header">
                                    <h3>{startup.company}</h3>
                                    <span className="batch-badge">{startup.batch}</span>
                                </div>
                                <p className="contact-name">{startup.contactName}</p>
                                <div className="email-row">
                                    <code className="contact-email">{startup.contactEmail}</code>
                                    {startup.contactEmail !== 'TBD' && (
                                        <button
                                            className="copy-btn"
                                            onClick={() => copyToClipboard(startup.contactEmail)}
                                            title="Copy Email"
                                        >
                                            📋
                                        </button>
                                    )}
                                </div>
                                {startup.website && (
                                    <a href={startup.website} target="_blank" rel="noopener noreferrer" className="website-link">
                                        View Website ↗
                                    </a>
                                )}
                            </div>

                            <div className="startup-actions">
                                <button
                                    className={`action-btn ${status.emailed ? 'active' : ''}`}
                                    onClick={() => onUpdateStatus(startup.id, 'emailed', !status.emailed)}
                                >
                                    {status.emailed ? '✓ Email Sent' : 'Mark Email Sent'}
                                </button>
                                <button
                                    className={`action-btn ${status.followup ? 'active' : ''}`}
                                    onClick={() => onUpdateStatus(startup.id, 'followup', !status.followup)}
                                >
                                    {status.followup ? '✓ Followup Sent' : 'Mark Followup'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {visibleCount < filteredStartups.length && (
                <div className="load-more-container">
                    <button className="load-more-btn glass-panel" onClick={() => setVisibleCount(prev => prev + 50)}>
                        Load More Startups ({filteredStartups.length - visibleCount} remaining)
                    </button>
                </div>
            )}

            {filteredStartups.length === 0 && (
                <p className="empty-msg">No startups found matching your search.</p>
            )}
        </div>
    );
};

export default YCList;
