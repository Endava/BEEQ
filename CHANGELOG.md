# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html)


## [1.0.0](https://github.com/Endava/BEEQ/compare/v0.13.0...v1.0.0) (2024-02-20)


### ⚠ BREAKING CHANGES

* **Tokens:** all the tokens related to hover, active, and disable states have been removed.

Before, we used to have e.g. primary-hover, and primary-active applied on a button when it hovered or active, this refactor relies now on the use of color-mix() to archive the same result.

* **Tokens:** simplify the declarative design tokens ([#835](https://github.com/Endava/BEEQ/issues/835)) ([1423aa7](https://github.com/Endava/BEEQ/commit/1423aa71ce3e2ca94cf2f0f655f2f003226d992b))


### Chore ⚙️

* **deps:** update angular ([#845](https://github.com/Endava/BEEQ/issues/845)) ([d7e8052](https://github.com/Endava/BEEQ/commit/d7e8052b492c94f8c52ab799dc9462d8e26180fe))
* **deps:** update dependency @chromatic-com/storybook to v1.1.8 ([#842](https://github.com/Endava/BEEQ/issues/842)) ([b9010da](https://github.com/Endava/BEEQ/commit/b9010dad9e40f919e66718b25f65f4ca7ae6c322))
* **deps:** update dependency @chromatic-com/storybook to v1.1.9 ([#852](https://github.com/Endava/BEEQ/issues/852)) ([49d64ae](https://github.com/Endava/BEEQ/commit/49d64ae9c0b11b573d713dcf438c380d22cf3ff8))
* **deps:** update dependency @commitlint/config-conventional to v18.6.2 ([#846](https://github.com/Endava/BEEQ/issues/846)) ([2c65c3e](https://github.com/Endava/BEEQ/commit/2c65c3e207c841944f716dabdc8d07a9df74b6c7))
* **deps:** update dependency @nxext/stencil to v17.2.1 ([#839](https://github.com/Endava/BEEQ/issues/839)) ([c729562](https://github.com/Endava/BEEQ/commit/c729562a533dbf2215753b84e3cc4a8719a32cc5))
* **deps:** update dependency @nxext/stencil to v17.2.2 ([#854](https://github.com/Endava/BEEQ/issues/854)) ([adb6a38](https://github.com/Endava/BEEQ/commit/adb6a3806bd159476a9a3e469b8e8dc1825904b8))
* **deps:** update dependency @stencil/core to v4.12.2 ([#837](https://github.com/Endava/BEEQ/issues/837)) ([e2470fe](https://github.com/Endava/BEEQ/commit/e2470fecd1e53c5b09a4a2e43104a6428eca172d))
* **deps:** update dependency @swc/core to v1.4.2 ([#857](https://github.com/Endava/BEEQ/issues/857)) ([f1c3755](https://github.com/Endava/BEEQ/commit/f1c375524d0146decffb8bd3d0517f61068b5001))
* **deps:** update dependency @types/node to v20.11.19 ([#849](https://github.com/Endava/BEEQ/issues/849)) ([1118677](https://github.com/Endava/BEEQ/commit/1118677739833eba16483016c6971d21abed7277))
* **deps:** update dependency @types/react to v18.2.56 ([#855](https://github.com/Endava/BEEQ/issues/855)) ([1abb489](https://github.com/Endava/BEEQ/commit/1abb489e9b1cec7ebe81a0b16fdf28f740091e60))
* **deps:** update dependency @types/react to v18.2.57 ([#858](https://github.com/Endava/BEEQ/issues/858)) ([26da093](https://github.com/Endava/BEEQ/commit/26da09349d7a57e8c31e5c8b750db9980c766b33))
* **deps:** update dependency chromatic to v10.9.5 ([#843](https://github.com/Endava/BEEQ/issues/843)) ([c882c72](https://github.com/Endava/BEEQ/commit/c882c72279969f8e0eee3b1ca67c2d909de7f68f))
* **deps:** update dependency chromatic to v10.9.6 ([#850](https://github.com/Endava/BEEQ/issues/850)) ([34bbda0](https://github.com/Endava/BEEQ/commit/34bbda03d7bb77e5f977503bd96515f37352d927))
* **deps:** update dependency core-js to v3.36.0 ([#841](https://github.com/Endava/BEEQ/issues/841)) ([520c1ab](https://github.com/Endava/BEEQ/commit/520c1ab2ae5924fa71ea3adf2bdb7d8c128ea586))
* **deps:** update dependency eslint-plugin-storybook to v0.8.0 ([#851](https://github.com/Endava/BEEQ/issues/851)) ([b1b95b7](https://github.com/Endava/BEEQ/commit/b1b95b73f191422f3c6f3b7638e1922082b06d01))
* **deps:** update dependency postcss-import to v16.0.1 ([#847](https://github.com/Endava/BEEQ/issues/847)) ([aa8ecf8](https://github.com/Endava/BEEQ/commit/aa8ecf8c9a833409d9dd5c32e2af5bbb28a61623))
* **deps:** update dependency postcss-preset-env to v9.4.0 ([#860](https://github.com/Endava/BEEQ/issues/860)) ([c7e6ae0](https://github.com/Endava/BEEQ/commit/c7e6ae0a6178d5a26dc2c90234eb5e896b8e32e2))
* **deps:** update dependency puppeteer to v22.1.0 ([#856](https://github.com/Endava/BEEQ/issues/856)) ([f1054c2](https://github.com/Endava/BEEQ/commit/f1054c23e6173ed4ef9d3b130556c643bd39d1d2))
* **deps:** update dependency vite to v5.1.2 ([#840](https://github.com/Endava/BEEQ/issues/840)) ([44bb06f](https://github.com/Endava/BEEQ/commit/44bb06f9bf86a146eddce7b7c7dc4a436e7bfd9e))
* **deps:** update dependency vite to v5.1.3 ([#853](https://github.com/Endava/BEEQ/issues/853)) ([26552d4](https://github.com/Endava/BEEQ/commit/26552d4bb50ef772512fdc0c644593ccddf5e2be))
* **deps:** update dependency vue to v3.4.19 ([#838](https://github.com/Endava/BEEQ/issues/838)) ([709ca49](https://github.com/Endava/BEEQ/commit/709ca491dfd8243763b4f2b217c53a804a9b3b25))
* **deps:** update node.js to v20.11.1 ([#848](https://github.com/Endava/BEEQ/issues/848)) ([17e50c0](https://github.com/Endava/BEEQ/commit/17e50c0a4f6285f02395a64cbb1d9d799f7900ba))
* **deps:** update storybook to v7.6.15 ([#836](https://github.com/Endava/BEEQ/issues/836)) ([35fcece](https://github.com/Endava/BEEQ/commit/35fcece95bd64679246baf499df6630150c10c3e))
* **deps:** update storybook to v7.6.16 ([#844](https://github.com/Endava/BEEQ/issues/844)) ([20dbe76](https://github.com/Endava/BEEQ/commit/20dbe762b031baa17d48254b78c0b41414169868))
* **deps:** update storybook to v7.6.17 ([#861](https://github.com/Endava/BEEQ/issues/861)) ([99c5802](https://github.com/Endava/BEEQ/commit/99c5802babee10c2158b738237da74ac2d877e7c))
* **deps:** update typescript-eslint to v7.0.2 ([#859](https://github.com/Endava/BEEQ/issues/859)) ([ffa88b1](https://github.com/Endava/BEEQ/commit/ffa88b1952ff69c1b0e73da9800c4d74373466b2))

## [0.13.0](https://github.com/Endava/BEEQ/compare/v0.12.0...v0.13.0) (2024-02-14)


### Features ⚡️

* **Alert:** add `border` property to facilitate dynamic border-radius changes ([#817](https://github.com/Endava/BEEQ/issues/817)) ([7a23cc0](https://github.com/Endava/BEEQ/commit/7a23cc009cac02f157629984ebcc7946272ac34d))
* **Card:** add new `bq-card` component ([#806](https://github.com/Endava/BEEQ/issues/806)) ([8e437ce](https://github.com/Endava/BEEQ/commit/8e437ce0b1e38347276cc25224ab9e963d2a0687))
* **Dialog:** add `border` property to facilitate dynamic border-radius changes ([#818](https://github.com/Endava/BEEQ/issues/818)) ([02586cc](https://github.com/Endava/BEEQ/commit/02586cc011dcb8f37bee72b44435a903026b5720))
* **Notification:** add `border` property to facilitate dynamic border-radius changes ([#819](https://github.com/Endava/BEEQ/issues/819)) ([5bd2446](https://github.com/Endava/BEEQ/commit/5bd2446b4472840576e79dec270b1b8e2cff8acf))
* **Toast:** add `border` property to facilitate dynamic border-radius changes ([#820](https://github.com/Endava/BEEQ/issues/820)) ([e7a76fb](https://github.com/Endava/BEEQ/commit/e7a76fbface23835920e1b12616266246d96482a))


### Test 🧪

* **Accordion:** add e2e tests for accordion-group ([#828](https://github.com/Endava/BEEQ/issues/828)) ([eff4597](https://github.com/Endava/BEEQ/commit/eff4597e292e5bd4907cb08ba3f03c0ace10f195))


### Documentation 📚

* update missing scss variables description ([#829](https://github.com/Endava/BEEQ/issues/829)) ([2ffe09e](https://github.com/Endava/BEEQ/commit/2ffe09e7a47adc823e637e7611fae37b69912f8e))


### Chore ⚙️

* **deps:** fix renovate configuration ([c3fdd40](https://github.com/Endava/BEEQ/commit/c3fdd4028a81b41d5c824171eaee05258d526d6e))
* **deps:** update actions/cache action to v4 ([#810](https://github.com/Endava/BEEQ/issues/810)) ([d4fe03b](https://github.com/Endava/BEEQ/commit/d4fe03b3981bf1f3bbf3bc6ede5446a0a5ea80a5))
* **deps:** update angular to v17.1.3 ([#827](https://github.com/Endava/BEEQ/issues/827)) ([aaa3448](https://github.com/Endava/BEEQ/commit/aaa3448d59450331adc8b0d1f0ee7590a73c92d3))
* **deps:** update dependency @jscutlery/semver to v5.1.0 ([#811](https://github.com/Endava/BEEQ/issues/811)) ([801161c](https://github.com/Endava/BEEQ/commit/801161cceb099d272c006dd6d41b873137d9cbef))
* **deps:** update dependency @jscutlery/semver to v5.1.1 ([#826](https://github.com/Endava/BEEQ/issues/826)) ([17c2bc6](https://github.com/Endava/BEEQ/commit/17c2bc64458407efbc85d98370b356db53cc737f))
* **deps:** update dependency @types/react to v18.2.52 ([#812](https://github.com/Endava/BEEQ/issues/812)) ([42aa5ee](https://github.com/Endava/BEEQ/commit/42aa5ee8eee75783bcce3acf523ba836a184faba))
* **deps:** update dependency @types/react to v18.2.53 ([#815](https://github.com/Endava/BEEQ/issues/815)) ([496c43b](https://github.com/Endava/BEEQ/commit/496c43b76d595287a4b1f7ded216bbd5fac23461))
* **deps:** update dependency npm to v10.4.0 ([#813](https://github.com/Endava/BEEQ/issues/813)) ([9016058](https://github.com/Endava/BEEQ/commit/90160585abc7e62c4a003737284e83ffb2e3c27b))
* **deps:** update dependency prettier to v3.2.5 ([#808](https://github.com/Endava/BEEQ/issues/808)) ([3abce55](https://github.com/Endava/BEEQ/commit/3abce55059a73c69b4fe0ef1d056ac10c7db91a6))
* **deps:** update dependency puppeteer to v22 ([#824](https://github.com/Endava/BEEQ/issues/824)) ([46e0f6d](https://github.com/Endava/BEEQ/commit/46e0f6de88aeafa7ca72e5f90e74b0938a659cbb))
* **deps:** update dependency vite to v5.1.1 ([#833](https://github.com/Endava/BEEQ/issues/833)) ([b43f495](https://github.com/Endava/BEEQ/commit/b43f4955d9b7bd52a2b5eed658251a287c498d58))
* **deps:** update dependency vue to v3.4.18 ([#830](https://github.com/Endava/BEEQ/issues/830)) ([5fc87df](https://github.com/Endava/BEEQ/commit/5fc87dfcc361df391ae903af6177635a05799700))
* **deps:** update NPM dependencies ([#807](https://github.com/Endava/BEEQ/issues/807)) ([38ae611](https://github.com/Endava/BEEQ/commit/38ae611a4e27cd9bc74c264aeed518fd4e4b1b20))
* **deps:** update nx to v18 (major) ([#814](https://github.com/Endava/BEEQ/issues/814)) ([6b2c814](https://github.com/Endava/BEEQ/commit/6b2c814e8ed8322ef6907489251b3934d3d32ed5))
* **deps:** update nx to v18.0.1 ([#809](https://github.com/Endava/BEEQ/issues/809)) ([9f2f4c9](https://github.com/Endava/BEEQ/commit/9f2f4c93e22099f41fc2e3b80620d23e6632a2ae))
* **deps:** update nx to v18.0.2 ([#822](https://github.com/Endava/BEEQ/issues/822)) ([14b6eb4](https://github.com/Endava/BEEQ/commit/14b6eb47ad1e92c9c4e038f241c8174860b40ff9))
* **deps:** update nx to v18.0.3 ([#825](https://github.com/Endava/BEEQ/issues/825)) ([5c3e8ff](https://github.com/Endava/BEEQ/commit/5c3e8ffa1ddc434d62b6beac0879a4a9d2cffb36))
* **deps:** update nx to v18.0.4 ([#831](https://github.com/Endava/BEEQ/issues/831)) ([550a3d9](https://github.com/Endava/BEEQ/commit/550a3d921e8de2ccfe0701d7351def2431f35eb4))
* **deps:** update storybook to v7.6.13 ([#823](https://github.com/Endava/BEEQ/issues/823)) ([ff68ec8](https://github.com/Endava/BEEQ/commit/ff68ec8b638a36a4ea73e1f3e4fad3816da0cfbe))
* **deps:** update storybook to v7.6.14 ([#832](https://github.com/Endava/BEEQ/issues/832)) ([fb3321f](https://github.com/Endava/BEEQ/commit/fb3321f0ebf99980313b73979be1ee1126e320cd))
* **deps:** update swc ([#816](https://github.com/Endava/BEEQ/issues/816)) ([444f3a5](https://github.com/Endava/BEEQ/commit/444f3a55b1ab62debf2c6e1e2d994aab5077585b))
* **deps:** use `@chromatic-com/storybook` for visual tests ([#821](https://github.com/Endava/BEEQ/issues/821)) ([2688e11](https://github.com/Endava/BEEQ/commit/2688e11240aa44628e1326906dce84ae0679f45e))

## [0.12.0](https://github.com/Endava/BEEQ/compare/v0.11.0...v0.12.0) (2024-02-02)


### Features ⚡️

* **Icon:** add support for custom source (`src`) and custom assets path ([#742](https://github.com/Endava/BEEQ/issues/742)) ([e44b8d1](https://github.com/Endava/BEEQ/commit/e44b8d159c7cb2e7f10beb490b2d4cf701d511d1))
* **Select:** add `clear()` method to remove selected value programmatically ([#770](https://github.com/Endava/BEEQ/issues/770)) ([57f84e8](https://github.com/Endava/BEEQ/commit/57f84e8795d66a4153fd4b0d6d394b0eda9ebb55))
* **Tag:** allow custom tag color ([#724](https://github.com/Endava/BEEQ/issues/724)) ([ff05338](https://github.com/Endava/BEEQ/commit/ff05338cf9c0cb5530a8b8ec6d84c75c9edc028f))


### Bug Fixes 🐞

* **Accordion:** skip focus if `disabled="true"` ([#741](https://github.com/Endava/BEEQ/issues/741)) ([43e1621](https://github.com/Endava/BEEQ/commit/43e162160ae9c151725a9df3d5774f9f21e05c99))
* **Alert:** improve open/close animation ([#769](https://github.com/Endava/BEEQ/issues/769)) ([a5873af](https://github.com/Endava/BEEQ/commit/a5873af1fcac6be890639c9e37f96bb2de874f8f))
* **Dialog:** prop `footerAppearance` typo and open/close animations improvement ([#767](https://github.com/Endava/BEEQ/issues/767)) ([1efb9cd](https://github.com/Endava/BEEQ/commit/1efb9cd7cb822992a148b5a87569ac2f51584b57))
* **Notification:** improve open/close animations ([#768](https://github.com/Endava/BEEQ/issues/768)) ([eeeac9e](https://github.com/Endava/BEEQ/commit/eeeac9e1442ad36d10208603093eefd603c41d0b))


### Test 🧪

* **Accordion:** add e2e test ([#800](https://github.com/Endava/BEEQ/issues/800)) ([1415508](https://github.com/Endava/BEEQ/commit/141550836e31554ecfc596b958958463a90dac0d))


### Documentation 📚

* **Accordion:** add css variables description ([#788](https://github.com/Endava/BEEQ/issues/788)) ([c81a172](https://github.com/Endava/BEEQ/commit/c81a172051ea1c7599208d9f26c4aaed768bbe7f))
* **Project:** update README: `Running the project` section ([#787](https://github.com/Endava/BEEQ/issues/787)) ([411f554](https://github.com/Endava/BEEQ/commit/411f554b5506ba87f4e4aba6c0c4b47cba158685))
* **Search:** add storybook examples for Search input ([#766](https://github.com/Endava/BEEQ/issues/766)) ([a777919](https://github.com/Endava/BEEQ/commit/a77791927a87c8f972d052ff45cd8596dd945e79))
* **Storybook:** enable visual tests addon ([#755](https://github.com/Endava/BEEQ/issues/755)) ([9c431ea](https://github.com/Endava/BEEQ/commit/9c431eab341544fc06422decb3190ae7ccce0a03))


### Chore ⚙️

* **Beeq TailwindCSS:** add missing publish target ([00e64c3](https://github.com/Endava/BEEQ/commit/00e64c331ddae072a7b3b50659281706afe89a6b))
* **Chromatic:** move chromatic config options to `chromatic.config.json` file ([e438ee1](https://github.com/Endava/BEEQ/commit/e438ee1edf2ccb7f48f1dbba4ef871e7b22c46e7))
* **deps:** update angular ([#743](https://github.com/Endava/BEEQ/issues/743)) ([20c987f](https://github.com/Endava/BEEQ/commit/20c987f19c265436b589352e69865235113253c3))
* **deps:** update angular ([#771](https://github.com/Endava/BEEQ/issues/771)) ([7d0e995](https://github.com/Endava/BEEQ/commit/7d0e995b55550c77c778c0764b9810d7c2b143b6))
* **deps:** update Angular to 17.1.2 ([#805](https://github.com/Endava/BEEQ/issues/805)) ([c107b2d](https://github.com/Endava/BEEQ/commit/c107b2dfe9d710ebf4d7af3ce99084092bd5c5a3))
* **deps:** update Angular to v17.1.1 ([#801](https://github.com/Endava/BEEQ/issues/801)) ([569e6e7](https://github.com/Endava/BEEQ/commit/569e6e74a91592fd46a70dd547733887ad3626f9))
* **deps:** update commitlint to v18.4.4 ([#744](https://github.com/Endava/BEEQ/issues/744)) ([a8dbfc9](https://github.com/Endava/BEEQ/commit/a8dbfc9a981efef9950a04bbe255471c4856e02c))
* **deps:** update dependency @babel/core to v7.23.9 ([#795](https://github.com/Endava/BEEQ/issues/795)) ([6ce4467](https://github.com/Endava/BEEQ/commit/6ce446731223f97a531086d50b3363ae907f0ad0))
* **deps:** update dependency @nxext/stencil to v17.2.0 ([#759](https://github.com/Endava/BEEQ/issues/759)) ([305f361](https://github.com/Endava/BEEQ/commit/305f3611efdbb89466f8ff66594e00fdaaf712b5))
* **deps:** update dependency @stencil/core to v4.10.0 ([#779](https://github.com/Endava/BEEQ/issues/779)) ([ff88a87](https://github.com/Endava/BEEQ/commit/ff88a87ad1a6003143d4d7c1b39dea2e417ba6ec))
* **deps:** update dependency @swc/core to v1.3.103 ([#780](https://github.com/Endava/BEEQ/issues/780)) ([0272bfa](https://github.com/Endava/BEEQ/commit/0272bfa7a4bd6f6d45b099085ad208e21daf67b4))
* **deps:** update dependency @types/node to v20.10.8 ([#761](https://github.com/Endava/BEEQ/issues/761)) ([8db8768](https://github.com/Endava/BEEQ/commit/8db876841e90e710786c8a5cfa3bd96cc3973653))
* **deps:** update dependency @types/node to v20.11.0 ([#775](https://github.com/Endava/BEEQ/issues/775)) ([132d3af](https://github.com/Endava/BEEQ/commit/132d3afcb8ff47e385b65ac1789fb20c9fe47838))
* **deps:** update dependency @types/node to v20.11.13 ([#790](https://github.com/Endava/BEEQ/issues/790)) ([0775a00](https://github.com/Endava/BEEQ/commit/0775a0048e92db66564634b66d0232350813ad7d))
* **deps:** update dependency @types/node to v20.11.2 ([#781](https://github.com/Endava/BEEQ/issues/781)) ([c7fe9e0](https://github.com/Endava/BEEQ/commit/c7fe9e02cc9201e4cc66a9f267345f501261a126))
* **deps:** update dependency @types/node to v20.11.3 ([#785](https://github.com/Endava/BEEQ/issues/785)) ([4f7cb68](https://github.com/Endava/BEEQ/commit/4f7cb6834d49e8d68d85a5dd3bfb462e3cdee9ec))
* **deps:** update dependency @types/react to v18.2.47 ([#745](https://github.com/Endava/BEEQ/issues/745)) ([8231789](https://github.com/Endava/BEEQ/commit/8231789945d96aad628b7bc95ccf4d34279123b8))
* **deps:** update dependency @types/react to v18.2.48 ([#782](https://github.com/Endava/BEEQ/issues/782)) ([b87102a](https://github.com/Endava/BEEQ/commit/b87102a0a06d146188335fe228c16a5b13fd19d6))
* **deps:** update dependency autoprefixer to v10.4.17 ([#791](https://github.com/Endava/BEEQ/issues/791)) ([7fb97ee](https://github.com/Endava/BEEQ/commit/7fb97ee9d05c3270c858b6aeb9b13e6e11f0b5c1))
* **deps:** update dependency chromatic to v10.2.1 ([#762](https://github.com/Endava/BEEQ/issues/762)) ([64396ec](https://github.com/Endava/BEEQ/commit/64396eca020ebafd414437453b9753f7d19a865f))
* **deps:** update dependency chromatic to v10.2.2 ([#772](https://github.com/Endava/BEEQ/issues/772)) ([fe9d4d7](https://github.com/Endava/BEEQ/commit/fe9d4d7303af4d63696b1ee7a28bb9ed4b3671a4))
* **deps:** update dependency core-js to v3.35.1 ([#792](https://github.com/Endava/BEEQ/issues/792)) ([6d4d970](https://github.com/Endava/BEEQ/commit/6d4d970ed333e3b685afdf8aa323b729b021b2b6))
* **deps:** update dependency eslint-plugin-prettier to v5.1.3 ([#763](https://github.com/Endava/BEEQ/issues/763)) ([48fcecf](https://github.com/Endava/BEEQ/commit/48fcecffb17d24ec8e5346b46ea72a0ce67f32ce))
* **deps:** update dependency lit-html to v3.1.1 ([#764](https://github.com/Endava/BEEQ/issues/764)) ([700ac79](https://github.com/Endava/BEEQ/commit/700ac7919e45a89c4fa8d6344f55052c435109dd))
* **deps:** update dependency ngx-deploy-npm to v8 ([#804](https://github.com/Endava/BEEQ/issues/804)) ([e38c28c](https://github.com/Endava/BEEQ/commit/e38c28c97249cacef90281f88d36bd516471ccaa))
* **deps:** update dependency npm to v10.3.0 ([#776](https://github.com/Endava/BEEQ/issues/776)) ([c295b08](https://github.com/Endava/BEEQ/commit/c295b080962b02df60a8e1489d1c8d2f668b5a1b))
* **deps:** update dependency nx-stylelint to v17.1.1 ([#757](https://github.com/Endava/BEEQ/issues/757)) ([b44705e](https://github.com/Endava/BEEQ/commit/b44705ea313f10f352d3416f02cc340ffcacbeac))
* **deps:** update dependency postcss to v8.4.33 ([#746](https://github.com/Endava/BEEQ/issues/746)) ([14351fd](https://github.com/Endava/BEEQ/commit/14351fd17d3c4dc14b8432035fd94484b2ccafe4))
* **deps:** update dependency postcss-import to v16 ([#753](https://github.com/Endava/BEEQ/issues/753)) ([4a06efd](https://github.com/Endava/BEEQ/commit/4a06efdb8bc1a67e5c55b1708131ddcc43f07083))
* **deps:** update dependency prettier to v3.2.2 ([#777](https://github.com/Endava/BEEQ/issues/777)) ([1f55f3d](https://github.com/Endava/BEEQ/commit/1f55f3d60a2cd37dabc11884b4f35aede4d752bb))
* **deps:** update dependency prettier to v3.2.4 ([#793](https://github.com/Endava/BEEQ/issues/793)) ([2903b8d](https://github.com/Endava/BEEQ/commit/2903b8d343b63ec3fa08a8f22a82499004bf0f8e))
* **deps:** update dependency prettier-plugin-tailwindcss to v0.5.11 ([#747](https://github.com/Endava/BEEQ/issues/747)) ([3f07464](https://github.com/Endava/BEEQ/commit/3f07464f216e09488afffb8ff9f4dae5e75535ea))
* **deps:** update dependency puppeteer to v21.7.0 ([#751](https://github.com/Endava/BEEQ/issues/751)) ([e62ff60](https://github.com/Endava/BEEQ/commit/e62ff6065858e3d6e6f3ec89098cd0a803ff14f0))
* **deps:** update dependency stylelint-config-standard-scss to v13 ([#754](https://github.com/Endava/BEEQ/issues/754)) ([272375e](https://github.com/Endava/BEEQ/commit/272375e2ad5321a06fa09391f66f89e0ec148955))
* **deps:** update dependency tailwindcss to v3.4.1 ([#748](https://github.com/Endava/BEEQ/issues/748)) ([7eed58e](https://github.com/Endava/BEEQ/commit/7eed58ebd124a30b87929df90b500d527f7e5a33))
* **deps:** update dependency tailwindcss-theme-swapper to v0.11.0 ([#778](https://github.com/Endava/BEEQ/issues/778)) ([cbf165c](https://github.com/Endava/BEEQ/commit/cbf165c3511d25bd9386721304c06a06ec3faeb3))
* **deps:** update dependency ts-jest to v29.1.2 ([#796](https://github.com/Endava/BEEQ/issues/796)) ([867f795](https://github.com/Endava/BEEQ/commit/867f7957741692e175cf6901f6e4f98141e266a5))
* **deps:** update dependency vite to v5.0.11 ([#749](https://github.com/Endava/BEEQ/issues/749)) ([278c483](https://github.com/Endava/BEEQ/commit/278c48330d8baec551eebae4c9202716c0bfa6fb))
* **deps:** update dependency vite to v5.0.12 ([#794](https://github.com/Endava/BEEQ/issues/794)) ([88f4be2](https://github.com/Endava/BEEQ/commit/88f4be2c9004c7e43bc35772bdaeb0bcfaadecc0))
* **deps:** update dependency vue to v3.4.13 ([#773](https://github.com/Endava/BEEQ/issues/773)) ([46a4987](https://github.com/Endava/BEEQ/commit/46a4987bd21a88cb088f5f19134893ed67daebd1))
* **deps:** update dependency vue to v3.4.14 ([#783](https://github.com/Endava/BEEQ/issues/783)) ([074dc3c](https://github.com/Endava/BEEQ/commit/074dc3c2f8d702be49398f9573b6d6e8e8790b9d))
* **deps:** update dependency vue to v3.4.15 ([#797](https://github.com/Endava/BEEQ/issues/797)) ([7702af9](https://github.com/Endava/BEEQ/commit/7702af9993a9622dabcff2d0f488403f5104218c))
* **deps:** update dependency vue to v3.4.5 ([#750](https://github.com/Endava/BEEQ/issues/750)) ([3f22096](https://github.com/Endava/BEEQ/commit/3f22096707f9b3852f7a4c9f1a4f3cb555b096c7))
* **deps:** update dependency vue to v3.4.7 ([#760](https://github.com/Endava/BEEQ/issues/760)) ([f8b1fd0](https://github.com/Endava/BEEQ/commit/f8b1fd0963c992f29d5013efd2073eda66820fe3))
* **deps:** update node.js to v20.11.0 ([#765](https://github.com/Endava/BEEQ/issues/765)) ([8234d31](https://github.com/Endava/BEEQ/commit/8234d313420d03e41ef9bcdd8dee17d50e4009c1))
* **deps:** update nx to v17.3.0 ([#802](https://github.com/Endava/BEEQ/issues/802)) ([be09676](https://github.com/Endava/BEEQ/commit/be09676388a6dd5d101c61375033479f8137554f))
* **deps:** update stencil ([#798](https://github.com/Endava/BEEQ/issues/798)) ([6f8d948](https://github.com/Endava/BEEQ/commit/6f8d948bd25b6e96e79e549a2b3310f6ec3aa48c))
* **deps:** update storybook to v7.6.11 ([#799](https://github.com/Endava/BEEQ/issues/799)) ([26902cc](https://github.com/Endava/BEEQ/commit/26902cc5b45bf547e7ecc291b75985ad1555c757))
* **deps:** update storybook to v7.6.12 ([#803](https://github.com/Endava/BEEQ/issues/803)) ([b51d26e](https://github.com/Endava/BEEQ/commit/b51d26e1b0d5ba28944b4edb18c4d5268d2fef0c))
* **deps:** update storybook to v7.6.8 ([#774](https://github.com/Endava/BEEQ/issues/774)) ([e424a17](https://github.com/Endava/BEEQ/commit/e424a17335f986fad91ced236cbda4560c48bdbb))
* **deps:** update storybook to v7.6.9 ([#786](https://github.com/Endava/BEEQ/issues/786)) ([a7c4592](https://github.com/Endava/BEEQ/commit/a7c45923d3b711c53443c8575b148a128a378729))
* **deps:** update swc ([#789](https://github.com/Endava/BEEQ/issues/789)) ([35e993c](https://github.com/Endava/BEEQ/commit/35e993c69358f27b702020c7d68058105cf7e8b5))
* **deps:** update typescript-eslint to v6.18.0 ([#752](https://github.com/Endava/BEEQ/issues/752)) ([7c54b59](https://github.com/Endava/BEEQ/commit/7c54b5953e80e361dcf71140f4db28b5cf49f144))
* **deps:** update typescript-eslint to v6.18.1 ([#758](https://github.com/Endava/BEEQ/issues/758)) ([8211795](https://github.com/Endava/BEEQ/commit/82117957a944008355ece5538d41bd6abc757d92))
* **deps:** update typescript-eslint to v6.19.0 ([#784](https://github.com/Endava/BEEQ/issues/784)) ([2a6898e](https://github.com/Endava/BEEQ/commit/2a6898e91c67c85864e042c357c03988a8bb1899))

## [0.11.0](https://github.com/Endava/BEEQ/compare/v0.10.0...v0.11.0) (2024-01-02)


### Features ⚡️

* **Accordion:** add new `bq-accordion` and `bq-accordion-group` components ([#697](https://github.com/Endava/BEEQ/issues/697)) ([5e39673](https://github.com/Endava/BEEQ/commit/5e39673aab978477ffe4794b1cddb6e36488f861))
* **Alert:** add new `bq-alert` component ([#675](https://github.com/Endava/BEEQ/issues/675)) ([a146415](https://github.com/Endava/BEEQ/commit/a14641514650aee2e0db2e3254c66b2ba044ce59))
* **BEEQ TailwindCSS:** add BEEQ's opinionated TailwindCSS preset package ([#628](https://github.com/Endava/BEEQ/issues/628)) ([dbc2f25](https://github.com/Endava/BEEQ/commit/dbc2f25ff254bfa0f7d685362b2ab0657e313099))
* **Button:** add `border` property to support border-radius changes ([#709](https://github.com/Endava/BEEQ/issues/709)) ([686536a](https://github.com/Endava/BEEQ/commit/686536ab208a3cca070d8573283a96e7959d2979))
* **Empty State:** add new `bq-empty-state` component ([#694](https://github.com/Endava/BEEQ/issues/694)) ([367de74](https://github.com/Endava/BEEQ/commit/367de746d8e21392165ab687d523c668d957e2d8))
* **Tag:** add new `bq-tag` component ([#695](https://github.com/Endava/BEEQ/issues/695)) ([bc67079](https://github.com/Endava/BEEQ/commit/bc67079a93c4088ae6edaee437bd2e36593e41b0))


### Bug Fixes 🐞

* **Badge:** remove border styles ([#629](https://github.com/Endava/BEEQ/issues/629)) ([c23d138](https://github.com/Endava/BEEQ/commit/c23d1383376ccdb0cef95610e50f697be1cd646c))
* **Textarea:** export missing shadow DOM parts ([#708](https://github.com/Endava/BEEQ/issues/708)) ([b759583](https://github.com/Endava/BEEQ/commit/b7595832a915c3a856a405135009a7690be251db))


### Documentation 📚

* **Empty State:** remove unused constants ([#696](https://github.com/Endava/BEEQ/issues/696)) ([ac82fa6](https://github.com/Endava/BEEQ/commit/ac82fa67ac62ffd8c3e6c5359b783c91c6bbea41))
* **Storybook:** prevent storybook docs from being crawled ([61bbe38](https://github.com/Endava/BEEQ/commit/61bbe38ea2622387e8dadc5cef0da71507743635))


### Chore ⚙️

* **Beeq:** remove `tsconfig.json` duplicate compiler options ([4d0a77e](https://github.com/Endava/BEEQ/commit/4d0a77ee069749819146886db0d362178cb6cfe5))
* **CI:** add a Github pages deploy workflow ([#715](https://github.com/Endava/BEEQ/issues/715)) ([d922fd8](https://github.com/Endava/BEEQ/commit/d922fd866f347626632a5e5a3d6ecf4515b651e4))
* **CI:** change Github pages branch name ([285a77b](https://github.com/Endava/BEEQ/commit/285a77b6599ff9436157ac8dbbc0893949e8888f))
* **deps:** update Angular ([#621](https://github.com/Endava/BEEQ/issues/621)) ([cdb6cd9](https://github.com/Endava/BEEQ/commit/cdb6cd930a069c5015340b273f0e711af25d4baa))
* **deps:** update Angular ([#641](https://github.com/Endava/BEEQ/issues/641)) ([c9efbed](https://github.com/Endava/BEEQ/commit/c9efbed3fdfc1601202d1967efc338598517fbc9))
* **deps:** update angular ([#676](https://github.com/Endava/BEEQ/issues/676)) ([79b0a0f](https://github.com/Endava/BEEQ/commit/79b0a0f5547d7d41825f1fbcf500bfde1aee8b2f))
* **deps:** update Angular to v17.0.3 ([#673](https://github.com/Endava/BEEQ/issues/673)) ([7e0f83f](https://github.com/Endava/BEEQ/commit/7e0f83fd02edb618c6ae04c311b4cba9295aaa19))
* **deps:** update angular to v17.0.6 ([#698](https://github.com/Endava/BEEQ/issues/698)) ([31c7cb7](https://github.com/Endava/BEEQ/commit/31c7cb7ce39cdb44dfa8d0534db474d68ecfa983))
* **deps:** update angular to v17.0.7 ([#710](https://github.com/Endava/BEEQ/issues/710)) ([305ae66](https://github.com/Endava/BEEQ/commit/305ae661027688b9aa8f2ea21bea621c04614ae4))
* **deps:** update angular to v17.0.8 ([#726](https://github.com/Endava/BEEQ/issues/726)) ([1fd3666](https://github.com/Endava/BEEQ/commit/1fd3666427c3703332631b827a8ba194147d7a9b))
* **deps:** update commitlint to v18.4.0 ([#651](https://github.com/Endava/BEEQ/issues/651)) ([14e7090](https://github.com/Endava/BEEQ/commit/14e7090d34b34a92862716c02ea3ff1182649420))
* **deps:** update commitlint to v18.4.3 ([#677](https://github.com/Endava/BEEQ/issues/677)) ([314115c](https://github.com/Endava/BEEQ/commit/314115c9b80de208c7ec62d35b7dba1c751e8d6b))
* **deps:** update dependency @babel/core to v7.23.3 ([#654](https://github.com/Endava/BEEQ/issues/654)) ([5826a2d](https://github.com/Endava/BEEQ/commit/5826a2d31641243d87365cac2e6b803107d20ff8))
* **deps:** update dependency @babel/core to v7.23.5 ([#685](https://github.com/Endava/BEEQ/issues/685)) ([29c43a5](https://github.com/Endava/BEEQ/commit/29c43a566378a874171706d63af486c6b491ddaf))
* **deps:** update dependency @babel/core to v7.23.6 ([#711](https://github.com/Endava/BEEQ/issues/711)) ([e4c4ae9](https://github.com/Endava/BEEQ/commit/e4c4ae953179760f9b9636cfdbf859bac84af2a8))
* **deps:** update dependency @babel/core to v7.23.7 ([#731](https://github.com/Endava/BEEQ/issues/731)) ([2363751](https://github.com/Endava/BEEQ/commit/2363751138c314c2688d3ae815d3df419331a03a))
* **deps:** update dependency @babel/preset-react to v7.23.3 ([#653](https://github.com/Endava/BEEQ/issues/653)) ([f897191](https://github.com/Endava/BEEQ/commit/f897191a78969462c90c3e956bc25ede252ce0b1))
* **deps:** update dependency @commitlint/cli to v18.4.1 ([#652](https://github.com/Endava/BEEQ/issues/652)) ([69cd5ea](https://github.com/Endava/BEEQ/commit/69cd5ea47d5c30348357a15151380621fbeeb259))
* **deps:** update dependency @jscutlery/semver to v4.1.0 ([#668](https://github.com/Endava/BEEQ/issues/668)) ([0d89841](https://github.com/Endava/BEEQ/commit/0d89841d8585eaa6f318904941b7a187fc692061))
* **deps:** update dependency @jscutlery/semver to v4.2.0 ([#725](https://github.com/Endava/BEEQ/issues/725)) ([2be7b6c](https://github.com/Endava/BEEQ/commit/2be7b6c0ce4b108483c1bb2d94e814e1c6038363))
* **deps:** update dependency @stencil/core to v4.7.2 ([#662](https://github.com/Endava/BEEQ/issues/662)) ([293b10f](https://github.com/Endava/BEEQ/commit/293b10ff6ff23acf24fb9a4429d59f7b819ffc42))
* **deps:** update dependency @stencil/core to v4.8.0 ([#687](https://github.com/Endava/BEEQ/issues/687)) ([739215e](https://github.com/Endava/BEEQ/commit/739215ed64fa22a79c3f99c02d8d935e1925b398))
* **deps:** update dependency @stencil/core to v4.8.1 ([#692](https://github.com/Endava/BEEQ/issues/692)) ([0d690ba](https://github.com/Endava/BEEQ/commit/0d690baffd9cd8ab151a578dd23c770b777b2bbf))
* **deps:** update dependency @stencil/core to v4.8.2 ([#712](https://github.com/Endava/BEEQ/issues/712)) ([81f4392](https://github.com/Endava/BEEQ/commit/81f4392407767247c2cdd037ee7e9e2b0bbe69a0))
* **deps:** update dependency @stencil/core to v4.9.0 ([#718](https://github.com/Endava/BEEQ/issues/718)) ([6271279](https://github.com/Endava/BEEQ/commit/627127907c82cd0934c2b130ad8d22114b730294))
* **deps:** update dependency @stencil/vue-output-target to v0.8.7 ([#644](https://github.com/Endava/BEEQ/issues/644)) ([f91edf2](https://github.com/Endava/BEEQ/commit/f91edf2d8b888276fc6fcfa65ec89a6382e84a51))
* **deps:** update dependency @swc/cli to v0.1.63 ([#663](https://github.com/Endava/BEEQ/issues/663)) ([8ed7c52](https://github.com/Endava/BEEQ/commit/8ed7c523aa59537bfb2582ca3344c968e701f39c))
* **deps:** update dependency @swc/core to v1.3.100 ([#678](https://github.com/Endava/BEEQ/issues/678)) ([8c406bb](https://github.com/Endava/BEEQ/commit/8c406bba502a596b58990c62355adf1e07bf8914))
* **deps:** update dependency @swc/core to v1.3.96 ([#624](https://github.com/Endava/BEEQ/issues/624)) ([cfad326](https://github.com/Endava/BEEQ/commit/cfad326bcaf684dcd9115c58fc35786542cca494))
* **deps:** update dependency @testing-library/react to v14.1.0 ([#640](https://github.com/Endava/BEEQ/issues/640)) ([2cef6f0](https://github.com/Endava/BEEQ/commit/2cef6f06f1926633445f83d08dd40b55dcb6f280))
* **deps:** update dependency @testing-library/react to v14.1.2 ([#664](https://github.com/Endava/BEEQ/issues/664)) ([4fc881a](https://github.com/Endava/BEEQ/commit/4fc881ad61cc8904bf80a96175bf53bd1005b8d1))
* **deps:** update dependency @types/jest to v29.5.10 ([#679](https://github.com/Endava/BEEQ/issues/679)) ([e8b1fc8](https://github.com/Endava/BEEQ/commit/e8b1fc81474602767280785bb715f8761cb5b306))
* **deps:** update dependency @types/jest to v29.5.11 ([#699](https://github.com/Endava/BEEQ/issues/699)) ([9631f38](https://github.com/Endava/BEEQ/commit/9631f38c0e6786ee9f0791947754438725d3e418))
* **deps:** update dependency @types/jest to v29.5.8 ([#632](https://github.com/Endava/BEEQ/issues/632)) ([b835585](https://github.com/Endava/BEEQ/commit/b83558523ec9ec7524f4fb798c08eea12bc1c33e))
* **deps:** update dependency @types/mdx to v2.0.10 ([#636](https://github.com/Endava/BEEQ/issues/636)) ([7eeb3bd](https://github.com/Endava/BEEQ/commit/7eeb3bddd3bc2d3058bf0ec7754d608e9601d2b5))
* **deps:** update dependency @types/node to v20.10.5 ([#700](https://github.com/Endava/BEEQ/issues/700)) ([11adaf9](https://github.com/Endava/BEEQ/commit/11adaf9f5bc598f9b2027937019b0ebedf2b30b4))
* **deps:** update dependency @types/node to v20.10.6 ([#732](https://github.com/Endava/BEEQ/issues/732)) ([87efd58](https://github.com/Endava/BEEQ/commit/87efd58175dd812d6f425f574b7fdc2197095d75))
* **deps:** update dependency @types/node to v20.9.0 ([#638](https://github.com/Endava/BEEQ/issues/638)) ([a0d3a5a](https://github.com/Endava/BEEQ/commit/a0d3a5af1a7a4a443ed2f532ff6eb07f63fde766))
* **deps:** update dependency @types/node to v20.9.2 ([#665](https://github.com/Endava/BEEQ/issues/665)) ([5ec53bd](https://github.com/Endava/BEEQ/commit/5ec53bde80a15321bb0cd2562859f36b7a39b969))
* **deps:** update dependency @types/react to v18.2.36 ([#623](https://github.com/Endava/BEEQ/issues/623)) ([e2a5268](https://github.com/Endava/BEEQ/commit/e2a52685c349692278107d63ab91cb39c8fe9575))
* **deps:** update dependency @types/react to v18.2.46 ([#733](https://github.com/Endava/BEEQ/issues/733)) ([7f6260c](https://github.com/Endava/BEEQ/commit/7f6260cd14f5b27e315a2925cc4837f1239d46c9))
* **deps:** update dependency chromatic to v10 ([#691](https://github.com/Endava/BEEQ/issues/691)) ([a495e47](https://github.com/Endava/BEEQ/commit/a495e4704f589cea340d06722cfaac09d44e7250))
* **deps:** update dependency chromatic to v10.2.0 ([#730](https://github.com/Endava/BEEQ/issues/730)) ([92f4e90](https://github.com/Endava/BEEQ/commit/92f4e90d0efb25844fb20a66e710313448efa8ed))
* **deps:** update dependency chromatic to v7.6.0 ([#639](https://github.com/Endava/BEEQ/issues/639)) ([7e7417b](https://github.com/Endava/BEEQ/commit/7e7417b5ae14ab2df4eb1f6a84058825db14b0bc))
* **deps:** update dependency chromatic to v8 ([#647](https://github.com/Endava/BEEQ/issues/647)) ([fedac37](https://github.com/Endava/BEEQ/commit/fedac3757c75f676f38ab5d77e4259cc0d5690cd))
* **deps:** update dependency chromatic to v9 ([#650](https://github.com/Endava/BEEQ/issues/650)) ([a575b3f](https://github.com/Endava/BEEQ/commit/a575b3f3c3ec98fa3813b623b54b6fd44f0dce29))
* **deps:** update dependency chromatic to v9.1.0 ([#669](https://github.com/Endava/BEEQ/issues/669)) ([fe32eb8](https://github.com/Endava/BEEQ/commit/fe32eb842408d08228a62fe88c0799fae40b2cb4))
* **deps:** update dependency core-js to v3.35.0 ([#737](https://github.com/Endava/BEEQ/issues/737)) ([6f2802e](https://github.com/Endava/BEEQ/commit/6f2802e9dfbb7ad53b5145d1646538d1830eb3b1))
* **deps:** update dependency eslint-plugin-prettier to v5.1.0 ([#721](https://github.com/Endava/BEEQ/issues/721)) ([f8100f6](https://github.com/Endava/BEEQ/commit/f8100f6e2e65ec30936ea5cb0f50f16dc9a16559))
* **deps:** update dependency eslint-plugin-prettier to v5.1.2 ([#727](https://github.com/Endava/BEEQ/issues/727)) ([358fece](https://github.com/Endava/BEEQ/commit/358fece996031d3a971fb64a40880214002b4abc))
* **deps:** update dependency fs-extra to v11.2.0 ([#688](https://github.com/Endava/BEEQ/issues/688)) ([4cfe94d](https://github.com/Endava/BEEQ/commit/4cfe94ddaffdc3f13751b3472dde807297c34832))
* **deps:** update dependency lint-staged to v15.1.0 ([#648](https://github.com/Endava/BEEQ/issues/648)) ([27f5f8b](https://github.com/Endava/BEEQ/commit/27f5f8b5e8bb5ba159e3352a38d48cd8a34ca193))
* **deps:** update dependency lit-html to v3.0.2 ([#625](https://github.com/Endava/BEEQ/issues/625)) ([8a79f7b](https://github.com/Endava/BEEQ/commit/8a79f7b3046e843371db7d5a3d043e6f07f93e61))
* **deps:** update dependency ngx-deploy-npm to v7.1.0 ([#646](https://github.com/Endava/BEEQ/issues/646)) ([617a157](https://github.com/Endava/BEEQ/commit/617a157c982256dda120c62d4fe0c86377b98780))
* **deps:** update dependency npm to v10.2.3 ([#626](https://github.com/Endava/BEEQ/issues/626)) ([e5a72c9](https://github.com/Endava/BEEQ/commit/e5a72c9fbd5cf81be752cb536095f39ef835b259))
* **deps:** update dependency npm to v10.2.4 ([#666](https://github.com/Endava/BEEQ/issues/666)) ([bca70e2](https://github.com/Endava/BEEQ/commit/bca70e2287d6e5a3a78f3aa0346f905f035c56c0))
* **deps:** update dependency npm to v10.2.5 ([#702](https://github.com/Endava/BEEQ/issues/702)) ([c2ab33f](https://github.com/Endava/BEEQ/commit/c2ab33f32fbe865ec78e4388ef0259235fa8e54a))
* **deps:** update dependency plop to v4.0.1 ([#728](https://github.com/Endava/BEEQ/issues/728)) ([1b259f5](https://github.com/Endava/BEEQ/commit/1b259f52ea7bb6f07c2c4efc7e806b92904032a3))
* **deps:** update dependency postcss to v8.4.32 ([#686](https://github.com/Endava/BEEQ/issues/686)) ([ba1c22a](https://github.com/Endava/BEEQ/commit/ba1c22a3c49deeafc8f35594333e1e935a29d1fe))
* **deps:** update dependency postcss-preset-env to v9.3.0 ([#634](https://github.com/Endava/BEEQ/issues/634)) ([455ba28](https://github.com/Endava/BEEQ/commit/455ba284152023634da1ed6d932be897acf7a53c))
* **deps:** update dependency prettier to v3.1.0 ([#671](https://github.com/Endava/BEEQ/issues/671)) ([c73cb6d](https://github.com/Endava/BEEQ/commit/c73cb6dfa6c431950a64b8e3bafb4e26d79e10fd))
* **deps:** update dependency prettier to v3.1.1 ([#704](https://github.com/Endava/BEEQ/issues/704)) ([3c142bb](https://github.com/Endava/BEEQ/commit/3c142bb5903706f6494c395999b54768281c07e6))
* **deps:** update dependency prettier-plugin-tailwindcss to v0.5.10 ([#734](https://github.com/Endava/BEEQ/issues/734)) ([2a67824](https://github.com/Endava/BEEQ/commit/2a67824b4b3fac36806ccd58cd953e3293ffa7f1))
* **deps:** update dependency prettier-plugin-tailwindcss to v0.5.7 ([#642](https://github.com/Endava/BEEQ/issues/642)) ([e2963fb](https://github.com/Endava/BEEQ/commit/e2963fb6bf7e8906e0f7b32e9834a2243428387b))
* **deps:** update dependency prettier-plugin-tailwindcss to v0.5.9 ([#703](https://github.com/Endava/BEEQ/issues/703)) ([294768e](https://github.com/Endava/BEEQ/commit/294768e205d1118c6a7f342bf3330d6b9bc71d4d))
* **deps:** update dependency puppeteer to v21.5.0 ([#610](https://github.com/Endava/BEEQ/issues/610)) ([e5f18dd](https://github.com/Endava/BEEQ/commit/e5f18dd07ae2aa72723230fbb8ff80de2277799d))
* **deps:** update dependency puppeteer to v21.5.1 ([#643](https://github.com/Endava/BEEQ/issues/643)) ([c337184](https://github.com/Endava/BEEQ/commit/c3371840ff71fdf048ce7048611d295023b81264))
* **deps:** update dependency puppeteer to v21.5.2 ([#667](https://github.com/Endava/BEEQ/issues/667)) ([bf58282](https://github.com/Endava/BEEQ/commit/bf582821f18673f5da42bf6e3801c85957b6653b))
* **deps:** update dependency stylelint to v16.1.0 ([#738](https://github.com/Endava/BEEQ/issues/738)) ([b3f5245](https://github.com/Endava/BEEQ/commit/b3f52458ccfa574b94ee765d657e16c25d2fc2f4))
* **deps:** update dependency tailwindcss to v3.3.6 ([#693](https://github.com/Endava/BEEQ/issues/693)) ([6bc9cb4](https://github.com/Endava/BEEQ/commit/6bc9cb4bca53457d54cdbf41222cae8b4f7350c4))
* **deps:** update dependency tailwindcss to v3.4.0 ([#722](https://github.com/Endava/BEEQ/issues/722)) ([bb6e284](https://github.com/Endava/BEEQ/commit/bb6e28441e0221985bfb2e49418c3c9cf97f8d09))
* **deps:** update dependency tailwindcss-theme-swapper to v0.8.0 ([#649](https://github.com/Endava/BEEQ/issues/649)) ([609d116](https://github.com/Endava/BEEQ/commit/609d116b98ba049ccf538b303992de6b2198f7aa))
* **deps:** update dependency ts-node to v10.9.2 ([#705](https://github.com/Endava/BEEQ/issues/705)) ([16e86a0](https://github.com/Endava/BEEQ/commit/16e86a0117ef9fd101bd657ed5b74fb3618cb1a1))
* **deps:** update dependency vite to v5 ([#674](https://github.com/Endava/BEEQ/issues/674)) ([8947cc4](https://github.com/Endava/BEEQ/commit/8947cc4e7c08a202276026e1266e6d0a59f9b4f6))
* **deps:** update dependency vite to v5.0.10 ([#713](https://github.com/Endava/BEEQ/issues/713)) ([a5ef754](https://github.com/Endava/BEEQ/commit/a5ef75461581cbe8866f3195bf110d9d9620ee37))
* **deps:** update dependency vite to v5.0.4 ([#680](https://github.com/Endava/BEEQ/issues/680)) ([2f9bffa](https://github.com/Endava/BEEQ/commit/2f9bffa0ea3aefdf0a33a9eaec8a67ee2a075174))
* **deps:** update dependency vite to v5.0.7 ([#706](https://github.com/Endava/BEEQ/issues/706)) ([f57226c](https://github.com/Endava/BEEQ/commit/f57226c8a30a7c31f13069e5dd73b8c85b62b0ad))
* **deps:** update dependency vite-tsconfig-paths to v4.2.2 ([#707](https://github.com/Endava/BEEQ/issues/707)) ([ce95315](https://github.com/Endava/BEEQ/commit/ce95315f646c7401de3cb01274884d868ab07a8b))
* **deps:** update dependency vite-tsconfig-paths to v4.2.3 ([#735](https://github.com/Endava/BEEQ/issues/735)) ([17619eb](https://github.com/Endava/BEEQ/commit/17619ebd9036fb1f446470ee817fc663d6e408fb))
* **deps:** update dependency vue to v3.3.12 ([#714](https://github.com/Endava/BEEQ/issues/714)) ([0b0efdd](https://github.com/Endava/BEEQ/commit/0b0efdd5294eed40b2a48545c3221c6e6be29b4d))
* **deps:** update dependency vue to v3.3.13 ([#720](https://github.com/Endava/BEEQ/issues/720)) ([6b1c38a](https://github.com/Endava/BEEQ/commit/6b1c38af7d94f824e329bb9966802d77effdff4f))
* **deps:** update dependency vue to v3.3.8 ([#633](https://github.com/Endava/BEEQ/issues/633)) ([074e6c7](https://github.com/Endava/BEEQ/commit/074e6c76c72d05f76e9f6032d505ab20f2244d1e))
* **deps:** update dependency vue to v3.3.9 ([#681](https://github.com/Endava/BEEQ/issues/681)) ([033bc66](https://github.com/Endava/BEEQ/commit/033bc66ae2af5d267ca74829a11d581c3f224bdc))
* **deps:** update dependency vue to v3.4.3 ([#739](https://github.com/Endava/BEEQ/issues/739)) ([dc47a8a](https://github.com/Endava/BEEQ/commit/dc47a8a59733b41a9b67185d43ef1717b36c1eed))
* **deps:** update eslint ([#635](https://github.com/Endava/BEEQ/issues/635)) ([1aea8ce](https://github.com/Endava/BEEQ/commit/1aea8ce2537d3aab74b609f3e3e120789fece6cb))
* **deps:** update eslint ([#689](https://github.com/Endava/BEEQ/issues/689)) ([9d30fcc](https://github.com/Endava/BEEQ/commit/9d30fcc4f14bc82523a9851837d4955491becb34))
* **deps:** update node.js to v20.10.0 ([#684](https://github.com/Endava/BEEQ/issues/684)) ([b6b3aa4](https://github.com/Endava/BEEQ/commit/b6b3aa47072ea1e1bd14ad27660b548d0ea48f22))
* **deps:** update NPM dependencies ([#672](https://github.com/Endava/BEEQ/issues/672)) ([8921f90](https://github.com/Endava/BEEQ/commit/8921f90f094da5e26ab12579defa4e355297a099))
* **deps:** update Nx to v17.0.3 ([#627](https://github.com/Endava/BEEQ/issues/627)) ([03d418c](https://github.com/Endava/BEEQ/commit/03d418c50f21efcfcb8983036369d7c63a6b45a5))
* **deps:** update Nx to v17.1.1 and Angular to v17 ([#645](https://github.com/Endava/BEEQ/issues/645)) ([22b573c](https://github.com/Endava/BEEQ/commit/22b573c524561c8da87d30ed652744069ce60cdc))
* **deps:** update Nx to v17.1.2 ([#659](https://github.com/Endava/BEEQ/issues/659)) ([a11f1f7](https://github.com/Endava/BEEQ/commit/a11f1f7d8e9f9ae2f5968f35dbd47af15afe843e))
* **deps:** update nx to v17.1.3 ([#682](https://github.com/Endava/BEEQ/issues/682)) ([f5e143f](https://github.com/Endava/BEEQ/commit/f5e143f9b4cdc4dacc8b95a0c8973701735d7cfa))
* **deps:** update nx to v17.2.5 ([#717](https://github.com/Endava/BEEQ/issues/717)) ([2223f72](https://github.com/Endava/BEEQ/commit/2223f7203724a1c7188e3c7ab3fdb50dc8ae2b39))
* **deps:** update nx to v17.2.7 ([#729](https://github.com/Endava/BEEQ/issues/729)) ([c069576](https://github.com/Endava/BEEQ/commit/c0695763be6f2a3f866591dd3450d547241f56b3))
* **deps:** update nx to v17.2.8 ([#736](https://github.com/Endava/BEEQ/issues/736)) ([526a7d2](https://github.com/Endava/BEEQ/commit/526a7d2d45f8a2733c7b5f1a16043f90da22e04c))
* **deps:** update Stencil ([#622](https://github.com/Endava/BEEQ/issues/622)) ([478d2c1](https://github.com/Endava/BEEQ/commit/478d2c1a7bc94672f49a230a0a441b56f0d9530f))
* **deps:** update storybook to v7.5.3 ([#630](https://github.com/Endava/BEEQ/issues/630)) ([90c2691](https://github.com/Endava/BEEQ/commit/90c26914383f686cfd75802dd7594403ad540d59))
* **deps:** update storybook to v7.6.3 ([#690](https://github.com/Endava/BEEQ/issues/690)) ([19ade99](https://github.com/Endava/BEEQ/commit/19ade99a6c50fff8f866e2b579517f3230262a8f))
* **deps:** update storybook to v7.6.5 ([#716](https://github.com/Endava/BEEQ/issues/716)) ([196074e](https://github.com/Endava/BEEQ/commit/196074ecc8ac6df2be60ae9451290ba75e47828e))
* **deps:** update storybook to v7.6.6 ([#719](https://github.com/Endava/BEEQ/issues/719)) ([8018133](https://github.com/Endava/BEEQ/commit/80181337ba7b04cd5843c47871b7dfc6128d4c69))
* **deps:** update stylelint to v16 (major) ([#723](https://github.com/Endava/BEEQ/issues/723)) ([3b298b9](https://github.com/Endava/BEEQ/commit/3b298b9415b300d882fb4a037a71bdc0efff96c0))
* **deps:** update types react ([#637](https://github.com/Endava/BEEQ/issues/637)) ([416ee8f](https://github.com/Endava/BEEQ/commit/416ee8f7df5f956ffbfb0afa0b257931e2697819))
* **deps:** update types react ([#683](https://github.com/Endava/BEEQ/issues/683)) ([9dd52f3](https://github.com/Endava/BEEQ/commit/9dd52f3adab1e05a80a150d68d33fea3862c7852))
* **deps:** update types react ([#701](https://github.com/Endava/BEEQ/issues/701)) ([ad45337](https://github.com/Endava/BEEQ/commit/ad45337722e98703b719aa43e87ef03df5127ab0))
* **deps:** update typescript-eslint to v6.10.0 ([#613](https://github.com/Endava/BEEQ/issues/613)) ([aaa312b](https://github.com/Endava/BEEQ/commit/aaa312b82d1602ce48638806e42e16b9850e9ab0))

## [0.10.0](https://github.com/Endava/BEEQ/compare/v0.9.0...v0.10.0) (2023-11-01)


### Features ⚡️

* **BEEQ Vue:** add `@bee-q/vue` output target ([#619](https://github.com/Endava/BEEQ/issues/619)) ([c820b42](https://github.com/Endava/BEEQ/commit/c820b42f0d27b3a1c5355b16dfd9190d3f45de8c))


### Bug Fixes 🐞

* **Nx:** missing cache of BEEQ output targets folder output ([18f8aec](https://github.com/Endava/BEEQ/commit/18f8aeca561254170d3c4b971bdd9aff81a7cb5c))


### Chore ⚙️

* **deps:** update Angular to v16 (major) ([#615](https://github.com/Endava/BEEQ/issues/615)) ([3552bf1](https://github.com/Endava/BEEQ/commit/3552bf1548f3ddb83a09b328134db7bdbef29557))
* **deps:** update available patch and minor devDependencies ([#583](https://github.com/Endava/BEEQ/issues/583)) ([7719154](https://github.com/Endava/BEEQ/commit/771915472b33f1c1c2f1f80315cdb3184e4b500c))
* **deps:** update commitlint to v18 (major) ([#604](https://github.com/Endava/BEEQ/issues/604)) ([106b087](https://github.com/Endava/BEEQ/commit/106b087618f2b16148766001ee8b0d459e8d6e9b))
* **deps:** update dependency @nxext/stencil to v17.0.2 ([#617](https://github.com/Endava/BEEQ/issues/617)) ([f45e44d](https://github.com/Endava/BEEQ/commit/f45e44dffc3e7e794077655f10f9cd0b25c1e27a))
* **deps:** update dependency @stencil/core to v4.5.0 ([#584](https://github.com/Endava/BEEQ/issues/584)) ([c6960bb](https://github.com/Endava/BEEQ/commit/c6960bb9590e8a2efff3f10e6f6a3818b8ac2f3e))
* **deps:** update dependency @swc/core to v1.3.95 ([#602](https://github.com/Endava/BEEQ/issues/602)) ([f2a1cb6](https://github.com/Endava/BEEQ/commit/f2a1cb6ccc81ea486b37088e0e5f4b09185c02dc))
* **deps:** update dependency @swc/helpers to v0.5.3 ([#587](https://github.com/Endava/BEEQ/issues/587)) ([827cd33](https://github.com/Endava/BEEQ/commit/827cd33ada252104249e7a74da1f29ffd3b9f7f7))
* **deps:** update dependency @types/mdx to v2.0.9 ([#594](https://github.com/Endava/BEEQ/issues/594)) ([ab1214b](https://github.com/Endava/BEEQ/commit/ab1214b015b5729e9dec4a58b974266a2ddf6ae7))
* **deps:** update dependency @types/node to v20.8.10 ([#608](https://github.com/Endava/BEEQ/issues/608)) ([1f56a86](https://github.com/Endava/BEEQ/commit/1f56a86d01b014d019393cab2327c9214ba71988))
* **deps:** update dependency @types/node to v20.8.7 ([#582](https://github.com/Endava/BEEQ/issues/582)) ([1ee5b8f](https://github.com/Endava/BEEQ/commit/1ee5b8f6dfce8c5d380903f871b7f47f99a44bac))
* **deps:** update dependency @types/react to v18.2.29 ([#573](https://github.com/Endava/BEEQ/issues/573)) ([320ccaa](https://github.com/Endava/BEEQ/commit/320ccaad5c789423e0c7eac1908544650b9c4a3d))
* **deps:** update dependency @types/react to v18.2.33 ([#603](https://github.com/Endava/BEEQ/issues/603)) ([a6df95e](https://github.com/Endava/BEEQ/commit/a6df95ec99fe59b541bfc7a98fa8a09dc48537e3))
* **deps:** update dependency chromatic to v7.5.0 ([#580](https://github.com/Endava/BEEQ/issues/580)) ([ec86a52](https://github.com/Endava/BEEQ/commit/ec86a5212cce5a2a5f6397baae5f819fcfad797a))
* **deps:** update dependency chromatic to v7.5.4 ([#609](https://github.com/Endava/BEEQ/issues/609)) ([32334ae](https://github.com/Endava/BEEQ/commit/32334ae193dbedf278b3891dab002d9f94716650))
* **deps:** update dependency eslint to v8.52.0 ([#612](https://github.com/Endava/BEEQ/issues/612)) ([3ebf848](https://github.com/Endava/BEEQ/commit/3ebf848952dc36e9f490dc32a76dc40a91024e93))
* **deps:** update dependency eslint-plugin-storybook to v0.6.15 ([#588](https://github.com/Endava/BEEQ/issues/588)) ([a3be4b3](https://github.com/Endava/BEEQ/commit/a3be4b3cf3df16bd4efbb51a037a4269ebc38a74))
* **deps:** update dependency lint-staged to v15 ([#593](https://github.com/Endava/BEEQ/issues/593)) ([816df24](https://github.com/Endava/BEEQ/commit/816df2419eff5cf20208f5bc45f43f14d3c9a3a6))
* **deps:** update dependency lint-staged to v15.0.2 ([#595](https://github.com/Endava/BEEQ/issues/595)) ([f811271](https://github.com/Endava/BEEQ/commit/f811271cd2045c4ed45882a7df34e3301a05ed25))
* **deps:** update dependency lit-html to v3 ([#585](https://github.com/Endava/BEEQ/issues/585)) ([1738a3a](https://github.com/Endava/BEEQ/commit/1738a3ac3fec303ee9992fd4ea4f0414142354ab))
* **deps:** update dependency npm to v10.2.1 ([#596](https://github.com/Endava/BEEQ/issues/596)) ([e2bb329](https://github.com/Endava/BEEQ/commit/e2bb329711f2e41a3ec670433f21e43a33cd179c))
* **deps:** update dependency nx-stylelint to v16 ([#586](https://github.com/Endava/BEEQ/issues/586)) ([5e3ed98](https://github.com/Endava/BEEQ/commit/5e3ed98f9d2b17d6f30c510edd055c0b9c5f2bcb))
* **deps:** update dependency prettier-plugin-tailwindcss to v0.5.6 ([#592](https://github.com/Endava/BEEQ/issues/592)) ([505b784](https://github.com/Endava/BEEQ/commit/505b784aaac569bef79b25691022a0ca5de13f15))
* **deps:** update dependency puppeteer to v21.4.0 ([#578](https://github.com/Endava/BEEQ/issues/578)) ([ca12e01](https://github.com/Endava/BEEQ/commit/ca12e013932cc8f5221ef1b4a4583f90568aff0d))
* **deps:** update dependency stylelint to v15.11.0 ([#591](https://github.com/Endava/BEEQ/issues/591)) ([5fe5862](https://github.com/Endava/BEEQ/commit/5fe5862807c00c212eebde185417f05c99b66aad))
* **deps:** update dependency tailwindcss to v3.3.5 ([#607](https://github.com/Endava/BEEQ/issues/607)) ([aba7b8d](https://github.com/Endava/BEEQ/commit/aba7b8d9ab079094525368e81ce8ea049f317e0e))
* **deps:** update dependency vite to v4.5.0 ([#576](https://github.com/Endava/BEEQ/issues/576)) ([dcdd821](https://github.com/Endava/BEEQ/commit/dcdd821517d19c1d3106c4b9ad892f420acf0375))
* **deps:** update node.js to v18.18.2 ([#590](https://github.com/Endava/BEEQ/issues/590)) ([a7d296f](https://github.com/Endava/BEEQ/commit/a7d296f77e71c8be77938cb35767bbadf1cb7e6d))
* **deps:** update node.js to v20 ([#600](https://github.com/Endava/BEEQ/issues/600)) ([7ff3cf9](https://github.com/Endava/BEEQ/commit/7ff3cf96578853397170fc0120004871fd62b701))
* **deps:** update nx to v16.10.0 ([#574](https://github.com/Endava/BEEQ/issues/574)) ([605cde6](https://github.com/Endava/BEEQ/commit/605cde6237b20f91d66a60d8097a7d39f677d388))
* **deps:** update nx to v17 (major) ([#599](https://github.com/Endava/BEEQ/issues/599)) ([9233901](https://github.com/Endava/BEEQ/commit/9233901ea13835b074c895ae3e7ad74c0fb2c86a))
* **deps:** update stencil ([#606](https://github.com/Endava/BEEQ/issues/606)) ([214d156](https://github.com/Endava/BEEQ/commit/214d15610bd8be2924c3907a69a468fe6cff4b1f))
* **deps:** update Stencil to v4.7.0 ([#616](https://github.com/Endava/BEEQ/issues/616)) ([1231445](https://github.com/Endava/BEEQ/commit/12314454025ad86447d5820a8105b3b1c15699c2))
* **deps:** update storybook to v7.5.0 ([#589](https://github.com/Endava/BEEQ/issues/589)) ([3534d0e](https://github.com/Endava/BEEQ/commit/3534d0ed09e31e7a8f55976e1e73bda11b9c3a50))
* **deps:** update storybook to v7.5.1 ([#597](https://github.com/Endava/BEEQ/issues/597)) ([099a71e](https://github.com/Endava/BEEQ/commit/099a71e40e204d764ab6c17583a46203cc0073d0))
* **deps:** update storybook to v7.5.2 ([#618](https://github.com/Endava/BEEQ/issues/618)) ([9c6a3bf](https://github.com/Endava/BEEQ/commit/9c6a3bf7ae978673b805d26ceebc1945cb48d93c))
* **deps:** update types react ([#598](https://github.com/Endava/BEEQ/issues/598)) ([c82e24a](https://github.com/Endava/BEEQ/commit/c82e24a518abf495fb8f13911c10f723dac46bb8))

## [0.9.0](https://github.com/Endava/BEEQ/compare/v0.8.2...v0.9.0) (2023-10-11)


### Features ⚡️

* **Colors:** add new `alt` and `alt-disabled` color tokens ([#505](https://github.com/Endava/BEEQ/issues/505)) ([b5f67b0](https://github.com/Endava/BEEQ/commit/b5f67b099b844b8279fd5f10767e2592f20c4db8))
* **Steps:** add `bq-steps` and `bq-step-item` components ([#532](https://github.com/Endava/BEEQ/issues/532)) ([7c9ac7b](https://github.com/Endava/BEEQ/commit/7c9ac7b9c02bccbf0f7dd09774b0bcc956a186af))
* **Theme:** add Endava theme ([#567](https://github.com/Endava/BEEQ/issues/567)) ([619df05](https://github.com/Endava/BEEQ/commit/619df05cf313357309a5c21aa36072af617b638b))


### Bug Fixes 🐞

* **Form Inputs:**  hide label containers if no slot passed ([#569](https://github.com/Endava/BEEQ/issues/569)) ([e41a9d1](https://github.com/Endava/BEEQ/commit/e41a9d18b623d1b6056d25437c4d7311bb7144cf))
* **Tooltip:** add z-index to the tooltip panel ([#570](https://github.com/Endava/BEEQ/issues/570)) ([fb3fb41](https://github.com/Endava/BEEQ/commit/fb3fb416f7cf10dc13d55674243296a0a19d844a))


### Chore ⚙️

* **deps:** update [@nx](https://github.com/nx) to v16.7.4 ([#504](https://github.com/Endava/BEEQ/issues/504)) ([94a6a2d](https://github.com/Endava/BEEQ/commit/94a6a2d22e9fca62c7a72ff2520866974a014b64))
* **deps:** update [@nx](https://github.com/nx) to v16.8.1 ([#548](https://github.com/Endava/BEEQ/issues/548)) ([95d4a16](https://github.com/Endava/BEEQ/commit/95d4a16a367bf098b914713775b0574c234f12bb))
* **deps:** update [@stencil](https://github.com/stencil) ([#541](https://github.com/Endava/BEEQ/issues/541)) ([7184453](https://github.com/Endava/BEEQ/commit/71844535022c9445ca8e688628aef2628397244c))
* **deps:** update [@storybook](https://github.com/storybook) to v7.4.0 ([#507](https://github.com/Endava/BEEQ/issues/507)) ([49b26c6](https://github.com/Endava/BEEQ/commit/49b26c61ca3acf74c9fa6f8f6579032c2dc722fe))
* **deps:** update [@storybook](https://github.com/storybook) to v7.4.5 ([#550](https://github.com/Endava/BEEQ/issues/550)) ([528ed53](https://github.com/Endava/BEEQ/commit/528ed5321952bbb19e10cdd15708eb5744009cfe))
* **deps:** update [@swc](https://github.com/swc) ([#506](https://github.com/Endava/BEEQ/issues/506)) ([b8b085a](https://github.com/Endava/BEEQ/commit/b8b085a6cd2c092f6520fcbebf50ec62e74c3db5))
* **deps:** update [@swc](https://github.com/swc) ([#544](https://github.com/Endava/BEEQ/issues/544)) ([7cdab0e](https://github.com/Endava/BEEQ/commit/7cdab0e2ce74381d68616298644ad925517c2f7b))
* **deps:** update actions/checkout action to v4 ([#563](https://github.com/Endava/BEEQ/issues/563)) ([a343354](https://github.com/Endava/BEEQ/commit/a3433546979aef668911798280892fe57cd01a2a))
* **deps:** update aws-actions/configure-aws-credentials action to v4 ([#557](https://github.com/Endava/BEEQ/issues/557)) ([15bd2ca](https://github.com/Endava/BEEQ/commit/15bd2ca35c0fa292baa5be5126cafa7628469b20))
* **deps:** update dependency @babel/preset-react to v7.22.15 ([#538](https://github.com/Endava/BEEQ/issues/538)) ([40ceb2f](https://github.com/Endava/BEEQ/commit/40ceb2f3138c2abc93c331448bc2b94441a980fa))
* **deps:** update dependency @floating-ui/dom to v1.5.3 ([#551](https://github.com/Endava/BEEQ/issues/551)) ([b9248fa](https://github.com/Endava/BEEQ/commit/b9248fa79bdae64e6ec142661cf7fbb151e491fc))
* **deps:** update dependency @stencil/core to v4.3.0 ([#552](https://github.com/Endava/BEEQ/issues/552)) ([fb3c466](https://github.com/Endava/BEEQ/commit/fb3c4667859fa0c407aecb83f02a3f3693210b8e))
* **deps:** update dependency @swc/core to v1.3.80 ([#524](https://github.com/Endava/BEEQ/issues/524)) ([3e1c179](https://github.com/Endava/BEEQ/commit/3e1c179fd337efb114ab1edd605beee1aee40016))
* **deps:** update dependency @swc/core to v1.3.81 ([#534](https://github.com/Endava/BEEQ/issues/534)) ([e7a8960](https://github.com/Endava/BEEQ/commit/e7a89601816f8fae72a27f9b9fee1005e9c81788))
* **deps:** update dependency @types/mdx to v2.0.7 ([#518](https://github.com/Endava/BEEQ/issues/518)) ([b96eda7](https://github.com/Endava/BEEQ/commit/b96eda7649d13bb3d30a541482f7eaacc9a2059f))
* **deps:** update dependency @types/node to v20.5.1 ([#510](https://github.com/Endava/BEEQ/issues/510)) ([f298c1c](https://github.com/Endava/BEEQ/commit/f298c1c9ecfd2e659820398e3d6ef0f90041d412))
* **deps:** update dependency @types/node to v20.5.2 ([#517](https://github.com/Endava/BEEQ/issues/517)) ([526f48f](https://github.com/Endava/BEEQ/commit/526f48f1ff1de65e23c1329c4ac51f5f92078ebc))
* **deps:** update dependency @types/node to v20.5.3 ([#520](https://github.com/Endava/BEEQ/issues/520)) ([fa0ac02](https://github.com/Endava/BEEQ/commit/fa0ac02a5b33067764f536a16608098132a84d77))
* **deps:** update dependency @types/node to v20.5.4 ([#521](https://github.com/Endava/BEEQ/issues/521)) ([c6ed30e](https://github.com/Endava/BEEQ/commit/c6ed30ec5ea11207526ab813672d3d3f587ca45b))
* **deps:** update dependency @types/node to v20.5.6 ([#523](https://github.com/Endava/BEEQ/issues/523)) ([4e33116](https://github.com/Endava/BEEQ/commit/4e331162481912f87407b194fab65bfd1b56472a))
* **deps:** update dependency @types/node to v20.5.7 ([#526](https://github.com/Endava/BEEQ/issues/526)) ([f171c87](https://github.com/Endava/BEEQ/commit/f171c8750c2e2d9cc0e9da7964fa7efec832283c))
* **deps:** update dependency @types/node to v20.5.8 ([#537](https://github.com/Endava/BEEQ/issues/537)) ([5a846e1](https://github.com/Endava/BEEQ/commit/5a846e1edd79624ad6c97b53262d3cf525bd719e))
* **deps:** update dependency @types/react to v18.2.21 ([#519](https://github.com/Endava/BEEQ/issues/519)) ([10e9729](https://github.com/Endava/BEEQ/commit/10e972993f7634e2cf5893e03bc2ae71a68e397b))
* **deps:** update dependency chromatic to v6.23.0 ([#516](https://github.com/Endava/BEEQ/issues/516)) ([f42c80d](https://github.com/Endava/BEEQ/commit/f42c80d8cc16d89eed0c1106aec4e18bbbc701ab))
* **deps:** update dependency chromatic to v7 ([#527](https://github.com/Endava/BEEQ/issues/527)) ([69eb810](https://github.com/Endava/BEEQ/commit/69eb810ffd8d633cb3a3b560fa5811e6ced2e265))
* **deps:** update dependency core-js to v3.32.1 ([#511](https://github.com/Endava/BEEQ/issues/511)) ([7c1c759](https://github.com/Endava/BEEQ/commit/7c1c7590e410f5fff6b58b8a72487bc8a0316c6a))
* **deps:** update dependency eslint to v8.48.0 ([#525](https://github.com/Endava/BEEQ/issues/525)) ([0af0098](https://github.com/Endava/BEEQ/commit/0af00981e18620db65d89b3536698b9cc9975a28))
* **deps:** update dependency eslint to v8.50.0 ([#554](https://github.com/Endava/BEEQ/issues/554)) ([670a537](https://github.com/Endava/BEEQ/commit/670a53719fa989708ace239a3160e5c735ddb34a))
* **deps:** update dependency eslint-plugin-import to v2.28.1 ([#513](https://github.com/Endava/BEEQ/issues/513)) ([86d8ce6](https://github.com/Endava/BEEQ/commit/86d8ce6be90efe2b700258e420c8a72d02048fac))
* **deps:** update dependency eslint-plugin-react to v7.33.2 ([#500](https://github.com/Endava/BEEQ/issues/500)) ([ec629a1](https://github.com/Endava/BEEQ/commit/ec629a177a828f3c3ce7652eee389f530ecda2cf))
* **deps:** update dependency lint-staged to v14.0.1 ([#514](https://github.com/Endava/BEEQ/issues/514)) ([25b2ab1](https://github.com/Endava/BEEQ/commit/25b2ab1c31fff27bf2e287dc838a32da19701b70))
* **deps:** update dependency npm to v10 ([#564](https://github.com/Endava/BEEQ/issues/564)) ([cf36312](https://github.com/Endava/BEEQ/commit/cf363126750e8027f7f09c4819656eb068bfac44))
* **deps:** update dependency npm to v10.2.0 ([#568](https://github.com/Endava/BEEQ/issues/568)) ([6835245](https://github.com/Endava/BEEQ/commit/6835245fc1d1fed205e447cf40c33a821da996cc))
* **deps:** update dependency nx-cloud to v16.4.0 ([#528](https://github.com/Endava/BEEQ/issues/528)) ([a0c54a5](https://github.com/Endava/BEEQ/commit/a0c54a563caebe78a3dc04eb8e16ad26a20ef442))
* **deps:** update dependency postcss to v8.4.29 ([#533](https://github.com/Endava/BEEQ/issues/533)) ([3b85622](https://github.com/Endava/BEEQ/commit/3b85622f40927ad8bc374c0f1cd33aa79e3a016b))
* **deps:** update dependency postcss-preset-env to v9.1.2 ([#529](https://github.com/Endava/BEEQ/issues/529)) ([313519d](https://github.com/Endava/BEEQ/commit/313519db47adbd8bb40d488d9be89811dbf7071e))
* **deps:** update dependency puppeteer to v21.1.0 ([#508](https://github.com/Endava/BEEQ/issues/508)) ([9389c9b](https://github.com/Endava/BEEQ/commit/9389c9b57cd85013e034318dae529f4e33295e89))
* **deps:** update dependency puppeteer to v21.1.1 ([#530](https://github.com/Endava/BEEQ/issues/530)) ([ac74f5e](https://github.com/Endava/BEEQ/commit/ac74f5e6a873a516de12a078830b51e7edef01f3))
* **deps:** update dependency stylelint to v15.10.3 ([#509](https://github.com/Endava/BEEQ/issues/509)) ([996b963](https://github.com/Endava/BEEQ/commit/996b963c9eddeb433c521c69ffde2710ffa0c1d2))
* **deps:** update dependency tslib to v2.6.2 ([#512](https://github.com/Endava/BEEQ/issues/512)) ([dba1672](https://github.com/Endava/BEEQ/commit/dba1672a1fc2f0b220a31bf5222a1b00517cc8c3))
* **deps:** update dependency vite-plugin-turbosnap to v1.0.3 ([#546](https://github.com/Endava/BEEQ/issues/546)) ([07458d9](https://github.com/Endava/BEEQ/commit/07458d92ee2c4924da67245746fe1ff66f0b22a5))
* **deps:** update node.js to v18.18.0 ([#562](https://github.com/Endava/BEEQ/issues/562)) ([7a62da8](https://github.com/Endava/BEEQ/commit/7a62da89b7aa634b8942c169620bbd8ac31280f6))
* **deps:** update nx orb to v1.6.2 ([#553](https://github.com/Endava/BEEQ/issues/553)) ([20c01c2](https://github.com/Endava/BEEQ/commit/20c01c28b30d52626e26f29b73257ce7cfd8b765))
* **deps:** update Nx to v16.9.1 ([#561](https://github.com/Endava/BEEQ/issues/561)) ([1f1504d](https://github.com/Endava/BEEQ/commit/1f1504d8421b533318459a17df270a3f62456c26))
* **deps:** update storybook to v7.4.6 ([#566](https://github.com/Endava/BEEQ/issues/566)) ([597ebed](https://github.com/Endava/BEEQ/commit/597ebedff3d7fbc195c27a1de157a1711b915df3))
* **deps:** update typescript eslint to v6.4.1 ([#515](https://github.com/Endava/BEEQ/issues/515)) ([0e98bff](https://github.com/Endava/BEEQ/commit/0e98bffaaaccf2b239264ea15bc0df33fbd0dd9b))
* **deps:** update typescript eslint to v6.5.0 ([#531](https://github.com/Endava/BEEQ/issues/531)) ([aa5e604](https://github.com/Endava/BEEQ/commit/aa5e60408182ac20cc8d57258f6960ef4cbfbb1a))
* **deps:** update volta-cli/action action to v4 ([#565](https://github.com/Endava/BEEQ/issues/565)) ([4312c58](https://github.com/Endava/BEEQ/commit/4312c58e4478284976952547c60284598df2d863))
* **ESLint:** improve modules import ([#503](https://github.com/Endava/BEEQ/issues/503)) ([2057420](https://github.com/Endava/BEEQ/commit/2057420850925552d0d53ab44a7107e768c0f9ec))

## [0.8.2](https://github.com/Endava/BEEQ/compare/v0.8.1...v0.8.2) (2023-09-01)


### Bug Fixes 🐞

* **debounce:** cancel is not a function ([#502](https://github.com/Endava/BEEQ/issues/502)) ([645a25f](https://github.com/Endava/BEEQ/commit/645a25f0e13101be6e0971d69fe44a63cf15248e))
* **ESM loader:** wrong script src path ([c76de5a](https://github.com/Endava/BEEQ/commit/c76de5a32dda20f6e516d5a3b8cd6f7b12e578ea))


### Documentation 📚

* **Storybook:** improve styles and BEEQ light/dark mode ([#501](https://github.com/Endava/BEEQ/issues/501)) ([8568f0e](https://github.com/Endava/BEEQ/commit/8568f0e75cbb7644fe53e66d522c53bd0e9ba4cf))


### Style 🎨

* **CSS:** set HTML font base to 1rem ([#474](https://github.com/Endava/BEEQ/issues/474)) ([caee9e4](https://github.com/Endava/BEEQ/commit/caee9e49aeafe6c09ebb729676fe6f8d78dce197))


### Chore ⚙️

* **deps:** update [@commitlint](https://github.com/commitlint) to v17.7.0 ([#481](https://github.com/Endava/BEEQ/issues/481)) ([e30a9c9](https://github.com/Endava/BEEQ/commit/e30a9c97e559077cae55e7f3bd73b4e182b3bd6e))
* **deps:** update dependency @commitlint/cli to v17.7.1 ([#488](https://github.com/Endava/BEEQ/issues/488)) ([f5397b6](https://github.com/Endava/BEEQ/commit/f5397b640b6a57dee0560556a7039b36f64253c0))
* **deps:** update dependency @stencil/core to v4.1.0 ([#470](https://github.com/Endava/BEEQ/issues/470)) ([2bdb09f](https://github.com/Endava/BEEQ/commit/2bdb09f4f70c8398b81377749227404d5c61826c))
* **deps:** update dependency @swc/core to v1.3.74 ([#458](https://github.com/Endava/BEEQ/issues/458)) ([87f10b1](https://github.com/Endava/BEEQ/commit/87f10b146aa5172d57e1791147f7a112d4fb83b2))
* **deps:** update dependency @swc/core to v1.3.75 ([#476](https://github.com/Endava/BEEQ/issues/476)) ([2a9bae0](https://github.com/Endava/BEEQ/commit/2a9bae025d23bf63772eab39d9629712a1153f21))
* **deps:** update dependency @swc/core to v1.3.76 ([#487](https://github.com/Endava/BEEQ/issues/487)) ([4bc0e67](https://github.com/Endava/BEEQ/commit/4bc0e678dccebe2f8bb2f2c0a0b3a83334354cb4))
* **deps:** update dependency @swc/core to v1.3.77 ([#499](https://github.com/Endava/BEEQ/issues/499)) ([dd9a03c](https://github.com/Endava/BEEQ/commit/dd9a03cfece7a16c3d0465a7025be445d35fd253))
* **deps:** update dependency @types/mdx to v2.0.6 ([#478](https://github.com/Endava/BEEQ/issues/478)) ([64c171f](https://github.com/Endava/BEEQ/commit/64c171f705bac1d24229b59b87117c5e03248b71))
* **deps:** update dependency @types/node to v20.4.8 ([#456](https://github.com/Endava/BEEQ/issues/456)) ([cb0446c](https://github.com/Endava/BEEQ/commit/cb0446cc0b3b1012fdd68764eaee8d212fca1df3))
* **deps:** update dependency @types/node to v20.5.0 ([#480](https://github.com/Endava/BEEQ/issues/480)) ([a430eae](https://github.com/Endava/BEEQ/commit/a430eae855fd3701b0e279ecbfddb625ba346bd4))
* **deps:** update dependency @types/react to v18.2.20 ([#477](https://github.com/Endava/BEEQ/issues/477)) ([e5740c7](https://github.com/Endava/BEEQ/commit/e5740c7279d988025919612375ccad7312e6d520))
* **deps:** update dependency autoprefixer to v10.4.15 ([#486](https://github.com/Endava/BEEQ/issues/486)) ([f449fa0](https://github.com/Endava/BEEQ/commit/f449fa0532becd65db5f56835f24a6123354507a))
* **deps:** update dependency chromatic to v6.21.0 ([#473](https://github.com/Endava/BEEQ/issues/473)) ([19fb4a6](https://github.com/Endava/BEEQ/commit/19fb4a62d39b877c186062feb8e578385038083e))
* **deps:** update dependency chromatic to v6.22.0 ([#497](https://github.com/Endava/BEEQ/issues/497)) ([f84dcbf](https://github.com/Endava/BEEQ/commit/f84dcbf9c405dcf191bd6fc313167390120d9f54))
* **deps:** update dependency eslint to v8.47.0 ([#491](https://github.com/Endava/BEEQ/issues/491)) ([9524476](https://github.com/Endava/BEEQ/commit/9524476684ab1cebad89bc2f5af7a9f1bb260291))
* **deps:** update dependency lint-staged to v13.3.0 ([#492](https://github.com/Endava/BEEQ/issues/492)) ([06f5429](https://github.com/Endava/BEEQ/commit/06f5429550771f9972686806bed88eb87da9ed4b))
* **deps:** update dependency lint-staged to v14 ([#493](https://github.com/Endava/BEEQ/issues/493)) ([6571b73](https://github.com/Endava/BEEQ/commit/6571b73820762528300c8ccaf4b83a3101785039))
* **deps:** update dependency ngx-deploy-npm to v7 ([#471](https://github.com/Endava/BEEQ/issues/471)) ([906f3bc](https://github.com/Endava/BEEQ/commit/906f3bce5fb0f2ce0451c4f190b7e93c67d7ac83))
* **deps:** update dependency ngx-deploy-npm to v7.0.1 ([#489](https://github.com/Endava/BEEQ/issues/489)) ([83b770e](https://github.com/Endava/BEEQ/commit/83b770e59d6960e19e22f03f7e365ab8ca141af3))
* **deps:** update dependency nx-cloud to v16.3.0 ([#484](https://github.com/Endava/BEEQ/issues/484)) ([3f210a5](https://github.com/Endava/BEEQ/commit/3f210a5a46417cc7d7cd4022cef4bacf52257a84))
* **deps:** update dependency postcss to v8.4.28 ([#496](https://github.com/Endava/BEEQ/issues/496)) ([93269f5](https://github.com/Endava/BEEQ/commit/93269f54220590b2a0ede82b79bf23941453b9b3))
* **deps:** update dependency postcss-preset-env to v9.1.1 ([#465](https://github.com/Endava/BEEQ/issues/465)) ([a7c9edc](https://github.com/Endava/BEEQ/commit/a7c9edc3515e816952d3f3c6abd3dcef3681ac00))
* **deps:** update dependency puppeteer to v21.0.2 ([#479](https://github.com/Endava/BEEQ/issues/479)) ([e0a0955](https://github.com/Endava/BEEQ/commit/e0a0955e8a2541335c167472b0947b8895f65159))
* **deps:** update dependency puppeteer to v21.0.3 ([#490](https://github.com/Endava/BEEQ/issues/490)) ([419c294](https://github.com/Endava/BEEQ/commit/419c2944e7458dd739ae66bd1d03c542b5bc8b65))
* **deps:** update dependency vite to v4.4.9 ([#472](https://github.com/Endava/BEEQ/issues/472)) ([ceb5a87](https://github.com/Endava/BEEQ/commit/ceb5a878280f906e04e23f19f6e80ac6f704c6c6))
* **deps:** update eslint ([#482](https://github.com/Endava/BEEQ/issues/482)) ([fa06af1](https://github.com/Endava/BEEQ/commit/fa06af14c30111c342ba15515bbe9379bb359c84))
* **deps:** update node.js to v18.17.1 ([#483](https://github.com/Endava/BEEQ/issues/483)) ([ce0aa56](https://github.com/Endava/BEEQ/commit/ce0aa564257d3a5925600c2ff0d575418148e174))
* **deps:** update typescript eslint to v6.3.0 ([#475](https://github.com/Endava/BEEQ/issues/475)) ([c1dd862](https://github.com/Endava/BEEQ/commit/c1dd862eddc16e7f9461158334e6515edad745e1))
* **deps:** update typescript eslint to v6.4.0 ([#495](https://github.com/Endava/BEEQ/issues/495)) ([fff3354](https://github.com/Endava/BEEQ/commit/fff335451def9abd4b7ba7ac217dfa20bbc11c72))

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
