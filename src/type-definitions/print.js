// @flow

const printTypes = (type: any, indentLevel: number = 0) => {
  switch (typeof type) {
    case 'object': {
      const indent = Array(indentLevel + 1).join('  ')
      const indentContent = Array(indentLevel + 2).join('  ')
      return [
        `${indent}{`,
        Object.keys(type)
          .map(
            key =>
              `${indentContent}${key}: ${printTypes(
                type[key],
                indentLevel + 1,
              )},`,
          )
          .join(`\n`),
        `${indent}}`,
      ].join('\n')
    }
    default:
      return type
  }
}

export default printTypes
