json-hyper-schema-client-generator
===

A client generator from JSON Hyper Schema

Dependencies
---

A generated file depends on below packages.

- babel
- babel-preset-es2015
- babel-preset-flow
- flow-bin

You must install them beforehand to use the generated file.

```sh
npm install --save-dev babel babel-preset-es2015 babel-preset-flow flow-bin
npx flow init
```

And make a file `.babelrc` with below contents.

```json:.babelrc
{
  "presets": ["es2015", "flow"]
}
```

The generated file relies on `flow` to check request body.
Run below command to check type consistensy.

```sh
npx flow
```

Usage
---

```sh
generate-json-hyper-schema-client [--fetch <fetch library>] <JSON Hyper Schama file> > client.js
```

The command generates type definitions used by flow and `Client` class that has interfaces for each APIs.

You can use generated file as below:

```js
import Client from './client'

const main = async () => {
  try {
    // create client with a host to connect
    const client = new Client('http://localhost:8080')

    const response = await client.login({
      user: 'foo',
      password: 'xxxxxx',
    })

    // you can specify extra HTTP headers as 2nd argument
    const user = await client.getUser({
      id: 'xxxxx',
    }, {
      'X-API-Token': response.apiToken,
    })
  }
  catch(err) {
    console.error(err)
  }
}

main()
```

### fetch library

You have three options.

- none
- whatwg-fetch
- node-fetch

#### none

`Client` use built-in fetch.

### whatwg-fetch

`Client` use whatwg-fetch and form-data package
In order to use the generated client, you must install them.

```sh
npm install --save whatwg-fetch form-data
```

### node-fetch

`Client` use node-fetch and form-data package
In order to use the generated client, you must install them.

```sh
npm install --save node-fetch form-data
```
