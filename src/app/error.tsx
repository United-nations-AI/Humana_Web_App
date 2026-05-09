"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "60vh", gap: 16, padding: "0 24px",
      fontFamily: "'Space Grotesk', Arial, sans-serif", textAlign: "center",
    }}>
      <p style={{ fontSize: 15, color: "rgba(1,1,32,0.5)" }}>
        Something went wrong. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          background: "#010120", color: "#fff", border: "none",
          borderRadius: 6, padding: "10px 20px", fontSize: 13,
          fontWeight: 600, cursor: "pointer",
          fontFamily: "'Space Grotesk', Arial, sans-serif",
        }}
      >
        Try again
      </button>
    </div>
  );
}
