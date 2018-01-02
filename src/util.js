// @flow

export type Converter = (key: string, value: any) => [string, any]
export const mapObject = (src: Object, converter: Converter) => {
  const result = {}
  Object.keys(src).forEach(key => {
    const tmp = converter(key, src[key])
    result[tmp[0]] = tmp[1]
  })
  return result
}

export const convertSnakeCaseToPascalCase = (src: string) => {
  return src
    .replace(/^(\w)/, match => match.toUpperCase())
    .replace(/_(\w)/g, (match, p1) => p1.toUpperCase())
}
