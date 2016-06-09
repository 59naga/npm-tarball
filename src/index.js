import request from 'request'
import {format} from 'util'
import {maxSatisfying} from 'semver'
import {PassThrough} from 'stream'

export function resolveUri (name, range) {
  const api = 'https://registry.npmjs.org/%s/%s'
  const uri = format(api, name, '')

  return new Promise((resolve, reject) => {
    request(uri, {json: true}, (error, {body: data}) => {
      if (error) {
        reject(error)
        return
      }
      if (data.versions === undefined) {
        reject(new Error(`non-existent package "${name}"`))
        return
      }

      const versions = Object.keys(data.versions)
      if (range == null) {
        const version = data['dist-tags'].latest
        const tarballUri = format(api, name, `-/${name}-${version}.tgz`)
        resolve(tarballUri)
        return
      }

      const rangeValue = range != null ? String(range) : null
      const version = maxSatisfying(versions, rangeValue)
      if (version === null) {
        reject(new TypeError(`Invalid Version: ${versions.join(', ')}`))
        return
      }
      const tarballUri = format(api, name, `-/${name}-${version}.tgz`)
      resolve(tarballUri)
    })
  })
}

export function fetch (...args) {
  return resolveUri(...args).then(uri => {
    return new Promise((resolve, reject) => {
      request(uri, {encoding: null}, (error, {body: buffer}) => {
        if (error) {
          reject(error)
          return
        }
        resolve(buffer)
      })
    })
  })
}

export class NpmTarball extends PassThrough {
  constructor (...args) {
    super()

    resolveUri(...args)
    .then(uri => request(uri).pipe(this))
  }
}

export function createReadStream (...args) {
  return new NpmTarball(...args)
}
