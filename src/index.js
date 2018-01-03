// @flow

import minimist from 'minimist'
import fs from 'fs'
import { mapObject, convertSnakeCaseToPascalCase } from './util'

const makeSymbol = (src: string) =>
  `JS${convertSnakeCaseToPascalCase(stripReference(src))}`
const stripReference = (src: string) => src.replace(/^#\/definitions\//, '')
const isRequired = (required: Array<string>, key) => {
  return required.includes(key) ? '' : '?'
}
const parseTypeDefinitions = (src: Object) => {
  if (src.oneOf) {
    return src.oneOf
      .map(definition => parseTypeDefinitions(definition))
      .join(' | ')
  }
  if (src.anyOf) {
    return src.anyOf
      .map(definition => parseTypeDefinitions(definition))
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
            parseTypeDefinitions(value),
          ]
        }
        return [key, parseTypeDefinitions(value)]
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

const printTypes = (type: any, indentLevel: number = 0) => {
  switch (typeof type) {
    case 'object': {
      const indent = Array(indentLevel + 1).join('  ')
      const indentContent = Array(indentLevel + 2).join('  ')
      return [
        `${indent}{`,
        Object.keys(type)
          .map(
            key =>
              `${indentContent}${key}: ${printTypes(
                type[key],
                indentLevel + 1,
              )},`,
          )
          .join(`\n`),
        `${indent}}`,
      ].join('\n')
    }
    default:
      return type
  }
}

const makeMethodName = (title: string) =>
  title
    .replace(/^(\w)/, match => match.toLowerCase())
    .replace(/ ((\w))/g, (match, p1) => p1.toUpperCase())

const parseInterface = link => {
  const result = {
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

const makeRequestBodyTypeName = name =>
  `${name.replace(/^\w/, match => match.toUpperCase())}RequestBody`
const printWithRequestBody = api => {
  console.log(`
  ${api.name}(requestBody: ${makeRequestBodyTypeName(api.name)}) {
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
const printInterfaces = interfaces => {
  interfaces.forEach(api => {
    console.log(
      `export type ${makeRequestBodyTypeName(api.name)} = ${printTypes(
        api.requestBody,
      )}`,
    )
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

const generateTypeDefinitions = async definitions => {
  const types = mapObject(definitions, (name, definition) => {
    return [makeSymbol(name), parseTypeDefinitions(definition)]
  })

  Object.keys(types).forEach(name => {
    const type = types[name]
    console.log(`export type ${name} = ${printTypes(type)}`)
  })
}

const generateClient = async links => {
  const interfaces = links.map(link => {
    return parseInterface(link)
  })

  printInterfaces(interfaces)
}

const main = async () => {
  const argv = minimist(process.argv.slice(2))
  const raw = fs.readFileSync(argv._[0]).toString()

  const schema = JSON.parse(raw)

  await generateTypeDefinitions(schema.definitions)
  await generateClient(schema.links)
}

main()
