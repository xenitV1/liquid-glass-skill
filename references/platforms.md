# Platforms — building Liquid Glass outside the browser

The design rules in SKILL.md (two layers, regular vs clear, rationed colour,
rim, refraction, accessibility fallbacks) are the same everywhere. What changes
per platform is *how* you get three things:

1. **Backdrop** — can the glass see the pixels behind it?
2. **Blur** — can it blur them?
3. **Bend** — can it displace them (refraction)? This is the part people notice
   when it is missing.

APIs below were checked on 2026-10-12 against the linked pages. Re-check before
big work: these move every release.

Contents: [Choosing a route](#choosing-a-route) · [Apple native](#apple-native-swiftui-uikit) ·
[Android](#android-jetpack-compose) · [Flutter](#flutter) · [Desktop: Electron](#electron) ·
[Desktop: Tauri](#tauri) · [Windows native](#windows-native) · [Linux](#linux) ·
[Window material is not Liquid Glass](#window-material-is-not-liquid-glass)

---

## Choosing a route

| Platform | Backdrop + blur | Bend (refraction) | Route |
|---|---|---|---|
| iOS / iPadOS / macOS 26+ | system | system | Use the real material: SwiftUI `glassEffect`, UIKit `UIGlassEffect`. Never fake it there. |
| Android 12+ (Compose) | Haze | Haze `haze-glass`, needs Android 13+ | Spiralens recipe below |
| Web, Chromium (Chrome, Edge, Android WebView, Electron, Tauri on Windows) | `backdrop-filter` | `assets/refraction.js` | `assets/tokens.css` + `refraction.js` |
| Web, Safari / Firefox | `backdrop-filter` | not available | Same files; refraction switches itself off, blur glass stays |
| Flutter | `BackdropFilter` | `ImageFilter.shader`, Impeller only | shader route below |
| Linux desktop apps | in-app only | in-app only | draw the glass inside the app (web view or GPU shader) |

Rule of thumb: on Apple platforms use Apple's material; everywhere else build it
inside your own rendering, because only your app can see its own content.

## Apple native (SwiftUI, UIKit)

The system material does the blur, bend, rim, adaptation and accessibility for
you. Your job is the design rules: where glass goes and how much colour it gets.

SwiftUI (iOS, iPadOS, macOS, tvOS, watchOS, Mac Catalyst 26.0+), from
developer.apple.com/documentation/swiftui/view/glasseffect(_:in:):

```swift
Text("Hello, World!")
    .padding()
    .glassEffect()                        // regular variant, capsule shape by default

Image(systemName: "play.fill")
    .frame(width: 44, height: 44)
    .glassEffect(.clear.interactive(true), in: .circle)   // over photos and video only

Button("Publish") { }
    .glassEffect(.regular.tint(.blue))    // the one tinted action in a bar
```

- `Glass` has `.regular`, `.clear`, `.identity` (no effect) and the modifiers
  `.tint(Color?)` and `.interactive(Bool)`.
- Group neighbouring glass shapes in a `GlassEffectContainer` so they blend and
  morph into each other; give them `glassEffectID(_:in:)` for morphing and
  `glassEffectUnion(id:namespace:)` to merge several into one shape.
- Buttons: `GlassButtonStyle` and `GlassProminentButtonStyle` exist for glass
  and prominent glass buttons.
- Standard bars, tab bars, sheets and sidebars adopt Liquid Glass automatically
  when built with the iOS 26 SDK. Don't put a second custom glass layer on top.

UIKit (iOS, iPadOS, Mac Catalyst, tvOS 26.0+): `UIGlassEffect(style:)` is a
`UIVisualEffect` with `tintColor` and `isInteractive`; set it as the `effect`
of a `UIVisualEffectView`. `UIGlassContainerEffect` combines several glass
elements.

Do not ship the web recipe inside a native iOS app's own screens — the system
material is better in every way and respects every accessibility setting.

## Android (Jetpack Compose)

Proven in a shipped app (Spiralens, Haze 2.0.1). Libraries, from Maven Central:

```kotlin
implementation("dev.chrisbanes.haze:haze:2.0.1")
implementation("dev.chrisbanes.haze:haze-glass:2.0.1")   // experimental API
```

The pattern:

```kotlin
@OptIn(ExperimentalHazeApi::class)
fun Modifier.liquidGlass(
    backdrop: HazeState,
    shape: RoundedCornerShape = RoundedCornerShape(50),
    clear: Boolean = false,
): Modifier = this
    .hazeGlass(
        input = HazeInput.Sources(backdrop),
        performanceMode = HazePerformanceMode.Quality,   // keeps the blur while scrolling
        style = GlassStyle {
            backgroundColor(Page)            // opaque base: nothing sharp shows through
            tint(Cream.copy(alpha = if (clear) .04f else .07f))
            whitePoint(if (clear) 0f else .12f)
            chromaMultiplier(if (clear) 1.1f else 1.3f)
            optics(
                blurRadius = if (clear) 2.dp else 34.dp,
                refractionStrength = 1f,
                refractionHeightFraction = if (clear) .5f else .618f,
                refractionDisplacement = if (clear) 13.dp else 24.dp,
                refractionFoldStrength = .8f,
                depth = .9f,
            )
            specularIntensity(.7f)
            ambientResponse(.35f)
            edgeSoftness(1.dp)
            shape(shape)
            surfaceProfile(SurfaceProfile.Squircle)
            chromaticAberrationStrength(.12f)
        },
    )
    .border(1.dp, RimBrush, shape)          // the rim, brightest upper-left

val RimBrush = Brush.linearGradient(
    0f to Color.White.copy(alpha = .85f),
    .45f to Color.White.copy(alpha = .14f),
    1f to Color.White.copy(alpha = .50f),
)
```

`Page` and `Cream` are the app's own page and tint colours.

What the source needs:
- `val state = rememberHazeState()`, and the content behind the glass gets
  `Modifier.background(Page).hazeSource(state)`. **The source must be opaque**,
  and the style needs `backgroundColor(...)` too, or sharp text shows through
  the glass body and it looks broken.
- Bending needs Android 13+ (it runs as a runtime shader); blur needs 12+.
  Below that, and in battery saver, on low-RAM phones, or with animations
  turned off, fall back to a clipped dark veil + light gradient body + the same
  rim.
- Dialogs and bottom sheets are separate windows and cannot see the app behind
  them. For real glass there, draw them inside the app (an overlay host at the
  root) and make the page the haze source while one is open. Text-heavy
  overlays need a strong dark veil (about 60%).
- Live camera preview: use `PreviewView.ImplementationMode.COMPATIBLE`
  (TextureView) so it can be a haze source, clear glass with a 35% veil, and
  `HazePerformanceMode.Performance`. Check frame rate and heat on a real phone.

Sizes that worked well there: spacing and radii on Fibonacci steps (5, 8, 13,
21, 34, 55 dp), sheets no taller than 61.8% of the screen. That is a design
choice from that app, not an Apple rule.

If the bundled `liquid-glass-android` skill is installed, it holds the full
reference file this section was distilled from.

## Flutter

- Blur: `BackdropFilter(filter: ImageFilter.blur(...))` clipped to the shape.
- Bend: `ImageFilter.shader(FragmentShader)` lets a fragment shader displace
  the backdrop. Per the API docs it is **only supported on Impeller**, throws
  `UnsupportedError` elsewhere, and must flip the y-axis on the OpenGL ES
  backend. Check `ImageFilter.isShaderFilterSupported` and fall back to the
  blur-only glass when it is false.
- The shader does what `refraction.js` does: inside a rim band, sample the
  backdrop from further inward, strongest at the outline. Port the map logic
  from `assets/refraction.js` (`buildMap`) into GLSL.
- Several packages on pub.dev wrap this; most are early or experimental, so
  read their changelogs before depending on one.

## Electron

Electron renders with Chromium, so **the web recipe works in full, including
refraction**: `tokens.css` + `refraction.js` inside the window.

Optional window-level material (behind the whole window, not Liquid Glass):
- Windows: `backgroundMaterial: 'auto' | 'none' | 'mica' | 'acrylic' | 'tabbed'`
  in `BrowserWindow` options or `win.setBackgroundMaterial()`. Windows 11 22H2
  and up only.
- macOS: `vibrancy` / `win.setVibrancy()` with values such as `sidebar`,
  `menu`, `popover`, `hud`, `under-window`.
Source: electronjs.org/docs/latest/api/browser-window.

## Tauri

The web view differs by OS, and that decides refraction:
- Windows: WebView2 (Chromium) — refraction works.
- macOS: WKWebView (Safari engine) — blur only. Prefer the
  `window-vibrancy` crate's `apply_liquid_glass` (macOS 26+) for the window,
  and keep in-page glass blur-only.
- Linux: WebKitGTK — blur only; treat refraction as off.

The `window-vibrancy` crate (github.com/tauri-apps/window-vibrancy) also offers
`apply_mica` (Windows 11), `apply_acrylic` (Windows 10/11) and `apply_vibrancy`
(macOS 10.10+). It states Linux is unsupported: blur there is up to the user's
compositor.

## Windows native

WinUI / Windows App SDK ship Mica and Acrylic. They are Microsoft's materials:
they blur the desktop or window behind, with no rim and no bending. Use them
for the window background if you want, but build Liquid Glass controls inside
your own rendering (Win2D or a shader, or a WebView2 with the web recipe).

## Linux

There is no system glass to call. GTK and Qt apps draw their own: blur and
displace their own content in the toolkit's GPU path (a shader effect), or host
the UI in a Chromium-based web view (Electron, CEF) and use the web recipe.
Desktop-wide blur behind a window depends on the compositor (KWin, Hyprland and
others offer it; it is not a standard), so never rely on it for legibility.

## Window material is not Liquid Glass

Mica, Acrylic and macOS vibrancy blur **what is behind the window** (the
desktop, other apps). Liquid Glass is a control floating over **your own
content** and bending it. A window can use both, but one never replaces the
other, and window materials alone will not produce the look people mean when
they ask for Liquid Glass.
