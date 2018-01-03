// @flow

import minimist from 'minimist'
import fs from 'fs'
import generateTypeDefinitions from './type-definitions'
import generateInterfaces from './interfaces'

const main = async () => {
  const argv = minimist(process.argv.slice(2))
  const raw = fs.readFileSync(argv._[0]).toString()

  const schema = JSON.parse(raw)

  await generateTypeDefinitions(schema.definitions)
  await generateInterfaces(schema.links)
}

main()
