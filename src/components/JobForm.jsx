import React, { useState } from 'react';
import './JobForm.css';

const JobForm = ({ onAddJob }) => {
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        jobLink: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        recruiterName: '',
        recruiterEmails: [],
        recruiterLinkedins: []
    });

    const [currentEmail, setCurrentEmail] = useState('');
    const [currentLinkedin, setCurrentLinkedin] = useState('');

    const handleAddEmail = () => {
        if (currentEmail && !formData.recruiterEmails.includes(currentEmail)) {
            setFormData({
                ...formData,
                recruiterEmails: [...formData.recruiterEmails, currentEmail]
            });
            setCurrentEmail('');
        }
    };

    const handleAddLinkedin = () => {
        if (currentLinkedin && !formData.recruiterLinkedins.includes(currentLinkedin)) {
            setFormData({
                ...formData,
                recruiterLinkedins: [...formData.recruiterLinkedins, currentLinkedin]
            });
            setCurrentLinkedin('');
        }
    };

    const handleRemoveEmail = (email) => {
        setFormData({
            ...formData,
            recruiterEmails: formData.recruiterEmails.filter(e => e !== email)
        });
    };

    const handleRemoveLinkedin = (linkedin) => {
        setFormData({
            ...formData,
            recruiterLinkedins: formData.recruiterLinkedins.filter(l => l !== linkedin)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.role || !formData.company) return;

        // Add any remaining text in the inputs
        const finalEmails = [...formData.recruiterEmails];
        if (currentEmail && !finalEmails.includes(currentEmail)) finalEmails.push(currentEmail);
        
        const finalLinkedins = [...formData.recruiterLinkedins];
        if (currentLinkedin && !finalLinkedins.includes(currentLinkedin)) finalLinkedins.push(currentLinkedin);

        onAddJob({
            ...formData,
            recruiterEmails: finalEmails,
            recruiterLinkedins: finalLinkedins,
            id: Date.now().toString(),
            dateAdded: new Date().toISOString(),
            statusLastUpdated: new Date().toISOString(),
            lastContactedDate: null,
            receivedResponse: false
        });

        setFormData({
            role: '',
            company: '',
            jobLink: '',
            status: 'Applied',
            appliedDate: new Date().toISOString().split('T')[0],
            recruiterName: '',
            recruiterEmails: [],
            recruiterLinkedins: []
        });
        setCurrentEmail('');
        setCurrentLinkedin('');
    };

    return (
        <form className="job-form glass-panel" onSubmit={handleSubmit}>
            <h2 className="form-title">Add New Application</h2>
            <div className="form-grid">
                <div className="input-group">
                    <label>Job Role *</label>
                    <input
                        type="text"
                        placeholder="e.g. Frontend Engineer"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Company *</label>
                    <input
                        type="text"
                        placeholder="e.g. Google"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Job Link</label>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={formData.jobLink}
                        onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label>Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offered">Offered</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Applied Date</label>
                    <input
                        type="date"
                        value={formData.appliedDate}
                        onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label>Recruiter Name</label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.recruiterName}
                        onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label>Recruiter Emails</label>
                    <div className="multi-input-container">
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={currentEmail}
                            onChange={(e) => setCurrentEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                        />
                        <button type="button" onClick={handleAddEmail} className="add-input-btn">Add</button>
                    </div>
                    <div className="contact-tags">
                        {formData.recruiterEmails.map(email => (
                            <span key={email} className="contact-tag">
                                {email}
                                <button type="button" onClick={() => handleRemoveEmail(email)}>×</button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="input-group">
                    <label>Recruiter LinkedIn</label>
                    <div className="multi-input-container">
                        <input
                            type="url"
                            placeholder="https://linkedin.com/in/..."
                            value={currentLinkedin}
                            onChange={(e) => setCurrentLinkedin(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLinkedin())}
                        />
                        <button type="button" onClick={handleAddLinkedin} className="add-input-btn">Add</button>
                    </div>
                    <div className="contact-tags">
                        {formData.recruiterLinkedins.map(linkedin => (
                            <span key={linkedin} className="contact-tag">
                                {linkedin.length > 25 ? linkedin.substring(0, 25) + '...' : linkedin}
                                <button type="button" onClick={() => handleRemoveLinkedin(linkedin)}>×</button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <button type="submit" className="submit-btn">Add Application</button>
        </form>
    );
};

export default JobForm;
