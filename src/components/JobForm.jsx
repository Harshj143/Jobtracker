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
        recruiterEmail: '',
        recruiterLinkedin: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.role || !formData.company) return;

        onAddJob({
            ...formData,
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
            recruiterEmail: '',
            recruiterLinkedin: ''
        });
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
                    <label>Recruiter Email</label>
                    <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.recruiterEmail}
                        onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label>Recruiter LinkedIn</label>
                    <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={formData.recruiterLinkedin}
                        onChange={(e) => setFormData({ ...formData, recruiterLinkedin: e.target.value })}
                    />
                </div>
            </div>
            <button type="submit" className="submit-btn">Add Application</button>
        </form>
    );
};

export default JobForm;
