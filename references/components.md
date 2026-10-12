# Components — shapes, states and limits

Read off the Toolbars, Sidebars, Tab bars, Lists and tables, Buttons,
Segmented controls, Pop-up buttons, Popovers, Menus, Search fields, Text fields
and Sheets pages, plus their figures. Sidebars change log: June 8, 2026.

Contents: [Toolbar](#toolbar) · [Sidebar](#sidebar) · [Tab bar](#tab-bar) ·
[Lists](#lists-and-tables) · [Buttons](#buttons) ·
[Segmented control](#segmented-control) · [Popover](#popover) · [Menu](#menus) ·
[Search](#search-fields) · [Sheet](#sheets)

---

## Toolbar

Contains three kinds of thing: the title of the current view, navigation
controls and search, and actions.

Rules:

- *"Choose items deliberately to avoid overcrowding."* The system adds an
  overflow menu itself on macOS and iPadOS — don't build one, and don't design a
  layout that overflows by default.
- *"Reduce the use of toolbar backgrounds and tinted controls… Instead, use the
  content layer to inform the color and appearance."*
- *"Avoid applying a similar color to toolbar item labels and content layer
  backgrounds. If your app already has bright, colorful content in the content
  layer, prefer using the default monochromatic appearance of toolbars."*
- *"Prefer using standard components in a toolbar. By default, standard buttons,
  text fields, headers, and footers have corner radii that are concentric with
  bar corners."*
- Consider hiding the toolbar contextually for a distraction-free view.

What the macOS Tahoe figure shows: a single uniform bar; each action is its own
circular glass chip; **related actions share one capsule** (the formatting group
sits in a single pill, separated by spacing rather than dividers); the title
block is two lines — name in semibold, count beneath in secondary grey; the back
control is circular. Nothing in the bar is coloured. Menus opening from it use a
white sheet with a solid accent fill on the highlighted row, inset from the
sheet edge by roughly the sheet's own padding.

Web translation: one full-width sticky bar with a hairline bottom edge, brand and
navigation at the leading side, search and icon actions trailing, 32px circular
hover targets, and a scroll edge effect beneath it.

## Sidebar

Navigates between areas of the app or top-level collections.

Rules:

- *"Extend visually rich content beneath the sidebar"* — use the background
  extension effect rather than a hard edge.
- *"Consider using familiar symbols to represent items"* — SF Symbols, or a
  custom symbol if nothing fits.
- *"Consider letting people hide the sidebar."*
- *"In general, show no more than two levels of hierarchy."* If you need more,
  add a content list between sidebar and detail.
- *"If you need to include two levels of hierarchy, use succinct, descriptive
  labels to title each group."*
- *"Make sure any sidebar icon colors you choose serve a clear purpose."* By
  default icons take the app's accent colour, and on macOS the user's chosen
  system accent overrides it — except for fixed-colour icons that carry meaning.
- When space is tight, a tab bar may be the better control.

What the figures show: section header in sentence case (**not** uppercase with
tracking); the selected row is a **full-width rounded pill filled with the accent
colour**, white icon and label; unselected rows show a tinted icon and a
near-black label; rows are generously tall; there are no chevrons; and in the
iPad example there is no divider between sidebar and content — the extended,
blurred background does that job.

## Tab bar

*"Use a tab bar to support navigation, not to provide actions… If you need to
provide controls that act on elements in the current view, use a toolbar."*

- Capsule shaped, floats above content, items rest on Liquid Glass.
- **Monochromatic except the selected item**, whose icon *and* label take the
  accent colour. The bar itself stays neutral.
- Keep it visible while navigating; hide only under a modal.
- Never disable or hide a tab, even when its section is empty — explain instead.
- Short labels, ideally one word; prefer SF Symbols so icons adapt between
  regular and compact states.
- Overflow becomes a "More" tab on iOS/iPadOS.
- Badges: red oval, white number or exclamation point, critical info only.
- A search tab renders as a **separate smaller capsule** beside the main group
  rather than fusing into it — grouped elements each keep their own capsule.
- tvOS: height 68pt, top edge 46pt from the top of the screen.

## Lists and tables

- *"Prefer displaying text in a list or table."* For items varying widely in
  size, or many images, use a collection instead.
- Feedback on selection is required, and differs by purpose: a navigating list
  persistently highlights the selected row to show the path.
- Keep row text succinct to avoid truncation and oversized rows.
- The iOS **grouped** style "uses headers, footers, and additional space to
  separate groups of rows" — this is the inset-grouped card look.
- A **disclosure indicator** (chevron) means "this navigates". An **info button**
  means "this explains". Don't swap them.
- macOS: sortable column headings, resizable columns, alternating row colours in
  wide multi-column tables, outline views for hierarchy.

Web translation of the inset grouped list: a rounded container with a small inner
padding, rows with their own smaller radius, hairline separators that start after
the leading thumbnail rather than spanning the full width, and a chevron only on
rows that navigate.

## Buttons

Three attributes: style (size, colour, shape), content (symbol, label, or both),
and role (normal, primary, cancel, destructive).

- *"Always include a press state for a custom button."*
- *"Make buttons easy for people to use"* — enough space around them to be
  distinguishable and hittable.
- *"Use a button that has a prominent visual style for the most likely action"* —
  the system applies the accent colour to its background.
- *"Use style — not size — to visually distinguish the preferred choice."*
- *"Avoid applying a similar color to button labels and content layer
  backgrounds"* — prefer monochromatic labels over colourful content.
- Primary uses the accent; destructive uses system red; never make a destructive
  action the primary.
- Title-style capitalisation, start with a verb, append an ellipsis when the
  action needs further input.

## Segmented control

- For a single choice among closely related options affecting one object or
  view. macOS also allows multiple selection. Can be momentary (no persistent
  selection) for action sets.
- *"Aim for no more than about five to seven segments in a wide interface and no
  more than about five segments on iPhone."*
- Segments are usually equal width; keep content of similar size in each.
- Text or icons, not a mix, within one control.
- Never mix selection segments and action segments in the same control.
- macOS: prefer a tab view when switching the main window content; a segmented
  control is fine in a toolbar or inspector.

Web translation: a filled track (`rgba(120,120,128,0.12)`), 2px padding, an
inner radius 2px smaller than the track, and a selected thumb that is an opaque
raised surface with a soft shadow — not a tinted fill.

## Popover

- *"Use a popover to expose a small amount of information or functionality."*
  Never for warnings — use an alert.
- The arrow should point as directly as possible at what opened it, without
  covering it.
- **One at a time.** Never a popover from a popover; nothing on top of one
  except an alert.
- Dismiss by clicking outside or selecting an item; a Close button only when it
  adds clarity. A nonmodal popover must save automatically on outside dismissal.
- Keep it only as large as its content, and animate size changes smoothly so it
  doesn't read as a new popover.
- macOS popovers can detach into a floating panel — keep appearance changes
  minimal when they do.
- Never say "popover" in user-facing text.

What the figure shows: an outer light rounded card with a triangular tail, and
**inside it, several separate white rounded groups** with visible gaps — grouped
list sections nested in one glass container, not a flat list.

## Menus

- Verb or verb phrase for actions, title-style capitalisation, drop articles.
- Dim unavailable items rather than removing them.
- Ellipsis when more input is needed.
- **Icons: uniform within a group — either every item has one, or none do.**
- Use system-standard icons for standard actions; use icons sparingly.
- Important items first; separators between logical groups.
- Submenus: only when a shared term appears in more than two items in a group;
  a single level deep; more than about five items means it should be a top-level
  menu instead.
- Toggled state: prefer one item with a changing label ("Show Map" / "Hide Map")
  over two items; use a checkmark for an attribute in effect.
- iOS layouts: Small (a row of four icon-only items above the list), Medium (a
  row of three icon-plus-label items), Large (a single list, default).

## Search fields

- Placeholder text signals the scope.
- Search live as people type where feasible; show suggested and recent terms;
  most relevant results first; let people filter.
- Default to a broad scope and let people narrow it.
- iOS placement: as a tab, in a toolbar, or inline with content. Prefer the
  bottom when there is room.
- iPadOS/macOS: trailing edge of the toolbar for general search; top of the
  sidebar when it filters navigation.
- Auto-focus the field when navigating to a dedicated search area.

## Sheets

- For a bounded task or a specific piece of information; use a full-screen modal
  for complex or prolonged flows.
- Buttons: Cancel/Close dismisses without saving, Done dismisses after saving,
  Back steps within the flow and never dismisses. Avoid showing all three; never
  ship Done without a Cancel or Back.
- One sheet at a time; closing returns to the parent, not to another sheet.
- iOS detents: Large and Medium. Include a grabber on any resizable sheet.
- Support swipe-to-dismiss, and confirm before discarding unsaved changes.
- macOS: *"a sheet is a cardlike view with rounded corners that floats on top of
  its parent window."* Use a panel instead when people need to act repeatedly and
  watch the result.
