# Markdown — Everything You Need For This Course

Markdown is just plain text with a few simple symbols that tell programs (like Claude Code, GitHub, Notion) how to format it. Files end in `.md`.

You will write a few `.md` files in this course — your `CLAUDE.md`, your agent files, your skills. This page covers every markdown move you need. Nothing more.

---

## Headings

A `#` at the start of a line is a heading. More `#`s = smaller heading.

```markdown
# Biggest heading
## Smaller
### Even smaller
```

---

## Bold and italic

Wrap text in symbols to format it.

```markdown
**bold text**
*italic text*
***bold and italic***
```

Renders as: **bold text** · *italic text* · ***bold and italic***

---

## Bullet lists

A `-` (dash) at the start of each line.

```markdown
- First item
- Second item
- Third item
```

You can also use `*` instead of `-` — both work.

---

## Numbered lists

Numbers followed by a dot.

```markdown
1. First step
2. Second step
3. Third step
```

Tip: even if you type `1.` for every line, markdown will renumber them when displayed.

---

## Inline code

Wrap text in backticks (the key above Tab on a US keyboard).

```markdown
Run the `claude` command in your terminal.
```

Renders as: Run the `claude` command in your terminal.

Use inline code for: command names, filenames, short snippets, anything you'd type literally.

---

## Code blocks (fenced)

For longer code or commands, use three backticks before and after.

````markdown
```
ls
cd course/module-1
```
````

You can name the language right after the opening backticks to get syntax highlighting:

````markdown
```python
def hello():
    print("hi")
```
````

---

## Links

Square brackets for the text you click, parentheses for the URL.

```markdown
[the course](https://github.com/sidarora28/aipm)
```

Renders as: [the course](https://github.com/sidarora28/aipm)

---

## Frontmatter (used in agent and skill files)

A small block of metadata at the very top of the file, between two lines of three dashes. Used by Claude Code to know how to load the file.

```markdown
---
name: researcher
description: Researches a topic and returns a summary
---

The rest of the file goes here as normal markdown.
```

You'll write frontmatter when you build agents in Module 1 and skills in Module 2. The template files in each module already have it — you just edit the values.

---

## Tables

Pipes (`|`) separate columns. A second row with `---` marks the header.

```markdown
| Tool | What it's for |
|---|---|
| Claude Code | Build AI products |
| Vercel | Deploy them to a real URL |
```

Renders as:

| Tool | What it's for |
|---|---|
| Claude Code | Build AI products |
| Vercel | Deploy them to a real URL |

---

## Quote blocks

A `>` at the start of a line.

```markdown
> "This is a quote."
```

Used throughout this course for example dialogue June would say.

---

## Horizontal rule (section divider)

Three dashes on their own line.

```markdown
---
```

Used to break sections visually.

---

## That's it

These are all the markdown moves you'll need for the course. You'll see most of them inside the existing course files — open any `TASK.md` and look at the raw markdown to see real examples.

If June asks you to edit a markdown file and you forget how to do something, scroll back to this page.
