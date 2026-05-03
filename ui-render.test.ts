import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { AgendaGroups, ScheduleView } from "@/ui";
import type { DayTimelineGroup } from "@/types";

const groups: DayTimelineGroup[] = [
  {
    dayKey: "2026-05-29",
    label: "Fri 29 May",
    dateText: "Fri 29 May",
    timezone: "Europe/Madrid",
    items: [
      {
        id: "event_1",
        kind: "event",
        title: "Happy Apartment CheckIn",
        category: "Hotel CheckIn",
        timezone: "Europe/Madrid",
        startAt: new Date("2026-05-29T15:00:00.000Z"),
        subtitle: "Happy Apartments, Gothic",
        detail: "Line 1\nLine 2\nAReallyLongUnbrokenNoteTokenThatShouldWrapSafelyOnMobile"
      }
    ]
  }
];

describe("traveler note rendering", () => {
  it("renders schedule notes with the dedicated note class and preserves note text", () => {
    const markup = renderToStaticMarkup(createElement(ScheduleView, { groups }));

    expect(markup).toContain("timeline-note");
    expect(markup).toContain("Line 1\nLine 2\nAReallyLongUnbrokenNoteTokenThatShouldWrapSafelyOnMobile");
  });

  it("renders agenda notes with the dedicated note class and preserves note text", () => {
    const markup = renderToStaticMarkup(createElement(AgendaGroups, { groups }));

    expect(markup).toContain("timeline-note");
    expect(markup).toContain("Line 1\nLine 2\nAReallyLongUnbrokenNoteTokenThatShouldWrapSafelyOnMobile");
  });
});
