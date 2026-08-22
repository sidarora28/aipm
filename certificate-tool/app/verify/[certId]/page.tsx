import { findByCertId } from '@/lib/members';
import { cohortConfig } from '@/lib/cohorts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Public verification. Shows the holder's name and cohort — plus the course
 * name and completion date, which are properties of the cohort rather than of
 * the person. The email is never read into this page.
 */
export default async function VerifyPage({
  params,
}: {
  params: Promise<{ certId: string }>;
}) {
  const { certId } = await params;
  const row = await findByCertId(certId);
  const config = row ? cohortConfig(row.cohort) : null;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <p style={styles.brand}>JUSTANOTHERPM</p>
        {row && config ? (
          <>
            <p style={styles.label}>This credential is valid.</p>
            <h1 style={styles.name}>{row.name}</h1>
            <p style={styles.detail}>
              Completed Cohort #{row.cohort} of {config.courseName}
            </p>
            <p style={styles.detail}>{config.completionDate}</p>
            <p style={styles.credential}>Credential ID · {row.certId}</p>
          </>
        ) : (
          <>
            <p style={styles.label}>No such credential.</p>
            <p style={styles.detail}>
              We could not find a certificate with the ID <strong>{certId}</strong>.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px 20px' },
  card: {
    width: '100%',
    maxWidth: 520,
    background: '#fff',
    border: '1px solid #eee6cd',
    borderRadius: 16,
    padding: '40px 32px',
    textAlign: 'center',
    boxShadow: '0 12px 40px rgba(0,0,0,0.05)',
  },
  brand: { margin: 0, fontSize: 12, letterSpacing: '0.14em', color: '#a08320', fontWeight: 700 },
  label: { margin: '18px 0 6px', color: '#666', fontSize: 14 },
  name: { margin: '0 0 12px', fontSize: 30, fontWeight: 700 },
  detail: { margin: '0 0 4px', color: '#444' },
  credential: { marginTop: 20, fontSize: 13, color: '#888', letterSpacing: '0.06em' },
};
