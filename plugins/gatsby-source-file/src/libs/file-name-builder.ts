import * as crypto from 'crypto'

export const buildMDHash = (title: string, rawMarkdownBody: string) => {
    return crypto.createHash('md5').update(`${title}-${rawMarkdownBody}` , 'utf8').digest('hex')
}
  
export const buildFileName = (slag: string, title: string, rawMarkdownBody: string, exe: string) => {
    return `${slag}-${buildMDHash(title, rawMarkdownBody)}.${exe}`
}