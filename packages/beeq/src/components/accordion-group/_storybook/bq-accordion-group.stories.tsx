import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

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
    multiple: { control: 'boolean' },
    size: { control: 'select', options: [...ACCORDION_SIZE] },
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    appearance: 'filled',
    'expand-all': false,
    multiple: false,
    size: 'medium',
    text: 'Header',
  },
};
export default meta;

type Story = StoryObj;

export const Group: Story = {
  render: (args: Args) => html`
    <bq-accordion-group
      ?expand-all=${args['expand-all']}
      ?multiple=${args.multiple}
      size=${args.size}
      appearance=${args.appearance}
    >
      <bq-accordion size=${args.size}>
        <span slot="header">${args.text}</span>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque magnam corporis perferendis, architecto vel
          ullam officia officiis necessitatibus optio nam soluta labore libero debitis? Delectus enim quaerat laboriosam
          consequatur ea.
        </div>
      </bq-accordion>
      <bq-accordion expanded>
        <span slot="header">${args.text}</span>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque magnam corporis perferendis, architecto vel
          ullam officia officiis necessitatibus optio nam soluta labore libero debitis? Delectus enim quaerat laboriosam
          consequatur ea.
        </div>
      </bq-accordion>
      <bq-accordion disabled>
        <span slot="header">${args.text}</span>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque magnam corporis perferendis, architecto vel
          ullam officia officiis necessitatibus optio nam soluta labore libero debitis? Delectus enim quaerat laboriosam
          consequatur ea.
        </div>
      </bq-accordion>
      <bq-accordion>
        <span slot="header">${args.text}</span>
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
