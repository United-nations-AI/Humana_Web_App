# Font Usage Reference

All fonts are loaded via `next/font/google` in `src/app/layout.tsx` — no external `@import` or `@font-face`.

---

## Space Grotesk — Primary UI Font

**CSS variable:** `--font-space`  
**Fallback:** `Arial, sans-serif`  
**Weights loaded:** 300, 400, 500, 600, 700

| CSS Class / Element | Where Used | Size | Weight |
|---|---|---|---|
| `body` | Global default — every page | 16px | 400 |
| `.heading-1` | Hero headings (Home, About) | clamp(36px → 72px) | 700 |
| `.heading-2` | Section headings (Home, About, Contact) | clamp(28px → 44px) | 700 |
| `.heading-3` | Sub-headings (Home features, About) | inherited | 600 |
| `.body-text` | Long-form paragraphs | 16px | 400 |
| `.btn-primary` | Primary CTA buttons (Home, About, Contact) | 15px | 600 |
| `.btn-outline` | Outline CTA buttons | 15px | 600 |
| **Navbar** | | | |
| `.nav-logo-name` | "Humana AI" logo text in navbar | 15px | 700 |
| `.nav-link` | Desktop nav links (Home, Chat, About, Contact) | 15px | 400 |
| `.nav-cta-btn` | "Try Now" CTA button in navbar | 13px | 600 |
| `.nav-mobile-link` | Mobile menu nav links | 15px | 400 |
| `.nav-mobile-cta` | Mobile menu CTA button | 14px | 600 |
| **Chat Sidebar** | | | |
| `.sidebar-logo-name` | "Humana AI" logo text in sidebar | 13px | 700 |
| `.sidebar-new-btn` | "+ New Chat" button | 13px | 500 |
| `.sidebar-empty` | "No chats yet" empty state | 13px | 400 |
| `.sidebar-thread-title` | Chat history thread names | 13px | 400 (active: 500) |
| `.sidebar-clear-btn` | "Clear all history" button | 12px | 400 |
| `.sidebar-confirm-yes` | Delete confirmation "Yes" button | 12px | 500 |
| `.sidebar-confirm-no` | Delete confirmation "No" button | 12px | 500 |
| **Chat Header** | | | |
| `.chat-header-title` | Active thread title in header | 14px | 600 |
| `.chat-nav-link` | Home / Chat / About / Contact links in chat header | 12px | 500 |
| `.chat-lang-btn` | Language switcher button in chat header | 11px | 500 |
| `.chat-lang-opt` | Language dropdown options | 12px | 400 |
| **Chat Messages Area** | | | |
| `.chat-welcome-heading` | "What would you like to know?" welcome text | clamp(22px → 30px) | 600 |
| `.chat-prompt-btn` | Suggested prompt buttons | 13px | 500 |
| `.msg-user-text` | User message bubble text | 15px | 400 |
| `.ai-prose p` | AI response paragraphs | 15px | 400 |
| `.ai-prose ul, ol` | AI response lists | 15px | 400 |
| `.ai-prose h1` | AI response heading level 1 | 18px | 700 |
| `.ai-prose h2` | AI response heading level 2 | 16px | 700 |
| `.ai-prose h3` | AI response heading level 3 | 14px | 700 |
| **Chat Input** | | | |
| `.chat-textarea` | Message input field | 15px (mobile: 16px) | 400 |
| `.chat-voice-status` | "Recording…" mic status label | 12px | 500 |
| `.chat-input-error` | Error banner below input | 12px | 400 |
| `.chat-url-input` | URL attachment input field | 13px | 400 |
| `.chat-url-add-btn` | "Add" URL button | 13px | 600 |
| `.chat-url-cancel-btn` | "Cancel" URL button | 13px | 400 |
| **Footer** | | | |
| `.footer-brand-name` | "Humana AI" in footer | 17px | 700 |
| `.footer-brand-desc` | Footer tagline / description | 14px | 400 |
| `.footer-link` | Footer navigation links | 14px | 400 |
| **Contact Page** | | | |
| `.form-input` | Name, Email, Subject fields | 14px | 400 |
| `.form-textarea` | Message textarea | 14px | 400 |
| **Terms Page** | | | |
| `.toc-link` | Table of contents links | 12px | 400 |
| **Language Switcher (site pages)** | | | |
| `.lang-btn` | Language toggle button in navbar area | 13px | 500 |
| `.lang-option-native` | Language name in dropdown (e.g. "English") | 14px | 500 |
| `.lang-mobile-opt` | Mobile language pill buttons | 13px | 500 |

