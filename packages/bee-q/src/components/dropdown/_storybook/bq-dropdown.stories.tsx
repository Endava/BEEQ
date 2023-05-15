import { html } from 'lit-html';
import mdx from './bq-dropdown.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Dropdown',
  component: 'bq-dropdown',
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
  argTypes: {
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    text: 'Some content in the panel',
  },
};
export default meta;

type Story = StoryObj;

export const ButtonTrigger: Story = {
  render: (args: Args) => html`
    <bq-dropdown>
      <bq-button appearance="secondary" href="" size="medium" target="" type="button" variant="standard" slot="trigger">
        <bq-icon name="dots-three-vertical"></bq-icon>
      </bq-button>

      <bq-panel distance="0" placement="bottom" open="false"> ${args.text} </bq-panel>
    </bq-dropdown>
  `,
};

export const AvatarTrigger: Story = {
  render: (args: Args) => html`
    <bq-dropdown>
      <bq-avatar
        alt-text="User profile"
        image="https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80"
        label="Avatar component label"
        initials=""
        shape="circle"
        size="medium"
        slot="trigger"
      ></bq-avatar>

      <bq-panel distance="0" placement="bottom" open="false"> ${args.text} </bq-panel>
    </bq-dropdown>
  `,
};

export const DropdownPosition: Story = {
  render: (args: Args) => html`
    <section>
      <bq-dropdown>
        <bq-button slot="trigger">Bottom</bq-button>

        <bq-panel distance="0" placement="bottom" open="false"> </bq-panel>
      </bq-dropdown>

      <bq-dropdown>
        <bq-button slot="trigger">Top</bq-button>

        <bq-panel distance="0" placement="top" open="false"> </bq-panel>
      </bq-dropdown>

      <bq-dropdown>
        <bq-button slot="trigger">Bottom start</bq-button>

        <bq-panel distance="0" placement="bottom-start" open="false"> </bq-panel>
      </bq-dropdown>

      <bq-dropdown>
        <bq-button slot="trigger">Top end</bq-button>

        <bq-panel distance="0" placement="top-end" opene="false"> </bq-panel>
      </bq-dropdown>
    </section>
  `,
};
