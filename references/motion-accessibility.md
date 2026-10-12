# Motion, feedback and accessibility

Read off the Motion, Feedback and Accessibility pages, plus the Reduce Motion
guidance that lives on the Accessibility page rather than the Motion page.

Contents: Motion · Reduce Motion · Reduce Transparency · Increase Contrast · Differentiate without colour · Contrast minimums · Text display · Feedback

---

## Motion

Apple's rules, condensed:

- *"Add motion purposefully, supporting the experience without overshadowing it.
  Don't add motion for the sake of adding motion. Gratuitous or excessive
  animation can distract people and may make them feel disconnected or
  physically uncomfortable."*
- *"Make motion optional."* Never let motion be the only carrier of important
  information; back it with text, haptics or sound.
- *"Strive for realistic feedback motion that follows people's gestures and
  expectations."* Motion that doesn't track the gesture is disorienting.
- *"Aim for brevity and precision in feedback animations."* Brief and precise
  reads as lightweight; it usually communicates better than something prominent.
- *"In apps, generally avoid adding motion to UI interactions that occur
  frequently."* The system already animates standard elements; extra motion on
  something used constantly becomes a tax.
- *"Let people cancel motion."* Don't make anyone wait out an animation,
  especially a repeated one.
- System components including Liquid Glass animate themselves, and adjust their
  motion in response to accessibility settings and input method.

**There is no named easing curve or duration in the HIG.** Apple's frameworks
expose spring presets (`.smooth`, `.snappy`, `.bouncy`), but the guidelines do
not name or mandate any of them for designers. If you specify a curve, own it as
your choice.

Practical web values that read correctly: `cubic-bezier(0.22, 1, 0.36, 1)` at
200–320ms for most interface movement; `cubic-bezier(0.32, 0.72, 0, 1)` for a
sliding segmented-control thumb; 120ms for a press-state scale of about 0.96.

Two hard numbers Apple does give, both niche: games should hold 30–60fps, and in
visionOS avoid oscillation near **0.2 Hz** because people are especially
sensitive to that frequency. watchOS applies built-in easing that cannot be
customised.

## Reduce Motion

When the setting is on, Apple's stated techniques:

- **Tighten animation springs to reduce bounce.**
- **Track animations directly with people's gestures.**
- **Avoid animating depth changes in z-axis layers.**
- **Replace transitions in x-, y-, and z-axes with fades.**
- **Avoid animating into and out of blurs.**

The last two matter most for Liquid Glass, since the material is defined by
blur and by floating above the content in z. Apple does not name Liquid Glass in
this list — the connection is direct but inferred, so implement it as sound
practice rather than quoting Apple on it.

On the web, `@media (prefers-reduced-motion: reduce)` should collapse durations
to near zero and remove any blur or transform transitions on glass surfaces.

## Reduce Transparency

Apple's current HIG text does not state an explicit Reduce Transparency rule for
Liquid Glass — searching the Accessibility and Materials pages returns nothing.
The Dark Mode page only mentions testing with it enabled.

So: implement the obvious fallback (opaque fill, no `backdrop-filter`) because
the OS behaves that way and the page would otherwise be unreadable, but don't
present it as an Apple quotation.

## Increase Contrast

- *"If your app doesn't provide this minimum contrast by default, ensure it at
  least provides a higher contrast color scheme when the system setting Increase
  Contrast is turned on. If your app supports Dark Mode, make sure to check the
  minimum contrast in both light and dark appearances."*
- *"Prefer system-defined colors. These colors have their own accessible variants
  that automatically adapt."*

Apple's increased-contrast variants are separate authored colours, and the glyph
colour on top can flip (white to black on yellow). It is not a filter.

## Differentiate without colour

The rule is titled *"Convey information with more than color alone"*: people who
are colour blind struggle with pairings like red-green and blue-orange, so
*"offer visual indicators, like distinct shapes or icons"* alongside colour.

The figure: two plain circles, one green one red, marked incorrect. Corrected by
making the green one carry a checkmark and the red one become an **octagon** with
an X — shape plus symbol, not hue alone.

For a web UI this usually means: category chips get a text label as well as a
colour; status indicators get an icon; charts get direct labels or patterns.

## Contrast minimums

| Text | Minimum ratio |
|---|---|
| Up to 17 pt, any weight | 4.5:1 |
| 18 pt and above | 3:1 |
| Bold, any size | 3:1 |

## Text display

- Allow enlargement to at least **200%** (140% on watchOS).
- Respect the per-platform minimum sizes (iOS 11pt, macOS 10pt).
- *"Bear in mind that font weight can also impact how easy text is to read. If
  you're using a custom font with a thin weight, aim for larger than the
  recommended sizes."*
- Dynamic Type: layouts must adapt to every size; increase meaningful icons
  along with text; keep truncation minimal at large sizes; consider a stacked
  layout; keep the information hierarchy constant across sizes.

Apple states no rule about line length or truncation limits on these pages —
don't attribute one.

## Feedback

Feedback communicates four things: current status, success or failure, a warning
before negative consequences, and a chance to correct a mistake.

- *"The most effective feedback tends to match the significance of the
  information to the way it's delivered."* Passive display for status;
  interruption only for high stakes.
- Make feedback accessible through more than one channel — colour, text, sound
  and haptics — so it survives any single one being unavailable.
- Prefer inline status near the thing it describes, so people don't lose context.
- *"By design, alerts disrupt the current context, so you need to match the
  importance of the information to the level of interruption."* Overused alerts
  stop being read.
- Warn only about **unexpected and irreversible** loss. Don't warn when loss is
  the expected outcome of the action.
- Confirm success only when the activity is important enough to warrant it —
  people assume success by default.
- When something can't be done, show it and explain why.

Apple gives no pixel or timing spec for press states anywhere in these pages.
