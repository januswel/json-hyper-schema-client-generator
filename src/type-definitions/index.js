// @flow

import parseJsonSchemaDefinitions from './parse'
import { mapObject } from '../util'
import printTypeDefinitions from './print'

const generateTypeDefinitions = async (definitions: JsonSchemaDefinitions) => {
  const typeDefinitions = parseJsonSchemaDefinitions(definitions)
  printTypeDefinitions(typeDefinitions)
}

export default generateTypeDefinitions
