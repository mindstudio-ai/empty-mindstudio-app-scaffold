---
name: Visual Identity
description: Minimal dark interface inspired by Apple and OpenAI design language.
version: 1
---

# Visual Identity

## Aesthetic

Pure black. Restrained, confident, typographic. The feel of apple.com or chatgpt.com — the design gets out of the way. No ornamentation, no gradients, no glow effects. Just strong hierarchy, precise spacing, and exceptional clarity.

## Color Palette

| Token      | Value                          | Usage                        |
| ---------- | ------------------------------ | ---------------------------- |
| Background | `#000000`                      | Page background              |
| Surface    | `#1c1c1e`                      | Cards, inputs                |
| Border     | `#2c2c2e`                      | Dividers                     |
| BorderSub  | `#3a3a3c`                      | Input focus border           |
| Text       | `#f5f5f7`                      | Primary text                 |
| Secondary  | `#86868b`                      | Subtitles, secondary text    |
| Tertiary   | `#48484a`                      | Placeholders, faint text     |

No accent color. The white button on black is the primary action. Everything else is grayscale.

## Typography

- **Primary font**: SF Pro Display / system-ui — the system font stack. No external fonts needed.
- **Heading**: 40px, weight 600, tight letter-spacing (-0.03em)
- **Body**: 15-17px, weight 400
- **Labels**: 13px, weight 500
- **Button**: 15px, weight 600

## Surfaces

Cards use the elevated surface color (`#1c1c1e`) with no border or shadow. When grouped, cards are separated by 1px dividers (`#2c2c2e`) inside a single rounded container. Inputs match the card surface with a transparent border that appears on focus.

## Spacing

120px top padding on desktop, 72px on mobile. 48px below the header. 56px between input and content. Cards have 20px vertical, 24px horizontal padding. Everything feels spacious without being empty.

## Interaction

- White button inverts on hover (brighter white)
- Subtle scale on press (0.97)
- Cards animate in with height reveal, not slide
- Streaming text shows a small pulsing dot at the end
- No hover states on cards — the list is for reading, not clicking
