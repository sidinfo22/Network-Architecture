import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: true,
    me: null,
    analytics: null,
    submissions: [],
    error: '',
  });

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        const meResponse = await fetch('/api/admin/me', { credentials: 'include' });
        if (meResponse.status === 401) {
          navigate('/admin/login');
          return;
        }

        const me = await meResponse.json();
        const [analyticsResponse, submissionsResponse] = await Promise.all([
          fetch('/api/admin/analytics', { credentials: 'include' }),
          fetch('/api/admin/submissions', { credentials: 'include' }),
        ]);

        const analytics = await analyticsResponse.json();
        const submissions = await submissionsResponse.json();

        if (!ignore) {
          setState({
            loading: false,
            me,
            analytics,
            submissions: submissions.submissions || [],
            error: '',
          });
        }
      } catch (error) {
        if (!ignore) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error.message || 'Unable to load dashboard.',
          }));
        }
      }
    }

    loadDashboard();
    return () => {
      ignore = true;
    };
  }, [navigate]);

  async function handleLogout() {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/admin/login');
  }

  if (state.loading) {
    return (
      <main className="admin-shell">
        <section className="admin-card">
          <h1>Loading Dashboard...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <section className="admin-card">
        <div className="admin-header-row">
          <div>
            <p className="admin-eyebrow">Admin Dashboard</p>
            <h1>Summit Care Admin Panel</h1>
            <p className="admin-copy">
              Signed in as {state.me?.username || 'admin'}.
            </p>
          </div>
          <button className="admin-button admin-button-secondary" onClick={handleLogout} type="button">
            Log Out
          </button>
        </div>

        {state.error ? <p className="admin-error">{state.error}</p> : null}

        <section className="admin-stats-grid">
          <article className="admin-stat-card">
            <h2>Total Submissions</h2>
            <strong>{state.analytics?.summary?.submissionCount ?? 0}</strong>
          </article>
          <article className="admin-stat-card">
            <h2>Total Page Views</h2>
            <strong>{state.analytics?.summary?.pageViewCount ?? 0}</strong>
          </article>
          <article className="admin-stat-card">
            <h2>Most Viewed Page</h2>
            <strong>{state.analytics?.summary?.topPage || 'No data yet'}</strong>
          </article>
        </section>

        <section className="admin-section">
          <h2>Recent Submissions</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {state.submissions.length === 0 ? (
                  <tr>
                    <td colSpan="5">No submissions yet.</td>
                  </tr>
                ) : (
                  state.submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{submission.name}</td>
                      <td>{submission.email}</td>
                      <td>{submission.subject}</td>
                      <td>{submission.message}</td>
                      <td>{new Date(submission.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-section">
          <h2>Page Analytics</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {(state.analytics?.pages || []).map((page) => (
                  <tr key={page.path}>
                    <td>{page.path}</td>
                    <td>{page.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
