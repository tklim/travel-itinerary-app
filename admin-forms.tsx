import type { Event, Flight, Stay, Trip } from "@prisma/client";

import {
  deleteEventAction,
  deleteFlightAction,
  deleteStayAction,
  saveEventAction,
  saveFlightAction,
  saveStayAction
} from "@/actions";
import { toDatetimeLocalValue } from "@/time";

export function FlightEditor({
  trip,
  flight
}: {
  trip: Pick<Trip, "homeTimezone" | "defaultAirportLeadMinutes" | "defaultWakeMinutes">;
  flight?: Flight;
}) {
  const originTimezone = flight?.originTimezone ?? trip.homeTimezone;
  const destinationTimezone = flight?.destinationTimezone ?? trip.homeTimezone;

  return (
    <article className="form-card stack">
      <div className="section-heading" style={{ marginBottom: 0 }}>
        <h3 className="card-title">{flight ? `${flight.originCode} to ${flight.destinationCode}` : "Add flight"}</h3>
        <p className="muted">Save flights into the current draft version.</p>
      </div>
      <form action={saveFlightAction} className="form-stack">
        <input type="hidden" name="logicalId" defaultValue={flight?.logicalId ?? ""} />
        <div className="two-up">
          <label className="label">
            Airline
            <input className="input" name="airline" defaultValue={flight?.airline ?? ""} required />
          </label>
          <label className="label">
            Flight number
            <input className="input" name="flightNumber" defaultValue={flight?.flightNumber ?? ""} required />
          </label>
        </div>
        <div className="two-up">
          <label className="label">
            Origin code
            <input className="input" name="originCode" defaultValue={flight?.originCode ?? ""} required />
          </label>
          <label className="label">
            Destination code
            <input className="input" name="destinationCode" defaultValue={flight?.destinationCode ?? ""} required />
          </label>
        </div>
        <div className="two-up">
          <label className="label">
            Origin name
            <input className="input" name="originName" defaultValue={flight?.originName ?? ""} required />
          </label>
          <label className="label">
            Destination name
            <input className="input" name="destinationName" defaultValue={flight?.destinationName ?? ""} required />
          </label>
        </div>
        <div className="two-up">
          <label className="label">
            Origin timezone
            <input className="input" name="originTimezone" defaultValue={originTimezone} required />
          </label>
          <label className="label">
            Destination timezone
            <input className="input" name="destinationTimezone" defaultValue={destinationTimezone} required />
          </label>
        </div>
        <div className="two-up">
          <label className="label">
            Depart at
            <input
              className="input"
              type="datetime-local"
              name="departAt"
              defaultValue={flight ? toDatetimeLocalValue(flight.departAt, originTimezone) : ""}
              required
            />
          </label>
          <label className="label">
            Arrive at
            <input
              className="input"
              type="datetime-local"
              name="arriveAt"
              defaultValue={flight ? toDatetimeLocalValue(flight.arriveAt, destinationTimezone) : ""}
              required
            />
          </label>
        </div>
        <div className="two-up">
          <label className="label">
            Airport lead minutes
            <input
              className="input"
              type="number"
              name="airportLeadMinutes"
              defaultValue={flight?.airportLeadMinutes ?? trip.defaultAirportLeadMinutes}
            />
          </label>
          <label className="label">
            Wake lead minutes
            <input
              className="input"
              type="number"
              name="wakeLeadMinutes"
              defaultValue={flight?.wakeLeadMinutes ?? trip.defaultWakeMinutes}
            />
          </label>
        </div>
        <label className="label">
          Notes
          <textarea className="textarea" name="notes" defaultValue={flight?.notes ?? ""} />
        </label>
        <div className="pill-row">
          <button className="button" type="submit">
            Save flight
          </button>
        </div>
      </form>
      {flight ? (
        <form action={deleteFlightAction}>
          <input type="hidden" name="logicalId" value={flight.logicalId} />
          <button className="button-secondary" type="submit">
            Delete flight
          </button>
        </form>
      ) : null}
    </article>
  );
}

