You are grading code a coding agent wrote in a consumer project that uses BEEQ, Endava's web-component design system.

Grade the files listed under "Files written" in the agent output. Read the code itself; the agent's description of it is a claim to check against the code. If no files were written, score 0.0.

This rubric is one of two independent grades. A separate program checks every BEEQ name and literal prop value against the component source and runs the `checks` regexes in "Expected Output" (`checks`, `allow_rules`, and `allow_api` are its settings). Score from your own reading of the code.

Weigh three things:

1. **Task criteria (60%).** Each sentence in `criteria`, as written, is an equal share. A sentence holds only when every requirement in it holds in the files, including any exact value it names, such as an attribute value, event, or slot; where it offers alternatives joined by "or", one of them is enough. A sentence that does not hold loses its whole share.
2. **BEEQ fit (25%).** Each piece uses the component its job calls for, configured through its props, events, and slots. Styling reaches for props, semantic tokens, and component CSS custom properties before `::part()` or custom CSS, and leaves the product's own layout to the product.
3. **Quality (15%).** Accessible (labels, accessible names, keyboard use, state not shown by colour alone), idiomatic for the framework, and complete enough to run once dependencies are installed.

**Evidence.** Build `reasoning` before you choose the score, and write it first in the JSON object. Number the `criteria` sentences. For each, write `held` or `failed`, then the shortest code that shows it, in backticks with its file name, or what is missing. A sentence with no quote from the files under "Files written" is `failed`. The score is 0.6 × the share of `held` sentences, plus up to 0.25 for BEEQ fit and 0.15 for quality. Keep `reasoning` under 250 words.
