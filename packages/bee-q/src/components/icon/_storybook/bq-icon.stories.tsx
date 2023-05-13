import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';

import mdx from './bq-icon.mdx';
import { getRandomFromArray } from '../../../shared/utils';
import { ICON_WEIGHT } from '../bq-icon.types';
import { ICONS_SET } from '../helper/icons-set';

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
    name: { control: 'select', options: [...ICONS_SET] },
    size: { control: 'number' },
    weight: { control: 'select', options: [...ICON_WEIGHT] },
  },
  args: {
    color: 'text--brand',
    size: 24,
    weight: 'regular',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-icon color=${args.color} name=${args.name} size=${args.size} weight=${args.weight}></bq-icon>
`;

export const Default: Story = {
  render: Template,
  args: {
    name: 'bell-ringing',
  },
};

export const ExploreIcons: Story = {
  render: (args: Args) => html`
    <style>
      bq-button::part(button) {
        text-decoration: none;
      }
    </style>
    <div class="mb-8 text-text-primary">
      <h1 class="text-xl font-bold">We didn't reinvent the wheel</h1>
      <p class="mt-2">
        Bee-Q icons are based on
        <a
          class="bq-link"
          href="https://phosphoricons.com/"
          target="_blank"
          title="Phosphor icons"
          rel="noreferrer noopener"
        >
          Phosphor icons library
        </a>
        , is a flexible icon family for interfaces, diagrams, presentations — whatever, really, is free and open-source,
        licensed under MIT.
      </p>
      <span class="text-xs text-text-secondary">
        (Below, you're seeing only a few examples of the icons that the library provides)
      </span>
    </div>
    <bq-button class="mb-8" appearance="primary" href="https://phosphoricons.com/" target="_blank">
      <bq-icon name="binoculars" weight="fill" slot="prefix"></bq-icon>
      Explore all the icons available
      <bq-icon class="ml-4" name="caret-right" weight="regular" slot="suffix"></bq-icon>
    </bq-button>
    <div class="icon-grid mx-auto my-0 grid grid-cols-[repeat(auto-fill,_minmax(75px,_1fr))] gap-6 gap-x-4">
      ${repeat(
        getRandomFromArray(args.icons, 36),
        (icon) => icon,
        (icon) => html`
          <div class="group flex flex-col items-stretch text-center outline-0" role="button" tabindex="0">
            <div
              class="mb-2 flex w-full justify-center rounded-m border border-solid border-stroke-secondary px-0 py-4 transition-shadow group-hover:shadow-m"
            >
              ${Template({ ...args, name: icon })}
            </div>
            <span class="text-s leading-regular text-text-primary">${icon}</span>
          </div>
        `,
      )}
    </div>
  `,
  args: {
    icons: ICONS_SET,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};
