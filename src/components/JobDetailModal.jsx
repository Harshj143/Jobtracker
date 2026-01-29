import React, { useState, useEffect } from 'react';
import './JobDetailModal.css';

const JobDetailModal = ({ job, onClose, onUpdateStatus, onMarkEmailed, onToggleResponse, onDelete, onUpdateJob }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...job });

    useEffect(() => {
        setEditData({ ...job });
    }, [job]);

    if (!job) return null;

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

    const handleSave = () => {
        onUpdateJob(job.id, editData);
        setIsEditing(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}>×</button>

                <header className="modal-header">
                    <div className="header-main">
                        {isEditing ? (
                            <input
                                className="edit-title"
                                value={editData.role}
                                onChange={e => setEditData({ ...editData, role: e.target.value })}
                            />
                        ) : (
                            <h2>{job.role}</h2>
                        )}
                        {isEditing ? (
                            <input
                                className="edit-company"
                                value={editData.company}
                                onChange={e => setEditData({ ...editData, company: e.target.value })}
                            />
                        ) : (
                            <p className="modal-company">{job.company}</p>
                        )}
                    </div>
                    <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(job.status) }}
                    >
                        {job.status}
                    </span>
                </header>

                <div className="modal-body">
                    <div className="info-section">
                        <label>Application Details</label>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Applied on:</span>
                                {isEditing ? (
                                    <input type="date" value={editData.appliedDate} onChange={e => setEditData({ ...editData, appliedDate: e.target.value })} />
                                ) : (
                                    <span className="info-value">{job.appliedDate || new Date(job.dateAdded).toLocaleDateString()}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <span className="info-label">Link:</span>
                                {isEditing ? (
                                    <input value={editData.jobLink} onChange={e => setEditData({ ...editData, jobLink: e.target.value })} />
                                ) : (
                                    job.jobLink ? <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="modal-link">Link 🔗</a> : <span className="muted">None</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <label>Recruiter & Follow-up</label>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Recruiter Name:</span>
                                {isEditing ? (
                                    <input value={editData.recruiterName} onChange={e => setEditData({ ...editData, recruiterName: e.target.value })} />
                                ) : (
                                    <span className="info-value">{job.recruiterName || 'None'}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <span className="info-label">Recruiter Email:</span>
                                {isEditing ? (
                                    <input value={editData.recruiterEmail} onChange={e => setEditData({ ...editData, recruiterEmail: e.target.value })} />
                                ) : (
                                    <span className="info-value">{job.recruiterEmail || 'None'}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="response-tracking-section">
                        <button
                            className={`response-toggle-btn ${job.receivedResponse ? 'received' : ''}`}
                            onClick={() => onToggleResponse(job.id)}
                        >
                            {job.receivedResponse ? '🎉 Response Received' : '⏳ Awaiting Response'}
                        </button>
                        {!job.receivedResponse && job.lastContactedDate && (
                            <p className="tracking-hint">Reminder will trigger 4 days after email sent.</p>
                        )}
                    </div>
                </div>

                <footer className="modal-footer">
                    <div className="actions-left">
                        {isEditing ? (
                            <button className="save-btn" onClick={handleSave}>💾 Save Changes</button>
                        ) : (
                            <button className="edit-btn-action" onClick={() => setIsEditing(true)}>✏️ Edit Details</button>
                        )}

                        <button
                            className={`email-action-btn ${job.lastContactedDate ? 'emailed' : ''}`}
                            onClick={() => onMarkEmailed(job.id)}
                        >
                            {job.lastContactedDate ? '✅ Emailed' : '📧 Sent Email'}
                        </button>
                    </div>
                    <div className="actions-right">
                        <select
                            value={job.status}
                            onChange={(e) => onUpdateStatus(job.id, e.target.value)}
                            className="status-select-modal"
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Ghosted">Ghosted</option>
                        </select>
                        <button className="delete-btn modal-delete" onClick={() => { if (window.confirm('Delete this?')) { onDelete(job.id); onClose(); } }}>
                            Delete
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default JobDetailModal;
