/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{jsx,js,tsx,ts}'],
  theme: {
    borderRadius: {
      none: 'var(--bq-radius--none)',
      xs: 'var(--bq-radius--xs)',
      s: 'var(--bq-radius--s)',
      m: 'var(--bq-radius--m)',
      l: 'var(--bq-radius--l)',
      xl: 'var(--bq-radius--xl)',
      base: 'var(--bq-radius--m)',
      card: 'var(--bq-radius--l)',
      full: 'var(--bq-radius--xl)',
    },
    colors: {
      current: 'currentColor',
      // Base Colours
      background: {
        light: 'var(--bq-background--light)',
        card: 'var(--bq-background--card)',
      },
      ui: {
        primary: 'var(--bq-ui--primary)',
        'primary-hover': 'var(--bq-ui--primary-hover)',
        'primary-active': 'var(--bq-ui--primary-active)',
        'primary-processing': 'var(--bq-ui--primary-processing)',
        'primary-disabled': 'var(--bq-ui--primary-disabled)',
        secondary: 'var(--bq-ui--secondary)',
        'secondary-hover': 'var(--bq-ui--secondary-hover)',
        'secondary-active': 'var(--bq-ui--secondary-active)',
        'secondary-processing': 'var(--bq-ui--secondary-processing)',
        'secondary-disabled': 'var(--bq-ui--secondary-disabled)',
      },
      text: {
        primary: 'var(--bq-text--primary)',
        'primary-disabled': 'var(--bq-text--primary-disabled)',
        secondary: 'var(--bq-text--secondary)',
        'secondary-disabled': 'var(--bq-text--secondary-disabled)',
        inverse: 'var(--bq-text--inverse)',
        accent: 'var(--bq-text--accent)',
      },
      system: {
        success: 'var(--bq-system--success)',
        neutral: 'var(--bq-system--neutral)',
        info: 'var(--bq-system--info)',
        danger: 'var(--bq-system--danger)',
        alert: 'var(--bq-system--alert)',
        guide: 'var(--bq-system--guide)',
      },
      data: {
        grey: 'var(--bq-data--grey)',
        blue: 'var(--bq-data--blue)',
        geekblue: 'var(--bq-data--geekblue)',
        purple: 'var(--bq-data--purple)',
        pink: 'var(--bq-data--pink)',
        red: 'var(--bq-data--red)',
        corai: 'var(--bq-data--corai)',
        orange: 'var(--bq-data--orange)',
        gold: 'var(--bq-data--gold)',
        yellow: 'var(--bq-data--yellow)',
        lime: 'var(--bq-data--lime)',
        green: 'var(--bq-data--green)',
        teal: 'var(--bq-data--teal)',
        cyan: 'var(--bq-data--cyan)',
      },
    },
    fontFamily: {
      inter: 'var(--bq-font-family--inter)',
    },
    fontSize: {
      xs: 'var(--bq-font-size--xs)',
      s: 'var(--bq-font-size--s)',
      m: 'var(--bq-font-size--m)',
      l: 'var(--bq-font-size--l)',
      xl: 'var(--bq-font-size--xl)',
      xxl: 'var(--bq-font-size--xxl)',
      xxxl: 'var(--bq-font-size--xxxl)',
      h: 'var(--bq-font-size--h)',
      g: 'var(--bq-font-size--g)',
    },
    fontWeight: {
      light: 'var(--bq-font-weight--light)',
      regular: 'var(--bq-font-weight--regular)',
      medium: 'var(--bq-font-weight--medium)',
      bold: 'var(--bq-font-weight--bold)',
      extrabold: 'var(--bq-font-weight--extrabold)',
    },
    lineHeight: {
      xs: 'var(--bq-line-height--xs)',
      s: 'var(--bq-line-height--s)',
      m: 'var(--bq-line-height--m)',
      l: 'var(--bq-line-height--l)',
      xl: 'var(--bq-line-height--xl)',
      xxl: 'var(--bq-line-height--xxl)',
      xxxl: 'var(--bq-line-height--xxxl)',
      h: 'var(--bq-line-height--h)',
      g: 'var(--bq-line-height--g)',
    },
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
