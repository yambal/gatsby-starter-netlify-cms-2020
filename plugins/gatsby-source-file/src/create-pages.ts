import mp3 from './libs/mp3'
import HtmlToSSML from './libs/html-to-ssml'
import { buildFileNameShort, buildMpCacheValue } from './libs/file-name-builder'
import { getAudioPath } from './libs/option-parser'
import * as fs from 'fs'
import { listFiles } from './file-checker'
import * as mkdirp from 'mkdirp-then'
import * as util from 'util'

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

const podcastCacheGet = (key: string) => {
  return new Promise((resolve: (resolve: string) => void) => {
    const cacheDir = `${process.cwd()}/.cache/podcast`
    const cacheFilePath = `${cacheDir}/cache-${key}.txt`
    try {
      fs.statSync(cacheFilePath)
      fs.readFile(cacheFilePath, "utf-8", (err, data) => {
        if(!err) {
          resolve(data)
          return
        }
        resolve(null)
      })
    } catch (error) {
      resolve(null)
    }
  })
}

const podcastCashSet = (key: string, value: string) => {
  return new Promise((resolve: () => void) => {
    const cacheDir = `${process.cwd()}/.cache/podcast`
    const cacheFilePath = `${cacheDir}/cache-${key}.txt`
    mkdirp(cacheDir)
    .then(
      () => {
        fs.writeFile(cacheFilePath, value, 'utf8', () => {
          resolve()
        });
      }
    )
  })
}

const podcastCacheCheck = (edge, pluginOption) => {
  console.log('\tpodcastCacheCheck')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    const html = edge.node.html
    const { title, date, channel, slug } = edge.node.frontmatter

    const fileName = buildFileNameShort(channel, slug, 'mp3')
    
    const cacheKey = buildFileNameShort(channel, slug)
    const chacheValue = buildMpCacheValue(title, html, channel, date, slug)

    const cacheDir = `${process.cwd()}/.cache/podcast`
    const publicDir = `${process.cwd()}/public/${getAudioPath(pluginOption)}`

    const ssml = HtmlToSSML(title, html)
    
    podcastCacheGet(cacheKey)
    .then(
      cachedValue => {
        let res = {
          edge,
          cacheDir,
          publicDir,
          ssml,
          fileName,
          cacheKey,
          chacheValue,
          isNeedReflash: true,
        }

        if (cachedValue) {
          if (cachedValue === chacheValue){
            // 変更なし
            res.isNeedReflash = false
          } else {
            // 変更あり
            res.isNeedReflash = true
          }
        } else {
          // キャッシュなし
          res.isNeedReflash = true
        }

        resolve(res)
      }
    )
  })
}

const podcastBuildMp3 = (i: iPodcastBuild) => {
  console.log('\tpodcastBuildMp3')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    const cacheFilePath = `${i.cacheDir}/${i.fileName}`

    if (i.isNeedReflash) {
      console.log(`\t\tmake:${i.fileName}`)
      
      mp3(i.ssml)
      .then(
        data => {
          
          mkdirp(i.cacheDir)
          .then(
            () => {
              const writeFile = util.promisify(fs.writeFile)
              writeFile(cacheFilePath, data, 'binary')
              .then(
                () => {
                  i.cachedFilePath = cacheFilePath
                  resolve(i)
                }
              )
            }
          )
        }
      )

    } else {
      console.log(`\t\tskip:${i.fileName}`)
      i.cachedFilePath = cacheFilePath
      resolve(i)
    }
  })
}

const podcastCacheSaver = (i: iPodcastBuild) => {
  console.log('\tpodcastCacheSaver')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    podcastCashSet(i.cacheKey, i.chacheValue)
    .then(
      () => {
        resolve(i)
      }
    )
  })
}

const cacheToPablic = (i: iPodcastBuild) => {
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    
    var publicPath = `${i.publicDir}/${i.fileName}`

    console.log('cacheToPablic')
    console.log(`\t${i.cachedFilePath}`)
    console.log(`\t${publicPath}`)

    mkdirp(i.publicDir)
    .then(
      () => {
        fs.copyFile(i.cachedFilePath, publicPath, (err) => {
          if (!err) {
            resolve(i)
            return
          }
          resolve(i)
        });
      }
    )
  })
}

const podcastEdgeToFile = (edge, options):Promise<iPodcastBuild> => {
  console.log('podcastEdgeToFile')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    return podcastCacheCheck(edge, options)
    .then(
      (res) => {
        return podcastBuildMp3(res)
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

    const list = listFiles(`${process.cwd()}/.cache`);
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