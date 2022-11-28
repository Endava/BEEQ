# Contributing to Bee-Q Design System

First off, thanks for taking the time to contribute and help out to make Bee-Q better than it is today! 💪😁 🎉

As a contributor, here are the guidelines we would like you to follow:

- [Contributing to Bee-Q Design System](#contributing-to-bee-q-design-system)
  - [ Code of Conduct ✍️](#-code-of-conduct-️)
  - [ How can I contribute?](#-how-can-i-contribute)
    - [ Report an Error or Bug](#-report-an-error-or-bug)
  - [ Project setup 🛠](#-project-setup-)
  - [ Styleguides 🎨](#-styleguides-)
    - [ Code formatting](#-code-formatting)
    - [ Branching strategy](#-branching-strategy)
    - [ Git Commit Messages](#-git-commit-messages)
      - [ Type](#-type)
      - [ Subject](#-subject)
    - [ Pull request](#-pull-request)

## <a name="code-of-conduct"></a> Code of Conduct ✍️

We have adopted the Contributor Covenant as our [Code of Conduct](https://www.contributor-covenant.org/), and we expect project participants to adhere to it. Please [read the full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## <a name="how-can-i-contribute"></a> How can I contribute?

So you wanna contribute some code! That's great! This project uses Git Pull Requests to manage contributions.

First of all, please be aware that when you submit code changes, your submissions are understood to be under the same [Apache 2.0](https://choosealicense.com/licenses/apache-2.0/) that covers the project. Feel free to contact the maintainers at [opensource@endava.com](opensource@endava.com) if that's a concern.

### <a name="report-an-error-or-bug"></a> Report an Error or Bug

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](issues/new/choose). When you are opening an issue, please be sure to report as much information as you can to allow us to replicate the problem and faster find the solution.

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## <a name="project-setup"></a> Project setup 🛠

For running the project in your local development environment please [follow the README instructions](README.md).

## <a name="styleguides"></a> Styleguides 🎨

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

### <a name="pull-request"></a> Pull request

❗️When creating a Pull Request (PR), please make sure that **the PR's name also respects the [commit message format](#git-commit-messages) and always use Squash and merge**.

**PR that introduces BREAKING CHANGES should include the `!` character in the type and an explanation of the changes in the PR's body or footer**. For example:

```
refactor(checkbox)!: rename `isChecked` property with `checked`

BREAKING CHANGE: the `isChecked` property has been renamed to `checked`.

The `isChecked` property (`is-checked` attribute) is no longer supported in the checkbox component and has been renamed to `checked` property/attribute.
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

Similarly, a Deprecation section should start with "DEPRECATED: " followed by a short description of what is deprecated, a blank line, and a detailed description of the deprecation that also mentions the recommended update path.