---

## JetBrains Mono — Monospace / Label Font

**CSS variable:** `--font-jetbrains`  
**Fallback:** `'Courier New', monospace`  
**Weights loaded:** 400, 500

| CSS Class / Element | Where Used | Size | Weight |
|---|---|---|---|
| `.label-xs` | Utility uppercase label class | 11px | 500 |
| `.mono-label` | Utility mono label class | 10px | 500 |
| `.tag` | Pill/badge tags (Home features, About) | 10px | 500 |
| **Navbar** | | | |
| `.nav-logo-sub` | "Human Rights AI" sub-label under logo | 9px | 500 |
| `.nav-cta-label` | "Free · Open Access" label beside CTA | 9px | 500 |
| **Chat Sidebar** | | | |
| `.sidebar-group-label` | "Today" / "Yesterday" group headings | 9px | 500 |
| `.sidebar-thread-meta` | Thread timestamp below title | 9px | 400 |
| **Chat Header** | | | |
| `.chat-header-sub` | "Human Rights Assistant" subtitle | 9px | 500 |
| `.chat-online-label` | "Online" status text | 9px | 500 |
| **Chat Messages** | | | |
| `.msg-timestamp` | Message timestamp (e.g. "2:34 PM") | 9px | 400 |
| `.msg-copy-label` | "Copy" label on copy button | 9px | 500 |
| `.att-badge-name` | Filename in AI message attachment badge | 10px | 500 |
| `.voice-player-time` | Audio player elapsed / total time | 10px | 400 |
| `.tts-listen-btn` | "Listen" TTS trigger button | 11px | 400 |
| `.tts-error-label` | TTS error message | 10px | 400 |
| `.ai-prose code` | Inline code in AI responses | 12px | 400 |
| `.ai-prose pre code` | Code blocks in AI responses | 12px | 400 |
| **Chat Input** | | | |
| `.chat-input-hint` | "Shift+Enter for new line" hint text | 9px | 500 |
| `.chat-attachment-name` | Filename in attachment chip in input tray | 10px | 500 |
| **Footer** | | | |
| `.footer-col-heading` | "Navigation" / "Legal" column headings | 9px | 500 |
| `.footer-copy` | Copyright notice | 10px | 500 |
| `.footer-badge` | "Qatar CPD" badge | 9px | 500 |
| **Contact Page** | | | |
| `.form-label` | "NAME", "EMAIL", etc. field labels | 9px | 500 |
| **Language Switcher (site pages)** | | | |
| `.lang-option-label` | Language code label (e.g. "EN", "AR") | 9px | 500 |

---

## Size Summary

| Range | Font | Usage |
|---|---|---|
| 72px (max) | Space Grotesk | Hero headings |
| 30px (max) | Space Grotesk | Chat welcome heading |
| 18px | Space Grotesk | AI response h1 |
| 17px | Space Grotesk | Footer brand name |
| 16px | Space Grotesk | Body default, AI h2, mobile textarea |
| 15px | Space Grotesk | Nav links, buttons, message text, AI prose |
| 14px | Space Grotesk | Footer links, form inputs, mobile CTA, AI h3 |
| 13px | Space Grotesk | Sidebar items, URL inputs, lang buttons |
| 12px | Space Grotesk | Chat nav links, error text, TOC links, AI code |
| 11px | Space Grotesk / JetBrains Mono | Lang button / label-xs / TTS button |
| 10px | JetBrains Mono | Mono labels, attachment names, timestamps, footer copy |
| 9px | JetBrains Mono | Logo sub, nav labels, group headings, form labels, timestamps |
