import request from 'request'
import {format} from 'util'
import {maxSatisfying as maxSatisfyingVersion} from 'semver'
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

      const versions = Object.keys(data.versions)
      const version = maxSatisfyingVersion(versions, range) || data['dist-tags'].latest

      resolve(format(api, name, `-/${name}-${version}.tgz`))
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
