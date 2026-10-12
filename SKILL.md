---
name: apple-liquid-glass
description: >-
  Apple's Liquid Glass design language (iOS 26 / macOS 26 HIG) made buildable on
  any platform: the content/chrome two-layer model, regular vs clear glass, real
  refraction (content bending at the rim), the rim light, type scales, system
  colours, component shapes, and Reduce Motion/Transparency/Increase Contrast
  fallbacks. Ships a CSS token file and a refraction script for the web, plus
  routes for SwiftUI/UIKit, Android Compose (Haze), Flutter, Electron, Tauri,
  Windows and Linux. Use when building or reviewing any UI that should look
  Apple-made or "liquid glass": "iOS style", "macOS style", "Liquid Glass",
  "glassmorphism", "frosted glass", "refraction", SF Pro typography, "Apple
  gibi görünsün", "cam efekti", "buzlu cam", "kırılma efekti", or when an
  Apple-style UI looks fake. Not for app flows, navigation or screen specs
  (use `mobile-ux-designer`).
---

# Apple Liquid Glass — the design language, on any platform

Scope: any interface that should carry Apple's Liquid Glass look — a web page,
a web app, an Electron or Tauri desktop app, an Android or Flutter app, or a
native Apple app. The design rules below are the same everywhere; only the way
you get the backdrop, the blur and the bend differs. Pick the route first:

| Building for | Route |
|---|---|
| Web, Electron, Tauri, WebView | `assets/tokens.css` + `assets/refraction.js` (this file and the references) |
| iOS, iPadOS, macOS 26+ native | the system material: SwiftUI `glassEffect`, UIKit `UIGlassEffect` — never a fake |
| Android (Compose) | Haze `haze-glass` recipe |
| Flutter | `BackdropFilter` + `ImageFilter.shader` |
| Windows / Linux native | draw it in-app; window materials (Mica, Acrylic) are not Liquid Glass |

Per-platform code, version limits and fallbacks: `references/platforms.md`.
For app flows, navigation and screen specs use `mobile-ux-designer`.

This skill exists so you never have to re-derive Apple's design language from
scratch. Everything here was read off Apple's own Human Interface Guidelines and
its figures, not from memory or from blog posts about Apple. Where Apple does not
actually state something, this skill says so rather than inventing a rule —
that honesty is the point, because most "Apple-style" work fails by confidently
applying invented rules.

## The one idea everything else follows from

Apple's interface is **two layers**, and the entire language is about keeping
them distinct:

- **The content layer** — what the app is actually about. Opaque. Solid
  surfaces, real shadows, no glass. Text lives here and must never sit on a
  moving background.
- **The functional layer** — toolbars, sidebars, tab bars, popovers, menus,
  floating controls. This is where **Liquid Glass** lives. It floats above the
  content, refracts it, and never competes with it.

Apple states this directly: *"Don't use Liquid Glass in the content layer…
including it in the content layer can result in unnecessary complexity and a
confusing visual hierarchy."*

If you take one thing: **glass on chrome, never on cards.** The single most
common failure of "Apple-style" work is frosting everything, which destroys the
hierarchy the material exists to create.

## Output

Give the user what they asked for — a fixed page, a diagnosis, a component —
at the length and in the format they asked for. Don't pad a fix with an unrequested
design-philosophy writeup, and don't skip real requirements to stay brief: verify
contrast, tap-target size, and the fallbacks below even when not asked, because a
result that looks right but fails them is exactly the "fake Apple" outcome this
skill exists to prevent.

The 2026 refinement matters too. Apple's macOS 27 Golden Gate page
(apple.com/os/macos, checked 2026-09-27): *"Updates to Liquid Glass ensure
exceptional readability with more uniform refraction and improved contrast."*
It also lists uniform toolbars, edge-to-edge sidebars, and updated window shapes.
So: heavier tint, visible refraction rim, one continuous bar rather than
floating islands. If you build the thin, barely-there glass of the first
release, you are building the version Apple already corrected.

## Start from the tokens (web)

`assets/tokens.css` is a working token layer — light and dark palettes, the
glass primitive with its refraction rim, the scroll edge effect, and fallbacks
for reduced transparency, reduced motion, and no `backdrop-filter` support at
all. Start from it instead of hand-rolling values, but verify it against the
actual brief rather than pasting it in unread: check it still meets the
contrast and tap-target rules below in your context, and adapt values (colours
especially — Apple restates it may change them release to release) rather than
citing the file as unquestionable ground truth.

Two things in it are worth understanding rather than just using:

**The glass primitive** is a tinted translucent background + `backdrop-filter:
saturate(180%) blur(28px)` + an inset top highlight. The highlight is what reads
as bent light; without it the surface looks like plain transparency, which is
the tell of glassmorphism-by-imitation. Apple's own material figures show a
distinct bright rim tracing the edge.

