
## Product Requirements Document

**Project:** WeekAhead - London Event Discovery App  
**Version:** 2.0  
**Date:** 2026-11-17
**Prepared by:** Requirements Elicitation Skill
**Status:** Draft

### 1. Overview

#### 1.1 Purpose

WeekAhead is a mobile-first Next.js web app that combines two complementary ways of building a night out:

1. **Curated discovery:** users browse a personalised, swipeable feed of London events and restaurants.
2. **Real-world capture:** users photograph or upload an event poster, review extracted event details, and save the event into the same planning flow.

Both routes feed a single planning model: **Interested -> RSVP'd -> Booked externally**. Swiping right or scanning a poster indicates interest only. An explicit RSVP adds an item to the in-app weekly planner. Ticket purchases and restaurant reservations remain on external platforms.

#### 1.2 Success Criteria

##### Hackathon Goal

Deliver a deployed, judge-accessible Vercel demo that proves one clear end-to-end story:

> Discover an event in the feed or capture it from a poster, save it as Interested, RSVP it into a weather-aware weekly planner, then follow a clearly labelled external booking link.

##### Detailed Success Criteria

The demo is successful when a first-time user can:

- sign in and complete lightweight onboarding in under one minute;
- understand the two entry routes: **Discover** and **Scan Poster**;
- swipe right on a recommendation without believing they have booked it;
- upload or photograph a poster and review extracted information before saving it;
- find feed and scanned items together in **Interested**;
- RSVP an item and see it on the correct day in the weekly planner;
- distinguish Interested, RSVP'd, and externally booked states;
- open an external booking source without believing payment occurred in the app.

#### 1.3 Background

London nightlife information is fragmented across ticketing services, venue pages, social media, physical posters, and recommendations from friends. Users do not need another unfiltered catalogue. They need a fast way to turn both digital recommendations and things they encounter in the real world into a curated shortlist and a practical plan.

The combined design addresses two user behaviours:

- **Planned discovery:** browsing ahead for suitable events, restaurants, prices, locations, and deals.
- **In-the-moment capture:** seeing a poster while out, scanning it before forgetting, and converting it into an actionable event record.

### 2. Users

##### Primary User

A frequent London nightlife-goer aged 18-45 who attends gigs, clubs, comedy nights, pop-ups, theatre, and restaurants. They are comfortable with swipe interactions, card-based event browsing, phone cameras, and calendar views.

##### Core Contexts

- **Advance planning:** deciding what to do over the next seven days.
- **Spontaneous discovery:** finding something for tonight.
- **Real-world capture:** noticing a poster at a venue, station, campus, cafe, or street location and wanting to remember it.

##### User Need

> Help me turn both recommendations and things I notice around London into a small, useful shortlist, then make a realistic plan without confusing interest with commitment or booking.

#### User Personas

WeekAhead is designed for frequent London nightlife-goers who plan both in advance and spontaneously. Users can begin with curated digital recommendations or capture an event encountered in the real world through a poster. Both routes lead into the same Interested, RSVP and external-booking journey.

### 3. Scope

#### 3.1 In Scope

The primary navigation contains:

- **Discover:** personalised swipe feed and nearby recommendations.
- **Scan Poster:** camera/upload entry, extraction review, and save flow.
- **Interested:** unified shortlist containing liked feed items and confirmed poster captures.
- **Planner:** seven-day view of RSVP'd items with weather.
- **Profile:** preferences, price range, and sign-out.

##### Journey A - Curated Discovery

1. User signs in and chooses event types and price range.
2. User opens Discover and sees a visual event or restaurant card.
3. User swipes right to mark it Interested or left to skip it.
4. User opens the item from Interested.
5. User RSVPs it into the Planner.
6. User optionally follows the external booking link.

##### Journey B - Poster Capture

1. User opens Scan Poster.
2. User takes a photo or uploads an image.
3. The app extracts candidate details: title, date, time, venue, address, price, URL or QR destination, and event type.
4. The app shows a review screen with confidence or “needs review” indicators.
5. User corrects any details and saves the item as Interested.
6. User can RSVP it into the Planner or open a detected external link.

##### Unified State Journey

`Recommended or Scanned -> Interested -> RSVP'd -> Booked externally`

- **Interested:** saved for later; not on the Planner.
- **RSVP'd:** appears on the Planner; still not proof of booking.
- **Booked externally:** transaction happens outside the app and is not assumed unless the user manually marks it as booked in a future version.

##### Must Have

- Landing page with Google sign-in
- Lightweight onboarding
- Discover feed with swipe and button controls
- Poster upload or camera capture
- Extraction review and manual correction
- Unified Interested list
- Event detail page
- RSVP into seven-day Planner
- Weather display or fallback
- Explicit external booking handoff
- Vercel deployment

