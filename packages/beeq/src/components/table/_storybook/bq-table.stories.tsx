import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';

import mdx from './bq-table.mdx';

const meta: Meta = {
  title: 'Components/Table',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    activeRowId: { control: 'text', table: { disable: true } },
    bordered: { control: 'boolean', table: { disable: true } },
    compact: { control: 'boolean', table: { disable: true } },
  },
};
export default meta;

type Story = StoryObj;

// Define the data structure
interface TableData {
  id: string;
  user: {
    initials: string;
    name: string;
  };
  text: string;
  tag: string;
  status: {
    type: 'alert' | 'danger' | 'info' | 'neutral' | 'success';
    label: string;
  };
  amount: string;
  stage: {
    number: number;
    label: string;
  };
  country: {
    code: string;
    name: string;
    flag: string;
  };
}

// Sample data
const tableData: TableData[] = [
  {
    id: '1',
    user: {
      initials: 'JD',
      name: 'John Doe',
    },
    text: 'Sample text content',
    tag: 'Tag',
    status: {
      type: 'success',
      label: 'Active',
    },
    amount: '-2,343 €',
    stage: {
      number: 1,
      label: 'Stage 1',
    },
    country: {
      code: 'es',
      name: 'Spain',
      flag: 'https://raw.githubusercontent.com/hampusborgos/country-flags/refs/heads/main/svg/es.svg',
    },
  },
  {
    id: '2',
    user: {
      initials: 'AS',
      name: 'Alice Smith',
    },
    text: 'Another text value',
    tag: 'Tag',
    status: {
      type: 'alert',
      label: 'Pending',
    },
    amount: '+95,453 €',
    stage: {
      number: 2,
      label: 'Stage 2',
    },
    country: {
      code: 'fr',
      name: 'France',
      flag: 'https://raw.githubusercontent.com/hampusborgos/country-flags/refs/heads/main/svg/fr.svg',
    },
  },
  {
    id: '3',
    user: {
      initials: 'RJ',
      name: 'Robert Johnson',
    },
    text: 'Third row text',
    tag: 'Tag',
    status: {
      type: 'neutral',
      label: 'Inactive',
    },
    amount: '-2,343 €',
    stage: {
      number: 3,
      label: 'Stage 3',
    },
    country: {
      code: 'de',
      name: 'Germany',
      flag: 'https://raw.githubusercontent.com/hampusborgos/country-flags/refs/heads/main/svg/de.svg',
    },
  },
];

const Template = (args: Args) => {
  const { activeRowId, bordered, compact } = args;

  return html`
    <style>
      .bq-table {
        bq-button[appearance='text'] {
          --bq-button--medium-paddingX: var(--bq-spacing-xs2);
          --bq-button--medium-paddingY: var(--bq-spacing-xs);
        }

        bq-dropdown::part(panel) {
          --bq-panel--width: fit-content;
        }
      }
    </style>
    <div class="bq-table--container">
      <table class=${classMap({ 'bq-table': true, compact: compact, bordered: bordered })}>
        <thead>
          <tr>
            <th>User</th>
            <th>Text</th>
            <th>Tag</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Stage</th>
            <th>Country</th>
            <th class="!text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${tableData.map(
            (row) => html`
              <tr class=${classMap({ selected: row.id === activeRowId })}>
                <td>
                  <div class="flex items-center gap-s">
                    <bq-avatar initials=${row.user.initials} size="small"></bq-avatar>
                    <span>${row.user.name}</span>
                  </div>
                </td>
                <td>${row.text}</td>
                <td>
                  <bq-tag size="xsmall">${row.tag}</bq-tag>
                </td>
                <td>
                  <bq-status type=${row.status.type}>${row.status.label}</bq-status>
                </td>
                <td>${row.amount}</td>
                <td>
                  <div class="flex items-center gap-xs">
                    <bq-icon name="arrow-right"></bq-icon>
                    <span>${row.stage.label}</span>
                  </div>
                </td>
                <td>
                  <div class="flex items-center gap-xs">
                    <bq-avatar size="xsmall" image=${row.country.flag}></bq-avatar>
                    <span>${row.country.name}</span>
                  </div>
                </td>
                <td class="!text-center">
                  <bq-dropdown placement="bottom-end">
                    <bq-button appearance="text" size="small" slot="trigger">
                      <bq-icon name="dots-three-vertical" size="20"></bq-icon>
                    </bq-button>
                    <bq-option-list>
                      <bq-option>
                        <bq-icon name="pen" slot="prefix"></bq-icon>
                        <span>Edit</span>
                      </bq-option>
                      <bq-option>
                        <bq-icon name="trash" slot="prefix"></bq-icon>
                        <span>Delete</span>
                      </bq-option>
                    </bq-option-list>
                  </bq-dropdown>
                </td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    </div>
  `;
};

export const Default: Story = {
  render: Template,
};

export const ActiveRow: Story = {
  render: Template,
  args: {
    activeRowId: '2',
  },
};

export const Bordered: Story = {
  render: Template,
  args: {
    activeRowId: '2',
    bordered: true,
  },
};

export const Compact: Story = {
  render: Template,
  args: {
    activeRowId: '2',
    compact: true,
  },
};
