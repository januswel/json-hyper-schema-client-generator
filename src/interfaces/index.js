// @flow

import parse from './parse'
import print from './print'

const generateInterfaces = async (links: JsonSchemaLinks) => {
  const interfaces = links.map(link => {
    return parse(link)
  })

  print(interfaces)
}

export default generateInterfaces
