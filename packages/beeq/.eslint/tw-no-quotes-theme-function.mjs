import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@beeq/tailwindcss-no-quotes-in-theme-function';
const messages = ruleMessages(ruleName, {
  rejected: 'Avoid using quotes in Tailwind CSS theme() function',
});

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });
    if (!validOptions) return;

    root.walkDecls((ruleNode) => {
      if (ruleNode.value.includes('theme(')) {
        // Use a regular expression to match the theme function and its arguments
        const match = ruleNode.value.match(/theme\((.*?)\)/);

        // If a match is found and the first character of the first group (the arguments of the theme function) is a single quote
        if (match?.[1]?.startsWith("'")) {
          report({
            message: messages.rejected, // The message to display
            node: ruleNode, // The node where the issue was found
            result, // The result object to which the issue should be attached
            ruleName, // The name of the rule that was violated
          });
        }
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);
