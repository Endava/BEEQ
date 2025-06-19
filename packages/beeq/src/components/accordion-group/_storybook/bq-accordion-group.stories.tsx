import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from '../../accordion/_storybook/bq-accordion.mdx';
import { ACCORDION_APPEARANCE, ACCORDION_SIZE } from '../../accordion/bq-accordion.types';

const meta: Meta = {
  title: 'Components/Accordion',
  component: 'bq-accordion-group',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    appearance: { control: 'select', options: [...ACCORDION_APPEARANCE] },
    'expand-all': { control: 'boolean' },
    'no-animation': { control: 'boolean' },
    multiple: { control: 'boolean' },
    size: { control: 'select', options: [...ACCORDION_SIZE] },
  },
  args: {
    appearance: 'filled',
    'expand-all': false,
    'no-animation': false,
    multiple: false,
    size: 'medium',
  },
};
export default meta;

type Story = StoryObj;

export const Group: Story = {
  render: (args: Args) => html`
    <bq-accordion-group
      appearance=${ifDefined(args.appearance)}
      ?expand-all=${args['expand-all']}
      ?no-animation=${args['no-animation']}
      ?multiple=${args.multiple}
      size=${ifDefined(args.size)}
    >
      <bq-accordion size=${args.size}>
        <span slot="header">First</span>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque magnam corporis perferendis, architecto vel
          ullam officia officiis necessitatibus optio nam soluta labore libero debitis? Delectus enim quaerat laboriosam
          consequatur ea.
        </div>
      </bq-accordion>
      <bq-accordion expanded>
        <span slot="header">Second</span>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque magnam corporis perferendis, architecto vel
          ullam officia officiis necessitatibus optio nam soluta labore libero debitis? Delectus enim quaerat laboriosam
          consequatur ea.
        </div>
      </bq-accordion>
      <bq-accordion disabled>
        <span slot="header">Third</span>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque magnam corporis perferendis, architecto vel
          ullam officia officiis necessitatibus optio nam soluta labore libero debitis? Delectus enim quaerat laboriosam
          consequatur ea.
        </div>
      </bq-accordion>
      <bq-accordion>
        <span slot="header">Four</span>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque magnam corporis perferendis, architecto vel
          ullam officia officiis necessitatibus optio nam soluta labore libero debitis? Delectus enim quaerat laboriosam
          consequatur ea.
        </div>
      </bq-accordion>
    </bq-accordion-group>
  `,
  args: {},
};
