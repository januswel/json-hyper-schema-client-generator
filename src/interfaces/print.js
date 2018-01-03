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
export default class Client {
  constructor(host: string) {
    this.host = host
  }

  static makeQueryString(requestBody: Object) {
    return Object.keys(requestBody)
      .map(key => \`\${key}=\${encodeURIComponent(requestBody[key])}\`)
      .join('&')
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

  const requestBody = (() => {
    switch (api.contentType) {
      case 'application/json':
        return 'JSON.stringify(requestBody)'
      case 'application/x-www-form-urlencoded':
        return 'Client.makeQueryString(requestBody)'
    }
  })()

  const queryString = api.method === 'GET' ? `?\${${requestBody}}` : ''
  const optionBody = api.method !== 'GET' ? `body: ${requestBody},` : ''

  console.log(`
  ${api.name}(requestBody: ${requestBodyTypeName}) {
    return fetch(\`\${this.host}${api.endpoint}${queryString}\`, {
      method: '${api.method}',
      ${optionBody}
    })
      .then(response => response.json())
      .catch(err => {
        throw err
      })
  }`)
}

const printWithoutRequestBody = api => {
  console.log(`
  ${api.name}() {
    return fetch(\`\${this.host}${api.endpoint}\`, {
      method: '${api.method}',
    })
      .then(response => response.json())
      .catch(err => {
        throw err
      })
  }`)
}

export default printInterfaces
