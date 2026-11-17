# Product Requirements Document

**Project:** Event Planner — London Nightlife Discovery App
**Version:** 1.0
**Date:** 2026-11-17
**Prepared by:** Requirements Elicitation Skill
**Status:** Draft - Awaiting stakeholder sign-off

---

## 1. Overview

### 1.1 Purpose

Event Planner is a Next.js web app that helps London nightlife-goers discover and plan events,
restaurants, and deals for the week ahead. It solves the problem of choice overload — too many
scattered sources (Google, social media, word of mouth) and no easy way to find quality venues
or current deals (free entry, 2-for-1, happy hour, early-bird, theatre pricing). It is being
built as a hackathon project, with a working demo due same-day.

### 1.2 Success Criteria

A deployed, judge-accessible Vercel demo where a user can: sign in with Google, set their
interests, swipe through a personalized feed of events/restaurants, save items they're
interested in, RSVP items onto a weekly calendar alongside a daily weather forecast, and view
rich detail pages with a map and a link to book externally.

### 1.3 Background

Today, people find London nightlife events and restaurants by searching Google, browsing social
media, and asking friends. Google Maps surfaces many options but gives no help narrowing them
down to quality choices, and none of these channels surface time-limited deals (free entry,
2-for-1 drinks, happy hour, early-bird dinner, theatre pricing) that venues post on their own
social channels. This project curates that into one weekly planning surface.

---

## 2. Users

| User type | Description | Primary goal | Key frustration today |
|---|---|---|---|
| Frequent nightlife-goer | 18-45, goes out multiple nights a week (clubs, gigs, comedy, pop-up events) in London | Decide quickly what's worth doing this week or tonight, and find a good deal while doing it | Overwhelmed by raw search results; no way to filter to quality or discounted options |

### User Personas

A typical user is in their 20s-30s, living in or around London, who goes out several times a
week and treats finding "what's on" as a recurring, slightly tedious chore. They bounce between
Google search, Instagram, and group chats with friends to piece together a picture of the week.
They're equally happy planning ahead on a Sunday night as they are deciding same-day that
they're free tonight and want something to do. They know roughly what kind of night they like
(a gig, a comedy night, a club, a pop-up) and have a budget in mind, but discovering a quality,
reasonably-priced option takes more digging than it should — especially when it comes to finding
deals, which tend to live only on a venue's own social media.

---

## 3. Scope

### 3.1 In Scope

- Google sign-in (via NextAuth) and a user profile capturing event-type preferences and price range
- Onboarding flow to set initial preferences
- "For You" swipeable discovery feed of events and restaurants
- Swipe-right ("interested") saves an item to a personal Saved/Interested folder; swipe-left dismisses it for the session
- Simple preference refinement: swipe history weights the For You feed toward frequently-liked event types/price ranges
- Saved/Interested folder — browse and remove saved items
- Weekly Calendar view (current day through +6 days) showing only items the user has RSVP'd to, plus a daily weather forecast
- RSVP action (from a detail page) that adds an item to the calendar; cancel RSVP to remove it
- Event Detail and Restaurant Detail pages: name, description, date/time, price, venue, images, Google Maps embed, external booking link
- Integration with Eventbrite and DICE for event data, and OpenTable for restaurant data
- Integration with OpenWeatherMap for the calendar's daily forecast
- Fallback to mock/sample data when a live API call fails or returns no results
- Dark, nightlife-themed responsive UI treated equally across desktop and mobile
- In-app toast confirmations for key actions (saved, RSVP added, RSVP cancelled, preferences updated)
- Deployment to Vercel

### 3.2 Out of Scope

- Actual booking/payment/reservation processing — the app links out to Eventbrite, DICE, or OpenTable; it never completes a transaction itself
- A dedicated deals/discounts data source — no clean API exists for this; deals are a flagged research risk and are not a committed feature for the hackathon demo (see Section 6)
- Formal WCAG audit or certified compliance — only best-effort accessibility practices
- Email/push notifications — in-app feedback only
- Multi-user roles, admin dashboards, or content moderation tooling
- Load testing or scaling beyond demo-day traffic
- Formal GDPR/compliance audit — standard reasonable care for Google profile data only

