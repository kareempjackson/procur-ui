import Link from "next/link";

export default function LotCodeNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf8f4",
        fontFamily: "'Urbanist', system-ui, sans-serif",
        color: "#1c2b23",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#fdf2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#b43c3c" strokeWidth="2" strokeLinecap="round" width={26} height={26}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>
        Lot Code Not Found
      </h1>
      <p style={{ fontSize: 14, color: "#6a7f73", margin: "0 0 28px", maxWidth: 320 }}>
        This lot code does not match any record in our traceability system. The code may be invalid or not yet registered.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "10px 24px",
          background: "#2d4a3e",
          color: "#fff",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Return to Procur
      </Link>
    </div>
  );
}
