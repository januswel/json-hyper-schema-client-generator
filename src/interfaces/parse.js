// @flow

import { parseJsonSchemaDefinition } from '../type-definitions/parse'

export type Interface = {
  name: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  contentType?: string,
  description?: string,
  requestBody?: {
    [name: string]: string | Object,
  },
}

const parseJsonSchemaLinks = (links: JsonSchemaLinks) =>
  links.map(link => parseJsonSchemaLink(link))

const parseJsonSchemaLink = (link: JsonSchemaLink) => {
  const name = makeInterfaceName(link.title)
  const result: Interface = {
    name,
    method: 'GET',
    endpoint: link.href,
  }
  if (link.method) {
    result.method = link.method
  }
  if (link.encType) {
    result.contentType = link.encType
  }
  if (link.description) {
    result.description = link.description
  }
  if (link.schema) {
    const requestBodyTypeName = makeRequestBodyTypeName(name)
    result.requestBody = {
      [requestBodyTypeName]: parseJsonSchemaDefinition(link.schema),
    }
  }

  return result
}

const makeInterfaceName = (title: string) =>
  title
    .replace(/^(\w)/, match => match.toLowerCase())
    .replace(/ ((\w))/g, (match, p1) => p1.toUpperCase())
const makeRequestBodyTypeName = name =>
  `JS${name.replace(/^\w/, match => match.toUpperCase())}RequestBody`

export default parseJsonSchemaLinks
