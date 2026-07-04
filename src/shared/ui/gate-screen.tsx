export function GateScreen({ title, copy }: { title: string; copy: string }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: 'min(100%, 460px)',
          padding: 24,
          borderRadius: 20,
          border: '1px solid rgba(188, 201, 198, 0.9)',
          background: 'rgba(255, 255, 255, 0.92)',
          boxShadow: '0 1px 0 rgba(18, 28, 42, 0.06)',
          textAlign: 'center',
        }}
      >
        <div className="page-kicker" style={{ marginBottom: 12 }}>
          Loading
        </div>
        <h1 className="panel-title" style={{ marginBottom: 8 }}>
          {title}
        </h1>
        <p className="panel-copy" style={{ margin: 0 }}>
          {copy}
        </p>
      </div>
    </main>
  );
}

