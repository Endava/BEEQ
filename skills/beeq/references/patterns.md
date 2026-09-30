---
title: "Skill reference: BEEQ screen patterns"
description: Ready-to-adapt HTML recipes for common screens built with BEEQ components and tokens, including an app shell, a settings form, a list with loading, empty, and error states, a page header, and a confirmation dialog.
---
<!-- Generated from packages/beeq-skills/src/beeq/references/patterns.md. Edit the source, not this file. -->

This reference supports the [BEEQ agent skill](../SKILL.md). Each recipe uses documented BEEQ APIs and product CSS built on BEEQ tokens. Copy the one that matches the task, translate it to the target framework with the [framework reference](frameworks.md), then adapt the content.

Check the project's own patterns first. If the project already has an app shell or form layout, follow it instead.

## App shell with side navigation

BEEQ provides the menu; the grid around it is yours.

```html
<div class="app-shell">
  <bq-side-menu class="app-shell__menu">
    <div class="app-shell__logo" slot="logo">
      <bq-icon name="cube" size="32" aria-hidden="true"></bq-icon>
      <span>Acme Console</span>
    </div>
    <bq-side-menu-item active>
      <bq-icon name="squares-four" slot="prefix" aria-hidden="true"></bq-icon>
      Dashboard
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="folder" slot="prefix" aria-hidden="true"></bq-icon>
      Projects
      <bq-badge slot="suffix">3</bq-badge>
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="gear" slot="prefix" aria-hidden="true"></bq-icon>
      Settings
    </bq-side-menu-item>
  </bq-side-menu>

  <main class="app-shell__content">
    <bq-page-title>
      Dashboard
      <span slot="sub-title">Activity across your projects this week</span>
      <bq-button slot="suffix">New project</bq-button>
    </bq-page-title>
    <!-- Page sections -->
  </main>
</div>

<style>
  .app-shell {
    display: grid;
    grid-template-columns: auto 1fr;
    min-block-size: 100dvh;
    background-color: var(--bq-background--primary);
  }

  .app-shell__logo {
    display: flex;
    align-items: center;
    gap: var(--bq-spacing-s);
    padding: var(--bq-spacing-m);
    font-weight: var(--bq-font-weight--semibold);
  }

  .app-shell__content {
    display: grid;
    align-content: start;
    gap: var(--bq-spacing-xl);
    min-inline-size: 0;
    padding: var(--bq-spacing-xl);
  }
</style>
```

Notes:

