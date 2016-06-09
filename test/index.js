import parallel from 'mocha.parallel'
import assert from 'assert'
import {createGunzip} from 'zlib'
import {Parse as tarParse} from 'tar'
import streamToPromise from 'stream-to-promise'
import {createReadStream as streamify} from 'streamifier'

// target
import {resolveUri, fetch, NpmTarball} from '../src'

// helper
const fixture = 'babel-plugin-add-module-exports'
const extractPackageJson = (tarballStream, callback) => {
  return new Promise((resolve, reject) => {
    tarballStream
    .pipe(createGunzip())
    .pipe(
      tarParse()
      .on('entry', (entry) => {
        if (entry.path === 'package/package.json') {
          streamToPromise(entry).then(buffer => resolve(JSON.parse(buffer)))
        }
      })
      .on('error', (error) => { reject(error) })
    )
  })
}
const extractPackageJsonViaNpmRegistory = (...args) => {
  return extractPackageJson(new NpmTarball(...args))
}

// specs
parallel('.resolveUri', () => {
  const expectedPrefix = 'https://registry.npmjs.org/babel-plugin-add-module-exports/-/babel-plugin-add-module-exports-'
  it('should return the latest version', async () => {
    assert((await resolveUri(fixture)) === `${expectedPrefix}0.2.1.tgz`)
  })
  it('should interpret the range of semver', async () => {
    assert((await resolveUri(fixture, '4')) === `${expectedPrefix}0.2.1.tgz`)
    assert((await resolveUri(fixture, '1 || 2 || 3')) === `${expectedPrefix}0.2.1.tgz`)
    assert((await resolveUri(fixture, '0.x')) === `${expectedPrefix}0.2.1.tgz`)
    assert((await resolveUri(fixture, '0.2')) === `${expectedPrefix}0.2.1.tgz`)
    assert((await resolveUri(fixture, '0.1.x')) === `${expectedPrefix}0.1.4.tgz`)
    assert((await resolveUri(fixture, '^0.1.0')) === `${expectedPrefix}0.1.4.tgz`)
    assert((await resolveUri(fixture, '~0.0')) === `${expectedPrefix}0.0.4.tgz`)
  })
})

parallel('.fetch', () => {
  it('should return "tarball buffer" using `.fetch`', async () => {
    const buffer = await fetch(fixture)
    const info = await extractPackageJson(streamify(buffer))
    assert(info.version === '0.2.1')
  })
})

parallel('.NpmTarball', () => {
  it('should return ReadableStream using `.NpmTarball`', async () => {
    const info = await extractPackageJsonViaNpmRegistory(fixture)
    assert(info.version === '0.2.1')
  })
})
