import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
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
    label: { control: 'text' },
    name: { control: 'select', options: [...ICONS_SET] },
    size: { control: 'number' },
    src: { control: 'text' },
    weight: { control: 'select', options: [...ICON_WEIGHT] },
  },
  args: {
    color: 'text--brand',
    label: undefined,
    size: 24,
    src: undefined,
    weight: 'regular',
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
  render: (args: Args) => html`
    <style>
      bq-button::part(button) {
        text-decoration: none;
      }
    </style>
    <div class="mb-8 text-text-primary">
      <h1 class="text-xl font-bold">We didn't reinvent the wheel</h1>
      <p class="mt-2">
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
    <div class="icon-grid mx-auto my-0 grid grid-cols-[repeat(auto-fill,_minmax(75px,_1fr))] gap-l gap-x-m">
      ${repeat(
        getRandomFromArray(args.icons, 36),
        (icon) => icon,
        (icon) => html`
          <div class="group flex flex-col items-stretch text-center outline-0" role="button" tabindex="0">
            <div
              class="mb-s flex w-full justify-center rounded-m border-s border-solid border-stroke-primary px-0 py-m transition-[shadow,transform] group-hover:scale-125 group-hover:shadow-l"
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
