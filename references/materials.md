# Materials — Liquid Glass and standard materials

Read off developer.apple.com/design/human-interface-guidelines/materials and the
Adopting Liquid Glass technology overview. Materials change log: September 9,
2025 ("Updated guidance for Liquid Glass"), June 9, 2025 ("Added guidance for
Liquid Glass").

Contents: The two families · Regular vs clear · Adaptation · Refraction and the rim · Standard materials (iOS/iPadOS) · Vibrancy · Scroll edge effect · Background extension effect · Web recipes

---

## The two families

*"Apple platforms feature two types of materials: Liquid Glass, and standard
materials. Liquid Glass is a dynamic material that unifies the design language
across Apple platforms, allowing you to present controls and navigation without
obscuring underlying content."*

**Liquid Glass** belongs to the functional layer only:

> "Liquid Glass forms a distinct functional layer for controls and navigation
> elements — like tab bars and sidebars — that floats above the content layer,
> establishing a clear visual hierarchy between functional elements and content."

> "Don't use Liquid Glass in the content layer. Liquid Glass works best when it
> provides a clear distinction between interactive elements and content, and
> including it in the content layer can result in unnecessary complexity and a
> confusing visual hierarchy. Instead, use standard materials for elements in
> the content layer."

> "Use Liquid Glass effects sparingly. Standard components from system
> frameworks pick up the appearance and behavior of this material
> automatically. If you apply Liquid Glass effects to a custom control, do so
> sparingly."

**Standard materials** are for the content layer — blur, vibrancy and blending
used to "convey a sense of structure in the content beneath Liquid Glass."

## Regular vs clear

Apple ships two variants and choosing wrong is visible.

**Regular** — the default, used by most system components.

> "The regular variant blurs and adjusts the luminosity of background content to
> maintain legibility of text and other foreground elements. Scroll edge effects
> further enhance legibility by blurring and reducing the opacity of background
> content."

In Apple's own figures the regular variant is close to opaque. Over a starfield
it reads as a dark navy-grey disc with the stars almost gone; over a beach photo
it reads as milky frosted white with the scene reduced to soft colour blobs. In
both, a thin bright rim traces the edge. If your glass shows a legible picture
through it, it is too transparent to be "regular".

**Clear** — for media backgrounds only.

> "Only use clear Liquid Glass for components that appear over visually rich
> backgrounds… The clear variant is highly translucent, which is ideal for
> prioritizing the visibility of the underlying content and ensuring visually
> rich background elements remain prominent. Use this variant for components
> that float above media backgrounds — such as photos and videos."

With clear glass, legibility is your problem to solve:

> "If the underlying content is bright, consider adding a dark dimming layer of
> 35% opacity."
> "If the underlying content is sufficiently dark, or if you use standard media
> playback controls from AVKit that provide their own dimming layer, you don't
> need to apply a dimming layer."

## Adaptation

Small elements adapt to what is behind them: *"the system can adapt Liquid Glass
between a light and dark appearance in response to the underlying content. By
default, symbols and text on these elements follow a monochromatic color scheme,
becoming darker when the underlying content is light."*

On the web there is no automatic adaptation, so the equivalent is to author
genuinely different glass values per theme — a light tint with a bright rim for
light mode, a dark tint with a faint white rim for dark mode. Reusing one colour
at two opacities produces the grey mush that gives imitation glass away.

## Refraction and the rim

This is the part blur cannot fake, and the part people notice when it is
missing. Apple's June 2025 announcement (apple.com/newsroom) says: *"This
translucent material reflects and refracts its surroundings"*, and of sidebars,
*"They refract the content behind them."* Apple's own images show it plainly
when zoomed in:

- Shapes and text that reach the edge of a glass control **bend and stretch
  along the outline**, as through the thick rim of a lens. The middle stays
  nearly undistorted.
- A thin **bright rim** runs round the edge, brightest on the upper-left,
  faint along the sides, picking up again lower-right, with a soft inner glow.
- The body is not see-through: the picture behind is blurred and takes the
  hue of what is underneath, then bent at the rim.

Plain frosted blur with a uniform white border is "glassmorphism", the 2020
web trend. Without the bend and the uneven rim, users read it as a copy.

**How the bend works (any platform).** Inside a rim band ("bezel") the glass
shows content sampled from *further inward*, strongest at the outline and
fading to nothing at the inner edge of the band. Content near the edge
therefore looks pulled outward and curved. Follow the shape's real outline:
a capsule bends along its round ends, a rounded rectangle along its corners.

Sensible starting values (derived from a shipped Android app and tuned on the
web, not Apple numbers):

| | Regular | Clear |
|---|---|---|
| Rim band | about half the corner radius, 8–20 px, < 1/3 of the short side | same |
| Maximum shift | about 0.6 × the rim band (Android: 24 dp) | about 0.6 × the rim band (Android: 13 dp) |
| Blur after bending | strong (web 10 px, Android 26–34 dp) | almost none (web 0.5 px, Android 2 dp) |
| Colour fringe | very slight | very slight |

Clear glass is where text visibly curves; on regular glass the bend shows on
shapes and colour edges in the blurred picture.

Tint while bending: controls with icons or one short label can drop the tint
(`--glass-refract`, about 0.42 light / 0.48 dark) so the bend reads. Glass that
carries words — menus, popovers, sheets, sidebars — keeps the full tint
(`.glass-text`). A shipped Android app found the same: text-heavy overlays
needed a dark veil of about 60%; 32% was unreadable over a bright backdrop.

**Where each platform gets it:** see `references/platforms.md`. On the web,
`assets/refraction.js` builds the displacement map per element and runs it in
one of two modes:

- *Backdrop mode* (Chromium: Chrome, Edge, Android WebView, Electron):
  `backdrop-filter: url(#filter)` bends whatever is behind the glass, live,
  including scrolling content.
- *Mirror mode* (any browser, used when backdrop mode is unavailable and the
  element has `data-refract-source="#id"`): the script places a copy of the
  source inside the glass, keeps it aligned every frame, and bends it with a
  normal CSS `filter`. Good for glass over a hero, photo or card; it does not
  pick up content that changes after load unless `refresh()` is called.
- Neither: plain blur glass, nothing breaks.

Verified 2026-10-12 with Playwright: Chromium runs backdrop mode; Firefox runs
mirror mode and the result matches Chromium closely, including while dragging
and after scrolling. WebKit could not be launched on the test machine, so
Safari is untested; it supports SVG filters on HTML elements, which is all
mirror mode needs.

Lesson from shipping the demo: a visitor on Firefox first saw clear glass
lenses as white smudges, because without the bend the clear glass blur (14px)
erased the text under it. Give demo and hero glass a source so every browser
gets the bend.

**Accessibility.** Bending is part of the transparency: switch it off under
Reduce Transparency (the script does) and keep it static — never animate the
displacement under Reduce Motion.

**How to check it.** Put a glass control over a line of text and over a photo
with a straight edge, and screenshot. The letters at the rim should stretch
and curve; the middle should stay readable. If nothing bends, the
displacement is not running (wrong browser, missing script, no `data-refract`).
If the whole control smears, the rim band is too wide or the shift too strong.

## Standard materials (iOS/iPadOS)

Four thicknesses, all for the content layer: `ultraThin`, `thin`, `regular`
(default), `thick`.

> "Thicker materials, which are more opaque, can provide better contrast for
> text and other elements with fine features."
> "Thinner materials, which are more translucent, can help people retain their
> context by providing a visible reminder of the content that's in the
> background."

In the specimens, ultraThin and thin look nearly identical and let background
hue and shape through; regular is much whiter and more blurred; thick is nearly
flat opaque white. Note that Apple's alt text describes them as progressively
"darkened/muted" — visually this reads as *desaturation and loss of structure*,
not loss of luminance.

tvOS has its own recommendations: ultraThin for full-screen views needing a light
scheme, thin for partial overlays needing a light scheme, regular for partial
overlays, thick for partial overlays needing a dark scheme.

visionOS has a single unmodifiable `glass` material and no dark mode — the glass
adapts to the luminance of real-world objects behind it.

## Vibrancy

Vibrancy is how Apple keeps text legible *on* a material — colours that adapt to
the material rather than sitting on top of it.

> "Help ensure legibility by using vibrant colors on top of materials. When you
> use system-defined vibrant colors, you don't need to worry about colors
> seeming too dark, bright, saturated, or low contrast in different contexts."

Levels: labels have `.label`, `.secondaryLabel`, `.tertiaryLabel`,
`.quaternaryLabel`; fills have `.fill`, `.secondaryFill`, `.tertiaryFill`;
separators have exactly one level that works on all materials. Avoid
`quaternaryLabel` on thin and ultraThin — *"the contrast is too low."*

Apple's before/after figure is stark: the same share icon in flat `systemGray3`
is nearly invisible on a pale material, and in a vibrant colour it is solidly
legible. The lesson for the web: don't put mid-greys on glass. Use a colour with
real contrast against the *material*, not against the page.

## Scroll edge effect

> "Optimize for legibility when content scrolls beneath controls. Scroll views
> offer a scroll edge effect that helps maintain sufficient legibility and
> contrast for controls by obscuring content that scrolls beneath them. System
> bars like toolbars adopt this behavior by default."

And from the Layout page: *"Instead of a background, use a scroll edge effect to
provide a…"* — the effect is the alternative to giving a bar an opaque
background.

## Background extension effect

From Sidebars: *"Extend visually rich content beneath the sidebar. In iOS,
iPadOS, and macOS, as with other controls such as toolbars and tab bars,
sidebars can float above content in the Liquid Glass layer. To reinforce the
separation, you can extend content…"*

Apple's incorrect/correct pair makes it concrete. Incorrect: a hero image stops
dead at the sidebar's edge. Correct: the image is **flipped, blurred and
extended** beneath the sidebar all the way to the window edge, so the sidebar's
glass has something of the content's own colour to refract. In the correct
version there is no border between sidebar and content at all — the material
alone does the separating.

## Web recipes

**Regular glass, light theme**

```css
background: rgba(252, 252, 254, 0.72);
backdrop-filter: saturate(180%) blur(28px);
box-shadow:
  inset 0 0.5px 0 rgba(255, 255, 255, 0.85),   /* refraction rim */
  inset 0 0 0 0.5px rgba(255, 255, 255, 0.35),
  0 8px 26px rgba(0, 0, 0, 0.10);
```

Plus the rim as a gradient ring (`.glass::before` in the token file: 1px,
`linear-gradient(135deg, white .9, white .16 at 45%, white .55)`, cut to a ring
with a mask) and a specular sheen as a pseudo-element: a `linear-gradient(180deg,
rgba(255,255,255,.30), rgba(255,255,255,.06) 34%, transparent 62%)` over the
top. Without the rim and sheen the surface reads as plain transparency.

**Regular glass, dark theme** — `rgba(38, 38, 43, 0.72)`, rim at
`rgba(255,255,255,0.22)`, sheen at roughly half strength.

**Clear glass over media** — drop the tint to ~0.18 alpha, raise blur, and put a
`rgba(0,0,0,0.35)` dimming layer underneath when the media is bright.

**Refraction** — add `data-refract` to the glass element and load
`assets/refraction.js`. Options and limits are in the file header.

**Scroll edge effect** — a sticky element directly under the bar:

```css
height: 24px;
margin-bottom: -24px;
backdrop-filter: blur(6px);
mask-image: linear-gradient(to bottom, #000, transparent);
```

**Background extension** — put a copy of the hero image inside the sidebar,
behind its children (`.bg-extend` in the token file), with
`transform: scaleX(-1)`, `filter: blur(40px)` and low opacity. The copy carries
its own blur because a `backdrop-filter` only affects what is behind the element,
not its own children.

**Ambient ground** — glass over a flat colour renders as flat colour. Give the
page a few very low-opacity radial gradients so the material has something to
refract.

**Reduced transparency** — every glass surface needs an opaque fallback under
`@media (prefers-reduced-transparency: reduce)`, dropping `backdrop-filter` and
raising the background to ~0.9 alpha.

**Reduced motion** — do not animate blur or the glass transition; Apple's Reduce
Motion guidance specifically says to avoid animating into and out of blurs.
