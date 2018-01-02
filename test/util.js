// @flow

import { describe, it } from 'kocha'
import assert from 'assert'
import { mapObject, convertSnakeCaseToPascalCase } from '../src/util'

describe('mapObject', () => {
  it('returns object coverted by converter', () => {
    const src = {
      foo: 'a',
      bar: 'b',
      buz: 'c',
    }
    const actual = mapObject(src, (key, value) => {
      return [value, key]
    })
    const expected = {
      a: 'foo',
      b: 'bar',
      c: 'buz',
    }
    assert.deepEqual(expected, actual)
  })
})

describe('snakeCaseToPascalCase', () => {
  it('returns string in PascalCase', () => {
    assert('Foo', convertSnakeCaseToPascalCase('foo'))
    assert('FooBarBuz', convertSnakeCaseToPascalCase('foo_bar_buz'))
  })
})
