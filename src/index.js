// @flow

import minimist from 'minimist'
import fs from 'fs'
import { mapObject, convertSnakeCaseToPascalCase } from './util'

const makeSymbol = (src: string) =>
  `JsonSchema${convertSnakeCaseToPascalCase(stripReference(src))}`
const stripReference = (src: string) => src.replace(/^#\/definitions\//, '')
const parseJsonSchema = (src: Object) => {
  if (src.oneOf) {
    return src.oneOf.map(definition => parseJsonSchema(definition)).join(' | ')
  }
  if (src.anyOf) {
    return src.anyOf.map(definition => parseJsonSchema(definition)).join(' | ')
  }
  if (src.$ref) {
    return makeSymbol(src.$ref)
  }

  switch (src.type) {
    case 'object': {
      if (!src.properties) {
        return 'Object'
      }
      return mapObject(src.properties, (key, value) => {
        if (value.$ref) {
          return [key, makeSymbol(value.$ref)]
        }
        return [key, parseJsonSchema(value)]
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
      console.error(src)
      return src
    }
  }
}

const print = (type: any, indentLevel: number = 0) => {
  switch (typeof type) {
    case 'object': {
      const indent = Array(indentLevel + 1).join('  ')
      const indentContent = Array(indentLevel + 2).join('  ')
      return [
        `${indent}{`,
        Object.keys(type)
          .map(
            key =>
              `${indentContent}${key}: ${print(type[key], indentLevel + 1)},`,
          )
          .join(`\n`),
        `${indent}}`,
      ].join('\n')
    }
    default:
      return type
  }
}

const generateTypeDefinitions = async definitions => {
  const types = mapObject(definitions, (name, definition) => {
    return [makeSymbol(name), parseJsonSchema(definition)]
  })

  Object.keys(types).forEach(name => {
    const type = types[name]
    console.log(`export type ${name} = ${print(type)}`)
  })
}

const generateLinks = async links => {
  console.error(links)
}

const main = async () => {
  const argv = minimist(process.argv.slice(2))
  const raw = fs.readFileSync(argv._[0]).toString()

  const schema = JSON.parse(raw)

  await generateTypeDefinitions(schema.definitions)
  await generateLinks(schema.links)
}

main()
