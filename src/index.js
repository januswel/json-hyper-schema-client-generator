// @flow

import minimist from 'minimist'
import fs from 'fs'
import generateTypeDefinitions from './type-definitions'
import generateInterfaces from './interfaces'

const main = async () => {
  try {
    const argv = processArguments()

    const raw = fs.readFileSync(argv.target).toString()

    const schema = JSON.parse(raw)

    console.log('// @flow')
    printDependencies(argv.fetchLibrary)
    console.log('// type definitions')
    await generateTypeDefinitions(schema.definitions)

    console.log('// interfaces')
    await generateInterfaces(schema.links)
  } catch (err) {
    console.error(err.message)
  }
}

const processArguments = () => {
  const argv = minimist(process.argv.slice(2))
  if (!argv._) {
    throw new Error('specify target JSON Hyper Schema file')
  }
  if (argv.fetch && !['node-fetch', 'whatwg-fetch'].includes(argv.fetch)) {
    throw new Error('specify fetch library from "node-fetch" or "whatwg-fetch"')
  }
  return {
    target: argv._[0],
    fetchLibrary: argv.fetch,
  }
}

const printDependencies = fetch => {
  if (!fetch) {
    return
  }
  console.log("import FormData from 'form-data'")
  switch (fetch) {
    case 'node-fetch': {
      console.log("import fetch from 'node-fetch'")
      return
    }
    case 'whatwg-fetch': {
      console.log("import 'whatwg-fetch'")
      return
    }
  }
}

main()
