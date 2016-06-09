`npm-tarball`
---

<p align="right">
  <a href="https://npmjs.org/package/npm-tarball">
    <img src="https://img.shields.io/npm/v/npm-tarball.svg?style=flat-square">
  </a>
  <a href="https://travis-ci.org/59naga/npm-tarball">
    <img src="http://img.shields.io/travis/59naga/npm-tarball.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/59naga/npm-tarball/coverage">
    <img src="https://img.shields.io/codeclimate/github/59naga/npm-tarball.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/59naga/npm-tarball">
    <img src="https://img.shields.io/codeclimate/coverage/github/59naga/npm-tarball.svg?style=flat-square">
  </a>
  <a href="https://gemnasium.com/59naga/npm-tarball">
    <img src="https://img.shields.io/gemnasium/59naga/npm-tarball.svg?style=flat-square">
  </a>
</p>

Download tarball of npm registry with stream/promise api

Installation
---
```bash
npm install npm-tarball --save
```

API
---

  * `resolveUri(packageName, semver)` -> `Promise<uri>`

  ```js
  import {resolveUri} from 'npm-tarball'

  resolveUri('jquery').then(uri => console.log(uri))
  // https://registry.npmjs.org/jquery/-/jquery-2.2.4.tgz

  resolveUri('jquery', 1).then(uri => console.log(uri))
  // https://registry.npmjs.org/jquery/-/jquery-1.12.4.tgz

  resolveUri('jquery', '~2.1').then(uri => console.log(uri))
  // https://registry.npmjs.org/jquery/-/jquery-2.1.4.tgz
  ```

  * `fetch(packageName, semver)` -> `Promise<tarballBuffer>`

  ```js
  import {fetch} from 'npm-tarball'
  import {writeFileSync} from 'fs'

  fetch('jquery').then(buffer => writeFileSync('jquery-latest.tgz', buffer))
  fetch('jquery', 1).then(buffer => writeFileSync('jquery-v1.tgz', buffer))
  fetch('jquery', '~2.1').then(buffer => writeFileSync('jquery-v2.1.tgz', buffer))
  ```

  * `new NpmTarball(packageName, semver)` -> `tarballReadableStream`
  * `createReadStream(packageName, semver)` -> `tarballReadableStream`

  ```js
  import {createReadStream} from 'npm-tarball'
  import {createWriteStream} from 'fs'

  createReadStream('jquery').pipe(createWriteStream('jquery-latest.tgz'))
  createReadStream('jquery', 1).pipe(createWriteStream('jquery-v1.tgz'))
  createReadStream('jquery', '~2.1').pipe(createWriteStream('jquery-v2.1.tgz'))
  ```

Development
---
Requirement global
* NodeJS v5.11.1
* Npm v3.8.6 (or [pnpm](https://github.com/rstacruz/pnpm))

```bash
git clone https://github.com/59naga/npm-tarball
cd npm-tarball
npm install

npm test
npm run lint
```

License
---
[MIT](http://59naga.mit-license.org/)