**The rim** (`.glass::before`) is a 1px gradient ring, brightest upper-left,
faint along the sides, brighter again lower-right. A uniform white border reads
as a sticker; the uneven rim reads as a thick bevel catching light.

**The ambient ground.** Glass needs something behind it to refract or it renders
as flat grey. A subtle multi-stop gradient on the page background gives the
material something to do. Apple gets this free from wallpapers and photos; on
the web you have to supply it.

## Refraction: the part blur cannot fake

Apple: *"This translucent material reflects and refracts its surroundings."*
Zoom into any of Apple's own images and the text or shapes that reach the edge
of a glass control **bend and stretch along its outline**, while the middle
stays clear. This is what separates Liquid Glass from 2020-era glassmorphism,
and it is the first thing users miss when it is absent. Build it in by default
for glass controls; don't wait to be asked.

- Mechanism (all platforms): inside a rim band, show the content from further
  inward, strongest at the outline, following the real shape (capsule ends,
  rounded corners).
- Web: add `data-refract` to a glass element and load `assets/refraction.js`.
  In Chromium engines (Chrome, Edge, Android WebView, Electron, Tauri on
  Windows) it bends the live backdrop. Safari and Firefox can't run `url()`
  filters in `backdrop-filter`, so for glass over a known area add
  `data-refract-source="#id"`: the script bends a copy of that area instead,
  in every browser. Glass with neither keeps plain blur. Always give hero and
  demo glass a source, or most visitors (Safari, Firefox) see no bend at all.
- Clear glass is where text visibly curves (little blur); on regular glass the
  bend shows in the blurred picture's shapes and colour edges.
- Bending glass gets a lighter tint (`--glass-refract`) so the bend shows. Glass
  that carries words — menus, popovers, sheets, sidebars — adds `.glass-text`
  to keep the full tint; otherwise its labels can drop below contrast over
  bright content.
- Off under Reduce Transparency, never animated under Reduce Motion.
- Check it: put the control over a line of text and screenshot. Letters at the
  rim curve and stretch; the middle stays readable.

Values, tuning table and the test method: `references/materials.md`
("Refraction and the rim"). Android, Flutter and native routes:
`references/platforms.md`.

## Non-negotiables

These are the rules that, when broken, make the result read as not-Apple.

1. **Glass only in the functional layer.** Content cards get opaque surfaces and
   shadows.
2. **Colour is rationed.** Apple: *"Apply color sparingly to the Liquid Glass
   material… reserve it for elements that truly benefit from emphasis, such as
   status indicators or primary actions."* Their figure shows a toolbar with
   three tinted buttons marked incorrect, and the same toolbar with only the
   primary action tinted marked correct. One coloured thing per bar.
3. **Emphasis goes on the background, not the glyph.** *"To emphasize primary
   actions, apply color to the background rather than to symbols or text."* The
   exception is a selected tab: there Apple colours the icon and label and
   leaves the bar neutral.
4. **Hairlines, not borders.** Separators are 0.5px at ~12% opacity, and in
   lists they inset past the leading icon. A 1px solid grey border is a web
   idiom, not an Apple one.
5. **No light font weights.** Apple: *"prefer Regular, Medium, Semibold, or Bold
   font weights, and avoid Ultralight, Thin, and Light."*
6. **Sentence case, not uppercase-with-tracking.** Uppercase micro-labels with
   wide letter-spacing are a dashboard/editorial idiom. Apple's section headers
   are sentence case and rely on weight and colour.
7. **Hierarchy from size, weight and colour — never from rules and boxes.**
   Headings are not underlined and sections are not fenced. Apple's own Mail
   figure builds four levels purely from those three variables.
8. **Icons are all-or-nothing within a group.** Apple's menu rule: *"either
   every item in a group has an icon, or none do."* Half-iconed lists look
   unfinished.
9. **Every custom control needs a press state.** Apple calls this out
   explicitly — without it a control "can feel unresponsive."
10. **Content extends under the chrome.** Use the scroll edge effect so content
    dissolves as it passes beneath a bar, and extend the background beneath
    sidebars (see below). Content that stops dead at a sidebar edge is the
    thing Apple's own incorrect/correct figure pair is about.
11. **Every `backdrop-filter` use needs an `@supports not (...)` opaque
    fallback**, separate from the reduced-transparency media query — one
    handles missing browser support, the other a user setting. Skipping it is
    a common, easy-to-miss bug: the bar silently renders too-transparent with
    no blur.
