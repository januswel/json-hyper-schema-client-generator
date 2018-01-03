// @flow

import type { TypeDefinitions } from './parse'

const printTypeDefinitions = (typeDefinitions: TypeDefinitions) => {
  Object.keys(typeDefinitions).forEach(name => {
    const typeDefinition = typeDefinitions[name]
    console.log(`export type ${name} = ${printTypeDefinition(typeDefinition)}`)
  })
}

const printTypeDefinition = (type: any, indentLevel: number = 0) => {
  switch (typeof type) {
    case 'object': {
      if (type.isArray) {
        return `Array<${type.typeDefinition}>`
      }

      const indent = Array(indentLevel + 1).join('  ')
      const indentContent = Array(indentLevel + 2).join('  ')
      return [
        `${indent}{`,
        Object.keys(type)
          .map(
            key =>
              `${indentContent}${key}: ${printTypeDefinition(
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

export default printTypeDefinitions
