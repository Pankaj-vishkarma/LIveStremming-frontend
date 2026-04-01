# Voxylive Frontend

This project is a frontend implementation of the Voxylive application built using React and Tailwind CSS. The UI is developed based on the provided Figma design with a mobile-first approach.

---

## Project Overview

The application includes an onboarding flow and a feed screen. The focus has been on matching the Figma design closely in terms of layout, spacing, and styling.

---

## Work Completed

* Implemented onboarding flow with the following screens:

  * Splash screen
  * Welcome screen
  * Email input screen with custom keyboard
  * OTP verification screen
  * Date of Birth selection screen
  * Profile setup screen

* Implemented Feed screen:

  * Header (user info, coins, notification icon)
  * Tabs section with horizontal scroll
  * Dropdown filter (Global, India, etc.)
  * Grid layout with dynamic cards (image, avatar, name, views)
  * Bottom navigation bar

* Fixed UI and UX issues:

  * Removed visible scrollbars and enabled smooth scrolling
  * Ensured consistent layout across all screens (max-width: 412px)
  * Improved spacing, alignment, and component structure
  * Added back navigation in onboarding flow

---

## Key Files and Changes

* `src/pages/onboarding/Onboarding.jsx`

  * Managed step-based navigation (next and previous flow)

* `src/pages/onboarding/steps/Splash.jsx`

  * Implemented splash screen UI

* `src/pages/onboarding/steps/Welcome.jsx`

  * Added background image and call-to-action layout

* `src/pages/onboarding/steps/Email.jsx`

  * Integrated custom keyboard input
  * Added back navigation functionality

* `src/pages/onboarding/steps/Otp.jsx`

  * Implemented OTP input with auto focus and auto-submit

* `src/pages/onboarding/steps/Dob.jsx`

  * Created date selection UI (month, date, year)

* `src/pages/onboarding/steps/Profile.jsx`

  * Added profile setup with avatar selection and finish action

* `src/pages/main/Feed.jsx`

  * Built complete feed UI with header, tabs, dropdown, grid, and bottom navigation
  * Made feed data dynamic (different avatars, names, and views)

* `src/components/Keyboard1.jsx`

  * Implemented custom keyboard layout and input handling

---

## Tech Stack

* React
* React Router DOM
* Tailwind CSS

---

## Setup

Install dependencies and run the project:

```bash
npm install
npm run dev
```

---

## Status

Frontend UI is completed based on the current scope. Backend integration is not included yet.
