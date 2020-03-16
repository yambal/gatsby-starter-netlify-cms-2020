export interface iHeader {
  text: string
  level: number
}

export interface iLinks {
  text: string
  href: string
}

export interface iPodCast {
  url: string
  absoluteUrl: string,
  headers: iHeader[]
  links: iLinks[]
}

