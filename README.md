# Base Camp Academy

Interactive lecture pages for CSCI 3753 Operating Systems (CU Boulder).
The companion lab repo is `base-camp` (OS Basecamp).

Each lecture is one HTML page in the style of the QEC Atlas Academy
tutorials: graph-paper hero, chapter rail, numbered sections, "Try it"
widgets, checkpoints, and a glossary. It has two modes:

- **Read**: the tutorial page, for self-study.
- **Present**: press <kbd>P</kbd>. Every chapter head and every section
  becomes one 16:9 slide, scaled to the screen. Use <kbd>→</kbd>/<kbd>Space</kbd>
  to step, <kbd>←</kbd> to go back, <kbd>F</kbd> for full screen, and
  <kbd>Esc</kbd> to return to reading.

No build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000   # then http://localhost:8000/
```

## Layout

```
index.html              course index
assets/academy.css      shared design system (tokens, chapters, widgets, present mode)
assets/academy.js       shared runtime (terms, quizzes, scroll spy, present mode)
lectures/NN-name.html   one self-contained page per lecture (content + its widgets)
```

## Authoring contract

- Chapters are `<section class="chapter" id="chN">` inside `<main>`, each
  starting with a `.ch-head` (`.ch-no`, `h2`, `.ch-lede`) and ending with a
  `.ch-nav`. Add a matching link to the `.rail` and `.toc-mobile`.
- Each section is `<div class="sec" id="…">` starting with
  `<h3><span class="sec-no">N.M</span>Title</h3>`. One `.sec` is one slide
  when presenting, so keep each to about a screen of content.
- A `.sec.present-only.title-slide` directly inside `<main>` is the opening
  slide; it is hidden when reading.
- `data-step="n"` on any element (SVG groups too) reveals it at step *n*
  when presenting. When reading, everything is visible.
- `.read-only` and `details.fold` are hidden when presenting.
- Boxes: `.note.note-key` (key idea), `.note.note-honest` (what we simplified),
  `.note.note-warn`, `.note.note-lab` (link to the lab).
- Figures: `figure.fig > .fig-frame > svg.dia` plus a
  `figcaption` starting with `<span class="fno">Fig. N.M</span>`.
- Widgets: `.widget > .widget-head(.chip, .w-title, .w-reset) > .controls >
  .widget-body > .readout`.
- Glossary: `<span class="term">word<span class="tip">definition</span></span>`.
- Checkpoint: `.quiz[data-quiz]` with `.q-opt` buttons. Mark the right one
  `data-ok` and give wrong ones a `data-why` hint.
- Widgets that step with the arrow keys call
  `Academy.register(secId, { steps, readStep, show(i) })` and use the
  returned `go(i)` from their own buttons.

### Color means the same thing in every lecture

| token  | meaning                                            |
|--------|----------------------------------------------------|
| `--cz` | logical/virtual: page number, virtual address       |
| `--cx` | offset d: the bits that pass through unchanged      |
| `--cf` | physical: frame number, physical address, RAM       |
| `--cd` | miss, fault, trap                                   |
| `--co` | the kernel acting: privileged registers, fix-ups    |
