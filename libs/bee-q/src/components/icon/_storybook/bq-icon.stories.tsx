import { html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';
import mdx from './bq-icon.mdx';
import { ICONS_SET } from '../helper/icons-set';
import { ICON_WEIGHT } from '../bq-icon.types';
import { getRandomFromArray } from '../../../shared/utils';

export default {
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
    color: 'text--accent',
    size: 24,
    weight: 'regular',
  },
};
export const Default = (args) => html`
  <bq-icon color=${args.color} name=${args.name} size=${args.size} weight=${args.weight}></bq-icon>
`;
Default.args = {
  name: 'bell-ringing',
};

export const ExploreIcons = (args) => html`
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
        class="text-text-accent"
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
  <div class="icon-grid my-0 mx-auto grid grid-cols-[repeat(auto-fill,_minmax(75px,_1fr))] gap-6 gap-x-4">
    ${repeat(
      getRandomFromArray(args.icons, 36),
      (icon) => icon,
      (icon) => html`
        <div class="group flex flex-col items-stretch text-center outline-0" role="button" tabindex="0">
          <div
            class="mb-2 flex w-full justify-center rounded-m border border-solid border-ui-secondary py-4 px-0 transition-shadow group-hover:shadow-m"
          >
            <bq-icon color=${args.color} .name=${icon as string} size=${args.size} weight=${args.weight}></bq-icon>
          </div>
          <span class="text-s leading-regular text-text-primary">${icon}</span>
        </div>
      `,
    )}
  </div>
`;
ExploreIcons.args = {
  icons: ICONS_SET,
};
ExploreIcons.parameters = {
  chromatic: { disableSnapshot: true },
};
