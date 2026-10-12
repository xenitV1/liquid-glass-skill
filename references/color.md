# Colour — exact specification

Read off developer.apple.com/design/human-interface-guidelines/color and
/dark-mode. Change log: Color updated December 16, 2025 ("Updated guidance for
Liquid Glass") and June 9, 2025 ("Updated system color values"). All values in
§1–2 re-checked against the page's swatch data on 2026-09-27.

Apple's own caveat, worth repeating to anyone who asks for these values:
*"Avoid hard-coding system color values in your app. Documented color values are
for your reference during the app design process. The actual color values may
fluctuate from release to release."* Use them as anchors.

The RGB values below come from the `alt` text of Apple's swatch images — the
only place literal values appear on the page. Hex is converted from that RGB,
not published by Apple.

Contents: [1](#1-system-colours) System colours · [2](#2-grays) Grays ·
[3](#3-semantic-colours-ios) Semantic colours iOS · [4](#4-semantic-colours-macos)
macOS · [5](#5-liquid-glass-colour) Liquid Glass colour ·
[6](#6-dark-mode) Dark mode · [7](#7-contrast) Contrast · [8](#8-for-the-web) Web

---

## 1. System colours

| Colour | Light | Dark | Increased contrast (light) | Increased contrast (dark) |
|---|---|---|---|---|
| Red | `#FF383C` | `#FF4245` | `#E9152D` | `#FF6165` |
| Orange | `#FF8D28` | `#FF9230` | `#C55300` | `#FFA056` |
| Yellow | `#FFCC00` | `#FFD600` | `#A16A00` | `#FEDF43` |
| Green | `#34C759` | `#30D158` | `#008932` | `#4AD968` |
| Mint | `#00C8B3` | `#00DAC3` | `#008575` | `#54DFCB` |
| Teal | `#00C3D0` | `#00D2E0` | `#008198` | `#3BDDEC` |
| Cyan | `#00C0E8` | `#3CD3FE` | `#007EAE` | `#6DD9FF` |
| Blue | `#0088FF` | `#0091FF` | `#1E6EF4` | `#5CB8FF` |
| Indigo | `#6155F5` | `#6D7CFF` | `#564ADE` | `#A7AAFF` |
| Purple | `#CB30E0` | `#DB34F2` | `#B02FC2` | `#EA8DFF` |
| Pink | `#FF2D55` | `#FF375F` | `#E7124D` | `#FF8AC4` |
| Brown | `#AC7F5E` | `#B78A66` | `#956D51` | `#DBA679` |

Note how much the increased-contrast variants differ — they are separate colours
Apple authored, not an algorithmic darkening. Yellow in particular goes from
`#FFCC00` to `#A16A00`, and the glyph on top flips from white to black.

## 2. Grays

| Colour | Light | Dark | IC light | IC dark |
|---|---|---|---|---|
| systemGray | `#8E8E93` | `#8E8E93` | `#6C6C70` | `#AEAEB2` |
| systemGray2 | `#AEAEB2` | `#636366` | `#8E8E93` | `#7C7C80` |
| systemGray3 | `#C7C7CC` | `#48484A` | `#AEAEB2` | `#545456` |
| systemGray4 | `#D1D1D6` | `#3A3A3C` | `#BCBCC0` | `#444446` |
| systemGray5 | `#E5E5EA` | `#2C2C2E` | `#D8D8DC` | `#363638` |
| systemGray6 | `#F2F2F7` | `#1C1C1E` | `#EBEBF0` | `#242426` |

systemGray is deliberately identical in light and dark — that is Apple's data,
not an error. `#F2F2F7` (systemGray6 light) is the usual light grouped page
ground. In dark, `#1C1C1E` (systemGray6 dark) reads as a raised charcoal, so use
it (or near it) for cards over a darker base rather than as the page itself;
the HIG page does not publish the grouped-background values directly.

## 3. Semantic colours (iOS)

Foreground:

| Name | Use for |
|---|---|
| `label` | Primary text |
| `secondaryLabel` | Secondary text |
| `tertiaryLabel` | Tertiary text |
| `quaternaryLabel` | Least important text, watermarks |
| `placeholderText` | Placeholder in controls and text views |
| `separator` | A separator that lets underlying content show through |
| `opaqueSeparator` | A separator that blocks underlying content |
| `link` | Text that functions as a link |

Backgrounds come in two families — **system** and **grouped** — each with
primary, secondary and tertiary. Apple's hierarchy rule for both:

- Primary for the overall view
- Secondary for grouping content or elements within the overall view
- Tertiary for grouping content or elements within secondary elements

*"In general, use the grouped background colors"* when content sits in groups.
For the web that means: page = grouped primary (light grey), cards = grouped
secondary (white). Inverting the usual web default of white page + grey cards is
a large part of the Apple look.

Rule: *"Avoid redefining the semantic meanings of dynamic system colors… don't
use the separator color as a text color."*

## 4. Semantic colours (macOS)

macOS publishes ~35 dynamic colours. The ones that matter for web work:

| Name | Purpose |
|---|---|
| `labelColor` | Primary text |
| `secondaryLabelColor` / `tertiaryLabelColor` / `quaternaryLabelColor` | Descending text importance |
| `separatorColor` | Separator between content sections |
| `controlAccentColor` | The accent the user picked in System Settings |
| `controlBackgroundColor` | Background of a large element (table, browser) |
| `selectedContentBackgroundColor` | Selected content in a key window |
| `unemphasizedSelectedContentBackgroundColor` | Selected content in a non-key window |
| `keyboardFocusIndicatorColor` | Focus ring for keyboard navigation |
| `windowBackgroundColor` | Window background |
| `alternatingContentBackgroundColors` | Alternating table rows |

Two macOS behaviours worth knowing: the user can set a system-wide accent colour
which overrides an app's own, and **desktop tinting** — with the graphite accent,
window backgrounds pick up colour from the desktop picture. Apple advises
including some transparency in custom component backgrounds so they participate.

## 5. Liquid Glass colour

Every rule from the "Liquid Glass color" section:

- *"By default, Liquid Glass has no inherent color, and instead takes on colors
  from the content directly behind it."*
- *"You can apply color to some Liquid Glass elements, giving them the appearance
  of colored or stained glass. This is useful for drawing emphasis to a specific
  control, like a primary call to action."*
- *"Controls can use color in the Liquid Glass background, like in a primary
  action button."*
- *"Symbols and text that appear on Liquid Glass can have color, like in a
  selected tab bar item."*
- *"For smaller elements like toolbars and tab bars, the system can adapt Liquid
  Glass between a light and dark appearance in response to the underlying
  content. By default, symbols and text on these elements follow a monochromatic
  color scheme, becoming darker when the underlying content is light."*
- *"Apply color sparingly to the Liquid Glass material, and to symbols or text on
  the material. If you apply color, reserve it for elements that truly benefit
  from emphasis, such as status indicators or primary actions. To emphasize
  primary actions, apply color to the background rather than to symbols or
  text."* … *"Refrain from adding color to the background of multiple
  controls."*
- *"Avoid using similar colors in control labels if your app has a colorful
  background."*
- *"Be aware of the placement of color in the content layer"* — keep contrast by
  avoiding colour collisions between content and the controls floating over it.

The decisive figure pair: a toolbar with the close, edit and confirm buttons all
tinted blue is marked **incorrect**; the same toolbar with only the confirm
(primary) button tinted is marked **correct**. And the tab-bar figure shows the
bar itself staying neutral frosted grey while the selected item's icon and label
turn blue — confirming that on small bars the colour goes on the content of the
selected item, not on the material.

## 6. Dark mode

- Dark mode uses "dimmer background colors and brighter foreground colors" —
  and explicitly: *"these colors aren't necessarily inversions of their light
  counterparts: while many colors are inverted, some are not."*
- **Base and elevated.** *"In Dark Mode, the system uses two sets of background
  colors — called base and elevated — to enhance the perception of depth when
  one dark interface is layered above another."* Base is dimmer and recedes;
  elevated is brighter and comes forward. The system switches a surface to
  elevated automatically when it is foregrounded, such as a popover or sheet.
  Apple's figures show base as true/near black and elevated as a distinctly
  lighter charcoal — so pure black everywhere is wrong.
- *"Avoid offering an app-specific appearance setting"* — it creates a second
  place to manage a preference that already exists system-wide. (On the web a
  theme toggle is conventional; if you ship one, still respect
  `prefers-color-scheme` as the default rather than forcing a choice.)
- *"Soften the color of white backgrounds"* in content images, so they don't glow
  against a dark interface.
- Illustrations need real adjustment, not reuse: Apple's figure shows the same
  line art with dark strokes vanishing on black, then corrected with light
  strokes. An icon that would disappear may need an outline added in dark mode.
- Test with Increase Contrast and Reduce Transparency on, separately and
  together — dark text on dark backgrounds is where it breaks.
- Not supported in visionOS or watchOS; visionOS glass adapts to real-world
  luminance instead.

## 7. Contrast

Apple's stated minimums:

| Text | Minimum ratio |
|---|---|
| Up to 17 pt, any weight | **4.5:1** |
| 18 pt and above, any weight | **3:1** |
| Bold, any size | **3:1** |

The dark-mode page repeats the floor: *"At a minimum, make sure the contrast
ratio between colors is no lower than 4.5:1. For custom foreground and background
colors, strive for a contrast ratio of 7:1, especially in small text."*

If your default palette can't meet this, Apple's fallback rule is to *"at least
provide a higher contrast color scheme when the system setting Increase Contrast
is turned on"* — and check both appearances.

Related: *"Avoid relying solely on color to differentiate between objects,
indicate interactivity, or communicate essential information."* The figure shows
a green circle and a red circle (incorrect) fixed by making one a green circle
with a checkmark and the other a red **octagon** with an X — shape and symbol,
not just hue.

## 8. For the web

- Page ground `#F2F2F7` light / a near-black base such as `#131316` dark; cards
  `#FFFFFF` / a lighter charcoal such as `#1D1D20` (the values in
  `assets/tokens.css`). The page and card must differ visibly in both themes.
- Separators as `rgba(60,60,67,0.13)` light, `rgba(255,255,255,0.11)` dark —
  hairlines at 0.5px, not 1px borders.
- Fills for track backgrounds and hover states: `rgba(120,120,128,0.12)`.
- Keep one brand tint and let the system colours carry categorical meaning; give
  every category a text label as well as its colour.
- Define every colour as a token at `:root` and redefine only the tokens in the
  dark block, so no component ever hard-codes a value that works in one theme.
