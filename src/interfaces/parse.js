// @flow

import parseTypeDefinitions from '../type-definitions/parse'

export type Interface = {
  name: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  contentType?: string,
  description?: string,
  requestBody?: string | Object,
  responseBody?: string | Object,
}

const parseJsonSchemaLinks = (links: JsonSchemaLinks) =>
  links.map(link => parseJsonSchemaLink(link))

const parseJsonSchemaLink = (link: JsonSchemaLink) => {
  const result: Interface = {
    name: makeMethodName(link.title),
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
    result.requestBody = parseTypeDefinitions(link.schema)
  }
  if (link.targetSchema) {
    result.responseBody = parseTypeDefinitions(link.targetSchema)
  }

  return result
}

const makeMethodName = (title: string) =>
  title
    .replace(/^(\w)/, match => match.toLowerCase())
    .replace(/ ((\w))/g, (match, p1) => p1.toUpperCase())

export default parseJsonSchemaLinks
