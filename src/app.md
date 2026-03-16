---
name: Hello World
description: A simple starter app that greets people using AI.
version: 1
---

# Hello World

A minimal MindStudio app. Takes a name, generates a creative greeting using AI, and saves it. Demonstrates the full app lifecycle (spec, method, table, web interface) without unnecessary complexity.

~~~
Intentionally simple: no authentication, no roles, no pagination, single interface (web only). This is the default scaffold for new projects.
~~~

## Data Model

One table: `greetings` with two columns: `name` (string) and `greeting` (string).

## Hello World Method

Takes `{ name: string }`, generates a creative one-sentence greeting using AI, stores it in the greetings table, and returns the result.

~~~
The AI prompt should ask for a single warm, creative greeting. The response is stored as-is. Use a fast, cheap text model — this is a lightweight creative task.
~~~

Error messages should be friendly and non-technical. Never expose API errors or stack traces.
