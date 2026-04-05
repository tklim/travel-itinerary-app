import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f6f68 0%, #f2b35d 100%)",
          borderRadius: 40
        }}
      >
        <svg width="126" height="126" viewBox="0 0 48 48" fill="none">
          <path
            d="M11 18.5c2.1-5.2 6.1-8.3 11.6-8.8 4.4-.4 7.9 1.2 11.2 4.6"
            fill="none"
            stroke="#fff4db"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2.4 4.2"
          />
          <circle cx="11.1" cy="18.6" r="3.1" fill="#fff4db" />
          <circle cx="35.4" cy="15.1" r="4.1" fill="#0f6f68" />
          <circle cx="35.4" cy="15.1" r="2.4" fill="#f9fbf8" />
          <path d="M18.8 29.8 32.1 26.4l-7.5 11.5-1.3-4.8-4.5-3.3Z" fill="#ffffff" />
        </svg>
      </div>
    ),
    size
  );
}
