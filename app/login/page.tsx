import { redirect } from "next/navigation";

import { getSessionRole } from "@/auth";
import { loginAction } from "@/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const role = await getSessionRole();
  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "traveler") {
    redirect("/");
  }

  const params = (await searchParams) ?? {};
  const message =
    params.error === "admin"
      ? "The admin pages need the organizer passcode."
      : params.error === "invalid"
        ? "That passcode did not match this trip."
        : null;

  return (
    <div className="auth-shell">
      <div className="panel auth-card stack">
        <span className="eyebrow">Private family trip</span>
        <div className="stack" style={{ gap: 8 }}>
          <h1 className="hero-title" style={{ fontSize: "2.6rem", maxWidth: "none" }}>
            Travel itinerary access
          </h1>
          <p className="hero-copy">
            Enter the traveler passcode to view the itinerary, or the organizer passcode to edit it.
          </p>
        </div>
        <form action={loginAction} className="form-stack">
          <label className="label">
            Passcode
            <input
              className="input"
              name="passcode"
              type="password"
              placeholder="Enter trip passcode"
              autoFocus
            />
          </label>
          {message ? <p className="error-text">{message}</p> : null}
          <button className="button" type="submit">
            Open itinerary
          </button>
        </form>
        <div className="stack" style={{ gap: 10 }}>
          <h2 className="section-title" style={{ fontSize: "1.1rem" }}>
            Quick start
          </h2>
          <p className="muted" style={{ margin: 0 }}>
            1. Tap the link.
          </p>
          <p className="muted" style={{ margin: 0 }}>
            2. Type the family passcode.
          </p>
          <p className="muted" style={{ margin: 0 }}>
            3. Tap <strong style={{ color: "inherit" }}>Open itinerary</strong>.
          </p>
          <p className="muted" style={{ margin: 0 }}>
            Then tap <strong style={{ color: "inherit" }}>Home</strong>,{" "}
            <strong style={{ color: "inherit" }}>Today</strong>,{" "}
            <strong style={{ color: "inherit" }}>Schedule</strong>,{" "}
            <strong style={{ color: "inherit" }}>Flights</strong>, or{" "}
            <strong style={{ color: "inherit" }}>Stay</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
