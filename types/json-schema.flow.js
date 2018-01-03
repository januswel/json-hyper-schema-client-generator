declare type JsonSchemaDefinition = {
  type: string,
  enum?: Array<any>,
  default?: any,
  properties?: Object,
  items?: {
    $ref: string,
  },
}
/*
 * we can't give expressions for `definitions` of JSON Schema with flow
 *  {
 *    id: JsonSchemaDefinition,
 *    name: JsonSchemaDefinition,
 *  }
 * */
declare type JsonSchemaDefinitions = Object

declare type JsonSchemaLink = {
  title: string,
  href: string,
  rel?: string,
  description?: string,
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  encType?: string,
  schema: Object,
  targetSchema: Object,
}
declare type JsonSchemaLinks = Array<JsonSchemaLink>
