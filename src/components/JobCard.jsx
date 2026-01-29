import React from 'react';
import './JobCard.css';

const JobCard = ({ job, onClick, onUpdateStatus }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'applied': return 'var(--status-applied)';
            case 'interviewing': return 'var(--status-interviewing)';
            case 'offered': return 'var(--status-offered)';
            case 'rejected': return 'var(--status-rejected)';
            case 'ghosted': return 'var(--status-ghosted)';
            default: return 'var(--status-pending)';
        }
    };

    const needsFollowUp = () => {
        if (!job.lastContactedDate || job.receivedResponse || job.status === 'Rejected' || job.status === 'Offered' || job.status === 'Ghosted') return false;
        const lastContact = new Date(job.lastContactedDate);
        const now = new Date();
        const diffDays = Math.floor((now - lastContact) / (1000 * 60 * 60 * 24));
        return diffDays >= 4;
    };

    return (
        <div
            className={`job-card-summary glass-panel ${job.status === 'Ghosted' ? 'ghosted-card' : ''}`}
            onClick={() => onClick(job)}
        >
            {needsFollowUp() && (
                <div className="card-reminder-dot" title="Follow-up needed!"></div>
            )}

            <div className="card-main-info">
                <h3>{job.role}</h3>
                <p className="company-name">{job.company}</p>
                <span className="applied-date-small">Applied {job.appliedDate}</span>
            </div>

            <div className="card-right" onClick={(e) => e.stopPropagation()}>
                <div className="status-quick-update">
                    <select
                        value={job.status}
                        onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                        className="status-pill-select"
                        style={{ borderColor: getStatusColor(job.status), color: getStatusColor(job.status) }}
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offered">Offered</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Ghosted">Ghosted</option>
                    </select>
                </div>
                <div className="arrow">›</div>
            </div>
        </div>
    );
};

export default JobCard;
