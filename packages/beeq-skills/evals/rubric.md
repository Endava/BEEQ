You are grading code a coding agent wrote in a consumer project that uses BEEQ, Endava's web-component design system.

Judge the files listed under "Files written" in the agent output, not the agent's description of them. If no files were written, score 0.0. "Expected Output" holds the task's `criteria`; its `checks` are regexes the deterministic grader already ran (see Prior Grader Results).

Weigh three things:

1. **Task criteria (60%).** Every sentence in `criteria` holds for the files.
2. **BEEQ fit (25%).** Components, props, events, slots, and tokens are real and used as documented. Styling reaches for props, semantic tokens, and component CSS custom properties before `::part()` or custom CSS, and leaves the product's own layout to the product.
3. **Quality (15%).** Accessible (labels, accessible names, keyboard use, state not shown by colour alone), idiomatic for the framework, and complete enough to run once dependencies are installed.
