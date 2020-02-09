import * as crypto from 'crypto'

export const buildMDHash = (title: string, rawMarkdownBody: string) => {
    return crypto.createHash('md5').update(`${title}-${rawMarkdownBody}` , 'utf8').digest('hex')
}

/*
export const buildFileName = (slag: string, title: string, rawMarkdownBody: string, exe: string) => {
    return `${slag}-${buildMDHash(title, rawMarkdownBody)}.${exe}`
}
*/

export const buildMpCacheValue = (title: string, body: string, channel: string, date:string, slug: string) => {
    const hashSeed = `${title}-${body}-${channel}-${date}-${slug}`
    return crypto.createHash('md5').update(hashSeed , 'utf8').digest('hex')
}

export const buildFileNameShort = (channel: string, slug: string, exe?:string) => {
    const channelFix = channel ? `${channel}-` : ''
    const exeFix = exe ? `.${exe}` : ''

    return `podcast-${channelFix}${slug}${exeFix}`
}