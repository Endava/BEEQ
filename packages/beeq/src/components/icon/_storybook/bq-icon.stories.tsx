import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { repeat } from 'lit-html/directives/repeat.js';

import mdx from './bq-icon.mdx';
import { ICON_WEIGHT } from '../bq-icon.types';

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
        bq-button::part(button) {
          text-decoration: none;
        }
      </style>
      <div class="text-text-primary m-be-xl">
        <h1 class="text-xl font-bold">We didn't reinvent the wheel</h1>
        <p class="m-bs-xs">
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
        <span class="text-xs text-secondary">
          (Below, you're seeing only a few examples of the icons that the library provides)
        </span>
      </div>
      <bq-button class="m-be-xxl" appearance="primary" href="https://phosphoricons.com/" target="_blank">
        <bq-icon name="binoculars-fill" slot="prefix"></bq-icon>
        Explore all the icons available
        <bq-icon class="ms-m" name="caret-right" slot="suffix"></bq-icon>
      </bq-button>
      <!-- Warning block -->
      <bq-alert class="m-be-l" type="warning" disable-close open>
        <bq-icon name="warning-fill" slot="icon"></bq-icon>
        Please notice
        <span slot="body">
          The SVG icons will be flipped horizontally when the <code>dir="rtl"</code> attribute is used.
        </span>
      </bq-alert>
      <!-- Icons -->
      <div
        class="icon-grid grid grid-cols-[repeat(auto-fill,_minmax(75px,_1fr))] gap-l gap-x-m max-bs-auto max-is-auto"
      >
        ${repeat(
          ICONS,
          (icon) => icon,
          (icon) => html`
            <div class="group flex flex-col items-stretch text-center outline-0" role="button" tabindex="0">
              <div
                class="border flex w-full justify-center rounded-m border-s border-solid border-primary transition-[shadow,transform] p-b-m p-i-0 m-be-s group-hover:scale-125 group-hover:shadow-l"
              >
                ${Template({ ...args, name: icon })}
              </div>
              <span class="text-s leading-regular text-primary">${icon}</span>
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
