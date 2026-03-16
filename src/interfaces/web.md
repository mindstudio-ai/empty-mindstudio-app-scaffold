---
name: Web Interface
description: Simple, pretty Hello World single-page app.
version: 1
---

# Web Interface

A single-screen app centered in the viewport. Two sections: an input area at the top and a list of past greetings below.

## Input Area

Centered at the top of the page. A friendly heading ("Hello World"), a name input field with placeholder text ("What's your name?"), and a "Say Hello" button. The input auto-focuses on load.

When the user submits, the button shows a loading state ("Thinking...") and the input is disabled. On completion, the new greeting appears at the top of the list with a gentle animation.

## Greetings List

Below the input area. Each greeting is a card showing the greeting text and the name it was for. Newest first. Cards animate in when added.

Empty state: a friendly message like "No greetings yet. Say hello to someone!" centered where the list would be.

## Layout

Full viewport, centered content column (max-width ~480px). Generous padding. The input area stays at the top, the greeting list scrolls if needed. App-like feel — not a web page.
