import plugin from 'tailwindcss/plugin';
import { DefaultLightTheme } from './light';
import { DefaultDarkTheme } from './dark';

const ThemePlugin = plugin(function ({ addBase }) {
  addBase({
    ':root': {
      ...DefaultLightTheme,
    },
    '[data-theme="light"]': {
      ...DefaultLightTheme,
    },
    '[data-theme="dark"]': {
      ...DefaultDarkTheme,
    },
  });
});

export default ThemePlugin;