---

## 4. Features & Acceptance Criteria

### 4.1 Google Sign-In & Onboarding

**Description:** Users create a profile by signing in with their Google account. First-time users
are taken through onboarding to set their event-type preferences and price range before reaching
the main app.

**Requirement ref:** FR-01

**Priority:** Must Have

**Acceptance Criteria:**

- [ ] A user can sign in using their Google account via a visible "Sign in with Google" action.
- [ ] A first-time user is directed to an onboarding screen to select event-type preferences (e.g. clubs, gigs, comedy, pop-ups) and a price range before reaching the main app.
- [ ] A returning user who has already completed onboarding goes straight to the main app after sign-in.
- [ ] If Google sign-in fails or is cancelled, the user sees a clear message and can retry without the app crashing.

**Usability Criteria:**

- [ ] A new user can complete sign-in and onboarding in under a minute without needing instructions.

---

### 4.2 For You Swipe Feed

**Description:** A Tinder-style swipeable feed of personalized event and restaurant recommendations.
Swiping right signals interest and saves the item; swiping left dismisses it. This is a lightweight
preference signal, not a commitment to attend.

**Requirement ref:** FR-02

**Priority:** Must Have

**Acceptance Criteria:**

- [ ] Each card in the feed shows enough information to make a quick decision (name, type, image, date, price).
- [ ] Swiping right on a card adds that item to the user's Saved/Interested folder and advances to the next card, without leaving the feed.
- [ ] Swiping left dismisses the card and advances to the next card; a dismissed card does not reappear in the same session.
- [ ] Over time, the feed is weighted toward event types and price ranges the user has swiped right on more often.
- [ ] If live event data is unavailable, the feed falls back to mock/sample content rather than showing a blank or broken screen.

**Usability Criteria:**

- [ ] A user understands what swiping right vs. left does without needing an explanation (matches the familiar Tinder/Hinge mental model).
- [ ] A user can tell, without ambiguity, that swiping right does not book or commit them to anything.

---

### 4.3 Saved / Interested Folder

**Description:** A dedicated screen listing everything the user has swiped right on, so they can
review and act on it later.

**Requirement ref:** FR-03

**Priority:** Must Have

**Acceptance Criteria:**

- [ ] All items swiped right on appear in the Saved/Interested folder.
- [ ] A user can remove an item from this folder.
- [ ] Tapping a saved item opens its full Event or Restaurant Detail page.

---

### 4.4 Weekly Calendar

**Description:** Shows the current week (today through six days ahead) with the events and
restaurants the user has RSVP'd to, plus a daily weather forecast for London. This view reflects
committed plans only — not the full universe of available events.

**Requirement ref:** FR-04

**Priority:** Must Have

**Acceptance Criteria:**

- [ ] The calendar displays seven days starting from the current day.
- [ ] Each day shows the events/restaurants the user has RSVP'd to on that date, correctly placed.
- [ ] Each day shows a weather forecast (from OpenWeatherMap), including days with nothing booked.
- [ ] A day with no RSVP'd items clearly shows an empty state rather than looking broken.
- [ ] If the weather API is unavailable, the day still displays correctly with a fallback/placeholder forecast rather than breaking the layout.

**Usability Criteria:**

- [ ] A user can tell at a glance what they have planned for any day this week and what the weather will be.

---

### 4.5 Event & Restaurant Detail Pages

**Description:** A full-information page for a single event or restaurant, including a map and a
link to complete booking externally. RSVPing here adds the item to the user's calendar; it does
not complete a booking.

**Requirement ref:** FR-05

**Priority:** Must Have

**Acceptance Criteria:**

- [ ] The page displays name, description, date/time, price, venue, and at least one image.
- [ ] The page displays a Google Maps embed showing the venue's location.
- [ ] An external booking link opens the source platform (Eventbrite, DICE, or OpenTable) in a new tab — the app itself never processes a booking or payment.
- [ ] An "RSVP" action adds the item to the user's weekly calendar and shows an in-app confirmation.
- [ ] A user can cancel an existing RSVP from this page, removing it from the calendar.

