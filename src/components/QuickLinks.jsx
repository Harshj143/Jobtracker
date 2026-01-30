import React, { useState } from 'react';
import './QuickLinks.css';

const QuickLinks = ({ quickLinks, onAddQuickLink, onDeleteQuickLink }) => {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [copyStatus, setCopyStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) return;

        let validUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            validUrl = 'https://' + url;
        }

        onAddQuickLink({
            id: Date.now().toString(),
            url: validUrl,
            title: title || url,
            dateAdded: new Date().toISOString()
        });

        setUrl('');
        setTitle('');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopyStatus('Copied link!');
        setTimeout(() => setCopyStatus(''), 2000);
    };

    return (
        <div className="quick-links-page">
            <header className="page-header">
                <h1>Apply <span className="highlight">Later</span></h1>
                <p className="subtitle">Save interesting job links to apply later</p>
            </header>

            <form className="quick-links-form glass-panel" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="input-group" style={{ flex: 1 }}>
                        <label>Job Title (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. Senior Frontend at Google"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="input-group" style={{ flex: 2 }}>
                        <label>Job Link *</label>
                        <input
                            type="text"
                            placeholder="https://linked.com/jobs/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="add-link-btn">Save Link</button>
                </div>
            </form>

            <div className="links-grid">
                {quickLinks.length > 0 ? (
                    quickLinks.map(link => (
                        <div key={link.id} className="link-card glass-panel">
                            <div className="link-content">
                                <h3>{link.title}</h3>
                                <p className="link-url">{link.url}</p>
                                <span className="date-added">Added on {new Date(link.dateAdded).toLocaleDateString()}</span>
                            </div>
                            <div className="link-actions">
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="action-btn open-btn">Open 🔗</a>
                                <button className="action-btn copy-btn" onClick={() => copyToClipboard(link.url)}>Copy 📋</button>
                                <button className="delete-btn" onClick={() => onDeleteQuickLink(link.id)}>Remove</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state glass-panel">
                        <p>No saved links yet. Found a job you like? Paste the link above to save it!</p>
                    </div>
                )}
            </div>

            {copyStatus && <div className="toast">{copyStatus}</div>}
        </div>
    );
};

export default QuickLinks;
