import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { repeat } from 'lit-html/directives/repeat.js';

import { ICON_WEIGHT } from '../bq-icon.types';
import mdx from './bq-icon.mdx';

const meta: Meta = {
  title: 'Components/Icon',
  component: 'bq-icon',
  parameters: {
    controls: { sort: 'requiredFirst' },
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    icons: { table: { disable: true } },
    color: { control: 'text' },
    label: { control: 'text' },
    name: { control: 'text' },
    size: { control: 'number' },
    src: { control: 'text' },
    weight: { control: 'select', options: [...ICON_WEIGHT] },
  },
  args: {
    color: 'text--brand',
    label: undefined,
    size: 24,
    src: undefined,
    weight: undefined,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-icon
    color=${ifDefined(args.color)}
    label=${ifDefined(args.label)}
    name=${ifDefined(args.name)}
    size=${ifDefined(args.size)}
    src=${ifDefined(args.src)}
    weight=${ifDefined(args.weight)}
  ></bq-icon>
`;

export const Default: Story = {
  render: Template,
  args: {
    name: 'bell-ringing',
  },
};

export const Custom: Story = {
  name: 'Custom icon',
  render: Template,
  args: {
    size: 256,
    src: './assets/wallet.svg',
  },
};

export const ExploreIcons: Story = {
  render: (args) => {
    // List of icons to show, these are just a few examples of the icons available in the library
    const ICONS = [
      'align-left',
      'align-right',
      'arrow-circle-left',
      'arrow-circle-right',
      'arrow-elbow-left',
      'arrow-elbow-right',
      'arrow-square-left',
      'arrow-square-right',
      'arrows-horizontal',
      'arrows-vertical',
      'battery-charging',
      'book',
      'bookmark-simple',
      'car',
      'clipboard-text',
      'cloud-arrow-down',
      'cloud-arrow-up',
      'chart-line-up',
      'chart-line',
      'chart-pie-slice',
      'chart-pie',
      'chat',
      'folder-open',
      'git-commit',
      'git-merge',
      'git-pull-request',
      'hard-drives',
      'hash',
      'hash-straight',
      'layout',
      'list-bullets',
    ];

    return html`
      <style>
        .bq-story-icon__intro {
          margin-block-end: var(--bq-spacing-xl);
        }

        .bq-story-icon__intro h1 {
          font-size: var(--bq-font-size--xl);
          font-weight: var(--bq-font-weight--bold);
        }

        .bq-story-icon__intro p {
          margin-block-start: var(--bq-spacing-xs);
        }

        .bq-story-icon__intro span {
          font-size: var(--bq-font-size--xs);
          color: var(--bq-text--secondary);
        }

        .bq-story-icon__cta {
          margin-block-end: var(--bq-spacing-xxl);
        }

        .bq-story-icon__cta::part(button) {
          text-decoration: none;
        }

        .bq-story-icon__cta bq-icon[slot='suffix'] {
          margin-inline-start: var(--bq-spacing-m);
        }

        .bq-story-icon__notice {
          margin-block-end: var(--bq-spacing-l);
        }

        .bq-story-icon__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
          gap: var(--bq-spacing-l);
          column-gap: var(--bq-spacing-m);
          max-block-size: auto;
          max-inline-size: auto;
        }

        .bq-story-icon__item {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          text-align: center;
          outline-width: 0px;
        }

        .bq-story-icon__preview {
          display: flex;
          justify-content: center;
          width: 100%;
          border-radius: var(--bq-radius--m);
          border-width: var(--bq-stroke-s);
          border-style: solid;
          border-color: var(--bq-stroke--primary);
          /* "shadow" is not a CSS property, so only the transform has ever been animated */
          transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
          padding-block: var(--bq-spacing-m);
          padding-inline: 0px;
          margin-block-end: var(--bq-spacing-s);
        }

        .group:hover .bq-story-icon__preview {
          transform: scale(1.25);
          box-shadow: var(--bq-box-shadow--l);
        }

        .bq-story-icon__name {
          font-size: var(--bq-font-size--s);
          line-height: var(--bq-font-line-height--regular);
          color: var(--bq-text--primary);
        }
      </style>
      <div class="bq-story-icon__intro">
        <h1>We didn't reinvent the wheel</h1>
        <p>
          BEEQ icons are based on
          <a
            class="bq-link"
            href="https://phosphoricons.com/"
            target="_blank"
            title="Phosphor icons"
            rel="noreferrer noopener"
          >
            Phosphor icons library
          </a>
          , is a flexible icon family for interfaces, diagrams, presentations — whatever, really, is free and
          open-source, licensed under MIT.
        </p>
        <span>(Below, you're seeing only a few examples of the icons that the library provides)</span>
      </div>
      <bq-button class="bq-story-icon__cta" appearance="primary" href="https://phosphoricons.com/" target="_blank">
        <bq-icon name="binoculars-fill" slot="prefix"></bq-icon>
        Explore all the icons available
        <bq-icon name="caret-right" slot="suffix"></bq-icon>
      </bq-button>
      <!-- Warning block -->
      <bq-alert class="bq-story-icon__notice" type="warning" disable-close open>
        <bq-icon name="warning-fill" slot="icon"></bq-icon>
        Please notice
        <span slot="body">
          The SVG icons will be flipped horizontally when the <code>dir="rtl"</code> attribute is used.
        </span>
      </bq-alert>
      <!-- Icons -->
      <div class="icon-grid bq-story-icon__grid">
        ${repeat(
          ICONS,
          (icon) => icon,
          (icon) => html`
            <div class="group bq-story-icon__item" role="button" tabindex="0">
              <div class="bq-story-icon__preview">${Template({ ...args, name: icon })}</div>
              <span class="bq-story-icon__name">${icon}</span>
            </div>
          `,
        )}
      </div>
    `;
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};
