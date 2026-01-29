import React, { useState, useEffect } from 'react';
import JobForm from './components/JobForm';
import JobCard from './components/JobCard';
import Sidebar from './components/Sidebar';
import RecruiterList from './components/RecruiterList';
import JobDetailModal from './components/JobDetailModal';
import CompanyHub from './components/CompanyHub';
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

  const [currentView, setCurrentView] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

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
