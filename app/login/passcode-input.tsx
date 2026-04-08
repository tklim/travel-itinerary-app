"use client";

import { useState } from "react";

export function PasscodeInput() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-with-action">
      <input
        className="input"
        name="passcode"
        type={visible ? "text" : "password"}
        placeholder="Enter trip passcode"
        autoFocus
      />
      <button
        type="button"
        className="passcode-toggle"
        aria-label={visible ? "Hide passcode" : "Show passcode"}
        title={visible ? "Hide passcode" : "Show passcode"}
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-button-glyph">
          <path
            d="M3 12s3.5-5.5 9-5.5S21 12 21 12s-3.5 5.5-9 5.5S3 12 3 12Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.8" />
          {visible ? null : (
            <path
              d="M5 19 19 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
    </div>
  );
}
