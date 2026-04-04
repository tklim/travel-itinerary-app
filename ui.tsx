import Link from "next/link";
import type { ReactNode } from "react";

import type { AnswerCard, DayTimelineGroup, TonightStaySummary } from "@/types";
import { formatDateTime, formatShortTime } from "@/time";

type ShellProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  tripName: string;
  nav?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function AppShell({
  title,
  subtitle,
  eyebrow,
  tripName,
  nav,
  actions,
  children
}: ShellProps) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">T</div>
          <div className="brand-copy stack" style={{ gap: 6 }}>
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <div>
              <h1 style={{ margin: 0 }}>{title}</h1>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                {subtitle}
              </p>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
              {tripName}
            </p>
          </div>
        </div>
        {actions ? <div className="shell-actions">{actions}</div> : null}
      </header>
      {nav}
      <main className="stack spacious">{children}</main>
    </div>
  );
}

export function TravelerNav({ pathname }: { pathname: string }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/today", label: "Today" },
    { href: "/schedule", label: "Schedule" },
    { href: "/flights", label: "Flights" },
    { href: "/stay", label: "Stay" }
  ] as const;

  return (
    <>
      <nav className="nav-tabs traveler-nav-tabs" aria-label="Traveler pages">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-tab${pathname === link.href ? " active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="footer-nav traveler-footer-nav">
        <div className="footer-nav-inner">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export function AdminNav({ pathname }: { pathname: string }) {
  const links = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/flights", label: "Flights" },
    { href: "/admin/stays", label: "Stays" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/import", label: "Import" },
    { href: "/admin/settings", label: "Settings" }
  ] as const;

  return (
    <nav className="nav-tabs" aria-label="Admin pages">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`nav-tab${pathname === link.href ? " active" : ""}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function AnswerCards({ cards }: { cards: AnswerCard[] }) {
  return (
    <section className="answers-grid">
      {cards.map((card) => (
        <article key={card.title} className="answer-card">
          <div className="pill-row">
            <span className="pill">{card.title}</span>
            {card.badge ? <span className="chip warm">{card.badge}</span> : null}
          </div>
          <strong className="answer-time">{card.headline}</strong>
          <div>
            <p style={{ margin: 0 }}>{card.supporting}</p>
            <p className="muted" style={{ margin: "8px 0 0" }}>
              {card.detail}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}

export function SummaryStats({
  stats
}: {
  stats: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="stats-grid">
      {stats.map((stat) => (
        <article key={stat.label} className="stat-card">
          <div className="muted" style={{ fontSize: "0.88rem" }}>
            {stat.label}
          </div>
          <div className="answer-time" style={{ marginTop: 10 }}>
            {stat.value}
          </div>
        </article>
      ))}
    </section>
  );
}

export function StaySummaryCard({ stay }: { stay: TonightStaySummary }) {
  return (
    <article className="info-card stack">
      <div className="section-heading" style={{ marginBottom: 0 }}>
        <div className="pill-row">
          <span className="pill">Where are we staying?</span>
          <span className={`chip ${stay.status === "active" ? "" : "warm"}`}>
            {stay.status === "active" ? "Tonight" : "Next stay"}
          </span>
        </div>
        <h2 className="section-title">{stay.name}</h2>
        <p className="muted">{stay.headline}</p>
      </div>
      {stay.address ? <p style={{ margin: 0 }}>{stay.address}</p> : null}
      <div className="stack" style={{ gap: 8 }}>
        <p className="muted" style={{ margin: 0 }}>
          {stay.checkInText}
        </p>
        <p className="muted" style={{ margin: 0 }}>
          {stay.checkOutText}
        </p>
        {stay.phone ? (
          <p className="muted" style={{ margin: 0 }}>
            Phone: {stay.phone}
          </p>
        ) : null}
      </div>
      <div className="pill-row">
        {stay.mapUrl ? (
          <a className="button-secondary" href={stay.mapUrl} target="_blank" rel="noreferrer">
            Open map
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function ScheduleView({ groups }: { groups: DayTimelineGroup[] }) {
  return (
    <section className="stack">
      {groups.map((group) => (
        <article key={group.dayKey} className="timeline-card">
          <div className="day-heading">
            <div>
              <h2 className="section-title">{group.label}</h2>
              <p className="muted">{group.dateText}</p>
            </div>
            <span className="chip">{group.timezone}</span>
          </div>
          <div className="timeline-list" style={{ marginTop: 20 }}>
            {group.items.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-time">
                  {formatShortTime(item.startAt, item.timezone)}
                  {item.endAt ? (
                    <div className="muted" style={{ marginTop: 6, fontWeight: 500 }}>
                      to {formatShortTime(item.endAt, item.timezone)}
                    </div>
                  ) : null}
                </div>
                <div>
                  <div className="pill-row" style={{ marginBottom: 8 }}>
                    <span className="pill">{item.category}</span>
                    {item.kind === "flight" ? <span className="chip warm">Flight</span> : null}
                  </div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p>{item.subtitle}</p>
                  {item.detail ? <p>{item.detail}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

export function AgendaGroups({ groups }: { groups: DayTimelineGroup[] }) {
  return (
    <section className="stack">
      {groups.map((group) => {
        const items = [...group.items].sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

        return (
          <article key={group.dayKey} className="timeline-card today-agenda">
            <div className="section-heading" style={{ marginBottom: 0 }}>
              <div className="pill-row">
                <span className="pill">{group.dateText}</span>
                <span className="chip">{group.timezone}</span>
              </div>
              <h2 className="section-title">{group.label}</h2>
              <p className="muted">{group.dateText}</p>
            </div>

            <div className="today-agenda-list">
              {items.map((item) => (
                <article key={item.id} className="today-agenda-item">
                  <div className="today-agenda-time">
                    <strong>{formatShortTime(item.startAt, item.timezone)}</strong>
                    {item.endAt ? (
                      <span className="muted">to {formatShortTime(item.endAt, item.timezone)}</span>
                    ) : null}
                  </div>
                  <div className="today-agenda-content">
                    <div className="pill-row">
                      <span className="pill">{item.category}</span>
                      {item.kind === "flight" ? <span className="chip warm">Flight</span> : null}
                    </div>
                    <h3 className="timeline-title">{item.title}</h3>
                    <p>{item.subtitle}</p>
                    {item.detail ? <p className="muted">{item.detail}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function EmptyNotice({
  title,
  body,
  action
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <article className="notice-card">
      <h3 className="card-title" style={{ margin: 0 }}>
        {title}
      </h3>
      <p className="muted" style={{ margin: "8px 0 0" }}>
        {body}
      </p>
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </article>
  );
}

export function AdminSummaryCards({
  counts
}: {
  counts: Array<{ label: string; value: string; note: string }>;
}) {
  return (
    <section className="admin-grid">
      {counts.map((count) => (
        <article key={count.label} className="admin-card">
          <p className="muted" style={{ margin: 0 }}>
            {count.label}
          </p>
          <h3 className="answer-time" style={{ margin: "12px 0 8px" }}>
            {count.value}
          </h3>
          <p className="muted" style={{ margin: 0 }}>
            {count.note}
          </p>
        </article>
      ))}
    </section>
  );
}

export function PageIntro({
  title,
  body,
  chips
}: {
  title: string;
  body: string;
  chips?: string[];
}) {
  return (
    <section className="panel hero">
      <div className="hero-grid">
        <div className="stack">
          <h2 className="hero-title">{title}</h2>
          <p className="hero-copy">{body}</p>
        </div>
        {chips?.length ? (
          <div className="pill-row" style={{ justifyContent: "flex-start" }}>
            {chips.map((chip) => (
              <span key={chip} className="chip">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function CompactPageIntro({
  title,
  body,
  chips,
  detail
}: {
  title: string;
  body: string;
  chips?: string[];
  detail?: string;
}) {
  return (
    <section className="panel compact-hero">
      <div className="compact-hero-row">
        <div className="stack" style={{ gap: 8 }}>
          <h2 className="compact-hero-title">{title}</h2>
          {detail ? <p className="compact-hero-detail">{detail}</p> : null}
          <p className="hero-copy">{body}</p>
        </div>
        {chips?.length ? (
          <div className="pill-row">
            {chips.map((chip) => (
              <span key={chip} className="chip">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function LastUpdated({ date, timezone }: { date: Date; timezone: string }) {
  return (
    <p className="muted" style={{ margin: 0 }}>
      Last updated {formatDateTime(date, timezone)}
    </p>
  );
}
