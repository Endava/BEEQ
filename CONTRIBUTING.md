# Contributing to BEEQ Design System

First off, thanks for taking the time to contribute and help out to make BEEQ better than it is today! 💪😁 🎉

As a contributor, here are the guidelines we would like you to follow:

- [Contributing to BEEQ Design System](#contributing-to-beeq-design-system)
  - [✍️ Code of Conduct](#️-code-of-conduct)
  - [ We Develop with Github](#-we-develop-with-github)
  - [Pull Requests](#pull-requests)
  - [Any contributions you make will be under the Apache 2.0 Software License](#any-contributions-you-make-will-be-under-the-apache-20-software-license)
    - [ Report an Error or Bug](#-report-an-error-or-bug)
  - [🛠 Project setup](#-project-setup)
    - [Visual previews](#visual-previews)
  - [🎨 Styleguides](#-styleguides)
    - [ Code formatting](#-code-formatting)
    - [ Branching strategy](#-branching-strategy)
    - [ Preview releases](#-preview-releases)
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

Report a bug by [opening a new issue](https://github.com/Endava/BEEQ/issues/new/choose). When you are opening an issue, please be sure to report as much information as you can to allow us to replicate the problem and faster find the solution.

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

### Visual previews

Storybook loads the prebuilt BEEQ components and global styles from `dist/beeq` through static assets and script tags. Chromatic's TurboSnap dependency graph cannot trace those files back to their sources. Without explicit tracking, a component fix can pass CI while the Storybook link still serves an older build.

The `externals` in `chromatic.config.json` track the component, global and shared sources, the Stencil build configuration and runner, and the Chromatic configuration itself. Paths are relative to the repository root, not the Storybook directory. Keep these entries pointing at tracked sources, not ignored `dist` files.

Changes in these paths trigger a full snapshot run, including tests or stories stored in the same directories. Other changes remain eligible for TurboSnap's selective snapshots. This trades additional snapshots for reliable component previews; changing the Chromatic configuration also forces the next build to include fixes skipped by an earlier run.

## <a name="styleguides"></a>🎨 Styleguides

### <a name="code-formatting"></a> Code formatting

**Try to follow the existing style in the repository as closely as possible.** Keeping things consistent with the rest of the project is more important than following generic preferences.

BEEQ uses [Biome](https://biomejs.dev/) for linting and formatting, so it’s worth setting that up in your IDE or code editor before you start.

You can verify code quality with:

```bash
# Check affected publishable projects
pnpm exec nx affected -t check --exclude='*,!tag:publishable' --parallel

# Check the core package
pnpm exec nx run beeq:check

# Autofix supported issues
pnpm exec nx run beeq:check -- --write
```

### <a name="branching-strategy"></a> Branching strategy

We follow a **GitHub**'ish branch strategy, where:

- `main` our base branch used for stable releases

For GitHub flow, the general process is as follows:
- Every change that is worked on is branched directly off of `main` into a feature branch.
- Once a feature is ready it is tested on the feature branch and the code is reviewed before being merged to `main`.
- Once the feature has been merged to main it should be released to production.

Github flow is pretty simple and straightforward, but if you want to know more about it, please check the [Github Flow](https://guides.github.com/introduction/flow/) documentation.

- ❗️ When starting to work on a new feature or bugfix, branch off from the `main` branch:

```bash
git switch -c feat/<feature-name> main
git checkout -b feat/<feature-name> main
# or
git switch -c fix/<fix-name> main
git checkout -b fix/<fix-name> main
```

- ❗️ Hotfixes follow the same flow: branch off `main` with the `fix/` prefix:

```bash
git switch -c fix/<fix-name> main
git checkout -b fix/<fix-name> main
```

- For changes related to tests and documentation we recommend:

```bash
git switch -c test/<test-change> main
git checkout -b test/<test-change> main
# or
git switch -c docs/<doc-change> main
git checkout -b docs/<doc-change> main
```

- Other branch naming conventions (**_all of them should branch off from the `main` branch_**). The allowed prefixes are enforced by `.husky/branch-name.sh`:
  - **chore**: changes to the build process or auxiliary tools and libraries such as documentation generation
  - **style**: changes that do not affect the meaning of the code (white space, formatting, missing semi-colons, etc)
  - **refactor**: a code change that neither fixes a bug nor adds a feature
  - **perf**: a code change that improves performance
  - **revert**, **ci**, **build**: reverts, CI changes and build-system changes

### <a name="preview-releases"></a> Preview releases

Maintainers can publish a branch to npm before it is merged, so a change can be tried in a real project:

1. Go to **Actions** → **NPM preview publish** → **Run workflow**.
2. Under **Use workflow from**, pick the branch. The branch must contain the workflow and the latest release, so merge `main` into older branches first.
3. Tick **dry run** to see the version and package contents without publishing.
4. A required reviewer of the `npm-preview` environment approves the run under **Review deployments**. Nothing runs before that, dry runs included.

Every package is published as `X.Y.Z-preview.N` under the `preview` dist-tag:

- `X.Y.Z` is the next stable version implied by the branch's commits since its latest release tag: `feat` bumps the minor, breaking changes bump the major and the other releasable types bump the patch (see `release.conventionalCommits` in `nx.json`). A branch with only `docs`, `ci` or `release` commits has nothing to preview, so the run fails.
- `N` is the next free preview number for `X.Y.Z` on npm. A higher `N` was published later, but it only contains the changes of its own branch. The run summary shows the branch and commit.

Install the exact version, for example `npm install @beeq/core@1.18.0-preview.2`, because `@preview` points to the latest preview from any branch. Preview runs never commit, tag, create a GitHub release or deploy Storybook.

Both beta and preview releases pin internal BEEQ dependencies to the exact prerelease version, so a wrapper cannot resolve core from another prerelease channel. Stable releases retain the dependency ranges configured in `nx.json`.

❗️ One-time setup, before the first preview run:

1. In **Settings** → **Environments**, create `npm-preview` with **Required reviewers** and no deployment branch restriction. Create it before the workflow first runs, because GitHub creates a missing environment without any protection rules.
2. On npmjs.com, add a trusted publisher to `@beeq/core`, `@beeq/angular`, `@beeq/react`, `@beeq/vue` and `@beeq/tailwindcss` with workflow `publish-preview.yml`, environment `npm-preview` and `npm publish` allowed. npm then rejects any preview publish that did not go through the environment's approval. A new trusted publisher expires unless it publishes within 2 days, so add them just before the first real preview.

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
- **revert**, **ci**, **build**, **wip**, **release**: see `.commitlintrc.ts` (`type-enum`), the source of truth for allowed types

#### <a name="subject"></a> Subject Subject

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

We would like all our contributors to have the same experience while developing for BEEQ, hence here is a list of Extensions we primarily use with [Visual Studio Code](https://code.visualstudio.com/) and recommend everyone to installed in their local environment:

- Recommended
  - [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
  - [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
  - [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
  - [NX Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
  - [Stencil Snippets](https://marketplace.visualstudio.com/items?itemName=fdom.stencil-snippets)
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
