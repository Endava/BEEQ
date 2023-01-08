# Contributing to Bee-Q Design System

First off, thanks for taking the time to contribute and help out to make Bee-Q better than it is today! 💪😁 🎉

As a contributor, here are the guidelines we would like you to follow:

- [Contributing to Bee-Q Design System](#contributing-to-bee-q-design-system)
  - [✍️ Code of Conduct](#️-code-of-conduct)
  - [ We Develop with Github](#-we-develop-with-github)
  - [Pull Requests](#pull-requests)
  - [Any contributions you make will be under the Apache 2.0 Software License](#any-contributions-you-make-will-be-under-the-apache-20-software-license)
    - [ Report an Error or Bug](#-report-an-error-or-bug)
  - [🛠 Project setup](#-project-setup)
  - [🎨 Styleguides](#-styleguides)
    - [ Code formatting](#-code-formatting)
    - [ Branching strategy](#-branching-strategy)
    - [ Git Commit Messages](#-git-commit-messages)
      - [ Type](#-type)
      - [ Subject](#-subject)
    - [ Breaking changes](#-breaking-changes)
  - [👌 Recommended IDE Extensions](#-recommended-ide-extensions)

## <a name="code-of-conduct"></a>✍️ Code of Conduct

We have adopted the Contributor Covenant as our [Code of Conduct](https://www.contributor-covenant.org/), and we expect project participants to adhere to it. Please [read the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## <a name="develop-with-github"></a> We Develop with Github

So you wanna contribute some code? That's great! We use Github to host **code**, track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and start your branch from `develop`, following our [branching strategy](#-branching-strategy).
2. If you've added code that should be tested, add Unit tests.
3. If you've added a new component that should be tested, please add all the corresponding End-to-End Tests.
4. If you've changed APIs, update the documentation.
5. Ensure the test suite passes.
6. Make sure your code doesn't introduce new code quality violations.
7. Issue that pull request!

❗️When creating a Pull Request (PR), please make sure that **the PR's name also respects the [commit message format](#git-commit-messages) and always use Squash and merge**.

## Any contributions you make will be under the Apache 2.0 Software License

First of all, please be aware that when you submit code changes, your submissions are understood to be under the same [Apache 2.0](https://choosealicense.com/licenses/apache-2.0/) that covers the project. Feel free to contact the maintainers at [opensource@endava.com](opensource@endava.com) if that's a concern.

### <a name="report-an-error-or-bug"></a> Report an Error or Bug

Report a bug by [opening a new issue](issues/new/choose). When you are opening an issue, please be sure to report as much information as you can to allow us to replicate the problem and faster find the solution.

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give a sample code if you can
- What you expected would happen
- What happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## <a name="project-setup"></a>🛠 Project setup

For running the project in your local development environment please [follow the README instructions](README.md).

## <a name="styleguides"></a>🎨 Styleguides

### <a name="code-formatting"></a> Code formatting

**Follow the style you see used in the repository!** Consistency with the rest of the project always trumps other considerations. It doesn't matter what you choose for your daily code implementation or if you have your style but, please, **make sure to have configured [Prettier](https://prettier.io/)** on your IDE/Code Editor.

### <a name="branching-strategy"></a> Branching strategy

We follow a **GitFlow**'ish branch strategy, where:

- `main` branch is used for stable releases
- `develop` branch is used for integration of the 'next beta releases'

In that sense, **we recommend to all our contributors to [install git-flow CLI](https://github.com/petervanderdoes/gitflow-avh/wiki#installing-git-flow)** and to get familiar with how to work with `git-flow`, please [check this article from Tower (a git-gui client) for more details](https://www.git-tower.com/learn/git/ebook/en/command-line/advanced-topics/git-flow).

> _When setting locally git-flow, please, make sure to use the default values._

If you still prefer to do manual branches, please try to follow and respect our branch naming conventions:

- ❗️ When starting to work on a new feature or bugfix, branch off from the `develop` branch:

```bash
git switch -c feature/<feature-name> develop
git checkout -b feature/<feature-name> develop
# or
git switch -c bugfix/<fix-name> develop
git checkout -b bugfix/<fix-name> develop
```

- ❗️ When starting to work on a hotfix, branch off from the `main` branch:

```bash
git switch -c hotfix/<fix-name> main
git checkout -b hotfix/<fix-name> main
```

- For changes related to tests and documentation we recommend a manual branch creation from `develop`:

```bash
git switch -c tests/<test-change> develop
git checkout -b tests/<test-change> develop
# or
git switch -c docs/<doc-change> develop
git checkout -b docs/<doc-change> develop
```

- Other branch naming conventions (**_all of them should branch off from the `develop` branch_**):
  - **chore**: changes to the build process or auxiliary tools and libraries such as documentation generation
  - **style**: changes that do not affect the meaning of the code (white space, formatting, missing semi-colons, etc)
  - **refactor**: a code change that neither fixes a bug nor adds a feature
  - **perf**: a code change that improves performance

### <a name="git-commit-messages"></a> Git Commit Messages

We have very precise rules over how our git commit messages should be formatted. This leads to readable messages that are easy to follow when looking through the project history. Think that we can also use the git commit messages to generate our changelog 😃

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally after the first line.
- When only changing documentation, include `[ci skip]` in the commit title.
- Ensure your commit message match the following pattern:

  ```
  <type>[optional scope]: <subject>

  [optional body]

  [optional footer(s)]
  ```

> More details can be found in the [Conventional Commits Guidelines](https://www.conventionalcommits.org/en/v1.0.0/#summary)

#### <a name="type"></a> Type

Must be one of the following:

- **feat**: a new feature
- **fix**: a bug fix
- **docs**: documentation only changes
- **style**: changes that do not affect the meaning of the code (white space, formatting, missing semi-colons, etc)
- **refactor**: a code change that neither fixes a bug nor adds a feature
- **perf**: a code change that improves performance
- **test**: adding missing tests
- **chore**: changes to the build process or auxiliary tools and libraries such as documentation generation

#### <a name="subject"></a> Subject

The subject contains a succinct description of the change:

- do not capitalize the first letter
- do not place a period `.` at the end
- the entire length of the commit message must not go over 72 characters
- describe what the commit does, not what issue it relates to or fixes
- **be brief, yet descriptive** - we should have a good understanding of what the commit does by reading the subject

### <a name="breaking-changes"></a> Breaking changes

**PR that introduces BREAKING CHANGES should include the `!` character in the type and an explanation of the changes in the PR's body or footer**. For example:

```
refactor(checkbox)!: rename `isChecked` property with `checked`

BREAKING CHANGE: the `isChecked` property has been renamed to `checked`.

The `isChecked` property (`is-checked` attribute) is no longer supported in the checkbox component and has been renamed to `checked` property/attribute.
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

Similarly, a Deprecation section should start with "DEPRECATED: " followed by a short description of what is deprecated, a blank line, and a detailed description of the deprecation that also mentions the recommended update path.

## <a name="recommended-ide-extensions"></a>👌 Recommended IDE Extensions

We would like all our contributors to have the same experience while developing for Bee-Q, hence here is a list of Extensions we primarily use with [Visual Studio Code](https://code.visualstudio.com/) and recommend everyone to installed in their local environment:

- Recommended
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
  - [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
  - [NX Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
  - [Stencil Snippets](https://marketplace.visualstudio.com/items?itemName=fdom.stencil-snippets)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  - [Lit HTML](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html)
  - [Lit Plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
  - [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)
  - [CSS Var Complete](https://marketplace.visualstudio.com/items?itemName=phoenisx.cssvar)
  - [SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss)
  - [IntelliSense for CSS classes names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion)
- Nice to have
  - [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory)
  - [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
  - [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)
  - [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
  - [Document This](https://marketplace.visualstudio.com/items?itemName=oouo-diogo-perdigao.docthis)
  - [Comment Divider](https://marketplace.visualstudio.com/items?itemName=stackbreak.comment-divider)

> *If you use a different IDE than VSCode, please try to find and install the equivalent extensions for your specific Editor.*
