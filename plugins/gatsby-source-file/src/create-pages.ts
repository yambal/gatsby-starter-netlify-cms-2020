import mp3 from './libs/mp3'
import HtmlToSSML from './libs/html-to-ssml'
import { listFiles } from './file-checker'
import { cacheToPablic, podcastCashSet, checkCache, iPodcastCacheCheckResponse } from './libs/cache'

export interface iPodcastBuild {
  edge: any
  cacheDir: string
  publicDir: string
  ssml: string
  fileName?: string
  chacheValue?: string
  cacheKey?: string,
  cachedFilePath?: string
  isNeedReflash?:boolean
}

const podcastBuildMp3 = (
  checkCacheResponse: iPodcastCacheCheckResponse,
  ssml: string
) => {

  return new Promise((resolve: (resolve: iPodcastCacheCheckResponse) => void) => {
    if (!checkCacheResponse.hasCashe || checkCacheResponse.isOld) {
      console.log('podcast: make mp3')
      mp3(ssml)
      .then(
        audioData => {
          console.log('podcast: make mp3 success')
          checkCacheResponse.audioData = audioData
          resolve(checkCacheResponse)
        }
      )

    } else {
      console.log('podcast: make mp3 skip')
      resolve(checkCacheResponse)
    }
  })
}

const podcastCacheSaver = (checkCacheResponse: iPodcastCacheCheckResponse) => {
  return new Promise((resolve: (resolve: iPodcastCacheCheckResponse) => void) => {
    if (checkCacheResponse.audioData) {
      podcastCashSet(
        checkCacheResponse.cacheKey,
        checkCacheResponse.cacheValue,
        checkCacheResponse.channel,
        checkCacheResponse.slug,
        checkCacheResponse.audioData
      )
      .then(
        () => {
          console.log('podcast: cached')
          resolve(checkCacheResponse)
        }
      )
    } else {
      console.log('podcast: cacheing skip')
      resolve(checkCacheResponse)
    }

  })
}

const podcastEdgeToFile = (edge, options):Promise<iPodcastCacheCheckResponse> => {
  return new Promise((resolve: (resolve: iPodcastCacheCheckResponse) => void) => {
    return checkCache(edge, options)
    .then(
      (checkCacheResponse) => {
        const html = edge.node.html
        const { title } = edge.node.frontmatter
        const ssml = HtmlToSSML(title, html)
        return podcastBuildMp3(checkCacheResponse, ssml)
      }
    )
    .then(
      (res) => {
        return podcastCacheSaver(res)
      }
    )
    .then(
      (res) => {
        return cacheToPablic(res)
      }
    )
    .then(
      (res) => {
        resolve(res)
      }
    )
  })
}

module.exports = ({ cache, actions, graphql }, pluginOptions, cb: () => void) => {
  return graphql(`
  {
    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "PodCast"}}}, limit: 10) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            slug
            title
            date
            channel
          }
          rawMarkdownBody
          html
        }
      }
    }
  }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const list = listFiles(`${process.cwd()}/podcast`);
    console.log('file check', list.length);

    const edges = result.data.allMarkdownRemark.edges
    Promise.all(edges.map(
      edge => {
        return podcastEdgeToFile(edge, pluginOptions)
      }
    ))
    .then(
      () => {
        console.log('/podcast')
        cb && cb()
      }
    )
  })
}