##### Should Have

- Preference-based feed weighting
- QR-code or URL detection from posters
- Nearby filter
- Editable scanned items after saving
- Restaurant recommendations

##### Could Have

- Deals badges using curated or mocked data
- Poster-history gallery
- Share a plan with friends
- Export to Google Calendar or an ICS file
- Manual “booked externally” status


### 4. Features & Acceptance Criteria

#### 4.1 Google Sign-In & Onboarding

**Priority:** Must Have

- Provide a visible Google sign-in action using NextAuth.
- First-time users select event categories and price range.
- Returning users bypass onboarding.
- Failed or cancelled sign-in provides a retry path.

#### 4.2 For You Swipe Feed

**Priority:** Must Have

- Show cards with title, image, event type, date/time, area, and price.
- Right swipe or Interested button saves the item.
- Left swipe or Skip button dismisses it for the session.
- Swipe actions must have keyboard and button alternatives.
- The interface must state that Interested does not RSVP or book.
- Feed ordering should reflect onboarding preferences and, where feasible, prior likes.
- Live-data failure must fall back to sample content.

#### 4.3 Poster Scan & Extraction

**Priority:** Must Have for the combined-design demo

- Allow camera capture on supported mobile browsers and image upload on all devices.
- Accept common image formats such as JPEG, PNG, and WebP.
- Attempt to extract title, date, start time, venue, location, price, event category, source URL, and QR-code URL when present.
- Present extracted values as editable fields before saving.
- Highlight missing or low-confidence fields instead of silently inventing them.
- Prevent saving until a title and date are present, unless the user explicitly saves the item as an incomplete draft.
- Preserve the uploaded image as the item's visual reference for the demo session.
- If extraction fails, allow manual entry without losing the image.
- Saving a reviewed scan creates an Interested item, not an RSVP.

#### 4.4 Saved / Interested Folder

**Priority:** Must Have

- Display both feed-sourced and poster-sourced items in one list.
- Provide a visible source label such as “Recommended” or “Scanned poster.”
- Allow filtering by source, date, type, and price if time permits.
- Let the user open, edit, remove, RSVP, or discard an item.
- Keep scanned items visually consistent with API-sourced items while retaining their source label.

#### 4.5 Event & Restaurant Detail Pages

**Priority:** Must Have

- Display title, description, date/time, price, venue, image, source, and map/location.
- For scanned items, allow editing of extracted details.
- Provide an RSVP action that adds the item to the Planner.
- Provide Cancel RSVP when already RSVP'd.
- Label external actions by source, for example “View on Eventbrite” or “Open detected link.”
- Open external links in a new tab and make the external handoff explicit.
- Never imply that the app processes payment or confirms a reservation.

#### 4.6 Weekly Calendar

**Priority:** Must Have

- Show today plus the next six days.
- Display only RSVP'd items, regardless of whether they came from Discover or Scan Poster.
- Show London weather for every day, including empty days.
- Provide an intentional empty state for days with no plans.
- Handle missing weather data without breaking the Planner.
- Where a scanned date is ambiguous, require confirmation before the item can be RSVP'd.

#### 4.7 Nearby Context

**Priority:** Should Have

- Display event area or distance when location data is available.
- Allow a simple “Near me” filter or location-aware section if browser permission and time allow.
- A denied location permission must not block the core experience.

#### 4.8 Profile & Preferences

**Priority:** Should Have

- Allow users to review and update event types and price range.
- Apply updated preferences to the next feed load.

#### 4.9 Feedback & Status

**Priority:** Must Have

- Show confirmations for Interested, scan saved, RSVP added, RSVP removed, and preferences updated.
- Show progress during image extraction.
- Show actionable error states for unsupported images, failed extraction, unavailable APIs, and invalid dates.

### 5. Non-Functional Requirements

##### NFR-01 - Responsive Design

- Optimise the scan and swipe journeys for mobile.
- Keep the Planner and detail pages usable on desktop.

##### NFR-02 - Performance

- Keep interactions responsive for hackathon-scale use.
- Compress or resize uploaded images before extraction when practical.
- Show progress if extraction takes longer than an immediate interaction.

##### NFR-03 - Accessibility

- Use semantic HTML, visible focus states, adequate contrast, and labelled form fields.
- Provide buttons as alternatives to swipe gestures.
- Ensure extracted poster fields can be reviewed and corrected using a keyboard.

##### NFR-04 - Security and Privacy

