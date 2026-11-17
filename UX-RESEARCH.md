# UX Research Summary

**Project:** Event Planner — London Nightlife Discovery App
**Date:** 2026-11-17
**Prepared by:** Requirements Elicitation Skill (CPUX)

---

## User Profiles

**The Frequent Nightlife-Goer (primary and only persona)**

18-45 years old, lives in or around London, goes out multiple nights a week. Their nightlife diet
is varied — clubs, gigs, comedy nights, pop-up events — and they treat dinner as something that
often gets planned around a night out ("dinner before the gig") rather than as its own occasion.
They are comfortable using apps and have existing mental models from Tinder/Hinge, DICE, and
Google Calendar. Their context of use is split roughly evenly between two modes:

- **Advance planning** — e.g. a Sunday evening, deciding what the week ahead looks like
- **Spontaneous, same-day decisions** — "I'm free tonight, what's on"

Their goal isn't just "find an event" — it's to minimize the effort of sifting through
low-signal noise (generic Google results, scattered Instagram posts, friends' half-remembered
recommendations) to land on something that's actually good and, ideally, has a deal attached.

---

## Key Insights

- **The pain isn't lack of information — it's lack of curation.** Google Maps already surfaces
  plenty of options; the user's problem is deciding among them. The product's job is filtering
  and personalization, not aggregation for its own sake.
- **Deals live outside structured data.** Free entry, 2-for-1, happy hour, and theatre-pricing
  deals are typically posted by venues on their own social channels, not through ticketing
  platforms. This is a genuine data-availability gap, not just a build-time constraint — flagged
  as an open risk in the PRD (Section 6).
- **Swiping is for taste-signaling, not committing.** The user was explicit that swipe-right means
  "interested but not committed" — it must not be conflated with RSVPing or booking. Blurring this
  distinction would break trust in the app (e.g. a user wouldn't want to accidentally "book" a
  night out by swiping too fast).
- **The Calendar is a commitment view, not a discovery view.** It intentionally shows only what's
  been RSVP'd to, not the full universe of available events. Design and copy need to reinforce
  this distinction so users don't expect their swiped "interested" items to show up there
  automatically.
- **The app is a planning layer, not a transactional one.** The stakeholder was explicit that
  booking/payment is always handed off externally (Eventbrite, DICE, OpenTable). The UI must make
  this handoff obvious — e.g. clear "opens externally" affordances — so users aren't confused about
  where their money/booking confirmation actually lives.
- **Weather-on-calendar is a planning aid, not a gimmick.** For nightlife specifically (queuing
  outside venues, outdoor pop-ups, outfit choice), knowing the week's forecast alongside plans is
  directly useful to the target user's context.

---

## Mental Models & Domain Language

- **Swipe interaction** → modeled directly on Tinder/Hinge. Users will expect right = like/interested, left = skip, with no learning curve.
- **Event browsing/listing feel** → modeled on DICE. Card-based, visual-first, price and date prominent.
- **Calendar feel** → modeled on Google Calendar — a week-at-a-glance grid anchored to "today."
- **"Interested" vs. "RSVP"** — these are two distinct domain concepts in this product and must be labeled distinctly in the UI: *Interested* (saved from swiping, soft signal) vs. *RSVP'd* (shows on the calendar, a personal commitment) vs. *Booked* (happens externally, outside the app's knowledge).
- **"Booking" is explicitly not a thing the app does.** The product's own language should avoid implying it processes bookings — use "RSVP," "add to calendar," and "book externally" rather than "buy," "checkout," or "confirm booking."

---

## Task Analysis

| Task | Frequency | Stakes | Key friction | Design implication |
|---|---|---|---|---|
| Browse For You feed & swipe | High | Low | Risk of over-swiping without enough info per card | Cards must surface enough info (image, type, price, date) for a quick but informed decision |
| Review Saved/Interested folder | Medium | Low | Could become a "graveyard" of forgotten saves | Make it easy to act (RSVP or discard) directly from the folder |
| RSVP to an event/restaurant | Medium | Medium | Must not be confused with actually booking | Clear visual/copy separation between "RSVP" (in-app) and "Book" (external link) |
| Check weekly calendar | High | Low | Must distinguish "nothing planned" from "no data loaded" | Explicit empty-day state, always show weather even with nothing booked |
| Complete external booking | Medium | High (money/commitment) | User leaves the app; must trust the link is correct | Booking links must be obviously external (new tab, source platform branding/name shown) |
| Sign in & onboard | Low (one-time) | Medium | First impression of the whole product | Must be fast (under a minute) and get straight to useful personalization |

---

## Design Risks

- **Conflating "interested" and "RSVP'd."** If the UI doesn't clearly separate these two states, users may believe a swipe commits them to a plan, or may be confused why swiped items don't appear on their calendar.
- **Implying the app completes bookings.** Any ambiguity here (e.g. a button labeled "Book Now" instead of "View on Eventbrite") risks users believing a transaction happened in-app when it didn't.
- **Deals feature under-delivering against expectation.** Since this was one of the two founding pain points but has no clean data source, there's a risk that the live demo looks like it's missing a promised feature. Recommend explicitly scoping deals as a "coming soon" or mocked element rather than silently dropping it.
- **Empty states on the calendar being mistaken for a bug.** A day with nothing RSVP'd must look intentionally empty (with weather still shown), not broken.
- **API fallback transparency.** When mock data is shown due to an API failure, there's a risk a demo judge perceives this as "fake" — consider whether fallback content should be visually/contextually indistinguishable from live data for demo purposes, since the PRD does not require disclosing fallback state to the user.

---

## Usability Test Plan

Given the hackathon timeline, this is a lightweight, informal test plan rather than a formal
study — intended as a final self-check before the demo, not a scheduled research activity.

- **Who:** The developer themselves plus 1-2 informal testers (e.g. teammates or friends) acting as a first-time user.
- **What to test (priority order):**
  1. Sign in → onboarding → land in main app (should take under a minute, no confusion about what to select)
  2. Swipe through the For You feed (tester should immediately understand the gesture without being told)
  3. Open a Saved item and RSVP it, then confirm it appears correctly on the Calendar
  4. Open a detail page and confirm the external booking link is obviously external and separate from RSVP
  5. View the Calendar on a day with nothing booked — confirm it reads as empty, not broken
- **Pass/fail:** A tester with no prior explanation can complete tasks 1-4 unaided. Any point where a tester asks "wait, did that just book something?" or "is this broken?" is a fail and should be fixed before the demo if time allows.
- **Timing:** Formative — run this as a quick pass as soon as the core flow is wired up, not after full polish, so there's time to react to findings before the 3pm deadline.
