// @flow

import printTypeDefinitions from '../type-definitions/print'

import type { Interface } from './parse'

const printInterfaces = (interfaces: Array<Interface>) => {
  interfaces.forEach(api => {
    if (api.requestBody) {
      printTypeDefinitions(api.requestBody)
    }
  })

  console.log(`
class Client {
  constructor(host: string) {
    this.host = host
  }`)
  interfaces.forEach(api => {
    if (api.requestBody) {
      printWithRequestBody(api)
    } else {
      printWithoutRequestBody(api)
    }
  })
  console.log('}')
}

const printWithRequestBody = api => {
  if (!api.requestBody) {
    throw new Error('this route is not reached')
  }
  const requestBodyTypeName = Object.keys(api.requestBody)[0]
  console.log(`
  ${api.name}(requestBody: ${requestBodyTypeName}) {
    return fetch(\`\${this.host}\`${api.endpoint}, {
      method: ${api.method},
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .cacth(err => {
        throw err
      })
  }`)
}

const printWithoutRequestBody = api => {
  console.log(`
  ${api.name}() {
    return fetch(\`\${this.host}\`${api.endpoint}, {
      method: '${api.method}',
    })
      .then(response => response.json())
      .cacth(err => {
        throw err
      })
  }`)
}

export default printInterfaces
