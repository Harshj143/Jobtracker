import React, { useState } from 'react';
import './RecruiterList.css';

const RecruiterList = ({ jobs, manualRecruiters, onAddManualRecruiter }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRec, setNewRec] = useState({ name: '', company: '', email: '', linkedin: '' });

    // Merge recruiters from jobs and manual list
    const recruitersFromJobs = jobs
        .filter(job => job.recruiterName || job.recruiterEmails?.length > 0 || job.recruiterLinkedins?.length > 0 || job.recruiterEmail || job.recruiterLinkedin)
        .map(job => {
            const emails = Array.isArray(job.recruiterEmails) ? job.recruiterEmails : (job.recruiterEmail ? [job.recruiterEmail] : []);
            const linkedins = Array.isArray(job.recruiterLinkedins) ? job.recruiterLinkedins : (job.recruiterLinkedin ? [job.recruiterLinkedin] : []);

            return {
                name: job.recruiterName,
                emails: emails,
                linkedins: linkedins,
                // Keep for legacy display/compatibility
                email: emails[0] || '',
                linkedin: linkedins[0] || '',
                company: job.company,
                id: `job-${job.id}`,
                source: 'application'
            };
        });

    const rawRecruiters = [...manualRecruiters.map(r => ({ ...r, source: 'manual' })), ...recruitersFromJobs];

    // Duplicate Detection logic
    const checkDuplicates = (list) => {
        return list.map((rec, index) => {
            const isDuplicate = list.some((other, otherIdx) => {
                if (index === otherIdx) return false;
                // Match by email if available
                if (rec.email && other.email && rec.email.toLowerCase() === other.email.toLowerCase()) return true;
                // Match by name if available
                if (rec.name && other.name && rec.name.toLowerCase() === other.name.toLowerCase()) return true;
                return false;
            });
            return { ...rec, isDuplicate };
        });
    };

    const allRecruiters = checkDuplicates(rawRecruiters);

    const [copyStatus, setCopyStatus] = useState('');

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopyStatus(`Copied ${type}!`);
        setTimeout(() => setCopyStatus(''), 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newRec.name && !newRec.company) return;
        onAddManualRecruiter({ ...newRec, id: `manual-${Date.now()}` });
        setNewRec({ name: '', company: '', email: '', linkedin: '' });
        setShowAddForm(false);
    };

    return (
        <div className="recruiter-page">
            <header className="page-header">
                <div className="header-with-action">
                    <h1>Recruiter <span className="highlight">Directory</span></h1>
                    <button className="add-rec-btn" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? 'Close Form' : '+ Add Recruiter'}
                    </button>
                </div>
            </header>

            {showAddForm && (
                <form className="quick-add-form glass-panel" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-field">
                            <label>Name</label>
                            <input
                                placeholder="Full Name"
                                value={newRec.name}
                                onChange={e => setNewRec({ ...newRec, name: e.target.value })}
                            />
                        </div>
                        <div className="input-field">
                            <label>Company</label>
                            <input
                                placeholder="Company Name"
                                value={newRec.company}
                                onChange={e => setNewRec({ ...newRec, company: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-field">
                            <label>Email</label>
                            <input
                                placeholder="Email Address"
                                value={newRec.email}
                                onChange={e => setNewRec({ ...newRec, email: e.target.value })}
                            />
                        </div>
                        <div className="input-field">
                            <label>LinkedIn Profile URL</label>
                            <input
                                placeholder="https://linkedin.com/in/..."
                                value={newRec.linkedin}
                                onChange={e => setNewRec({ ...newRec, linkedin: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-rec-btn">Save Recruiter</button>
                </form>
            )}

            {copyStatus && <div className="toast">{copyStatus}</div>}

            <div className="recruiters-grid">
                {allRecruiters.length > 0 ? (
                    allRecruiters.map((rec, index) => (
                        <div key={`${rec.id}-${index}`} className={`recruiter-card glass-panel ${rec.isDuplicate ? 'duplicate-flag' : ''}`}>
                            {rec.isDuplicate && (
                                <div className="warning-badge">⚠️ Duplicate Entry</div>
                            )}

                            <div className="rec-info">
                                <div className="name-row">
                                    <h3>{rec.name || 'Anonymous'}</h3>
                                    <span className="source-tag">{rec.source}</span>
                                </div>
                                <p className="company-tag">{rec.company || 'Unknown Company'}</p>
                            </div>

                            <div className="rec-actions">
                                {rec.emails && rec.emails.length > 0 ? rec.emails.map((email, i) => (
                                    <div className="action-row" key={`${email}-${i}`}>
                                        <span className="email-text">{email}</span>
                                        <button className="copy-icon-btn" onClick={() => copyToClipboard(email, 'email')}>📋</button>
                                    </div>
                                )) : rec.email && (
                                    <div className="action-row">
                                        <span className="email-text">{rec.email}</span>
                                        <button className="copy-icon-btn" onClick={() => copyToClipboard(rec.email, 'email')}>📋</button>
                                    </div>
                                )}

                                {rec.linkedins && rec.linkedins.length > 0 ? rec.linkedins.map((link, i) => (
                                    <div className="action-row" key={`${link}-${i}`}>
                                        <span className="linkedin-text">LinkedIn Profile {rec.linkedins.length > 1 ? i + 1 : ''}</span>
                                        <div className="rec-link-group">
                                            <a href={link} target="_blank" rel="noopener noreferrer" className="nav-link-btn">🔗 View</a>
                                            <button className="copy-icon-btn" onClick={() => copyToClipboard(link, 'LinkedIn')}>📋</button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="action-row">
                                        <span className="linkedin-text">{rec.linkedin ? 'LinkedIn Profile' : 'No LinkedIn Profile'}</span>
                                        <div className="rec-link-group">
                                            {rec.linkedin && (
                                                <a href={rec.linkedin} target="_blank" rel="noopener noreferrer" className="nav-link-btn">🔗 View</a>
                                            )}
                                            {rec.linkedin && (
                                                <button className="copy-icon-btn" onClick={() => copyToClipboard(rec.linkedin, 'LinkedIn')}>📋</button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state glass-panel">
                        <p>No recruiters found. Add one manually or track them via job applications.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterList;
