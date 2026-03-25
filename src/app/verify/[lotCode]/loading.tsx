export default function VerifyLotLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf8f4",
        fontFamily: "'Urbanist', system-ui, sans-serif",
      }}
    >
      <div style={{ background: "#2d4a3e", height: 48 }} />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "28px 20px" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid #ebe7df",
              borderRadius: 14,
              padding: 22,
              marginBottom: 14,
              animation: "pulse 1.5s infinite",
            }}
          >
            <div style={{ height: 10, width: 80, background: "#f0ece6", borderRadius: 4, marginBottom: 12 }} />
            <div style={{ height: 22, width: "60%", background: "#f5f1ea", borderRadius: 6, marginBottom: 10 }} />
            <div style={{ height: 14, width: "40%", background: "#f5f1ea", borderRadius: 6 }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  );
}
