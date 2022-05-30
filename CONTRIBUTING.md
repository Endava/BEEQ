# Contributing to Bee-Q Design System

First off, thanks for taking the time to contribute and help ut to make Bee-Q better than it is today! 💪😁 🎉

As a contributor, here are the guidelines we would like you to follow:

  - [Code of Conduct](#code-of-conduct)
  - [How can I contribute?](#how-can-i-contribute)
    - [Request support 🙋🏼‍♂️](#request-support)
    - [Report an Error or Bug 🐞](#report-an-error-or-bug)
    - [Request a Feature ✨](#request-a-feature)
  - [Project setup](#project-setup)
  - [Styleguides](#styleguides)
    - [Code formatting](#code-formatting)
    - [Git Commit Messages](#git-commit-messages)
      - [Type](#type)
      - [Subject](#subject)
    - [Branches](#branches)
    - [Pull request](#pull-request)

## <a name="code-of-conduct"></a> Code of Conduct

We have adopted the Contributor Covenant as our [Code of Conduct](https://www.contributor-covenant.org/), and we expect project participants to adhere to it. Please [read the full text](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## <a name="how-can-i-contribute"></a> How can I contribute?

To be filled...

### <a name="request-support"></a> Request support 🙋🏼‍♂️

To be filled...

### <a name="report-an-error-or-bug"></a> Report an Error or Bug 🐞

To be filled...

### <a name="request-a-feature"></a> Request a Feature ✨

To be filled...

## <a name="project-setup"></a> Project setup

So you wanna contribute some code! That's great! This project uses Git Pull Requests to manage contributions. For running the project in your local development environment please [follow the README instructions](README.md).

## <a name="styleguides"></a> Styleguides

### <a name="code-formatting"></a> Code formatting

**Follow the style you see used in the repository!** Consistency with the rest of the project always trumps other considerations. It doesn't matter what you choose for your daily code implementation or if you have your style but, please, **make sure to have configured [Prettier](https://prettier.io/)** on your IDE/Code Editor.

### <a name="git-commit-messages"></a> Git Commit Messages

We have very precise rules over how our git commit messages should be formatted. This leads to readable messages that are easy to follow when looking through the project history. Think that we can also use the git commit messages to generate our changelog 😃

* Use the present tense ("Add feature" not "Added feature").
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
* Limit the first line to 72 characters or less.
* Reference issues and pull requests liberally after the first line.
* When only changing documentation, include `[ci skip]` in the commit title.
* Ensure your commit message match the following pattern:
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

### <a name="branches"></a> Branches

Make sure to start your branches with one of the [Commit Messages Types](#type), e.g:

```
feat/button-add-disable-property
```

### <a name="pull-request"></a> Pull request

❗️ Before merging your Pull Request (PR), please make sure that the PR's name respects the [commit message format](#git-commit-messages) and always use Squash and merge❗️

**PR that introduces BREAKING CHANGES should include the `!` character in the type and an explanation of the changes in the PR's body or footer**. For example:

```
refactor(radio option)!: remove deprecated disabled property

BREAKING CHANGE: the deprecated `disabled` property has been removed.

The `disabled` property is no longer supported in the radio-option element and the `isDisabled` property should be used instead.
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

Similarly, a Deprecation section should start with "DEPRECATED: " followed by a short description of what is deprecated, a blank line, and a detailed description of the deprecation that also mentions the recommended update path.