---

### 4.6 Profile & Preferences

**Description:** Users can view and update their event-type and price-range preferences at any
time after onboarding.

**Requirement ref:** FR-06

**Priority:** Should Have

**Acceptance Criteria:**

- [ ] A user can view their current event-type and price-range preferences.
- [ ] A user can update these preferences, and the For You feed reflects the change on next load.

---

## 5. Non-Functional Requirements

| ID | Category | Requirement | Acceptance criterion |
|---|---|---|---|
| NFR-01 | Performance | Demo-scale only — smooth experience for a handful of concurrent users (judges/testers); no load testing required | App remains responsive during a live demo with a small number of simultaneous users |
| NFR-02 | Security | Google profile data (name, email, photo) is handled with standard reasonable care; no formal compliance audit required for this build | Auth tokens and profile data are not exposed in client-side logs or committed to source control |
| NFR-03 | Reliability | No formal uptime target; resilience is handled via fallback to mock/cached data | If Eventbrite, DICE, OpenTable, or OpenWeatherMap calls fail or return empty, the app shows mock/fallback content instead of an error or blank screen |
| NFR-04 | Accessibility | Basic best-effort accessibility — semantic HTML, keyboard navigability, adequate color contrast; no formal WCAG audit | Core flows (sign-in, swipe, RSVP, calendar) are operable via keyboard and screen elements use semantic markup |

---

## 6. Constraints

- **Timeline:** Hackathon project, solo developer, demo due same-day (3pm). Scope is calibrated to a working demo with core screens functional; mocked/sample data is an acceptable substitute anywhere live integration isn't feasible in the time available.
- **Technology:** Must be built in Next.js and deployed to Vercel.
- **Data sources:** Must use Eventbrite and DICE for events, and OpenTable for restaurants.
- **Open risk — deals data:** No committed data source exists for deals/discounts (free entry, 2-for-1, happy hour, etc.). This is a research item for the dev team; if no viable API is found in time, deals content should be mocked or omitted from the live demo rather than blocking other features.
- **Team:** Solo developer — scope and acceptance criteria are written assuming no additional engineering resource.

---

## 7. Data & Integrations

**Key data entities:** User profile (Google identity, event-type preferences, price range),
Event, Restaurant, Saved/Interested item, Calendar RSVP.

**External integrations:**
- Google OAuth (via NextAuth) for sign-in
- Eventbrite API — event listings
- DICE API — event listings
- OpenTable API — restaurant listings
- OpenWeatherMap API — daily weather forecast
- Google Maps (embed) — venue location on detail pages

**Data sensitivity:** Basic PII from Google sign-in (name, email, profile photo). No payment or
financial data is handled by the app, since booking is completed externally.

---

## 8. UX Requirements Summary

Users think of this app the way they think of Tinder/Hinge (swipe mental model), DICE (event
browsing), and Google Calendar (the week view) — the interface should lean into these familiar
patterns rather than inventing new ones. The most important distinction to get right in the UI is
that **swiping is a soft signal of interest, not a commitment**, while **RSVP is a soft commitment
to a plan, not a completed booking** — the actual transaction always happens off-app via the
external booking link. The Calendar should never be confused with a browse-all-events view; it
only ever reflects what the user has explicitly RSVP'd to.

High-care journeys: the swipe feed (first impression, must feel immediately familiar) and the
RSVP → external booking handoff (must be unambiguous that the app isn't completing the booking).

Accessibility: basic best-effort only (semantic HTML, keyboard nav, contrast) — no formal WCAG
audit for this build.

---

## 9. Sign-off

This document represents the agreed requirements for the project as captured in conversation
with the stakeholder. Before development begins, the stakeholder should review this document
and confirm it accurately reflects what was discussed.

| Role | Name | Status | Date |
|---|---|---|---|
| Stakeholder | Caoilfhinn Farrell | Pending | |
| BA / UX Researcher | Requirements Elicitation Skill | Prepared | 2026-11-17 |

---

_This document is the reference for all development, testing, and assurance activity on this
project. Any changes to requirements after sign-off must be captured in an updated version of
this document before implementation begins._
