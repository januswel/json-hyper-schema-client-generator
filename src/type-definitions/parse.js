// @flow

import { mapObject, convertSnakeCaseToPascalCase } from '../util'

export type TypeDefinitions = {
  [name: string]: string | TypeDefinitions,
}

const parseJsonSchemaDefinitions = (definitions: JsonSchemaDefinitions) =>
  mapObject(definitions, (name, definition) => {
    return [makeSymbol(name), parseJsonSchemaDefinition(definition)]
  })

const parseJsonSchemaDefinition = (src: Object) => {
  if (src.oneOf) {
    return src.oneOf
      .map(definition => parseJsonSchemaDefinition(definition))
      .join(' | ')
  }
  if (src.anyOf) {
    return src.anyOf
      .map(definition => parseJsonSchemaDefinition(definition))
      .join(' | ')
  }
  if (src.$ref) {
    return makeSymbol(src.$ref)
  }

  const type = src.type || 'object'
  switch (type) {
    case 'object': {
      if (!src.properties) {
        return 'Object'
      }
      return mapObject(src.properties, (key, value) => {
        if (value.$ref) {
          if (src.required) {
            return [
              `${key}${isRequired(src.required, key)}`,
              makeSymbol(value.$ref),
            ]
          }
          return [key, makeSymbol(value.$ref)]
        }
        if (src.required) {
          return [
            `${key}${isRequired(src.required, key)}`,
            parseJsonSchemaDefinition(value),
          ]
        }
        return [key, parseJsonSchemaDefinition(value)]
      })
    }
    case 'array': {
      if (src.items.$ref) {
        return `Array<${makeSymbol(src.items.$ref)}>`
      }
    }
    case 'boolean':
      return 'bool'
    case 'integer':
    case 'number':
      return 'number'
    case 'string':
      return 'string'
    case 'null':
      return 'null'
    default: {
      console.error('not implemented yet')
      console.error(src.type, src)
      return src
    }
  }
}

const makeSymbol = (src: string) =>
  `JS${convertSnakeCaseToPascalCase(stripReference(src))}`
const stripReference = (src: string) => src.replace(/^#\/definitions\//, '')
const isRequired = (required: Array<string>, key) => {
  return required.includes(key) ? '' : '?'
}

export default parseJsonSchemaDefinitions
export { parseJsonSchemaDefinition }
