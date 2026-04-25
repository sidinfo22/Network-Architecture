import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: 'admin', password: 'summitcare123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Login failed.');
      }

      navigate('/admin');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-shell">
      <section className="admin-card admin-login-card">
        <p className="admin-eyebrow">Admin Access</p>
        <h1>Summit Care Dashboard</h1>
        <p className="admin-copy">
          Review contact submissions and local site analytics from one place.
        </p>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="admin-error">{error}</p> : null}
          <button className="admin-button" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Open Dashboard'}
          </button>
        </form>
        <p className="admin-helper">Default local login: admin / summitcare123</p>
      </section>
    </main>
  );
}