12. **Glass bends and has a rim.** A glass control with a uniform 1px white
    border and no refraction is glassmorphism, not Liquid Glass. Use the rim
    gradient and refraction wherever the platform allows, and a clean blur
    fallback where it doesn't.
13. **Hit targets are at least 44×44pt on iOS** (macOS is denser but still
    needs a comfortable click target). Destructive actions (delete, remove
    account) get the destructive/red role, never a neutral one.

## Type

Apple's scale is not decorative — it is a fixed ladder, and staying on it is
most of what makes typography feel native. The iOS default (Large) styles:

| Style | Weight | Size | Leading |
|---|---|---|---|
| Large Title | Regular | 34 | 41 |
| Title 1 | Regular | 28 | 34 |
| Title 2 | Regular | 22 | 28 |
| Title 3 | Regular | 20 | 25 |
| Headline | Semibold | 17 | 22 |
| Body | Regular | 17 | 22 |
| Callout | Regular | 16 | 21 |
| Subhead | Regular | 15 | 20 |
| Footnote | Regular | 13 | 18 |
| Caption 1 | Regular | 12 | 16 |
| Caption 2 | Regular | 11 | 13 |

macOS runs a tighter ladder (Body 13/16, Large Title 26/32) and its Headline is
Bold rather than Semibold. A desktop-first web layout usually wants something
between the two: iOS sizes for headings and reading text, macOS density for
sidebars and metadata.

Minimums are real: iOS 11pt, macOS 10pt. Below that Apple considers text
illegible, and web pixels are smaller than points, so treat ~11px as your floor.

Font stack: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', …` gives real SF
on Apple hardware. Everywhere else you need a fallback — Inter is the closest
widely available substitute. Never link SF from a CDN; it is not licensed for
that.

Apple's tracking is optically compensated per size: loose below 12pt, zero at
exactly 12pt, tightest around 19–20pt (≈ −0.45pt), then *positive* from about
24pt (+0.40pt at 29–34pt) before decaying to zero at display sizes. The system
font applies this itself on Apple hardware. The web values in the token file
(`-0.022em` headings, `-0.012em` body, `0` captions) are a web convention that
keeps fallback fonts such as Inter from looking loose — not a conversion of
Apple's table, so don't cite them as Apple's.

Full tables, the tracking curve, and SF Symbols weight/scale pairing:
`references/typography.md`.

## Colour

Apple ships exact values, but also says *"Avoid hard-coding system color
values… The actual color values may fluctuate from release to release."* So use
them as anchors, not gospel.

The semantic set is more useful than the palette: `label` /`secondaryLabel` /
`tertiaryLabel` / `quaternaryLabel` for text, `separator` for hairlines, and two
background families — system and grouped — each with primary / secondary /
tertiary. Grouped is the one to reach for when content sits in cards: the page
takes the grouped background (a light grey) and the cards take white. That
inversion of the web default — grey page, white cards — is a large part of why
Apple layouts read as Apple.

Dark mode is not an inversion. Apple uses **base** and **elevated** surfaces:
near-black for the receding backmost layer, a distinctly lighter charcoal for
anything that should read as raised. Painting everything pure black is wrong,
and Apple's own figure pair demonstrates it.

Contrast minimums, stated by Apple: **4.5:1 up to 17pt**, **3:1 at 18pt and
above**, **3:1 for bold at any size**.

Exact RGB values for every system colour across light, dark, and both
increased-contrast variants, plus the full semantic list for iOS and macOS:
`references/color.md`.

## Material

Two variants, and choosing wrong is visible:

- **Regular** — blurs and adjusts the luminosity of what is behind it. Almost
  everything uses this. In Apple's figures it is close to opaque; the
  background reads as soft colour, not as a picture.
- **Clear** — highly translucent, for controls floating over photos and video
  where the media must stay prominent. If the content behind is bright, Apple
  specifies **a dark dimming layer at 35% opacity** underneath so the labels
  survive.

The material also adapts: on light content the glass and its symbols go dark,
on dark content they go light. On the web that means your glass tokens need
genuinely different values per theme, not one value with a different opacity.

Recipes, the four standard materials, and vibrancy levels:
`references/materials.md`.

## Components

Component shapes carry a lot of the signal. The short version:

- **Toolbar** — one uniform bar, monochromatic, actions as circular or capsule
  chips, related actions grouped into a shared capsule. Title (and optional
  subtitle) can live in it.
- **Sidebar** — edge-to-edge, glass, SF-Symbol icons tinted with the accent,
  rounded selection fill on the active row, no chevrons. Extend the content's
  background beneath it (blurred and mirrored) instead of drawing a border.
- **Tab bar** — floating capsule; only the selected item is tinted, and the
  tint goes on its icon and label, not on the bar.
