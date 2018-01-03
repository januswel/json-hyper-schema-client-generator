// @flow

import parse, { makeSymbol } from './parse'
import { mapObject } from '../util'
import print from './print'

const generateTypeDefinitions = async (definitions: JsonSchemaDefinitions) => {
  const types = mapObject(definitions, (name, definition) => {
    return [makeSymbol(name), parse(definition)]
  })

  Object.keys(types).forEach(name => {
    const type = types[name]
    console.log(`export type ${name} = ${print(type)}`)
  })
}

export default generateTypeDefinitions
