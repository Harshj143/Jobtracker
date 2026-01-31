import React, { useState, useMemo } from 'react';
import ycData from '../data/yc_startups.json';
import './YCList.css';

const ITEMS_PER_PAGE = 50;

const YCList = ({ contactedIds, onToggleContacted }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('All');

    const filteredData = useMemo(() => {
        return ycData.filter(item => {
            const matchesSearch =
                item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter =
                filter === 'All' ||
                (filter === 'Contacted' && contactedIds.includes(item.id)) ||
                (filter === 'Pending' && !contactedIds.includes(item.id));

            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, filter, contactedIds]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="yc-list-page">
            <header className="page-header">
                <h1>YC <span className="highlight">Startups</span></h1>
                <p className="subtitle">Browse {ycData.length} YC startups and track your outreach</p>
            </header>

            <div className="list-controls yc-controls">
                <div className="search-group">
                    <input
                        type="text"
                        placeholder="Search company, name or email..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="filter-group">
                    <select value={filter} onChange={handleFilterChange}>
                        <option value="All">All Companies</option>
                        <option value="Contacted">Emailed</option>
                        <option value="Pending">Not Emailed</option>
                    </select>
                </div>
            </div>

            <div className="yc-table-container glass-panel">
                <table className="yc-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Batch</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Website</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map(item => (
                                <tr key={item.id} className={contactedIds.includes(item.id) ? 'row-contacted' : ''}>
                                    <td>
                                        <div className="company-info">
                                            <span className="company-name">{item.company}</span>
                                        </div>
                                    </td>
                                    <td><span className="batch-tag">{item.batch}</span></td>
                                    <td>{item.contactName}</td>
                                    <td>
                                        {item.contactEmail !== 'TBD' ? (
                                            <a href={`mailto:${item.contactEmail}`} className="email-link">
                                                {item.contactEmail}
                                            </a>
                                        ) : (
                                            <span className="text-muted">TBD</span>
                                        )}
                                    </td>
                                    <td>
                                        {item.website ? (
                                            <a href={item.website} target="_blank" rel="noopener noreferrer" className="web-link">
                                                Visit ↗
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        <span className={`status-pill ${item.status.toLowerCase()}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={`contact-btn ${contactedIds.includes(item.id) ? 'active' : ''}`}
                                            onClick={() => onToggleContacted(item.id)}
                                        >
                                            {contactedIds.includes(item.id) ? '✅ Emailed' : '✉️ Mark Sent'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="empty-row">No startups found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Previous
                    </button>
                    <span className="page-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default YCList;
