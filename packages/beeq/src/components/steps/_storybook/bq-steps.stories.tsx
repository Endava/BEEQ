import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import { STEPS_SIZE, STEPS_TYPE } from '../bq-steps.types';
import mdx from './bq-steps.mdx';

const meta: Meta = {
  title: 'Components/Steps',
  component: 'bq-steps',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'divider-color': { control: 'text' },
    type: { control: 'select', options: [...STEPS_TYPE] },
    size: { control: 'select', options: [...STEPS_SIZE] },
    // Events
    bqClick: { action: 'bqClick', table: { disable: true } },
    bqFocus: { action: 'bqFocus', table: { disable: true } },
    bqBlur: { action: 'bqBlur', table: { disable: true } },
    // Not part of the public API
    children: { control: 'text', table: { disable: true } },
  },
  args: {
    'divider-color': 'stroke--primary',
    size: 'medium',
  },
};
export default meta;

const Template = (args: Args) => {
  return html`
    <bq-steps
      divider-color=${args['divider-color']}
      type=${args.type}
      size=${args.size}
      @bqClick=${args.bqClick}
      @bqFocus=${args.bqFocus}
      @bqBlur=${args.bqBlur}
    >
      ${ifDefined(args.children) ? unsafeHTML(args.children) : nothing}
    </bq-steps>
  `;
};

export const Dots: StoryObj = {
  render: Template,
  args: {
    type: 'dot',
    children: `
      <bq-step-item status="default">
        <bq-icon aria-hidden="true" slot="prefix" name="circle"></bq-icon>
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>
      <bq-step-item status="error">
        <bq-icon aria-hidden="true" slot="prefix" name="x-circle"></bq-icon>
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>
      <bq-step-item status="completed">
        <bq-icon aria-hidden="true" slot="prefix" name="check-circle"></bq-icon>
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>
      <bq-step-item status="current">
        <bq-icon aria-hidden="true" slot="prefix" name="circle"></bq-icon>
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>
      <bq-step-item status="disabled">
        <bq-icon aria-hidden="true" slot="prefix" name="circle"></bq-icon>
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>
    `,
  },
};

export const Icons: StoryObj = {
  render: Template,
  args: {
    type: 'icon',
    children: `
      <bq-step-item status="completed">
        <bq-icon aria-hidden="true" slot="prefix" name="airplane-takeoff"></bq-icon>
        <span>Flight</span>
        <span slot="description">Reserve your flight</span>
      </bq-step-item>
      <bq-step-item status="completed">
        <bq-icon aria-hidden="true" slot="prefix" name="bed"></bq-icon>
        <span>Accommodation</span>
        <span slot="description">Reserve your accommodation</span>
      </bq-step-item>
      <bq-step-item status="error">
        <bq-icon aria-hidden="true" slot="prefix" name="car"></bq-icon>
        <span>Rent a car</span>
        <span slot="description">There was an error with your reservation</span>
      </bq-step-item>
      <bq-step-item status="current">
        <bq-icon aria-hidden="true" slot="prefix" name="tree-palm"></bq-icon>
        <span>Enjoy your holidays!</span>
        <span slot="description">You're ready for your vacations</span>
      </bq-step-item>
    `,
  },
};

export const Numbers: StoryObj = {
  render: Template,
  args: {
    type: 'numeric',
    children: `
      <bq-step-item status="default">
        <span aria-label="Step 1" slot="prefix">1</span>
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>
      <bq-step-item status="completed">
        <span aria-label="Step 2" slot="prefix">2</span>
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>
      <bq-step-item status="error">
        <span aria-label="Step 3" slot="prefix">3</span>
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>
      <bq-step-item status="current">
        <span aria-label="Step 4" slot="prefix">4</span>
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>
      <bq-step-item status="disabled">
        <span aria-label="Step 4" slot="prefix">4</span>
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>
    `,
  },
};