export function StayEditor({
  trip,
  stay
}: {
  trip: Pick<Trip, "homeTimezone">;
  stay?: Stay;
}) {
  const timezone = stay?.timezone ?? trip.homeTimezone;

  return (
    <article className="form-card stack">
      <div className="section-heading" style={{ marginBottom: 0 }}>
        <h3 className="card-title">{stay ? stay.name : "Add stay"}</h3>
        <p className="muted">Stays power the tonight and next-hotel answers for travelers.</p>
      </div>
      <form action={saveStayAction} className="form-stack">
        <input type="hidden" name="logicalId" defaultValue={stay?.logicalId ?? ""} />
        <div className="two-up">
          <label className="label">
            Name
            <input className="input" name="name" defaultValue={stay?.name ?? ""} required />
          </label>
          <label className="label">
            City
            <input className="input" name="city" defaultValue={stay?.city ?? ""} required />
          </label>
        </div>
        <div className="two-up">
          <label className="label">
            Country
            <input className="input" name="country" defaultValue={stay?.country ?? ""} required />
          </label>
          <label className="label">
            Timezone
            <input className="input" name="timezone" defaultValue={timezone} required />
          </label>
        </div>
        <label className="label">
          Address
          <input className="input" name="address" defaultValue={stay?.address ?? ""} required />
        </label>
        <div className="two-up">
          <label className="label">
            Phone
            <input className="input" name="phone" defaultValue={stay?.phone ?? ""} />
          </label>
          <label className="label">
            Map URL
            <input className="input" name="mapUrl" defaultValue={stay?.mapUrl ?? ""} />
          </label>
        </div>
        <div className="two-up">
          <label className="label">
            Check in
            <input
              className="input"
              type="datetime-local"
              name="checkInAt"
              defaultValue={stay ? toDatetimeLocalValue(stay.checkInAt, timezone) : ""}
              required
            />
          </label>
          <label className="label">
            Check out
            <input
              className="input"
              type="datetime-local"
              name="checkOutAt"
              defaultValue={stay ? toDatetimeLocalValue(stay.checkOutAt, timezone) : ""}
              required
            />
          </label>
        </div>
        <label className="label">
          Notes
          <textarea className="textarea" name="notes" defaultValue={stay?.notes ?? ""} />
        </label>
        <div className="pill-row">
          <button className="button" type="submit">
            Save stay
          </button>
        </div>
      </form>
      {stay ? (
        <form action={deleteStayAction}>
          <input type="hidden" name="logicalId" value={stay.logicalId} />
          <button className="button-secondary" type="submit">
            Delete stay
          </button>
        </form>
      ) : null}
    </article>
  );
}

export function EventEditor({
  trip,
  event
}: {
  trip: Pick<Trip, "homeTimezone" | "defaultWakeMinutes">;
  event?: Event;
}) {
  const timezone = event?.timezone ?? trip.homeTimezone;

  return (
    <article className="form-card stack">
      <div className="section-heading" style={{ marginBottom: 0 }}>
        <h3 className="card-title">{event ? event.title : "Add event"}</h3>
        <p className="muted">Events fill the daily timeline and morning wake-up logic.</p>
      </div>
      <form action={saveEventAction} className="form-stack">
        <input type="hidden" name="logicalId" defaultValue={event?.logicalId ?? ""} />
        <div className="two-up">
          <label className="label">
            Title
            <input className="input" name="title" defaultValue={event?.title ?? ""} required />
          </label>
          <label className="label">
            Category
            <input className="input" name="category" defaultValue={event?.category ?? "Plan"} required />
          </label>
        </div>
        <div className="two-up">
          <label className="label">
            Timezone
            <input className="input" name="timezone" defaultValue={timezone} required />
          </label>
          <label className="label">
            Location
            <input className="input" name="location" defaultValue={event?.location ?? ""} />
          </label>
        </div>
        <div className="two-up">
          <label className="label">
            Start at
            <input
              className="input"
              type="datetime-local"
              name="startAt"
              defaultValue={event ? toDatetimeLocalValue(event.startAt, timezone) : ""}
              required
            />
          </label>
          <label className="label">
            End at
            <input
              className="input"
              type="datetime-local"
              name="endAt"
              defaultValue={event?.endAt ? toDatetimeLocalValue(event.endAt, timezone) : ""}
            />
          </label>
        </div>
        <div className="two-up">
          <label className="label">
            Required arrival at
            <input
              className="input"
              type="datetime-local"
              name="requiredArrivalAt"
              defaultValue={
                event?.requiredArrivalAt ? toDatetimeLocalValue(event.requiredArrivalAt, timezone) : ""
              }
            />
          </label>
          <label className="label">
            Required lead minutes
            <input
              className="input"
              type="number"
              name="requiredLeadMinutes"
              defaultValue={event?.requiredLeadMinutes ?? ""}
            />
          </label>
        </div>
        <label className="label">
          Wake lead minutes
          <input
            className="input"
            type="number"
            name="wakeLeadMinutes"
            defaultValue={event?.wakeLeadMinutes ?? trip.defaultWakeMinutes}
          />
        </label>
        <label className="label">
          Notes
          <textarea className="textarea" name="notes" defaultValue={event?.notes ?? ""} />
        </label>
        <div className="pill-row">
          <button className="button" type="submit">
            Save event
          </button>
        </div>
      </form>
      {event ? (
        <form action={deleteEventAction}>
          <input type="hidden" name="logicalId" value={event.logicalId} />
          <button className="button-secondary" type="submit">
            Delete event
          </button>
        </form>
      ) : null}
    </article>
  );
}
