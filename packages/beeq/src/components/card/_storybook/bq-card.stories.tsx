import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import mdx from './bq-card.mdx';
import { CARD_BORDER_RADIUS, CARD_TYPE } from '../bq-card.types';

const meta: Meta = {
  title: 'Components/Card',
  component: 'bq-card',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    border: { control: 'select', options: [...CARD_BORDER_RADIUS] },
    type: { control: 'select', options: [...CARD_TYPE] },
    // This control is not part of the component
    content: { control: 'text', table: { disable: true } },
  },
  args: {
    border: 'm',
    type: 'default',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <div class="max-w-sm">
    <bq-card border=${args.border} type=${ifDefined(args.type)}>
      ${ifDefined(args.content) ? unsafeHTML(args.content) : nothing}
    </bq-card>
  </div>
`;

export const Default: Story = {
  render: Template,
  args: {
    content: `
      <div class="flex flex-col gap-6">
        <div>
          <div class="flex flex-row items-center gap-xs2">
            <span class="text-text-secondary">Title</span> <bq-icon color="text--brand" size="16" name="star" weight="bold" part="icon"/></bq-icon>
          </div>
          <h4>194</h4>
        </div>
        <div class="flex flex-col">
          <p><span class="font-bold">120</span> days</p>
          <p class="text-text-secondary">avg resolution</p>
        </div>
        <div class="flex flex-col">
          <p><span class="font-bold">120</span> days</p>
          <p class="text-text-secondary">avg resolution</p>
        </div>
      </div>
    `,
  },
};

export const FeatureHighlights: Story = {
  render: Template,
  args: {
    content: `
      <div class="flex flex-col font-medium gap-m">
        <h6 class="text-m font-medium">Title</h6>
        <div class="flex flex-col gap-s">
          <div class="flex flex-row items-center gap-xs">
            <bq-icon name="star-bold" part="icon"/></bq-icon>
            Lorem Ipsum is simply dummy text
          </div>
          <div class="flex flex-row items-center gap-xs">
            <bq-icon name="star-bold" part="icon"/></bq-icon>
            Lorem Ipsum is simply dummy text
          </div>
          <div class="flex flex-row items-center gap-xs">
            <bq-icon name="star-bold" part="icon"/></bq-icon>
            Lorem Ipsum is simply dummy text
          </div>
          <div class="flex flex-row items-center gap-xs">
            <bq-icon name="star-bold" part="icon"/></bq-icon>
            Lorem Ipsum is simply dummy text
          </div>
        </div>
      </div>
    `,
  },
};

export const PerformanceOverview: Story = {
  render: Template,
  args: {
    content: `
      <div class="flex flex-row gap-m">
        <bq-icon color="text--brand" size="56" name="star-bold" part="icon"/></bq-icon>
        <div>
          <div class="flex flex-row items-center gap-xs2">
            <span class="text-text-secondary">Title</span> <bq-icon color="text--brand" size="16" name="star" weight="bold" part="icon"/></bq-icon>
          </div>
          <div class="flex items-end gap-xs">
            <h4>194</h4>
            <span class="text-text-success">+24%</span>
            <span class="text-text-secondary">than last mo.</span>
          </div>
        </div>
      </div>
    `,
  },
};

export const DetailedContent: Story = {
  render: Template,
  args: {
    content: `
      <div class="flex flex-col items-start gap-m">
        <bq-icon color="text--brand" size="56" name="star" weight="bold" part="icon"/></bq-icon>
        <div class="flex flex-col gap-xs2">
          <h6 class="text-m font-medium">Title</h6>
          <p class="text-text-secondary items-stretch">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        </div>
        <bq-button appearance="link">Button</bq-button>
      </div>
    `,
  },
};

export const MiniCard: Story = {
  render: Template,
  args: {
    content: `
      <div class="flex is-full">
        <div class="flex p-i-l p-b-l bg-brand rounded-s-[--bq-card--borderRadius]">
          <bq-icon color="text--alt" size="24" name="star" weight="bold" part="icon"/></bq-icon>
        </div>
        <div class="flex items-center p-i-[--bq-card--paddingMinimal] p-b-[--bq-card--paddingMinimal] justify-between is-full">
          <div class="flex flex-col ps-2">
            <h6 class="text-m font-medium">Title</h6>
            <p class="text-text-secondary">description</p>
          </div>
          <div class="p-i-[--bq-card--paddingMinimal] p-b-[--bq-card--paddingMinimal]">
            <bq-icon color="text--brand" size="24" name="star" weight="bold" part="icon"/></bq-icon>
          </div>
        </div>
      </div>
    `,
    type: 'minimal',
  },
};