- **Lists** — inset grouped: a rounded container, rows inside it, hairlines
  inset past the leading thumbnail, a chevron only when the row navigates.
- **Segmented control** — equal-width segments in a filled track, the selected
  segment a raised light thumb. Five to seven segments maximum, about five on
  phone widths.
- **Popover** — an outer glass card containing nested opaque groups, with a
  pointer aimed at whatever opened it. One popover at a time, never stacked.

Every component's rules, limits, and what its figures show:
`references/components.md`.

## Motion and accessibility

Apple names no universal easing curve in the HIG, so don't claim one. What it
does say: motion must be purposeful, brief, precise, cancellable, and it should
track the user's gesture. In practice `cubic-bezier(0.22, 1, 0.36, 1)` around
200–320ms reads correctly for interface movement, and a slightly springier
`cubic-bezier(0.32, 0.72, 0, 1)` suits a segmented-control thumb — but present
those as sensible choices, not as Apple's specification.

Three system settings change what you render, and honouring them is part of the
language rather than an extra:

- **Reduce Motion** — tighten springs, replace axis transitions with fades,
  don't animate z-depth, and **don't animate into or out of blurs**. That last
  one directly constrains glass transitions.
- **Reduce Transparency** — swap the material for an opaque fill. Apple doesn't
  spell this out for Liquid Glass specifically, but every translucent surface
  needs the fallback; `@media (prefers-reduced-transparency: reduce)` is in the
  token file.
- **Increase Contrast** — Apple ships genuinely different colour values, and
  flips glyph colours where needed. Not a filter.

Details and the full rule lists: `references/motion-accessibility.md`.

## Before you call it done

Run through this. Each item is a mistake that has actually shipped in work
claiming to be Apple-style:

- Is anything in the content layer frosted? Un-frost it.
- Count the coloured elements in each bar. More than one? Cut back.
- Any uppercase letter-spaced micro-labels? Convert to sentence case.
- Any 1px solid borders where a 0.5px hairline belongs?
- Any font weight below Regular?
- Does the smallest text clear ~11px?
- Does content pass *under* the toolbar with a scroll edge effect, or stop at it?
- Does the sidebar have a hard edge instead of an extended background?
- Do rows in one group disagree about having icons?
- Does every control have a press state?
- In dark mode, is everything pure black, or are base and elevated distinct?
- Does text passing under a glass control bend at the rim in Chrome *and* in
  Firefox or Safari (needs `data-refract-source` there), on Android 13+ and
  native Apple? Does the rim have its upper-left highlight?
- Where bending is unavailable (Safari, Firefox, old Android), does the glass
  still look finished as plain blur glass?
- Does the page still work with reduced transparency and reduced motion, and
  with no `backdrop-filter` support at all (`@supports` fallback)?
- Is every tap target at least 44×44pt, and is every destructive action styled
  as destructive?

## Provenance and honest gaps

Sourced from developer.apple.com/design/human-interface-guidelines (Materials,
Color, Typography, Layout, Toolbars, Sidebars, Tab bars, Lists and tables,
Buttons, Popovers, Menus, Sheets, Motion, Accessibility, Feedback, Dark Mode)
and the Adopting Liquid Glass technology overview, including the figures on
those pages. Change-log dates seen: Color December 2025, Materials September
2025, Sidebars June 2026, Typography December 2025. Type ladders, tracking,
system/gray colour values, the 35% dimming layer, and the contrast table were
re-checked against the HIG data on 2026-09-27.

Refraction and platform material: Apple newsroom, June 2025 ("reflects and
refracts its surroundings"); SwiftUI `glassEffect`/`Glass` and UIKit
`UIGlassEffect` documentation; Haze 2.0.1 as used in a shipped Android app;
Flutter `ImageFilter.shader` API docs; Electron BrowserWindow docs; the
tauri-apps/window-vibrancy README. Browser behaviour of `refraction.js`
checked in Chromium and Firefox on 2026-10-12. Reference implementations:
`examples/`.

Known gaps — do not fill these with invention:

- **There is no published arithmetic formula for concentric corner radii.**
  Apple says the hardware's shape informs the curvature of nested elements and
  ships `ConcentricRectangle` and `cornerConfiguration`, but states no
  inner-equals-outer-minus-padding rule. Nesting radii so the gap stays visually
  even is a sound derived convention; present it as your own reasoning.
- Apple publishes no pixel spec for press states, no toolbar height, and no
  standard spacing scale — only "prefer standard spacing metrics."
- No named easing preset appears in the HIG text.
- Apple publishes no refraction numbers (rim width, displacement, index). The
  values in this skill are tuned by eye against Apple's images and a shipped
  app; present them as such.
