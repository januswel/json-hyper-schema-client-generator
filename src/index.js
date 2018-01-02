// @flow

import minimist from 'minimist'
import fs from 'fs'

const generateDefinitions = async definitions => {
  console.log(Object.keys(definitions))
}
const generateLinks = async links => {
  console.log(links)
}

const main = async () => {
  const argv = minimist(process.argv.slice(2))
  const raw = fs.readFileSync(argv._[0]).toString()

  const schema = JSON.parse(raw)

  await generateDefinitions(schema.definitions)
  await generateLinks(schema.links)
}

main()
