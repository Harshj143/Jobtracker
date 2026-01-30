import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Settings.css';

const Settings = ({ onImportData, onExportData, supabaseConfig, onUpdateSupabaseConfig }) => {
    const fileInputRef = useRef(null);
    const [config, setConfig] = useState(supabaseConfig || { url: '', anonKey: '' });
    const [user, setUser] = useState(null);
    const [authData, setAuthData] = useState({ email: '', password: '' });
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (supabase) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                setUser(session?.user ?? null);
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });

            return () => subscription.unsubscribe();
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                onImportData(data);
                alert('Data imported successfully!');
            } catch (error) {
                alert('Error parsing backup file. Please ensure it\'s a valid JSON.');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    };

    const handleConfigSave = () => {
        onUpdateSupabaseConfig(config);
        alert('Supabase configuration updated. The page will reload to apply changes.');
        window.location.reload();
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        if (!supabase) return alert('Please configure Supabase first.');

        setLoading(true);
        const { error } = authMode === 'login'
            ? await supabase.auth.signInWithPassword(authData)
            : await supabase.auth.signUp(authData);

        if (error) alert(error.message);
        else if (authMode === 'signup') alert('Check your email for the confirmation link!');

        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="settings-page">
            <header className="page-header">
                <h1>App <span className="highlight">Settings</span></h1>
                <p className="subtitle">Manage your data and synchronization</p>
            </header>

            <section className="settings-section glass-panel">
                <h2>Data Management</h2>
                <p className="section-desc">
                    Backup your data to a JSON file or restore from a previous backup.
                    Duplicates will be skipped during import.
                </p>

                <div className="settings-actions">
                    <button className="settings-btn export-btn" onClick={onExportData}>
                        <span className="icon">📥</span> Export Backup
                    </button>

                    <div className="import-wrapper">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            style={{ display: 'none' }}
                        />
                        <button className="settings-btn import-btn" onClick={() => fileInputRef.current.click()}>
                            <span className="icon">📤</span> Import Backup
                        </button>
                    </div>
                </div>
            </section>

            <section className="settings-section glass-panel supabase-section">
                <h2>Cloud Sync (Supabase)</h2>
                <p className="section-desc">
                    Connect to your Supabase project to sync data across all your devices.
                </p>

                <div className="supabase-config-grid">
                    <div className="input-field">
                        <label>Supabase URL</label>
                        <input
                            type="text"
                            placeholder="https://your-project.supabase.co"
                            value={config.url}
                            onChange={(e) => setConfig({ ...config, url: e.target.value })}
                        />
                    </div>
                    <div className="input-field">
                        <label>Anon Key</label>
                        <input
                            type="password"
                            placeholder="your-anon-key"
                            value={config.anonKey}
                            onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
                        />
                    </div>
                </div>
                <button className="settings-btn" onClick={handleConfigSave}>Save Configuration</button>

                {supabase && (
                    <div className="auth-section">
                        <hr className="divider" />
                        {user ? (
                            <div className="user-info">
                                <p>Logged in as: <strong>{user.email}</strong></p>
                                <button className="settings-btn logout-btn" onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <form className="auth-form" onSubmit={handleAuth}>
                                <h3>{authMode === 'login' ? 'Login' : 'Sign Up'} for Sync</h3>
                                <div className="input-field">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={authData.email}
                                        onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={authData.password}
                                        onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="auth-actions">
                                    <button type="submit" className="settings-btn login-submit-btn" disabled={loading}>
                                        {loading ? 'Processing...' : (authMode === 'login' ? 'Login' : 'Sign Up')}
                                    </button>
                                    <button
                                        type="button"
                                        className="text-btn"
                                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                    >
                                        {authMode === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                                    </button>
                                </div>
                            </form>
                        ) || (
                            <p className="status-msg warning">Configure Supabase and save to enable login.</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Settings;
