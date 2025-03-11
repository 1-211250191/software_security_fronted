export interface SbomItem {
  vendor: string
  name: string
  version: string
  language: string
  id: string
  paths?: string[]
  children?: SbomItem[]
  [property: string]: any
}
