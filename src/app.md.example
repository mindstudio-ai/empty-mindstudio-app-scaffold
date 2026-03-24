---
name: Hello World
description: A simple starter app that greets people using AI.
version: 1
---

# Hello World

A simple app that greets people. The user enters their name, the app generates a creative, personalized greeting using AI, and saves it so they can see all their past greetings.

~~~
Intentionally simple: no authentication, no roles, no pagination, single interface (web only). This is the default scaffold for new projects.
~~~

## Data

The app remembers every greeting it generates, along with who it was for.

~~~
One table. Columns: the person's name (string) and the generated greeting text (string). System columns (id, timestamps) are automatic.
~~~

## Greeting

When someone asks for a greeting, the app uses AI to write a single warm, creative sentence for them, saves it, and shows it right away.

~~~
The AI prompt should ask for exactly one sentence — warm, creative, personalized to the name. The response is stored as-is. Use a fast, cheap text model — this is a lightweight creative task.
~~~

Error messages should be friendly and human. Never show technical details to the user.
