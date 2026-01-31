import React, { useState, useEffect } from 'react';
import JobForm from './components/JobForm';
import JobCard from './components/JobCard';
import Sidebar from './components/Sidebar';
import RecruiterList from './components/RecruiterList';
import JobDetailModal from './components/JobDetailModal';
import CompanyHub from './components/CompanyHub';
import QuickLinks from './components/QuickLinks';
import Settings from './components/Settings';
import StartupHub from './components/StartupHub';
import { supabase } from './supabaseClient';
import './index.css';

function App() {
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem('jobTracker_jobs');
    return savedJobs ? JSON.parse(savedJobs) : [];
  });

  const [manualRecruiters, setManualRecruiters] = useState(() => {
    const savedRecs = localStorage.getItem('jobTracker_manualRecs');
    return savedRecs ? JSON.parse(savedRecs) : [];
  });

  const [companies, setCompanies] = useState(() => {
    const savedCos = localStorage.getItem('jobTracker_companies');
    return savedCos ? JSON.parse(savedCos) : [];
  });

  const [quickLinks, setQuickLinks] = useState(() => {
    const savedLinks = localStorage.getItem('jobTracker_quickLinks');
    return savedLinks ? JSON.parse(savedLinks) : [];
  });

  const [sentEmails, setSentEmails] = useState(() => {
    const saved = localStorage.getItem('jobTracker_sentEmails');
    return saved ? JSON.parse(saved) : [];
  });

  const [supabaseConfig, setSupabaseConfig] = useState(() => {
    const saved = localStorage.getItem('jobTracker_supabaseConfig');
    return saved ? JSON.parse(saved) : { url: '', anonKey: '' };
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [user, setUser] = useState(null);

  // Sync with Supabase on Auth or Data change
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

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchCloudData = async () => {
      if (user && supabase) {
        const { data, error } = await supabase
          .from('user_sync')
          .select('payload')
          .eq('user_id', user.id)
          .single();

        if (data && data.payload) {
          handleImportData(data.payload);
        } else if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error fetching cloud data:', error);
        }
      }
    };
    fetchCloudData();
  }, [user]);

  // Push updates to Supabase (Debounced)
  useEffect(() => {
    const pushTimer = setTimeout(async () => {
      if (user && supabase) {
        const payload = { jobs, manualRecruiters, companies, quickLinks, sentEmails };
        const { error } = await supabase
          .from('user_sync')
          .upsert({
            user_id: user.id,
            payload,
            updated_at: new Date().toISOString()
          });

        if (error) console.error('Error pushing to cloud:', error);
      }
    }, 2000);

    return () => clearTimeout(pushTimer);
  }, [jobs, manualRecruiters, companies, quickLinks, sentEmails, user]);

  // Auto-Ghosting (30 days) and Save
  useEffect(() => {
    const checkGhosting = () => {
      const now = new Date();
      let updated = false;
      const updatedJobs = jobs.map(job => {
        if (job.status !== 'Ghosted' && job.status !== 'Rejected' && job.status !== 'Offered') {
          const lastUpdate = new Date(job.statusLastUpdated || job.dateAdded);
          const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
          if (diffDays >= 30) {
            updated = true;
            return { ...job, status: 'Ghosted', statusLastUpdated: now.toISOString() };
          }
        }
        return job;
      });
      if (updated) setJobs(updatedJobs);
    };

    checkGhosting();
    localStorage.setItem('jobTracker_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('jobTracker_manualRecs', JSON.stringify(manualRecruiters));
  }, [manualRecruiters]);

  useEffect(() => {
    localStorage.setItem('jobTracker_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('jobTracker_quickLinks', JSON.stringify(quickLinks));
  }, [quickLinks]);

  useEffect(() => {
    localStorage.setItem('jobTracker_sentEmails', JSON.stringify(sentEmails));
  }, [sentEmails]);

  useEffect(() => {
    localStorage.setItem('jobTracker_supabaseConfig', JSON.stringify(supabaseConfig));
  }, [supabaseConfig]);

  const addJob = (job) => {
    const newJob = {
      ...job,
      receivedResponse: false
    };
    setJobs([newJob, ...jobs]);
    setCurrentView('applications');
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const updateStatus = (id, newStatus) => {
    const now = new Date().toISOString();
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, status: newStatus, statusLastUpdated: now } : job
    ));
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob(prev => ({ ...prev, status: newStatus, statusLastUpdated: now }));
    }
  };

  const markAsEmailed = (id) => {
    const now = new Date().toISOString();
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, lastContactedDate: now, receivedResponse: false } : job
    ));
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob(prev => ({ ...prev, lastContactedDate: now, receivedResponse: false }));
    }
  };

  const toggleResponse = (id) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, receivedResponse: !job.receivedResponse } : job
    ));
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob(prev => ({ ...prev, receivedResponse: !prev.receivedResponse }));
    }
  };

  const updateJob = (id, newData) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, ...newData } : job));
  };

  const addManualRecruiter = (rec) => {
    setManualRecruiters([rec, ...manualRecruiters]);
  };

  const addCompany = (cos) => {
    setCompanies([cos, ...companies]);
  };

  const deleteCompany = (id) => {
    setCompanies(companies.filter(c => c.id !== id));
  };

  const addQuickLink = (link) => {
    setQuickLinks([link, ...quickLinks]);
  };

  const deleteQuickLink = (id) => {
    setQuickLinks(quickLinks.filter(l => l.id !== id));
  };

  const toggleSentEmail = (id) => {
    setSentEmails(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExportData = () => {
    const backupData = {
      jobs,
      manualRecruiters,
      companies,
      quickLinks,
      sentEmails,
      version: '1.3'
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = (data) => {
    if (!data) return;

    // Duplicate detection helper
    const mergeUnique = (existing, incoming, keyFn) => {
      const existingKeys = new Set(existing.map(keyFn));
      const filteredIncoming = incoming.filter(item => !existingKeys.has(keyFn(item)));
      return [...filteredIncoming, ...existing]; // Keep incoming at top if desired
    };

    if (data.jobs) {
      setJobs(prev => mergeUnique(prev, data.jobs, j => `${j.company}-${j.role}`));
    }
    if (data.manualRecruiters) {
      setManualRecruiters(prev => mergeUnique(prev, data.manualRecruiters, r => `${r.name}-${r.email}`));
    }
    if (data.companies) {
      setCompanies(prev => mergeUnique(prev, data.companies, c => c.name));
    }
    if (data.quickLinks) {
      setQuickLinks(prev => mergeUnique(prev, data.quickLinks, q => q.url));
    }
    if (data.sentEmails) {
      setSentEmails(prev => Array.from(new Set([...prev, ...data.sentEmails])));
    }
  };


  const filteredJobs = jobs.filter(job => {
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const followUpJobs = jobs.filter(job => {
    if (!job.lastContactedDate || job.receivedResponse || job.status === 'Rejected' || job.status === 'Offered' || job.status === 'Ghosted') return false;
    const lastContact = new Date(job.lastContactedDate);
    const diffDays = Math.floor((new Date() - lastContact) / (1000 * 60 * 60 * 24));
    return diffDays >= 4;
  });

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === 'Applied').length,
    interviews: jobs.filter(j => j.status === 'Interviewing').length,
    offers: jobs.filter(j => j.status === 'Offered').length,
    ghosted: jobs.filter(j => j.status === 'Ghosted').length
  };

  return (
    <div className="app-wrapper">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        jobsCount={jobs.length}
        followUpCount={followUpJobs.length}
      />

      <main className="main-content">
        <div className="container">

          {currentView === 'dashboard' && (
            <div className="dashboard-view">
              <header className="page-header">
                <h1>Hunt <span className="highlight">Dashboard</span></h1>
                <p className="subtitle">Overview of your application status</p>
              </header>

              <section className="stats-grid">
                <div className="stat-card glass-panel">
                  <span className="stat-label">Total Jobs</span>
                  <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-card glass-panel">
                  <span className="stat-label" style={{ color: 'var(--status-applied)' }}>Applied</span>
                  <span className="stat-value">{stats.applied}</span>
                </div>
                <div className="stat-card glass-panel">
                  <span className="stat-label" style={{ color: 'var(--status-interviewing)' }}>Interviews</span>
                  <span className="stat-value">{stats.interviews}</span>
                </div>
                <div className="stat-card glass-panel">
                  <span className="stat-label" style={{ color: 'var(--status-ghosted)' }}>Ghosted</span>
                  <span className="stat-value">{stats.ghosted}</span>
                </div>
              </section>

              <JobForm onAddJob={addJob} />
            </div>
          )}

          {currentView === 'applications' && (
            <div className="applications-view">
              <header className="page-header">
                <h1>Job <span className="highlight">Applications</span></h1>
              </header>

              <div className="list-controls">
                <div className="search-group" style={{ flex: 1, marginRight: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Search company or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="filter-group">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">All Status</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Ghosted">Ghosted</option>
                  </select>
                </div>
              </div>

              <div className="compact-jobs-list">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={setSelectedJob}
                      onUpdateStatus={updateStatus}
                    />
                  ))
                ) : (
                  <p className="empty-msg">No applications found matching your criteria.</p>
                )}
              </div>
            </div>
          )}

          {currentView === 'followups' && (
            <div className="followups-view">
              <header className="page-header">
                <h1>Follow-up <span className="highlight">Tracking</span></h1>
                <p className="subtitle">Applications awaiting a response (4+ days)</p>
              </header>
              <div className="compact-jobs-list">
                {followUpJobs.length > 0 ? (
                  followUpJobs.map(job => (
                    <JobCard key={job.id} job={job} onClick={setSelectedJob} onUpdateStatus={updateStatus} />
                  ))
                ) : (
                  <p className="empty-msg">All set! No immediate follow-ups required.</p>
                )}
              </div>
            </div>
          )}

          {currentView === 'companies' && (
            <CompanyHub
              companies={companies}
              onAddCompany={addCompany}
              onDeleteCompany={deleteCompany}
            />
          )}

          {currentView === 'recruiters' && (
            <RecruiterList
              jobs={jobs}
              manualRecruiters={manualRecruiters}
              onAddManualRecruiter={addManualRecruiter}
            />
          )}

          {currentView === 'quicklinks' && (
            <QuickLinks
              quickLinks={quickLinks}
              onAddQuickLink={addQuickLink}
              onDeleteQuickLink={deleteQuickLink}
            />
          )}

          {currentView === 'ychub' && (
            <StartupHub
              sentEmails={sentEmails}
              onToggleSent={toggleSentEmail}
            />
          )}

          {currentView === 'settings' && (
            <Settings
              onExportData={handleExportData}
              onImportData={handleImportData}
              supabaseConfig={supabaseConfig}
              onUpdateSupabaseConfig={setSupabaseConfig}
            />
          )}

          {selectedJob && (
            <JobDetailModal
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onUpdateStatus={updateStatus}
              onMarkEmailed={markAsEmailed}
              onToggleResponse={toggleResponse}
              onDelete={deleteJob}
              onUpdateJob={updateJob}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