- Side menu items have no `href`. Route from the item's `bqClick` event or the menu's `bqSelect` event, and move `active` to the current item.
- Use the `collapse` prop with a labelled icon-only toggle for compact layouts; see [Side menu](https://www.beeq.design/components/side-menu.md). A collapsed item keeps its text for screen readers and shows it in a tooltip, so its prefix icon stays `aria-hidden="true"` in both states.
- `min-inline-size: 0` on the content column lets wide tables and long text shrink instead of overflowing the grid.

## Settings form

```html
<form class="settings-form" aria-labelledby="profile-title">
  <h2 id="profile-title">Profile</h2>

  <bq-input name="displayName" required>
    <label slot="label">Display name</label>
    <span slot="helper-text">Shown to people in your workspace.</span>
  </bq-input>

  <bq-select name="language" value="en">
    <label slot="label">Language</label>
    <bq-option value="en">English</bq-option>
    <bq-option value="es">Spanish</bq-option>
    <bq-option value="ro">Romanian</bq-option>
  </bq-select>

  <bq-textarea name="bio" placeholder="A sentence or two about you">
    <label slot="label">Bio</label>
  </bq-textarea>

  <bq-switch name="digest" checked>Email me a weekly summary</bq-switch>

  <div class="settings-form__actions">
    <bq-button appearance="secondary" type="reset">Discard changes</bq-button>
    <bq-button type="submit">Save profile</bq-button>
  </div>
</form>

<style>
  .settings-form {
    display: grid;
    gap: var(--bq-spacing-m);
    max-inline-size: 60ch;
  }

  .settings-form__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--bq-spacing-s);
    margin-block-start: var(--bq-spacing-s);
  }
</style>
```

Notes:

- Every control has a visible label through its `label` slot or default slot.
- Show validation with `validation-status="error"` and a message in the `helper-text` slot; do not rely on colour alone.
- Use `bq-switch` only when the change applies without submitting. Inside a submitted form, `bq-checkbox` is often clearer.

## List with loading, empty, and error states

Every data view needs all three states, not only the happy path. When the load fails, the region has nothing to show, so the error is an empty state too: it says what failed and offers Retry as its one action.

```html
<section class="project-list" aria-labelledby="projects-title" aria-busy="false">
  <h2 id="projects-title">Projects</h2>

  <!-- Loading -->
  <bq-spinner text-position="right">Loading projects</bq-spinner>

  <!-- Error -->
  <bq-empty-state>
    <bq-icon name="warning-circle" slot="thumbnail" size="80" color="icon--danger" aria-hidden="true"></bq-icon>
    Projects could not be loaded
    <span slot="body">Check your connection and try again.</span>
    <bq-button slot="footer" appearance="secondary">Retry</bq-button>
  </bq-empty-state>

  <!-- Empty -->
  <bq-empty-state>
    No projects yet
    <span slot="body">Create a project to start tracking work.</span>
    <bq-button slot="footer">Create project</bq-button>
  </bq-empty-state>
</section>

<style>
  .project-list {
    display: grid;
    gap: var(--bq-spacing-l);
  }
</style>
```

Notes:

- Render one state at a time. Keep the heading in place so the section does not jump.
- Set `aria-busy="true"` on the section while loading.
- The error thumbnail replaces the default icon; its title and body carry the meaning, so the icon stays `aria-hidden`. A slotted icon sets its own `size`: match the empty state's `size`, which draws its default icon at 40 (small), 80 (medium, the default), or 180 (large).
- Keep `bq-alert` for messages about content that is still on screen: a failed refresh above a stale list, a failed save, a partial failure. A toast alone disappears before people can act on it.

## Page header

`bq-page-title` renders the page's `h1`. Put metadata in `slot="sub-title"` and page actions in `slot="suffix"`.

```html
<bq-page-title>
  <bq-button slot="back" appearance="link" only-icon label="Back to reports" href="/reports">
    <bq-icon name="arrow-left" aria-hidden="true"></bq-icon>
  </bq-button>
  Q3 revenue forecast
  <span slot="sub-title">Updated 2 hours ago</span>
  <div class="page-actions" slot="suffix">
    <bq-status type="info">In review</bq-status>
    <bq-button appearance="secondary">Export</bq-button>
    <bq-button>Approve</bq-button>
  </div>
</bq-page-title>

<style>
  .page-actions {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: end;
    gap: var(--bq-spacing-s);
  }
</style>
```

Notes:

- `bq-page-title` is a block that fills its container, and its suffix area grows beside the title. `flex-grow: 1` plus `justify-content: end` on the slotted wrapper pushes the actions to the inline end; the host needs no width rule.
- Do not add another `h1` on the page. Headings inside the page start at `h2`.
- A status or other state of the whole page sits in the suffix beside the actions; descriptive metadata sits in the sub-title.
- One primary action in the suffix; secondary actions use `appearance="secondary"` or `text`.

## Confirm a destructive action

```html
<bq-button variant="danger" id="delete-trigger">Delete project</bq-button>

<bq-dialog id="delete-dialog" size="small">
  <h2 slot="title">Delete this project?</h2>
  <p>This removes the project, its files, and its history. You can't undo this.</p>
  <div class="dialog-actions" slot="footer">
    <bq-button appearance="secondary" data-action="cancel">Cancel</bq-button>
    <bq-button variant="danger" data-action="confirm">Delete project</bq-button>
  </div>
</bq-dialog>

<script type="module">
  const dialog = document.querySelector('#delete-dialog');
  document.querySelector('#delete-trigger').addEventListener('bqClick', () => dialog.show());
  dialog.querySelector('[data-action="cancel"]').addEventListener('bqClick', () => dialog.hide());
  dialog.querySelector('[data-action="confirm"]').addEventListener('bqClick', async () => {
    // Delete, then close.
    await dialog.hide();
  });
</script>

<style>
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--bq-spacing-s);
  }
</style>
```

Notes:

- The confirm label repeats the action ("Delete project"), not a generic "OK".
- Keep `variant="danger"` for the destructive action only. Cancel stays secondary.
- `show()` and `hide()` are the dialog's methods; check [Dialog](https://www.beeq.design/components/dialog.md) for events such as `bqCancel` and `bqAfterClose`.
