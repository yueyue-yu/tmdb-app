# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commonly Used Commands

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the codebase using Next.js's built-in linter.
- `docker build -t tmdb-app .`: Builds a Docker image for the application.
- `docker run -p 3000:3000 tmdb-app`: Runs the application inside a Docker container.

## High-level Code Architecture and Structure

This is a Next.js 15 application using the App Router. The application provides a modern movie information system using the TMDB API.

- `app/`: Contains the core application logic, following the Next.js App Router structure.
    - `app/(pages)/`: This directory likely contains the main pages of the application, grouped for organization. 
    - `app/components/`: Contains shared React components used across the application.
    - `app/lib/`: Contains helper functions and utilities, such as API wrappers for TMDB.
    - `app/layout.tsx`: The root layout for the application.
    - `app/page.tsx`: The main entry page for the application.
- `public/`: Stores static assets like images and fonts.
- `i18n/`: Contains internationalization (i18n) configuration files, likely for `next-intl`.
- `middleware.ts`: Implements Next.js middleware, probably for handling routing or internationalization.
- `next.config.ts`: The configuration file for Next.js.

The application uses Tailwind CSS for styling and TypeScript for type safety. It fetches data from the TMDB API, and requires an API key to be set in a `.env.local` file as `TMDB_API_KEY`.
