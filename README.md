# Base Camp Academy

Interactive course pages for CSCI 3753 Operating Systems at the University
of Colorado Boulder.

**Site:** <https://cu-cs-os-courses.github.io/base-camp-academy/>

## What is here

| Pages | What they are |
|---|---|
| `lectures/` | One page per lecture, L00–L23 |
| `recitations/` | One page per Friday recitation, R01–R13 |
| `tutorials/` | One walkthrough per lab, Lab00–Lab05 |

Each lab walkthrough is the specification of its lab, together with the
header comments of the files in the lab's `submit/` directory. The lab
files themselves are in the course repository,
[cu-cs-os-courses/3753-27-spring](https://github.com/cu-cs-os-courses/3753-27-spring).

## Reading a page

Every page has two modes:

- **Read**: the default, for self-study.
- **Present**: press <kbd>P</kbd>. Every chapter head and every section
  becomes one 16:9 slide, scaled to the screen. Press <kbd>→</kbd> or
  <kbd>Space</kbd> to step, <kbd>←</kbd> to go back, <kbd>F</kbd> for full
  screen, and <kbd>Esc</kbd> to return to reading.

There is no build step. To read the pages offline, open `index.html` in a
browser, or serve the folder:

```sh
python3 -m http.server 8000   # then open http://localhost:8000/
```

## For authors

A push to `main` updates the site. Therefore, every push is a publication.

Each piece of information has exactly one source. If a page needs a fact
that another page already states, link to it instead of copying it.

### Layout

```
index.html                 course index
assets/academy.css         shared design system (tokens, chapters, widgets, present mode)
assets/academy.js          shared runtime (terms, quizzes, scroll spy, present mode)
lectures/NN-name.html      one self-contained page per lecture (content and its widgets)
recitations/rNN-name.html  one page per recitation
tutorials/labNN-name.html  one walkthrough per lab
decks/                     lecture slides (PowerPoint); gitignored, local only, never pushed
```

### Authoring contract

- Chapters are `<section class="chapter" id="chN">` inside `<main>`. Each
  starts with a `.ch-head` (`.ch-no`, `h2`, `.ch-lede`) and ends with a
  `.ch-nav`. Add a matching link to the `.rail` and to `.toc-mobile`.
- Each section is `<div class="sec" id="…">` and starts with
  `<h3><span class="sec-no">N.M</span>Title</h3>`. One `.sec` is one slide
  when presenting, so keep each section to about one screen of content.
- A `.sec.present-only.title-slide` directly inside `<main>` is the opening
  slide. It is hidden when reading.
- `data-step="n"` on any element, SVG groups included, reveals it at step
  *n* when presenting. When reading, everything is visible.
- `.read-only` and `details.fold` are hidden when presenting.
- Boxes: `.note.note-key` (key idea), `.note.note-honest` (what we
  simplified), `.note.note-warn`, and `.note.note-lab` (link to the lab).
- Figures: `figure.fig > .fig-frame > svg.dia`, plus a `figcaption` that
  starts with `<span class="fno">Fig. N.M</span>`.
- Widgets: `.widget > .widget-head(.chip, .w-title, .w-reset) > .controls >
  .widget-body > .readout`.
- Glossary: `<span class="term">word<span class="tip">definition</span></span>`.
- Lecture reference: `<span class="ref" data-sec="L03 §4.3" data-title="Context switch"
  data-href="../lectures/03-process.html#s4-3">word<span class="ref-body">One or two
  sentences</span></span>`. The word gets a dashed underline; a click opens a card with
  the explanation and a link to that lecture section. Use it in a walkthrough where a
  concept is first needed, and explain only as much as the lab needs.
- Checkpoint: `.quiz[data-quiz]` with `.q-opt` buttons. Mark the right one
  `data-ok`, and give each wrong one a `data-why` hint.
- Widgets that step with the arrow keys call
  `Academy.register(secId, { steps, readStep, show(i) })`, and use the
  returned `go(i)` from their own buttons.

### Color means the same thing on every page

| Token | Meaning |
|---|---|
| `--cz` | logical or virtual, user side: page numbers, virtual addresses, the program |
| `--cx` | data in flight: offsets, data registers, bytes moving |
| `--cf` | physical, hardware side: frames, RAM, controllers, devices |
| `--cd` | miss, fault, trap, interrupt |
| `--co` | the kernel acting: privileged registers, drivers, fix-ups |
