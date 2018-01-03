// @flow

import parseJsonSchemaLinks from './parse'
import printInterfaces from './print'

const generateInterfaces = async (links: JsonSchemaLinks) => {
  const interfaces = parseJsonSchemaLinks(links)
  printInterfaces(interfaces)
}

export default generateInterfaces
