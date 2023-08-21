# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)


## [0.8.1](https://github.com/Endava/BEEQ/compare/v0.8.0...v0.8.1) (2023-08-21)


### Bug Fixes 🐞

* **beeq-react:** wrong paths on package.json ([#462](https://github.com/Endava/BEEQ/issues/462)) ([9aa36a6](https://github.com/Endava/BEEQ/commit/9aa36a6872b9d35b542a5ffa3d6693c5567c95e2))


### Chore ⚙️

* **BEEQ react:** build using TypeScript instead of Rollup ([#463](https://github.com/Endava/BEEQ/issues/463)) ([e5ffe47](https://github.com/Endava/BEEQ/commit/e5ffe47d829b872057e3cfe7b9f939996c26c307))
* **deps:** update [@nx](https://github.com/nx) to v16.7.2 ([#467](https://github.com/Endava/BEEQ/issues/467)) ([8f27ccf](https://github.com/Endava/BEEQ/commit/8f27ccf7cb8a6b0bbbd2e52dfcd25c90ea837c05))
* **deps:** update [@stencil](https://github.com/stencil) ([#469](https://github.com/Endava/BEEQ/issues/469)) ([b227ea4](https://github.com/Endava/BEEQ/commit/b227ea4eae4e609f0515199ee3d1b100bb930e11))
* **deps:** update [@storybook](https://github.com/storybook) to v7.3.2 ([#468](https://github.com/Endava/BEEQ/issues/468)) ([27f1123](https://github.com/Endava/BEEQ/commit/27f1123114b7a5d6925e1c1bee1e69e7c58d427b))
* **deps:** update dependency puppeteer to v21.0.1 ([#461](https://github.com/Endava/BEEQ/issues/461)) ([00d136e](https://github.com/Endava/BEEQ/commit/00d136ec6888cb91a5b0bd4b7e059b60965db30c))
* **deps:** update dependency regenerator-runtime to v0.14.0 ([#464](https://github.com/Endava/BEEQ/issues/464)) ([dbca3c1](https://github.com/Endava/BEEQ/commit/dbca3c179d6241a2ebec79c17725d02084327dd3))

## [0.8.0](https://github.com/Endava/bee-q/compare/v0.7.1...v0.8.0) (2023-08-18)


### Features ⚡️

* **Select:** add new `bq-select` component ([#449](https://github.com/Endava/bee-q/issues/449)) ([a03714f](https://github.com/Endava/bee-q/commit/a03714f4a57c5c48484bba3c274bdaa09dd9a550))
* **textarea:** add new `bq-textarea` component ([#393](https://github.com/Endava/bee-q/issues/393)) ([f51b25f](https://github.com/Endava/bee-q/commit/f51b25fbaa46437ec91da5922c1deb95fc37621d))
* **Theme:** add dark mode support ([#435](https://github.com/Endava/bee-q/issues/435)) ([db2a98d](https://github.com/Endava/bee-q/commit/db2a98d20490bc92305e16ef1c5ed40a8a1e7d15))
* **Typography:** add global typography CSS styles ([#388](https://github.com/Endava/bee-q/issues/388)) ([187e2f2](https://github.com/Endava/bee-q/commit/187e2f2f9b6fe9afe60f5762b6913995cd9f5eeb))


### Bug Fixes 🐞

* **Avatar:** trim initials text only if exist ([#428](https://github.com/Endava/bee-q/issues/428)) ([4d56e41](https://github.com/Endava/bee-q/commit/4d56e4172f193a9cf7c307f8acc199a89ace9289))
* **FloatingUI:** use object spread instead of `Object.assign()` ([#437](https://github.com/Endava/bee-q/issues/437)) ([0c0a3f3](https://github.com/Endava/bee-q/commit/0c0a3f3618871d89ad1fc479ad17e367ef1efee6))
* **Side menu item:** misalignment when menu is collapsed ([#453](https://github.com/Endava/bee-q/issues/453)) ([4e6e3c8](https://github.com/Endava/bee-q/commit/4e6e3c8192834ee9de7bf230031f1e987862199c))
* **tab:** update active tab when value is changed externally ([#402](https://github.com/Endava/bee-q/issues/402)) ([327fd50](https://github.com/Endava/bee-q/commit/327fd506dc8563379233a1bddfacb212b887dc5b))


### Documentation 📚

* all readme files and packages folder name to use `BEEQ` ([#454](https://github.com/Endava/bee-q/issues/454)) ([30e0992](https://github.com/Endava/bee-q/commit/30e0992e33fb1b0823cda93f692d5e7a388ab130))


### Chore ⚙️

* **deps:** update [@commitlint](https://github.com/commitlint) to v17.6.7 ([#417](https://github.com/Endava/bee-q/issues/417)) ([dda2ab0](https://github.com/Endava/bee-q/commit/dda2ab05fde42e64a8cd812868f2f9e7146b964f))
* **deps:** update [@stencil](https://github.com/stencil) ([#387](https://github.com/Endava/bee-q/issues/387)) ([44850f5](https://github.com/Endava/bee-q/commit/44850f5da5fb0d054ab6c8f5be565372fcdf4724))
* **deps:** update [@storybook](https://github.com/storybook) to v7.1.0 ([#376](https://github.com/Endava/bee-q/issues/376)) ([80275c7](https://github.com/Endava/bee-q/commit/80275c7a52b528d0c1fa1212c46768f07817d2f2))
* **deps:** update [@storybook](https://github.com/storybook) to v7.1.1 ([#429](https://github.com/Endava/bee-q/issues/429)) ([948fc7a](https://github.com/Endava/bee-q/commit/948fc7ae2f23378232d5ca5d28024ad1ba47cb18))
* **deps:** update [@storybook](https://github.com/storybook) to v7.2.3 ([#443](https://github.com/Endava/bee-q/issues/443)) ([176f17d](https://github.com/Endava/bee-q/commit/176f17dd39d99ab491bf669bb524e54fcb574d75))
* **deps:** update [@storybook](https://github.com/storybook) to v7.3.1 ([#451](https://github.com/Endava/bee-q/issues/451)) ([fc331af](https://github.com/Endava/bee-q/commit/fc331af67e168ca05b8c0658314d7012160ebe06))
* **deps:** update dependency @floating-ui/dom to v1.4.5 ([#399](https://github.com/Endava/bee-q/issues/399)) ([44b5491](https://github.com/Endava/bee-q/commit/44b5491c97c85badc9e472a1e287937aa901787b))
* **deps:** update dependency @floating-ui/dom to v1.5.0 ([#441](https://github.com/Endava/bee-q/issues/441)) ([f41b315](https://github.com/Endava/bee-q/commit/f41b3153edd39da609e2ef9d79da2e9c9b8eaeb6))
* **deps:** update dependency @floating-ui/dom to v1.5.1 ([#442](https://github.com/Endava/bee-q/issues/442)) ([6683c6d](https://github.com/Endava/bee-q/commit/6683c6dd10663eefeac37a74970550ef9f34a477))
* **deps:** update dependency @jscutlery/semver to v3 ([#411](https://github.com/Endava/bee-q/issues/411)) ([70f796a](https://github.com/Endava/bee-q/commit/70f796a52b6f622c82216dca85022b29f197d098))
* **deps:** update dependency @jscutlery/semver to v3.1.0 ([#413](https://github.com/Endava/bee-q/issues/413)) ([936cfde](https://github.com/Endava/bee-q/commit/936cfdee026095e8c69add4502ef54b417465b8f))
* **deps:** update dependency @nrwl/nx-cloud to v16.1.0 ([#395](https://github.com/Endava/bee-q/issues/395)) ([80fd0cd](https://github.com/Endava/bee-q/commit/80fd0cd31fa4e3d7cafae2485295522c6760e593))
* **deps:** update dependency @stencil/core to v4.0.3 ([#446](https://github.com/Endava/bee-q/issues/446)) ([0ba6039](https://github.com/Endava/bee-q/commit/0ba6039095fcc93c9eb979143c421b564915c763))
* **deps:** update dependency @swc/core to v1.3.69 ([#397](https://github.com/Endava/bee-q/issues/397)) ([1455db5](https://github.com/Endava/bee-q/commit/1455db569c53f43e7363a168d96d767bc0d7e565))
* **deps:** update dependency @swc/core to v1.3.70 ([#408](https://github.com/Endava/bee-q/issues/408)) ([772912c](https://github.com/Endava/bee-q/commit/772912c1c0579604ee7a0847cd6c7443c8aaa6aa))
* **deps:** update dependency @swc/core to v1.3.71 ([#430](https://github.com/Endava/bee-q/issues/430)) ([89408a2](https://github.com/Endava/bee-q/commit/89408a2b91179f3f291b06d8460f1be045cd782e))
* **deps:** update dependency @swc/core to v1.3.72 ([#444](https://github.com/Endava/bee-q/issues/444)) ([4325d1e](https://github.com/Endava/bee-q/commit/4325d1ec4b699d4dd06c38cd7cbce0b45bc50105))
* **deps:** update dependency @swc/core to v1.3.73 ([#448](https://github.com/Endava/bee-q/issues/448)) ([da9d7f6](https://github.com/Endava/bee-q/commit/da9d7f681b204d8df4f4634cff27cb84a81a00eb))
* **deps:** update dependency @types/node to v20.4.0 ([#378](https://github.com/Endava/bee-q/issues/378)) ([7e452fe](https://github.com/Endava/bee-q/commit/7e452fee92ea7648b941b4864957a5505b9fda63))
* **deps:** update dependency @types/node to v20.4.1 ([#385](https://github.com/Endava/bee-q/issues/385)) ([b74cdfd](https://github.com/Endava/bee-q/commit/b74cdfd5a537e9da7677d36a83f2c5ddc566751e))
* **deps:** update dependency @types/node to v20.4.2 ([#396](https://github.com/Endava/bee-q/issues/396)) ([3e219f0](https://github.com/Endava/bee-q/commit/3e219f0afb040d30d5535b805ec5b218170d0bb5))
* **deps:** update dependency @types/node to v20.4.3 ([#426](https://github.com/Endava/bee-q/issues/426)) ([395f664](https://github.com/Endava/bee-q/commit/395f6646376ffe1b72fd502b8a28360243edc5e6))
* **deps:** update dependency @types/node to v20.4.5 ([#427](https://github.com/Endava/bee-q/issues/427)) ([17a09a9](https://github.com/Endava/bee-q/commit/17a09a97cf880168cdf63db31bf6c7994670c284))
* **deps:** update dependency @types/react to v18.2.15 ([#400](https://github.com/Endava/bee-q/issues/400)) ([973483d](https://github.com/Endava/bee-q/commit/973483d5ec890b5753d923034722e178e3c18004))
* **deps:** update dependency @types/react to v18.2.17 ([#431](https://github.com/Endava/bee-q/issues/431)) ([b10a589](https://github.com/Endava/bee-q/commit/b10a5890e0ff6a12717ca8d7d0b5456b399e5a56))
* **deps:** update dependency @types/react to v18.2.18 ([#447](https://github.com/Endava/bee-q/issues/447)) ([d1444a8](https://github.com/Endava/bee-q/commit/d1444a82c70098094ff6cbb9a57a5f3f29e7d013))
* **deps:** update dependency @types/react-dom to v18.2.7 ([#394](https://github.com/Endava/bee-q/issues/394)) ([98a8725](https://github.com/Endava/bee-q/commit/98a872539c95f6ba58def97d58793256d790fa25))
* **deps:** update dependency chromatic to v6.20.0 ([#425](https://github.com/Endava/bee-q/issues/425)) ([a13296b](https://github.com/Endava/bee-q/commit/a13296bdcb1635974c28b6fc5f04e72a581dd6a7))
* **deps:** update dependency core-js to v3.31.1 ([#380](https://github.com/Endava/bee-q/issues/380)) ([64acc77](https://github.com/Endava/bee-q/commit/64acc775c22c7bb25d4fdcdf904d61a3d624676b))
* **deps:** update dependency core-js to v3.32.0 ([#439](https://github.com/Endava/bee-q/issues/439)) ([1c01c78](https://github.com/Endava/bee-q/commit/1c01c789a3e8271bc7c647b4f19711eeba768137))
* **deps:** update dependency eslint to v8.45.0 ([#405](https://github.com/Endava/bee-q/issues/405)) ([e594c37](https://github.com/Endava/bee-q/commit/e594c378463e8280a00c443b1d9fa118b2cfa52e))
* **deps:** update dependency eslint-plugin-react to v7.33.0 ([#423](https://github.com/Endava/bee-q/issues/423)) ([4c7be76](https://github.com/Endava/bee-q/commit/4c7be76605e41143d26ac125e3fd63486356104e))
* **deps:** update dependency eslint-plugin-storybook to v0.6.13 ([#420](https://github.com/Endava/bee-q/issues/420)) ([5925745](https://github.com/Endava/bee-q/commit/5925745dec7cfad5cf9ce0f0b132cb6644697d3d))
* **deps:** update dependency lit-html to v2.7.5 ([#377](https://github.com/Endava/bee-q/issues/377)) ([366009f](https://github.com/Endava/bee-q/commit/366009f956c4821e7a659c4dfd0eb5e21935940f))
* **deps:** update dependency lit-html to v2.8.0 ([#457](https://github.com/Endava/bee-q/issues/457)) ([d03c945](https://github.com/Endava/bee-q/commit/d03c945f922325c0cebb86c69afdef87aca1550b))
* **deps:** update dependency npm to v9.8.0 ([#379](https://github.com/Endava/bee-q/issues/379)) ([0e06ced](https://github.com/Endava/bee-q/commit/0e06ced7ebc7a69d1d9b2a2f3520f423f2ece866))
* **deps:** update dependency npm to v9.8.1 ([#419](https://github.com/Endava/bee-q/issues/419)) ([c62bab0](https://github.com/Endava/bee-q/commit/c62bab0b55ffb8fff1d35f877a9d377754fc0d65))
* **deps:** update dependency postcss to v8.4.25 ([#383](https://github.com/Endava/bee-q/issues/383)) ([b9eb9e7](https://github.com/Endava/bee-q/commit/b9eb9e730934f6320af8bec78be4f795e2d6c7d3))
* **deps:** update dependency prettier-plugin-tailwindcss to v0.4.1 ([#404](https://github.com/Endava/bee-q/issues/404)) ([0b09bef](https://github.com/Endava/bee-q/commit/0b09bef6d3564dd6d4513c46270adef85b534f24))
* **deps:** update dependency puppeteer to v20.8.0 ([#384](https://github.com/Endava/bee-q/issues/384)) ([3158a8f](https://github.com/Endava/bee-q/commit/3158a8f1b274591f330198013a9687d4cd1fd902))
* **deps:** update dependency puppeteer to v20.8.1 ([#391](https://github.com/Endava/bee-q/issues/391)) ([9f0df35](https://github.com/Endava/bee-q/commit/9f0df35fea90391efe3cc3d3b791c1dda8f0fa87))
* **deps:** update dependency puppeteer to v20.8.2 ([#398](https://github.com/Endava/bee-q/issues/398)) ([5184be1](https://github.com/Endava/bee-q/commit/5184be171e995d6b8a3cbf273b3f7becbf7c44e8))
* **deps:** update dependency puppeteer to v20.8.3 ([#409](https://github.com/Endava/bee-q/issues/409)) ([cb1ff7d](https://github.com/Endava/bee-q/commit/cb1ff7ddd830466bbd1f3d7aee9937dbe6761359))
* **deps:** update dependency puppeteer to v20.9.0 ([#421](https://github.com/Endava/bee-q/issues/421)) ([a0d246c](https://github.com/Endava/bee-q/commit/a0d246cb61c89f90bfbcf99f6ee214c75c762ba4))
* **deps:** update dependency puppeteer to v21 ([#455](https://github.com/Endava/bee-q/issues/455)) ([891e70b](https://github.com/Endava/bee-q/commit/891e70bec920a0a15da294a4d1cfd99be5732a20))
* **deps:** update dependency stylelint to v15.10.1 ([#381](https://github.com/Endava/bee-q/issues/381)) ([b6e1a3d](https://github.com/Endava/bee-q/commit/b6e1a3daa947777d98a7712b2c55e86cf070fd40))
* **deps:** update dependency stylelint to v15.10.2 ([#418](https://github.com/Endava/bee-q/issues/418)) ([b45d635](https://github.com/Endava/bee-q/commit/b45d6354a2ba49b451c64e9e11187bf0c3ec03a1))
* **deps:** update dependency tailwindcss to v3.3.3 ([#401](https://github.com/Endava/bee-q/issues/401)) ([c99505c](https://github.com/Endava/bee-q/commit/c99505c18623103f0459c2bc7ee98d6505439e8b))
* **deps:** update dependency tslib to v2.6.1 ([#432](https://github.com/Endava/bee-q/issues/432)) ([dfb9e6f](https://github.com/Endava/bee-q/commit/dfb9e6feff836512861c03d0bee583b4424584f8))
* **deps:** update dependency vite to v4.4.0 ([#382](https://github.com/Endava/bee-q/issues/382)) ([f775927](https://github.com/Endava/bee-q/commit/f775927f097ecf5c57d788248dff01493af70658))
* **deps:** update dependency vite to v4.4.2 ([#386](https://github.com/Endava/bee-q/issues/386)) ([2f6362c](https://github.com/Endava/bee-q/commit/2f6362c009a7439ad75c6ab486e571b60f313392))
* **deps:** update dependency vite to v4.4.3 ([#392](https://github.com/Endava/bee-q/issues/392)) ([700e3cc](https://github.com/Endava/bee-q/commit/700e3cc4b96ebd41f72a2fab36aad7c847f81c0d))
* **deps:** update dependency vite to v4.4.4 ([#403](https://github.com/Endava/bee-q/issues/403)) ([5325e78](https://github.com/Endava/bee-q/commit/5325e78bf402e5c29cbb067ae7beab43bb7f4ad8))
* **deps:** update dependency vite to v4.4.5 ([#422](https://github.com/Endava/bee-q/issues/422)) ([00e1b88](https://github.com/Endava/bee-q/commit/00e1b88c8458dff8c99c5486e2882c7df9a11a95))
* **deps:** update dependency vite to v4.4.6 ([#424](https://github.com/Endava/bee-q/issues/424)) ([84dfb61](https://github.com/Endava/bee-q/commit/84dfb61d839aaa9a25e19c93bbf58b7bd7711fc4))
* **deps:** update dependency vite to v4.4.7 ([#433](https://github.com/Endava/bee-q/issues/433)) ([87857fd](https://github.com/Endava/bee-q/commit/87857fd8ff16eab77a3d8537ca6e48c993f76640))
* **deps:** update dependency vite to v4.4.8 ([#450](https://github.com/Endava/bee-q/issues/450)) ([19062b5](https://github.com/Endava/bee-q/commit/19062b5cee2055d0af1fea7e595d957b10d3d729))
* **deps:** update eslint ([#438](https://github.com/Endava/bee-q/issues/438)) ([2a0d576](https://github.com/Endava/bee-q/commit/2a0d576fd427abf9ef3de5f374e1ed02b93a8dde))
* **deps:** update node.js to v18.17.0 ([#416](https://github.com/Endava/bee-q/issues/416)) ([6d618f6](https://github.com/Endava/bee-q/commit/6d618f6bc345cb0a2dc4551c24df3a8e6dc865bd))
* **deps:** update nx to v16.7.0 ([#452](https://github.com/Endava/bee-q/issues/452)) ([70295c9](https://github.com/Endava/bee-q/commit/70295c9d21eb6c0f5c678aef83a40d6efe0436a9))
* **deps:** update postcss ([#440](https://github.com/Endava/bee-q/issues/440)) ([67576b9](https://github.com/Endava/bee-q/commit/67576b9060b2c92af2e0b1b7cb0f429ef35062c4))
* **deps:** update typescript eslint to v5.62.0 ([#389](https://github.com/Endava/bee-q/issues/389)) ([52407e2](https://github.com/Endava/bee-q/commit/52407e2c35fea3aab22b1c8127ae9c80ba9e9469))
* **deps:** update typescript eslint to v6 ([#390](https://github.com/Endava/bee-q/issues/390)) ([05187ed](https://github.com/Endava/bee-q/commit/05187ed71e08e0f76c4c87c31decfb4346701fc0))
* **deps:** update typescript eslint to v6.1.0 ([#407](https://github.com/Endava/bee-q/issues/407)) ([f840388](https://github.com/Endava/bee-q/commit/f84038864135dfe4ddd824f3b19ed12e650c4322))
* **deps:** update typescript eslint to v6.2.0 ([#434](https://github.com/Endava/bee-q/issues/434)) ([c3e5685](https://github.com/Endava/bee-q/commit/c3e5685c8594a8d67d5f0fd98ad3ffd2b44d2a41))
* **deps:** update typescript eslint to v6.2.1 ([#445](https://github.com/Endava/bee-q/issues/445)) ([87eb97c](https://github.com/Endava/bee-q/commit/87eb97c5f72ecdcecb78352b6dafb2192b566a42))
* **Nx:** update to Nx 16 ([#406](https://github.com/Endava/bee-q/issues/406)) ([0959b19](https://github.com/Endava/bee-q/commit/0959b19ed43bd5f94f8f6216efa239f829800c53))
* **renovate:** allow `[@nx](https://github.com/nx)` and `[@nxext](https://github.com/nxext)` new versions ([053b751](https://github.com/Endava/bee-q/commit/053b7512106af01267823b3aa53c3aa556eb32c5))
* **Sonarcloud:** update code duplications exclusion pattern ([#436](https://github.com/Endava/bee-q/issues/436)) ([095760f](https://github.com/Endava/bee-q/commit/095760f1c6ed3382f8e253b094c8c51b6e870670))

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
