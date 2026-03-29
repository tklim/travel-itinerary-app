export default function NotFound() {
  return (
    <div className="auth-shell">
      <div className="panel auth-card stack">
        <span className="eyebrow">Not found</span>
        <h1 className="hero-title" style={{ fontSize: "2.2rem", maxWidth: "none" }}>
          This page does not exist.
        </h1>
        <p className="hero-copy">
          Try going back to the main itinerary or, if you are an organizer, return to the admin overview.
        </p>
      </div>
    </div>
  );
}
