import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import { CARD_BORDER_RADIUS, CARD_TYPE } from '../bq-card.types';
import mdx from './bq-card.mdx';

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
  <style>
    .bq-story-card {
      max-width: 24rem;
    }

    .bq-story-card h6 {
      font-size: var(--bq-font-size--m);
      font-weight: var(--bq-font-weight--medium);
    }

    .bq-story-card__header {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--bq-spacing-xs2);
    }

    .bq-story-card__stats {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .bq-story-card__metric {
      display: flex;
      flex-direction: column;
    }

    .bq-story-card__metric span {
      font-weight: var(--bq-font-weight--bold);
    }

    .bq-story-card__features {
      display: flex;
      flex-direction: column;
      font-weight: var(--bq-font-weight--medium);
      gap: var(--bq-spacing-m);
    }

    .bq-story-card__feature-list {
      display: flex;
      flex-direction: column;
      gap: var(--bq-spacing-s);
    }

    .bq-story-card__feature {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--bq-spacing-xs);
    }

    .bq-story-card__performance {
      display: flex;
      flex-direction: row;
      gap: var(--bq-spacing-m);
    }

    .bq-story-card__trend {
      display: flex;
      align-items: flex-end;
      gap: var(--bq-spacing-xs);
    }

    .bq-story-card__detail {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--bq-spacing-m);
    }

    .bq-story-card__detail-text {
      display: flex;
      flex-direction: column;
      gap: var(--bq-spacing-xs2);
    }

    .bq-story-card__detail-text p {
      align-items: stretch;
    }

    .bq-story-card__mini {
      display: flex;
      inline-size: 100%;
    }

    .bq-story-card__mini-icon {
      display: flex;
      padding-inline: var(--bq-spacing-l);
      padding-block: var(--bq-spacing-l);
      background-color: var(--bq-background--brand);
      border-start-start-radius: var(--bq-card--borderRadius);
      border-end-start-radius: var(--bq-card--borderRadius);
    }

    .bq-story-card__mini-body {
      display: flex;
      align-items: center;
      padding-inline: var(--bq-card--paddingMinimal);
      padding-block: var(--bq-card--paddingMinimal);
      justify-content: space-between;
      inline-size: 100%;
    }

    .bq-story-card__mini-text {
      display: flex;
      flex-direction: column;
      padding-inline-start: 0.5rem;
    }

    .bq-story-card__mini-action {
      padding-inline: var(--bq-card--paddingMinimal);
      padding-block: var(--bq-card--paddingMinimal);
    }
  </style>
  <div class="bq-story-card">
    <bq-card border=${args.border} type=${ifDefined(args.type)}>
      ${ifDefined(args.content) ? unsafeHTML(args.content) : nothing}
    </bq-card>
  </div>
`;

export const Default: Story = {
  render: Template,
  args: {
    content: `
      <div class="bq-story-card__stats">
        <div>
          <div class="bq-story-card__header">
            <span>Title</span> <bq-icon color="text--brand" size="16" name="star" weight="bold" part="icon"/></bq-icon>
          </div>
          <h4>194</h4>
        </div>
        <div class="bq-story-card__metric">
          <p><span>120</span> days</p>
          <p>avg resolution</p>
        </div>
        <div class="bq-story-card__metric">
          <p><span>120</span> days</p>
          <p>avg resolution</p>
        </div>
      </div>
    `,
  },
};

export const FeatureHighlights: Story = {
  render: Template,
  args: {
    content: `
      <div class="bq-story-card__features">
        <h6>Title</h6>
        <div class="bq-story-card__feature-list">
          <div class="bq-story-card__feature">
            <bq-icon name="star-bold" part="icon"/></bq-icon>
            Lorem Ipsum is simply dummy text
          </div>
          <div class="bq-story-card__feature">
            <bq-icon name="star-bold" part="icon"/></bq-icon>
            Lorem Ipsum is simply dummy text
          </div>
          <div class="bq-story-card__feature">
            <bq-icon name="star-bold" part="icon"/></bq-icon>
            Lorem Ipsum is simply dummy text
          </div>
          <div class="bq-story-card__feature">
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
      <div class="bq-story-card__performance">
        <bq-icon color="text--brand" size="56" name="star-bold" part="icon"/></bq-icon>
        <div>
          <div class="bq-story-card__header">
            <span>Title</span> <bq-icon color="text--brand" size="16" name="star" weight="bold" part="icon"/></bq-icon>
          </div>
          <div class="bq-story-card__trend">
            <h4>194</h4>
            <span>+24%</span>
            <span>than last mo.</span>
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
      <div class="bq-story-card__detail">
        <bq-icon color="text--brand" size="56" name="star" weight="bold" part="icon"/></bq-icon>
        <div class="bq-story-card__detail-text">
          <h6>Title</h6>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
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
      <div class="bq-story-card__mini">
        <div class="bq-story-card__mini-icon">
          <bq-icon color="text--on-brand" size="24" name="star" weight="bold" part="icon"/></bq-icon>
        </div>
        <div class="bq-story-card__mini-body">
          <div class="bq-story-card__mini-text">
            <h6>Title</h6>
            <p>description</p>
          </div>
          <div class="bq-story-card__mini-action">
            <bq-icon color="text--brand" size="24" name="star" weight="bold" part="icon"/></bq-icon>
          </div>
        </div>
      </div>
    `,
    type: 'minimal',
  },
};
