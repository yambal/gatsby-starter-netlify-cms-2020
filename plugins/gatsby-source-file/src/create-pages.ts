import mp3 from './libs/mp3'
import HtmlToSSML from './libs/html-to-ssml'
import { buildMDHash, buildFileNameShort, buildMpCacheValue } from './libs/file-name-builder'
import { getAudioPath } from './libs/option-parser'
import * as fs from 'fs'

interface iPodcastBuild {
  edge: any
  option: any
  cashier: any
  reflesh?:boolean
  title?: string
  html?: string
  fileName?: string
  chacheValue?: string
}
const podcastCacheCheck = (edge, pluginOption, cashier) => {
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    const html = edge.node.html
    const { title, date, channel, slug } = edge.node.frontmatter
    const fileName = buildFileNameShort(channel, slug, 'mp3')
    const chacheValue = buildMpCacheValue(title, html, channel, date, slug)

    cashier.get(fileName)
    .then(
      chachedValue => {
        !chachedValue || chachedValue !== chacheValue && resolve({
          edge,
          option: pluginOption,
          cashier,
          reflesh: true,
          title,
          html,
          fileName,
          chacheValue
        })
        chachedValue === chacheValue && resolve({
          edge,
          option: pluginOption,
          cashier,
          reflesh: false,
          title,
          html,
          fileName,
          chacheValue
        })
      }
    )
  })
}

const podcastBuildMp3 = (i: iPodcastBuild) => {
  console.log('\tpodcastBuildMp3')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    if (i.reflesh) {
      console.log(`\t\tmake:${i.fileName}`)
      mp3(HtmlToSSML(i.title, i.html), i.fileName, getAudioPath(i.option))
      .then(
        () => {
          resolve(i)
        }
      )
    } else {
      console.log(`\t\tskip:${i.fileName}`)
      resolve(i)
    }
  })
}

const podcastCacheSaver = (i: iPodcastBuild) => {
  console.log('\tpodcastCacheSaver')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    if (i.reflesh){
      i.cashier.set(i.fileName, i.chacheValue)
      .then(
        () => {
          console.log(`\t\tcached:${i.fileName} - ${i.chacheValue}`)
          resolve(i)
        }
      )
    } else {
      console.log(`\t\tskip:${i.fileName} - ${i.chacheValue}`)
      resolve(i)
    }
  })
}

const podcastEdgeToFile = (edge, options, cashier) => {
  console.log('podcastEdgeToFile')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    return podcastCacheCheck(edge, options, cashier)
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
  
      const edges = result.data.allMarkdownRemark.edges
      return Promise.all(edges.map(
        edge => {
          return podcastEdgeToFile(edge, pluginOptions, cache)
        }
      ))
      .then(
        () => {
          cb && cb()
        }
      )
    })
  }
  