- Do not expose OAuth tokens, API secrets, or profile data in client logs or source control.
- Do not store poster images longer than required for the demo unless the user saves them.
- Do not infer or process faces from poster images.
- Treat detected external links as untrusted and validate their scheme before opening.

##### NFR-05 - Reliability

- Use mock or cached content when event, restaurant, weather, mapping, or extraction services fail.
- Preserve user-entered corrections if a later network call fails.

### 6. Constraints

- Framework: Next.js with TypeScript and Tailwind CSS
- Testing: Vitest for critical data transformations and state transitions
- Hosting: Vercel
- Team: solo developer
- Timeline: same-day hackathon demo
- Delivery approach: build the shared PlanItem model and happy path first, then add live integrations and polish

| Risk | Impact | Mitigation |
|---|---|---|
| Poster extraction is inaccurate | User saves the wrong date or venue | Mandatory review screen, editable fields, missing-field warnings, manual fallback |
| Swipe, RSVP, and booking states are confused | Loss of trust | Consistent labels, separate actions, state badges, explicit external-link copy |
| The two designs feel like separate apps | Fragmented demo | Shared PlanItem model, unified Interested list, identical detail and RSVP flows |
| External APIs fail during judging | Broken demo | Adapter layer, cached/mock data, pretested demo records |
| Scanning expands scope too far | Core flow remains unfinished | Limit MVP to upload/camera, extraction review, save, and RSVP; defer advanced recognition |
| Deals promise exceeds available data | Demo appears incomplete | Use clearly curated/mock deal badges or place deals in Could Have |
| Empty Planner looks broken | Judges miss the intended flow | Weather remains visible and each empty day has deliberate copy |

### 7. Data & Integrations

##### Key Data Entities

**UserProfile**
- id
- Google identity fields
- preferred event types
- price range

**PlanItem**
- id
- sourceType: `recommended | scanned`
- sourceProvider: `Eventbrite | DICE | OpenTable | poster | mock`
- title
- description
- category
- startDateTime
- endDateTime
- venueName
- address
- latitude/longitude where available
- priceText
- heroImage
- externalUrl
- extractionConfidence by field for scanned items
- state: `interested | rsvped`

**PosterCapture**
- id
- image reference
- raw extracted text
- detected QR or URL
- extraction status
- linked PlanItem id

##### External Integrations

- Google OAuth through NextAuth
- Eventbrite and DICE for event listings
- OpenTable for restaurant listings
- OpenWeatherMap for daily weather
- Google Maps embed for venue location
- OCR/vision capability for poster text extraction
- QR-code detection where feasible

##### Fallback Strategy

Because the product is a same-day hackathon build:

- each external integration may use a typed adapter with sample data behind it;
- the poster flow may use preselected demo posters and deterministic extracted results;
- the review-and-correct interaction is more important than perfect extraction accuracy;
- fallback content should maintain the same UI shape as live content;
- the demo should never stop at a blank state because an API key, quota, CORS rule, or endpoint fails.

### 8. UX Requirements Summary

1. **Two inputs, one planning journey.** Feed recommendations and poster captures become the same event object wherever possible.
2. **Curation over volume.** The product should reduce choice, not reproduce raw search results.
3. **Interest is not commitment.** A right swipe or saved scan creates an Interested item only.
4. **RSVP is not a transaction.** RSVP means “put this in my personal plan.”
5. **Booking is external.** The source platform must be visible before the user leaves the app.
6. **AI extraction requires confirmation.** Poster-derived details must be reviewable and editable before they are saved.
7. **The demo must survive API failure.** Mock fallbacks are acceptable for discovery, extraction, weather, maps, and booking links.

#### Demo Acceptance Test

A tester with no explanation must be able to complete both paths:

##### Path A

`Sign in -> onboard -> swipe right -> Interested -> RSVP -> Planner -> external booking link`

##### Path B

`Scan/upload poster -> review extracted details -> save as Interested -> RSVP -> Planner`

The build fails the usability check if the tester asks:

- “Did swiping just book that?”
- “Why is my saved item not on the calendar?”
- “Did the app read the poster correctly, or can I change it?”
- “Did I buy a ticket here?”
- “Is this empty screen broken?”

### 9. Sign-off

This version supersedes the single-route PRD by treating curated swipe discovery and mobile poster capture as two inputs into WeekAhead. Development should prioritise the common Interested, RSVP, Planner and external-booking states so both designs reinforce one coherent demo rather than compete for scope.

| Role | Name | Status | Date |
|---|---|---|---|
| Stakeholder | Caoilfhinn Farrell | Pending | |
| BA / UX Researcher | Requirements Elicitation Skill | Prepared | 2026-11-17 |
