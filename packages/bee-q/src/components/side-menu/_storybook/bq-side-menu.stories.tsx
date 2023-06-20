import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';

import mdx from './bq-side-menu.mdx';
import { SIDE_MENU_APPEARANCE } from '../bq-side-menu.types';

const meta: Meta = {
  title: 'Components/Side menu',
  component: 'bq-side-menu',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    appearance: { control: 'select', options: [...SIDE_MENU_APPEARANCE] },
    collapse: { control: 'boolean' },
  },
  args: {
    appearance: 'light',
    collapse: false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-side-menu appearance=${args.appearance} collapse=${args.collapse}>
    <div class="flex items-center gap-s py-6 pl-s" slot="logo">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 40 40" class="h-10 w-10">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M5.167 10.286c-.328-.053-.592-.292-.775-.577a2.35 2.35 0 0 0-3.317-.69c-1.103.753-1.407 2.282-.678 3.416a2.35 2.35 0 0 0 3.439.6c.209-.162.466-.263.724-.22.413.066.7.453.697.883a8.42 8.42 0 0 0 1.336 4.611c.715 1.111.948 2.588.211 3.684l-4.235 6.3C.872 30.817.354 33.799 1.004 36.156c.67 2.423 2.565 4.092 5.35 3.814.278-.028.555-.06.834-.097 2.866-.377 5.193-2.373 6.603-4.963.726-1.333 2.642-1.857 3.839-.954.677.51 1.367.95 2.06 1.31 2.469 1.285 5.318 1.718 7.592.167 2.273-1.552 2.999-4.424 2.814-7.267a15.75 15.75 0 0 0-.386-2.542c-.327-1.404.798-2.91 2.19-3.069 2.866-.327 5.558-1.755 7.013-4.327.141-.25.279-.5.411-.752 1.336-2.534.584-4.983-1.32-6.563-1.853-1.537-4.72-2.21-7.639-1.585l-7.002 1.499c-1.308.28-2.574-.552-3.312-1.7a8.045 8.045 0 0 0-3.869-3.176.714.714 0 0 1-.44-.827.785.785 0 0 1 .396-.489c.066-.036.13-.075.193-.118 1.103-.753 1.406-2.282.678-3.416a2.35 2.35 0 0 0-3.318-.69c-1.103.753-1.407 2.282-.678 3.416l.015.022c.177.27.282.596.205.912a.952.952 0 0 1-.82.711 7.907 7.907 0 0 0-3.536 1.332A8.207 8.207 0 0 0 6.263 9.72c-.213.397-.634.642-1.07.571l-.026-.004Zm6.457 16.499a1.982 1.982 0 0 0-.163-.46c-.667-1.345-2.593-1.622-3.427-.38l-2.938 4.37c-.988 1.47-1.206 3.074-.894 4.204.293 1.062 1.056 1.777 2.374 1.645.246-.024.493-.053.74-.085 1.605-.211 2.888-1.287 3.718-2.811.848-1.558 1.207-3.58.803-5.48l-.213-1.003Zm.656-14.687c1.435-.98 3.1-1.168 4.753-.85.062.011.109-.058.074-.112-1.38-2.148-4.195-2.733-6.285-1.307-2.09 1.426-2.666 4.324-1.285 6.472.035.054.115.037.128-.027.362-1.692 1.18-3.197 2.615-4.176Zm14.642 1.329c-1.656.354-2.251 2.59-1.203 3.957.126.164.28.32.445.441l.133.097c1.541 1.125 3.488 1.574 5.212 1.377 1.685-.192 3.148-.99 3.962-2.43.126-.222.248-.445.366-.668.632-1.199.29-2.202-.544-2.895-.888-.736-2.407-1.155-4.106-.792l-4.265.913ZM22.9 18.408c.656.53.77 1.508.253 2.185-1.064 1.395-2.058 2.438-3.273 3.26-1.207.817-2.548 1.357-4.22 1.864-.802.243-1.641-.229-1.875-1.053-.235-.825.226-1.69 1.027-1.933 1.546-.468 2.562-.903 3.41-1.477.842-.57 1.604-1.334 2.555-2.58a1.484 1.484 0 0 1 2.123-.266Zm3.267 6.475c.626.55.789 1.495.362 2.11-.878 1.268-1.715 2.203-2.764 2.913-1.043.705-2.223 1.135-3.706 1.513-.71.18-1.5-.325-1.762-1.13-.262-.806.102-1.605.813-1.786 1.37-.349 2.264-.7 2.997-1.195.727-.492 1.37-1.175 2.154-2.308.427-.615 1.28-.668 1.906-.117Z"
          clip-rule="evenodd"
        />
      </svg>
      ${!args.collapse ? html`<h1 class="whitespace-nowrap text-xl">Bee-Q</h1>` : nothing}
    </div>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item active>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item akjasd kasjdh kjahsdkjash
      <bq-badge slot="suffix"> 5 </bq-badge>
    </bq-side-menu-item>
    <bq-side-menu-item disabled>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
  </bq-side-menu>
`;

export const Default: Story = {
  render: Template,
  args: {},
};
