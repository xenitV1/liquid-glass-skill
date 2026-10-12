# Typography — exact specification

Read off developer.apple.com/design/human-interface-guidelines/typography and
/sf-symbols. Change log on the typography page: December 16, 2025 — "Added
emphasized weights to the Dynamic Type style specifications for each platform."

Contents: [1](#1-ios-default-large-text-styles) iOS text styles ·
[2](#2-macos-text-styles) macOS text styles · [3](#3-default-and-minimum-sizes)
Size floors · [4](#4-hierarchy-rules) Hierarchy rules ·
[5](#5-the-families) Families and weights · [6](#6-tracking) Tracking curve ·
[7](#7-sf-symbols) SF Symbols · [8](#8-translating-to-the-web) Web translation

---

## 1. iOS default (Large) text styles

The default Dynamic Type size. Verified as the default by checking that Body =
17pt (Apple publishes one table per Dynamic Type size).

| Style | Weight | Size (pt) | Leading (pt) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 34 | 41 | Bold |
| Title 1 | Regular | 28 | 34 | Bold |
| Title 2 | Regular | 22 | 28 | Bold |
| Title 3 | Regular | 20 | 25 | Semibold |
| Headline | Semibold | 17 | 22 | Semibold |
| Body | Regular | 17 | 22 | Semibold |
| Callout | Regular | 16 | 21 | Semibold |
| Subhead | Regular | 15 | 20 | Semibold |
| Footnote | Regular | 13 | 18 | Semibold |
| Caption 1 | Regular | 12 | 16 | Semibold |
| Caption 2 | Regular | 11 | 13 | Semibold |

## 2. macOS text styles

Apple labels these columns "Text style" and "Line height", not "Style" and
"Leading". macOS does **not** support Dynamic Type — this ladder is fixed.

| Text style | Weight | Size (pt) | Line height (pt) | Emphasized |
|---|---|---|---|---|
| Large Title | Regular | 26 | 32 | Bold |
| Title 1 | Regular | 22 | 26 | Bold |
| Title 2 | Regular | 17 | 22 | Bold |
| Title 3 | Regular | 15 | 20 | Semibold |
| Headline | **Bold** | 13 | 16 | **Heavy** |
| Body | Regular | 13 | 16 | Semibold |
| Callout | Regular | 12 | 15 | Semibold |
| Subheadline | Regular | 11 | 14 | Semibold |
| Footnote | Regular | 10 | 13 | Semibold |
| Caption 1 | Regular | 10 | 13 | Medium |
| Caption 2 | Medium | 10 | 13 | Semibold |

Note the divergences from iOS: macOS Headline is Bold (emphasized Heavy), and
Caption 2 is Medium at base weight. Desktop hierarchy leans harder on weight
because the sizes are so close together.

## 3. Default and minimum sizes

| Platform | Default | Minimum |
|---|---|---|
| iOS, iPadOS | 17 pt | 11 pt |
| macOS | 13 pt | 10 pt |
| tvOS | 29 pt | 23 pt |
| visionOS | 17 pt | 12 pt |
| watchOS | 16 pt | 12 pt |

## 4. Hierarchy rules

Apple's bolded rules, condensed:

- "Adjust font weight, size, and color as needed to emphasize important
  information and help people visualize hierarchy." Maintain the *relative*
  hierarchy when text sizes change.
- "Minimize the number of typefaces you use, even in a highly customized
  interface." Mixing families obscures hierarchy and reads as poorly designed.
- "Prioritize important content when responding to text-size changes." Not all
  content should scale equally.
- "In general, avoid light font weights… prefer Regular, Medium, Semibold, or
  Bold font weights, and avoid Ultralight, Thin, and Light."

The Mail figure on that page is the clearest demonstration: "Inbox" as Large
Title, sender as Title, subject as Subtitle, preview snippet as Body in a
secondary grey. Four levels, one family, no rules or boxes — built purely from
size + weight + colour.

## 5. The families

Two families ship with the system:

- **San Francisco (SF)** — sans serif. Variants: SF Pro, SF Compact, SF Mono,
  SF Arabic / Armenian / Georgian / Hebrew, plus **rounded** cuts of most, "to
  coordinate text with the appearance of soft or rounded UI elements, or to
  provide an alternative typographic voice."
- **New York (NY)** — serif, "designed to work well by itself and alongside the
  SF fonts." The two share compatible vertical metrics, so they pair at matched
  point sizes without adjustment.

System font per platform: SF Pro on iOS, iPadOS, macOS, tvOS, visionOS; SF
Compact on watchOS (SF Compact Rounded in complications). NY is available
everywhere as an option.

Both are variable fonts. Nine weights — Ultralight, Thin, Light, Regular,
Medium, Semibold, Bold, Heavy, Black — each with an upright and a true italic.
SF adds Condensed and Expanded widths.

Optical sizing is continuous: "the system fonts support dynamic optical sizes,
which merge discrete optical sizes (like Text and Display) and weights into a
single, continuous design." The old hard Text/Display split around 20pt no
longer exists as a switch, though the tracking curve below still shows where it
used to sit.

Do not embed or self-host the system fonts; they are not licensed for that.

## 6. Tracking

SF Pro on iOS/iPadOS/visionOS. Apple publishes a 49-row table from 6pt to 96pt;
the shape of the curve is what matters.

| Size (pt) | Tracking (1/1000 em) | Tracking (pt) |
|---|---|---|
| 6 | +41 | +0.24 |
| 10 | +12 | +0.12 |
| 12 | 0 | 0.00 |
| 13 | −6 | −0.08 |
| 17 | −26 | −0.43 |
| 19–20 | −24 / −23 | ≈ −0.45 (tightest) |
| 24 | +3 | +0.07 |
| 29–30 | +14 | +0.40 (loosest) |
| 34 | +12 | +0.40 |
| 44 | +8 | +0.37 |
| 60 | +4 | +0.26 |
| 80–96 | 0 | 0.00 |

Reading the curve: small text is **loosened**, crosses zero at exactly 12pt,
tightens to a trough around 19–20pt, then loosens again into the high twenties
before decaying back to zero at display sizes.

Separate tracking tables exist for SF Pro Rounded, New York, macOS, tvOS and
watchOS on the same page if you need them.

## 7. SF Symbols

Symbols share the text weight axis exactly — the same nine weights — which is
what makes "precise weight matching between symbols and adjacent text" possible.
Match a symbol's weight to the weight of the text beside it.

Scale is a separate axis with three steps, calibrated against the adjacent
text's cap height and baseline:

- **Small** — the symbol sits almost exactly between cap height and baseline.
- **Medium** — extends slightly past both.
- **Large** — extends well past; at this scale the symbol's internal strokes,
  not its outer edge, approach the cap-height and baseline guides.

Symbols scale automatically with Dynamic Type. Apple publishes no explicit
weight-pairing table — the pairing is described as automatic and demonstrated
visually, so treat "match the symbol weight to the text weight" as the practical
rule rather than a quoted spec.

## 8. Translating to the web

- Stack: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display',
  'Inter', system-ui, sans-serif`. Real SF on Apple hardware, Inter elsewhere.
- Points are not pixels. Apple's 17pt body maps comfortably to 16–17px UI text;
  for long-form reading on a desktop screen, 19px with 1.7 line-height sits
  better than a literal 17px.
- Tracking on the web: heading `-0.022em` to `-0.032em`, body `-0.012em`,
  captions `0`. This is a web convention, not a conversion of §6 — Apple's SF Pro
  table is *positive* from about 24pt up, and the system font applies it itself.
  The negative values keep fallback fonts (Inter) and large web headings from
  looking loose; label them as your choice, not Apple's spec.
- Keep the ladder. Pick your sizes from the tables above rather than inventing
  intermediate steps; the consistency is more visible than any single value.
- Line length near 65–75 characters for reading text.
- Use `font-variant-numeric: tabular-nums` anywhere digits stack — counts,
  timestamps, metrics. Apple does this throughout and it is a strong tell.
