'use client';

import { useState } from 'react';

type Certificate = {
  certId: string;
  name: string;
  cohort: string;
  downloadUrl: string;
  verifyUrl: string;
};

type LookupResult = { message: string; certificates: Certificate[] };

export default function Home() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setResult(null);
    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setResult((await res.json()) as LookupResult);
    } catch {
      setResult({ message: 'Something went wrong. Please try again later.', certificates: [] });
    } finally {
      setPending(false);
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <p style={styles.brand}>JUSTANOTHERPM</p>
        <h1 style={styles.heading}>Certificate of Completion</h1>
        <p style={styles.sub}>Enter the email you enrolled with.</p>

        <form onSubmit={onSubmit} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            style={styles.input}
          />
          <button type="submit" disabled={pending} style={styles.button}>
            {pending ? 'Checking…' : 'Get my certificate'}
          </button>
        </form>

        {result && (
          <section style={styles.results}>
            <p style={styles.message}>{result.message}</p>
            {result.certificates.map((cert) => (
              <article key={cert.certId} style={styles.cert}>
                <div>
                  <p style={styles.certName}>{cert.name}</p>
                  <p style={styles.certMeta}>
                    Cohort {cert.cohort} · {cert.certId}
                  </p>
                </div>
                <a href={cert.downloadUrl} style={styles.download}>
                  Download PDF
                </a>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '32px 20px',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    background: '#fff',
    border: '1px solid #eee6cd',
    borderRadius: 16,
    padding: '40px 32px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.05)',
  },
  brand: { margin: 0, fontSize: 12, letterSpacing: '0.14em', color: '#a08320', fontWeight: 700 },
  heading: { margin: '10px 0 6px', fontSize: 28, fontWeight: 700 },
  sub: { margin: '0 0 24px', color: '#666' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: {
    padding: '13px 14px',
    fontSize: 16,
    border: '1px solid #ddd',
    borderRadius: 10,
    width: '100%',
  },
  button: {
    padding: '13px 14px',
    fontSize: 16,
    fontWeight: 600,
    border: 'none',
    borderRadius: 10,
    background: '#f7d046',
    cursor: 'pointer',
  },
  results: { marginTop: 28, borderTop: '1px solid #f0f0f0', paddingTop: 20 },
  message: { margin: '0 0 16px', color: '#444' },
  cert: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '14px 16px',
    border: '1px solid #eee6cd',
    borderRadius: 12,
    marginBottom: 10,
  },
  certName: { margin: 0, fontWeight: 600 },
  certMeta: { margin: '2px 0 0', fontSize: 13, color: '#777' },
  download: { fontSize: 14, fontWeight: 600, color: '#8a6d0b', whiteSpace: 'nowrap' },
};
