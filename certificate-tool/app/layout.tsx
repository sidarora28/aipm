import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'JustAnotherPM — Certificates',
  description: 'Collect your certificate of completion.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const globalCss = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #1f2124;
    background: #fdfcf7;
    line-height: 1.5;
  }
  a { color: inherit; }
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: globalCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
