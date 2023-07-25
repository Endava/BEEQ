# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)


## [0.7.1](https://github.com/Endava/bee-q/compare/v0.7.0...v0.7.1) (2023-07-20)


### Bug Fixes

* **input:** clear button showing up when disabled ([#368](https://github.com/Endava/bee-q/issues/368)) ([df4c983](https://github.com/Endava/bee-q/commit/df4c983ddbcf413781e498092b6714a0a74c4d9f))
* **input:** focus style missing on consumer apps ([#371](https://github.com/Endava/bee-q/issues/371)) ([b573d5e](https://github.com/Endava/bee-q/commit/b573d5e9df10719e848a31e8ba133e6c72c7e159))
* **input:** set native input `id` from `name` prop value ([#370](https://github.com/Endava/bee-q/issues/370)) ([8e5b848](https://github.com/Endava/bee-q/commit/8e5b8484983748819ae8ce829a60254b0e03ce70))

## [0.7.0](https://github.com/Endava/bee-q/compare/v0.6.2...v0.7.0) (2023-07-18)


### Features

* **breadcrumb:** add new `bq-breadcrumb` component ([#266](https://github.com/Endava/bee-q/issues/266)) ([de4a705](https://github.com/Endava/bee-q/commit/de4a70535d13912f36769400ec253890f05a4d28))
* **input:** add new `bq-input` component ([#344](https://github.com/Endava/bee-q/issues/344)) ([6c4d288](https://github.com/Endava/bee-q/commit/6c4d28868e536f9e8219754626b5d727997d2f71))


### Bug Fixes

* **dialog:** backdrop overlay color opacity ([#342](https://github.com/Endava/bee-q/issues/342)) ([fcf8f48](https://github.com/Endava/bee-q/commit/fcf8f48511fd43d86f05e895b75a18cb0edca16e))
* **dialog:** dialog freeze when using `open` property ([#349](https://github.com/Endava/bee-q/issues/349)) ([252baa1](https://github.com/Endava/bee-q/commit/252baa12f70393f9d774cc3aebe7d35a02df0462))
* **tab:** wrong gap space between icon and label ([#366](https://github.com/Endava/bee-q/issues/366)) ([87b52e3](https://github.com/Endava/bee-q/commit/87b52e3aa3df65fe2f59d6d05c19e78050b40cd8))


### Style

* **icon:** expected non-Promise value in a boolean conditional ([#365](https://github.com/Endava/bee-q/issues/365)) ([ea5bfcc](https://github.com/Endava/bee-q/commit/ea5bfcc240c135707a55d6421e662b3220f14b88))

## [0.6.2](https://github.com/Endava/bee-q/compare/v0.6.1...v0.6.2) (2023-07-03)


### Bug Fixes

* **notification:** notification rendered as visible with `open="false"` ([#316](https://github.com/Endava/bee-q/issues/316)) ([371996c](https://github.com/Endava/bee-q/commit/371996c48ca5d507a74fcf70d16551e3d27bf622))
* **toast:** toast rendered as visible with `open="false"` ([#315](https://github.com/Endava/bee-q/issues/315)) ([2b410aa](https://github.com/Endava/bee-q/commit/2b410aad4ca8d0eb496b7a49d022d2f9e4288bbc))

## [0.6.1](https://github.com/Endava/bee-q/compare/v0.6.0...v0.6.1) (2023-07-03)

## [0.6.0](https://github.com/Endava/bee-q/compare/v0.5.0...v0.6.0) (2023-07-03)


### Features

* **avatar:** support adding a badge to the avatar ([#267](https://github.com/Endava/bee-q/issues/267)) ([99c8c42](https://github.com/Endava/bee-q/commit/99c8c42892fa1fe389e5a6e3b1e5d14a6aa51496))
* **dialog:** add new `<bq-dialog>` component ([#269](https://github.com/Endava/bee-q/issues/269)) ([fb53b87](https://github.com/Endava/bee-q/commit/fb53b87ef1c4da77588969fcef216f6b3c869ec0))
* **dialog:** allow disable backdrop overlay and `bqAfterOpen` event ([#306](https://github.com/Endava/bee-q/issues/306)) ([41ecdfc](https://github.com/Endava/bee-q/commit/41ecdfc0f34db9c0e0e8427eaa1b39927153dcb4))
* **toast:** add new `<bq-toast>` component ([#301](https://github.com/Endava/bee-q/issues/301)) ([5c22cc7](https://github.com/Endava/bee-q/commit/5c22cc778358bfba48d3a1026c9af0cbae734f77))


### Bug Fixes

* **angular wrapper:** this.appInits[i] is not a function ([#304](https://github.com/Endava/bee-q/issues/304)) ([7f64ee3](https://github.com/Endava/bee-q/commit/7f64ee3100f13594bc6ec7088b4ee10b46da1a0d))
* **badge:** not being full rounded with one digit ([#307](https://github.com/Endava/bee-q/issues/307)) ([3bf70c8](https://github.com/Endava/bee-q/commit/3bf70c83fc7bc125f9b733fc50d5e5a2973ea667))
* **CSS Shadow token:** wrong `shadow-m` token value ([#313](https://github.com/Endava/bee-q/issues/313)) ([f190123](https://github.com/Endava/bee-q/commit/f1901232898ec85efa3dc49268ac44abcbab49ce))
* **dialog:** footer padding when standard and highlight ([#305](https://github.com/Endava/bee-q/issues/305)) ([f824942](https://github.com/Endava/bee-q/commit/f82494265893eeef786143ff08965de64e13a9a8))
* **notification:** hidden CSS class not being applied ([#308](https://github.com/Endava/bee-q/issues/308)) ([e74bd24](https://github.com/Endava/bee-q/commit/e74bd24b80d0b88595e4c40e26b756560e678df4))
* **sonarlint:** code smells and security reviews ([#303](https://github.com/Endava/bee-q/issues/303)) ([7862ba6](https://github.com/Endava/bee-q/commit/7862ba68dc7e153a26e4d03e221bad23f7f486c4))
* **Sonarlint:** resolve major issues spotted by Sonarcloud ([#302](https://github.com/Endava/bee-q/issues/302)) ([00fd221](https://github.com/Endava/bee-q/commit/00fd2218b79096b64783c026d89f962c7c626be4))

## [0.5.0](https://github.com/Endava/bee-q/compare/v0.4.0...v0.5.0) (2023-06-23)


### Features

* **CSS reset:** improve  global custom CSS reset ([#287](https://github.com/Endava/bee-q/issues/287)) ([b4500d2](https://github.com/Endava/bee-q/commit/b4500d21b1cc803e167e7dc3329e09a1b0736e16))
* **side menu:** new `<bq-side-menu>` and `<bq-side-menu-item>` components ([#289](https://github.com/Endava/bee-q/issues/289)) ([f4935f1](https://github.com/Endava/bee-q/commit/f4935f17c51ad6418251bc766455fccbcecafefc))


### Bug Fixes

* **angular wrapper:** peerDependencies and versions allowed ([#291](https://github.com/Endava/bee-q/issues/291)) ([47a37e2](https://github.com/Endava/bee-q/commit/47a37e231dc15479fc8a25aa65ec9be67405d6f8))
* **angular:** cannot mix multi and regular providers ([#290](https://github.com/Endava/bee-q/issues/290)) ([63852e4](https://github.com/Endava/bee-q/commit/63852e4ce285ae84ded849e1d3085babb5b2549d))
* **plopjs:** storybook template eslint import order ([#280](https://github.com/Endava/bee-q/issues/280)) ([5c374cc](https://github.com/Endava/bee-q/commit/5c374cc55c53122a8ecb97d6d8a63bea48a9131e))
* **react wrapper:** peerDependencies versions allowed ([#292](https://github.com/Endava/bee-q/issues/292)) ([91c49a3](https://github.com/Endava/bee-q/commit/91c49a3b9792a1dfcfc40a7c8d4da1d0588f9459))

## [0.4.0](https://github.com/Endava/bee-q/compare/v0.3.0...v0.4.0) (2023-06-16)


### Features

* **button:** add `block` property to suport full width size ([#262](https://github.com/Endava/bee-q/issues/262)) ([03e1fad](https://github.com/Endava/bee-q/commit/03e1fad38c97328cab7b9234eeda3882e21706e3))
* **button:** add `justifyContent` property to align the label content ([#263](https://github.com/Endava/bee-q/issues/263)) ([250d69b](https://github.com/Endava/bee-q/commit/250d69b296732491eb740297d0bdd7b59e6df32b))
* **Notification:** add new `<bq-notification>` component ([#204](https://github.com/Endava/bee-q/issues/204)) ([fe4d4c1](https://github.com/Endava/bee-q/commit/fe4d4c188a45e2e7ad2007209d54563a37ea56a8))
* **Tokens:** add spacing tokens ([#265](https://github.com/Endava/bee-q/issues/265)) ([62b9858](https://github.com/Endava/bee-q/commit/62b98581cc4b01651f3688ca9ebcb09d16dfd4b3))


### Bug Fixes

* **tab group:** make divider full width ([#205](https://github.com/Endava/bee-q/issues/205)) ([86e4ef3](https://github.com/Endava/bee-q/commit/86e4ef3405d9fd292fae0689bfdbcf0ee2f60127))
* **tokens:** make feedback text color tokens accessible ([#268](https://github.com/Endava/bee-q/issues/268)) ([7906699](https://github.com/Endava/bee-q/commit/7906699dcc200332f11f7eb50e2392d7bf3ef2d1))

## [0.3.0](https://github.com/Endava/bee-q/compare/v0.2.2...v0.3.0) (2023-04-27)


### Features

* **tab:** add tab component ([#93](https://github.com/Endava/bee-q/issues/93)) ([6531f65](https://github.com/Endava/bee-q/commit/6531f6573b9bd7d34bcbbfef073f183a15075dbc))
* **Tokens:** add extended palette color and update declarative colors ([#67](https://github.com/Endava/bee-q/issues/67)) ([be11954](https://github.com/Endava/bee-q/commit/be1195472f3dd041d8df11d18ebd471e07160896))


### Documentation

* **Storybook:** upgrade to Storybook v7 ([#163](https://github.com/Endava/bee-q/issues/163)) ([5edd176](https://github.com/Endava/bee-q/commit/5edd176a2cb3213b2ac7d181fb1eaf98d8f55331))

## [0.2.2](https://github.com/Endava/bee-q/compare/v0.2.1...v0.2.2) (2023-03-09)


### Bug Fixes

* **CI:** trigger NPM publish after a GitHub release is published ([#38](https://github.com/Endava/bee-q/issues/38)) ([284aacc](https://github.com/Endava/bee-q/commit/284aacc4155e61ecba358e2898a4a22d534a3c7a))

## [0.2.1](https://github.com/Endava/bee-q/compare/v0.2.0...v0.2.1) (2023-03-08)


### Bug Fixes

* **Checkbox:**  label miss-alignment if parent has different alignment ([#35](https://github.com/Endava/bee-q/issues/35)) ([8a13ee8](https://github.com/Endava/bee-q/commit/8a13ee8c9d561948a684dc3699550962ee338b91))
* **Font family:** use font `[@font-face](https://github.com/font-face)` instead of `[@import](https://github.com/import)` ([#32](https://github.com/Endava/bee-q/issues/32)) ([a69f74b](https://github.com/Endava/bee-q/commit/a69f74bebb50aebc00e66532396ba66c35ea7e8b))
* **Icon:** base container alignment on custom size value ([#33](https://github.com/Endava/bee-q/issues/33)) ([c8299b2](https://github.com/Endava/bee-q/commit/c8299b2ef94fb39dc5b36a2f9f46daa904471f98))
* **Slider:** layout styles break if parent have alignment ([#34](https://github.com/Endava/bee-q/issues/34)) ([f56e1fe](https://github.com/Endava/bee-q/commit/f56e1fe1251bcac96293bb1e1fed78b2071c67a9))

## [0.2.0](https://github.com/dgonzalezr/bee-q/compare/v0.1.0...v0.2.0) (2023-03-03)


### Features

* **spinner:** add `bq-spinner` component ([#75](https://github.com/dgonzalezr/bee-q/issues/75)) ([7ffce25](https://github.com/dgonzalezr/bee-q/commit/7ffce258bb1dfd26c77fe0d26c5109dde8dfb66f))
* **switch:** add new `bq-switch` component ([#84](https://github.com/dgonzalezr/bee-q/issues/84)) ([7a86ed7](https://github.com/dgonzalezr/bee-q/commit/7a86ed7d4b08c2dbb12a0546871990274671f26d))
* **utils:** add `setProperties()` method utility ([#80](https://github.com/dgonzalezr/bee-q/issues/80)) ([77a9c1a](https://github.com/dgonzalezr/bee-q/commit/77a9c1af694f0b6897e381efe5f8c130246e7663))
* **utils:** add computed style properties filter ([#79](https://github.com/dgonzalezr/bee-q/issues/79)) ([d9f4a65](https://github.com/dgonzalezr/bee-q/commit/d9f4a65059afb6f66409520863b2bae42d971630))


### Bug Fixes

* **badge:** misspelled `disconnectedCallback` lifecycle method ([#90](https://github.com/dgonzalezr/bee-q/issues/90)) ([bb90159](https://github.com/dgonzalezr/bee-q/commit/bb90159bcd89bbae1203fcb2c3fce3ed833dcc74))
* **slider:** missing Angular value accessor and host display CSS rule  ([#91](https://github.com/dgonzalezr/bee-q/issues/91)) ([57c8cdc](https://github.com/dgonzalezr/bee-q/commit/57c8cdce44ac6d38e8f8be4e0751c3bc97be77c1))
* **spinner:** misspelled `disconnectedCallback` lifecycle method ([#89](https://github.com/dgonzalezr/bee-q/issues/89)) ([033c748](https://github.com/dgonzalezr/bee-q/commit/033c748f08ef70eb679aa783f786cc21f6701f84))
* **tools:** remove extra '<' from plopjs e2e generator ([#86](https://github.com/dgonzalezr/bee-q/issues/86)) ([104c225](https://github.com/dgonzalezr/bee-q/commit/104c2256c1658bda6ef09ca0b0dc0020f8d5d8d1))


### Documentation

* **project:** update README usage section ([c975cc1](https://github.com/dgonzalezr/bee-q/commit/c975cc15c6dad52d29ea9221120b67267fc12338))
* **spinner:** update shadow parts in the component's readme ([d0ee1bf](https://github.com/dgonzalezr/bee-q/commit/d0ee1bf0f2c34615ba02063a4af03eb8f6e6a934))


### Test

* **tooltip:** add e2e test ([#20](https://github.com/dgonzalezr/bee-q/issues/20)) ([91ef7a3](https://github.com/dgonzalezr/bee-q/commit/91ef7a3fb8128c6339707b51f507d6fa44c0495f))

## [0.1.0](https://github.com/dgonzalezr/bee-q/compare/v0.0.1-beta.5...v0.1.0) (2023-01-08)

This release includes all feature and bug fixes from all prior Bee-Q pre-releases, as well as the following
unreleased changes:

### Features

* **utils:** remove unnecessary "propertyValue" parameter from validatePropValue ([#53](https://github.com/dgonzalezr/bee-q/issues/53)) ([e9b13c8](https://github.com/dgonzalezr/bee-q/commit/e9b13c8f46c756e4350fc24e7db67f77f3d04a33))


### Bug Fixes

(https://github.com/dgonzalezr/bee-q/commit/2dcd4489ebddfcc20fa6dc695f27d818a7d6e8f0))
* **e2e:** missing HTML closing tag ([#68](https://github.com/dgonzalezr/bee-q/issues/68)) ([282bd23](https://github.com/dgonzalezr/bee-q/commit/282bd23de9811fe3b20775bcdf0fb1ee28943b5e))
* **e2e:** remove comment to fix prettier ([#45](https://github.com/dgonzalezr/bee-q/issues/45)) ([455a8cd](https://github.com/dgonzalezr/bee-q/commit/455a8cd42cc5a82a0a9444ceb0b75f85b9cfdc1d))
* **icon:** wait for SVG image to load on e2e tests ([#69](https://github.com/dgonzalezr/bee-q/issues/69)) ([8800437](https://github.com/dgonzalezr/bee-q/commit/8800437167f9a941a652fb1fb06ec1d52b2e9e80))


### Documentation

* **contribution:** add `Branching strategy` and `Test` ([#43](https://github.com/dgonzalezr/bee-q/issues/43)) ([fd12f9f](https://github.com/dgonzalezr/bee-q/commit/fd12f9f7c77cac1100ca79c53e456a8f128a8d1b))
* **code of conduct:** update to v2.0 of the contributor covenant  ([#55](https://github.com/dgonzalezr/bee-q/issues/55)) ([89aa591](https://github.com/dgonzalezr/bee-q/commit/89aa59120334817a4dd685eeba336328f0f3e8f2))
* **icon:** add a link to `Phosphor icons` on Storybook and show fewer SVGs ([#64](https://github.com/dgonzalezr/bee-q/issues/64)) ([403f8b3](https://github.com/dgonzalezr/bee-q/commit/403f8b3aef17db339feb78a8a2c18e414f6b0bf1))
* **readme:** fix typo on project structure section ([207403a](https://github.com/dgonzalezr/bee-q/commit/207403aa784692c496d2a9807e74b9a76ff52d06))
* update project and libs README files ([71fad5c](https://github.com/dgonzalezr/bee-q/commit/71fad5c0f046f261a60ebc0ad0ead3c0d65784c5))


### Test

* **avatar:** add e2e tests ([#58](https://github.com/dgonzalezr/bee-q/issues/58)) ([bc4cb39](https://github.com/dgonzalezr/bee-q/commit/bc4cb39805d96e6b414ba0778ce9cf960c769592))
* **button:** add e2e tests ([#46](https://github.com/dgonzalezr/bee-q/issues/46)) ([5b50743](https://github.com/dgonzalezr/bee-q/commit/5b507438dec317bf01bb7200a79be24ce3c4e624))
* **checkbox:** add e2e tests ([#57](https://github.com/dgonzalezr/bee-q/issues/57)) ([9b6e03b](https://github.com/dgonzalezr/bee-q/commit/9b6e03bf3b7b22ecff9a14b1e6b80038633ae63f))
* **divider:** add e2e tests ([#51](https://github.com/dgonzalezr/bee-q/issues/51)) ([4f15a44](https://github.com/dgonzalezr/bee-q/commit/4f15a44a97c875db58d7a1b271aaea45c1a2bced))
* **divider:** replace self closing tags ([#61](https://github.com/dgonzalezr/bee-q/issues/61)) ([885cd81](https://github.com/dgonzalezr/bee-q/commit/885cd819c43cc1f12a356633cb09719aceb098de))
* **icon:** add e2e tests ([#50](https://github.com/dgonzalezr/bee-q/issues/50)) ([1bba1f5](https://github.com/dgonzalezr/bee-q/commit/1bba1f5218383d124071839d3506a979a79ea905))
* **icon:** replace self closing tags ([#60](https://github.com/dgonzalezr/bee-q/issues/60)) ([939ee23](https://github.com/dgonzalezr/bee-q/commit/939ee235e6a594bc9b0e639bfd612ea704e50511))
* **radio:** add e2e tests ([#71](https://github.com/dgonzalezr/bee-q/issues/71)) ([134d684](https://github.com/dgonzalezr/bee-q/commit/134d684007adb9bee0008f4f9d84eec62ad97e95))
* **slider:** add e2e tests ([#65](https://github.com/dgonzalezr/bee-q/issues/65)) ([63ac887](https://github.com/dgonzalezr/bee-q/commit/63ac887a3530d64a88df924adae167370a2013f1))

### [0.0.1-beta.5](https://github.com/dgonzalezr/bee-q/compare/v0.0.1-beta.4...v0.0.1-beta.5) (2022-12-15)


### Features

* **slider:** add a new `bq-slider` component ([#32](https://github.com/dgonzalezr/bee-q/issues/32)) ([da5f424](https://github.com/dgonzalezr/bee-q/commit/da5f424f6b8df8f2f897259ed5a29887f0a4679f))
* **tooltip:** add `<bq-tooltip>` component ([#39](https://github.com/dgonzalezr/bee-q/issues/39)) ([b2d67af](https://github.com/dgonzalezr/bee-q/commit/b2d67af72ee00ebdcca6f333d4a5e9965a6b0ff8))
* **utils:** add `debounce` utility method ([#37](https://github.com/dgonzalezr/bee-q/issues/37)) ([2341934](https://github.com/dgonzalezr/bee-q/commit/234193406f233ad09a66380ccb3f8994ff3693bc))
* **status:** add e2e tests ([#42](https://github.com/dgonzalezr/bee-q/issues/42)) ([d4cf329](https://github.com/dgonzalezr/bee-q/commit/d4cf329e7df7eb587f0cdb784ff6d68f62f88878))
* **tokens:** update typography tokens ([#18](https://github.com/dgonzalezr/bee-q/issues/18)) ([07be5f7](https://github.com/dgonzalezr/bee-q/commit/07be5f73c5380cf99feab2504a77d2d188b209df))
* **chore:** add e2e test  to component generator ([#41](https://github.com/dgonzalezr/bee-q/issues/41)) ([c8b3df2](https://github.com/dgonzalezr/bee-q/commit/c8b3df2b93c45cd15523aa1655e44a387b6e6b20))
* **chore:** pin Node version with Volta ([#44](https://github.com/dgonzalezr/bee-q/issues/44)) ([3b44c77](https://github.com/dgonzalezr/bee-q/commit/3b44c7792b71a1e3b45e93b7452ae11755bad23e))


### Bug Fixes

* **button:** enable submit and reset form capabilities ([#47](https://github.com/dgonzalezr/bee-q/issues/47)) ([ded317f](https://github.com/dgonzalezr/bee-q/commit/ded317f478bbb5d59f81fa8f7961b0a3056795a9))
* **checkbox:** check container being resize on small resolutions ([#34](https://github.com/dgonzalezr/bee-q/issues/34)) ([59e5e6e](https://github.com/dgonzalezr/bee-q/commit/59e5e6eeee0be629bacd6e7a3ea51388ce2f5c9a))
* **checkbox:** fix checkbox vertical move upon click ([#24](https://github.com/dgonzalezr/bee-q/issues/24)) ([2dcd448](https://github.com/dgonzalezr/bee-q/commit/2dcd4489ebddfcc20fa6dc695f27d818a7d6e8f0))
* **e2e:** remove comment to fix prettier ([#45](https://github.com/dgonzalezr/bee-q/issues/45)) ([455a8cd](https://github.com/dgonzalezr/bee-q/commit/455a8cd42cc5a82a0a9444ceb0b75f85b9cfdc1d))
* **radio:** keyboard navigation select disable elements ([#31](https://github.com/dgonzalezr/bee-q/issues/31)) ([89f93cc](https://github.com/dgonzalezr/bee-q/commit/89f93cc15ce59bdab29d56f894cdc579e9fd3b9b))

### [0.0.1-beta.4](https://github.com/dgonzalezr/bee-q/compare/v0.0.1-beta.3...v0.0.1-beta.4) (2022-11-10)


### Features

* **bee-q angular:** add `@bee-q/angular` output target ([#29](https://github.com/dgonzalezr/bee-q/issues/29)) ([f6fea4a](https://github.com/dgonzalezr/bee-q/commit/f6fea4ad72aa7567081ca328884d79e7b32460e1))
* **divider:** use `svg` for the stroke and add multiple customizations ([#28](https://github.com/dgonzalezr/bee-q/issues/28)) ([99f11db](https://github.com/dgonzalezr/bee-q/commit/99f11db48b13a3a7a5e5651a880fa331b267caad))
* **radio:** add a new `bq-radio` component  ([#25](https://github.com/dgonzalezr/bee-q/issues/25)) ([6ad7ec2](https://github.com/dgonzalezr/bee-q/commit/6ad7ec23f652af97828d156fe9701924e295f205))


### Bug Fixes

* **checkbox:** fix checkbox vertical move upon click ([#24](https://github.com/dgonzalezr/bee-q/issues/24)) ([2dcd448](https://github.com/dgonzalezr/bee-q/commit/2dcd4489ebddfcc20fa6dc695f27d818a7d6e8f0))

### [0.0.1-beta.3](https://github.com/dgonzalezr/bee-q/compare/v0.0.1-beta.2...v0.0.1-beta.3) (2022-11-04)


### Features

* enable experimental import and SSR hydrate ([#23](https://github.com/dgonzalezr/bee-q/issues/23)) ([a03f9e4](https://github.com/dgonzalezr/bee-q/commit/a03f9e425e05ef5f094db67b705518a8d18fbeae))

### [0.0.1-beta.2](https://github.com/dgonzalezr/bee-q/compare/v0.0.1-beta.1...v0.0.1-beta.2) (2022-11-03)


### Bug Fixes

* **bee-q-react:** broken published npm package ([09b2870](https://github.com/dgonzalezr/bee-q/commit/09b2870ba4be94d4c87f358cb815b1fecbde04f8))

### [0.0.1-beta.1](https://github.com/dgonzalezr/bee-q/compare/v0.0.1-beta.0...v0.0.1-beta.1) (2022-11-02)


### Features

* **avatar:** add avatar component ([732ba48](https://github.com/dgonzalezr/bee-q/commit/732ba48d0bdd8bf3379367ab4813d45b2e3b6e19))
* **avatar:** support text type variation ([c2ef8b4](https://github.com/dgonzalezr/bee-q/commit/c2ef8b47e4aa6af24914e2e5876ebc1f51302b2f))
* **badge:** add a new `bq-badge` component ([#11](https://github.com/dgonzalezr/bee-q/issues/11)) ([a9864d2](https://github.com/dgonzalezr/bee-q/commit/a9864d224c176be7155025d7172704e89f3305b2))
* **button:** add new `bq-button` component ([#6](https://github.com/dgonzalezr/bee-q/issues/6)) ([2c2cde7](https://github.com/dgonzalezr/bee-q/commit/2c2cde71c894b06af08e71c0654c3aba85081067))
* **checkbox:** add a new `bq-checkbox` component ([#2](https://github.com/dgonzalezr/bee-q/issues/2)) ([ae3099c](https://github.com/dgonzalezr/bee-q/commit/ae3099c03361495b465468dbe4df84f0e22040cd))
* **divider:** add a new `bq-divider` component ([#22](https://github.com/dgonzalezr/bee-q/issues/22)) ([24a6417](https://github.com/dgonzalezr/bee-q/commit/24a6417f7a1f36554fd9b99f32bb9ea7eb176b36))
* **icon:** add a new `bq-icon` component ([20e15fb](https://github.com/dgonzalezr/bee-q/commit/20e15fbc4c37f6c08ae9c6375e4a97f8fbc9ce8d))
* **SCSS:** add `HSL` colors utility ([#7](https://github.com/dgonzalezr/bee-q/issues/7)) ([74b6c1c](https://github.com/dgonzalezr/bee-q/commit/74b6c1cf3f3370fc4693e41ac311ab8159cd1fcf))
* **status:** add bq-status component ([#12](https://github.com/dgonzalezr/bee-q/issues/12)) ([595ad36](https://github.com/dgonzalezr/bee-q/commit/595ad364d358557d205d64ae77b9bad72a7727b5))
* **tokens:** add border radius tokens ([516ca4d](https://github.com/dgonzalezr/bee-q/commit/516ca4d9871013fe2fa645d9213f2c9045f6826c))
* **tokens:** add box-shadow tokens ([#20](https://github.com/dgonzalezr/bee-q/issues/20)) ([f0a9377](https://github.com/dgonzalezr/bee-q/commit/f0a9377ed8a02b944c6dcbe888bc7e30f225601f))
* **tokens:** add primitive color tokens ([b27d1e5](https://github.com/dgonzalezr/bee-q/commit/b27d1e51edc1325a097156627aa6c9277d1da2ef))
* **tokens:** add typography tokens ([2f8613b](https://github.com/dgonzalezr/bee-q/commit/2f8613ba5fd04e378d6209bab36375f01ad458d9))


### Bug Fixes

* **bee-q:** missing README.md file after build ([a641d29](https://github.com/dgonzalezr/bee-q/commit/a641d2981d57fe43e796409ebf0d7e6e502fcc61))
* **build:** `npm run build` fails on Windows ([#14](https://github.com/dgonzalezr/bee-q/issues/14)) ([e109448](https://github.com/dgonzalezr/bee-q/commit/e1094488e73e8525e90514855a0eea53e925bdbd))
* libraries paths on tsconfig ([4d91c7c](https://github.com/dgonzalezr/bee-q/commit/4d91c7c5cb9b3479d412a63328a7c5e91d3308c5))
* **status:** fix vertical alignment ([#15](https://github.com/dgonzalezr/bee-q/issues/15)) ([937f13d](https://github.com/dgonzalezr/bee-q/commit/937f13d2a8ce6a437122e101679534675a2adfd9))
* **tailwind:** wrong font line height variables name ([ebe0b5c](https://github.com/dgonzalezr/bee-q/commit/ebe0b5cc77260ac64b4e3d97d8ffb59af1a6ee77))

### 0.0.1-beta.0 (2022-11-01)


### Features

* **avatar:** add avatar component ([732ba48](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/732ba48d0bdd8bf3379367ab4813d45b2e3b6e19))
* **avatar:** support text type variation ([c2ef8b4](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/c2ef8b47e4aa6af24914e2e5876ebc1f51302b2f))
* **badge:** add a new `bq-badge` component ([#11](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/issues/11)) ([a9864d2](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/a9864d224c176be7155025d7172704e89f3305b2))
* **button:** add new `bq-button` component ([#6](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/issues/6)) ([2c2cde7](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/2c2cde71c894b06af08e71c0654c3aba85081067))
* **checkbox:** add a new `bq-checkbox` component ([#2](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/issues/2)) ([ae3099c](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/ae3099c03361495b465468dbe4df84f0e22040cd))
* **icon:** add a new `bq-icon` component ([20e15fb](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/20e15fbc4c37f6c08ae9c6375e4a97f8fbc9ce8d))
* **SCSS:** add `HSL` colors utility ([#7](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/issues/7)) ([74b6c1c](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/74b6c1cf3f3370fc4693e41ac311ab8159cd1fcf))
* **status:** add bq-status component ([#12](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/issues/12)) ([595ad36](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/595ad364d358557d205d64ae77b9bad72a7727b5))
* **tokens:** add border radius tokens ([516ca4d](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/516ca4d9871013fe2fa645d9213f2c9045f6826c))
* **tokens:** add box-shadow tokens ([#20](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/issues/20)) ([f0a9377](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/f0a9377ed8a02b944c6dcbe888bc7e30f225601f))
* **tokens:** add primitive color tokens ([b27d1e5](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/b27d1e51edc1325a097156627aa6c9277d1da2ef))
* **tokens:** add typography tokens ([2f8613b](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/2f8613ba5fd04e378d6209bab36375f01ad458d9))


### Bug Fixes

* **build:** `npm run build` fails on Windows ([#14](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/issues/14)) ([e109448](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/e1094488e73e8525e90514855a0eea53e925bdbd))
* libraries paths on tsconfig ([4d91c7c](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/4d91c7c5cb9b3479d412a63328a7c5e91d3308c5))
* **status:** fix vertical alignment ([#15](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/issues/15)) ([937f13d](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/937f13d2a8ce6a437122e101679534675a2adfd9))
* **tailwind:** wrong font line height variables name ([ebe0b5c](https://bitbucket.endava.com/projects/DSEDV001/repos/bee-q/commit/ebe0b5cc77260ac64b4e3d97d8ffb59af1a6ee77))
