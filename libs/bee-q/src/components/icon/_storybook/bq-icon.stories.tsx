import { html } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';
import mdx from './bq-icon.mdx';
import { ICONS_SET } from '../helper/icons-set';
import { ICON_WEIGHT } from '../bq-icon.types';

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

export const ExploreIcons = (args) => {
  return html`
    <style>
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
        row-gap: 1.5rem;
        -webkit-column-gap: 1rem;
        column-gap: 1rem;
        margin: 0 auto;
      }
      .icon-wrapper {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        text-align: center;
        outline: 0;
      }
      .icon-wrapper:hover .icon-container {
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12);
      }
      .icon-container {
        display: flex;
        justify-content: center;
        border: 1px solid var(--bq-ui--secondary);
        border-radius: 4px;
        margin-bottom: 8px;
        padding: 16px 0;
        transition-timing-function: ease-in-out;
        transition-property: box-shadow;
        transition-duration: 0.25s;
        width: 100%;
      }
      .icon-span {
        font-family: var(--bq-font-family--inter);
        font-size: var(--bq-font-size--xs);
        line-height: var(--bq-font-line-height--regular);
        color: var(--bq-text--primary);
      }
    </style>
    <div class="icon-grid">
      ${repeat(
        args.icons,
        (icon) => icon,
        (icon) => html`
          <div class="icon-wrapper" role="button" tabindex="0">
            <div class="icon-container">
              <bq-icon color=${args.color} name=${icon} size=${args.size} weight=${args.weight}></bq-icon>
            </div>
            <span class="icon-span">${icon}</span>
          </div>
        `,
      )}
    </div>
  `;
};
ExploreIcons.args = {
  icons: ICONS_SET,
};
