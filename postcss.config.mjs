function mantineCSS() {
  return {
    postcssPlugin: 'postcss-preset-mantine',
    plugins: {},
  };
}

function simpleVarsCSS() {
  return {
    postcssPlugin: 'postcss-simple-vars',
    plugins: {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  };
}

export default {
  plugins: [mantineCSS(), simpleVarsCSS()],
};
