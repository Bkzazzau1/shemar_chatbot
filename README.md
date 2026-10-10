# Shemar Collection chatbot demonstration

This is a **frontend-only** customer service chatbot demonstration made with React, JavaScript and Vite. It is designed to display both customer interaction and administrative workflows **without requiring a separate backend server or database**.

## Features

- Customer chat with editable keyword-based intent matching and prepared responses
- Browser-local conversation history
- Feedback on individual answers (Helpful / Not helpful)
- Requests for human support, recorded as demonstration escalations
- Interactive admin demonstration: add/edit/delete FAQs and intents, view conversations and feedback, change escalation status
- Browser-local demo storage using `localStorage`, plus a reset action

All records are isolated to the current browser and device. This is not a multi-user service. **Do not enter private or real customer information.** The admin dashboard is publicly visible for demonstration; it does not provide secure authentication or actual agent communication.

## Technology and limitations

- React 19, Vite 8, JavaScript
- Keyword-based scoring for predefined intent categories, with prepared answers
- Browser `localStorage` for local demo records
- No Python backend, server API, database, authentication server or remote storage
- **No deployed pre-trained NLP model**. Keywords do not constitute pre-trained NLP.

## Run locally

```bash
cd shemar-chatbot-demo
npm ci
npm run dev
```

Create a production build using `npm run build`.

## Publication

A GitHub Actions workflow builds the application for GitHub Pages. The current workflow requires **Settings > Pages > Build and deployment > Source: GitHub Actions** to be configured for this repository. If Pages is disabled, the build can still succeed while the deployment job fails during `actions/configure-pages`.

## Academic project guidance

This repository can substantiate a frontend demonstration, keyword intent matching and simulated administration. It does not substantiate a claim of a deployed pre-trained NLP model, secure authentication, a persistent remote database, live human-agent escalation, or the dissertation's previously reported 15 passing tests without further evidence. The academic report should distinguish the proposed architecture from what was actually implemented and evaluated.
