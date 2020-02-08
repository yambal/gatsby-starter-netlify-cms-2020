import mp3 from './mp3'
import HtmlToSSML from './HtmlToSSML'
import * as crypto from 'crypto'
import { GraphQLObjectType, GraphQLString } from 'gatsby/graphql'
import { getITunesDuration } from './getITunesDuration'
var fs = require('fs')


const audioPath = 'audio'

const buildMDHash = (title: string, rawMarkdownBody: string) => {
  return crypto.createHash('md5').update(`${title}-${rawMarkdownBody}` , 'utf8').digest('hex')
}

const buildFileName = (slag: string, title: string, rawMarkdownBody: string, exe: string) => {
  return `${slag}-${buildMDHash(title, rawMarkdownBody)}.${exe}`
}

exports.createPages = (
  { cache, actions, graphql },
  pluginOptions,
  cb: () => void
) => {
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

    // MP3
    edges.forEach(
      (edge) => {
        const html = edge.node.html
        const title = edge.node.frontmatter.title
        
        const cacheKey = `podcast-${edge.node.id}`
        const hash = buildMDHash(title, edge.node.rawMarkdownBody)
        const fileName = buildFileName(edge.node.frontmatter.slug, title, edge.node.rawMarkdownBody, 'mp3')

        return cache.get(cacheKey)
          .then(
            (nodeIdHash) => {
              if (nodeIdHash !== hash){
                return mp3(HtmlToSSML(title, html), fileName, audioPath)
                  .then(
                    (response) => {
                      console.log(response)
                      return cache.set(cacheKey, hash)
                        .then(
                          () => {
                            cb && cb()
                          }
                        )
                    }
                  )
              } else {
                console.log(`\tskip: hash ${hash}`)
                cb && cb()
                return
              }
            }
          )
      }
    )
  })
}

// =====================================================
let MP3Type = new GraphQLObjectType({
  name: 'Mp3',
  fields: {
    absoluteUrl: { type: GraphQLString },
    url: { type: GraphQLString },
    path: { type: GraphQLString }
  },
});

exports.setFieldsOnGraphQLNodeType = ({ type }, option) => {
  console.log(52, 'setFieldsOnGraphQLNodeType')
  const { siteUrl = null } = option

  if (type.name !== `MarkdownRemark`) {
    return {}
  }

  return {
    mp3: {
      type: MP3Type,
      args: {
        prefix: {
          type: GraphQLString,
        }
      },
      resolve: (MDNode, args) => {
        const {
          frontmatter,
          rawMarkdownBody
        } = MDNode

        const { templateKey, slug, title } = frontmatter

        const fileName = buildFileName(slug, title, rawMarkdownBody, 'mp3')
        const mp3FilePath = `${process.cwd()}/public/${audioPath}/${fileName}`
        const absoluteUrl = siteUrl ? `${siteUrl}/${audioPath}/${fileName}` : 'siteUrl not set @option'

        if (templateKey === 'PodCast'){
          return {
            absoluteUrl: absoluteUrl,
            url: `/${audioPath}/${fileName}`,
            path: mp3FilePath
          }
        }

        return null
      }
    }
  }
}

/**
 * https://www.gatsbyjs.org/docs/node-apis/#onPostBuild
 * ビルドプロセスの他のすべての部分が完了した後に呼び出される最後の拡張ポイント。
 * https://www.npmjs.com/package/get-mp3-duration
 */
interface iPodcastEdge {
    node: {
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
        description: string
        date: string
      }
      mp3: {
        absoluteUrl: string
        url: string
        path: string
      }
    }
}
exports.onPostBuild = ({ actions, reporter, graphql }, option) => {
  const { siteUrl = null } = option

  graphql(`
  {
    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "PodCast"}}}, limit: 10) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            date
          }
          mp3 {
            absoluteUrl
            url
            path
          }
        }
      }
    }
  }
  `).then(result => {
    const edges:iPodcastEdge[] = result.data.allMarkdownRemark.edges

    const items = []

    edges.forEach(
      edge => {
        const {
          node :{
            fields: {
              slug
            },
            mp3 : {
              path,
              url,
              absoluteUrl
            },
            frontmatter: {
              date: pubDateStr,
              description,
              title
            }
          }
        } = edge

        /** Duration(MP3の長さ)を取得する */
        const iTunesDuration = getITunesDuration(path)

        /** Length(ファイルサイズ)を取得する */
        const size = fs.statSync(path).size

        /** pubDate */
        const pubDateUTC = new Date(pubDateStr).toUTCString()

        /** Link 記事ページへのリンク */
        const link = siteUrl ? `${siteUrl}${slug}` : slug

        /** MP3 ファイルのTRL */
        const enclosureUrl = siteUrl ? absoluteUrl : url

        const item = `<item>
        <title>${title}</title>
        <description>${description}</description>
        <pubDate>${pubDateUTC}</pubDate>
        <enclosure url="${enclosureUrl}" type="audio/mpeg" length="${size}"/>
        <itunes:duration>${iTunesDuration}</itunes:duration>
        <guid isPermaLink="false">${absoluteUrl}</guid>
        <link>${link}</link>
      </item>`
        items.push(item)
      }
    )

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0"
         xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
      <channel>
        <title>WWW.YAMBAL.NET</title>
        <googleplay:author>June YAMAMOTO</googleplay:author>
        <description>テストです</description>
        <googleplay:image href="http://placehold.jp/36/99ccff/003366/600x600.png?text=WWW.YAMBAL.NET"/>
        <language>ja-JP</language>
        <link>${siteUrl}/</link>
        ${items.join('\n')}
      </channel>
    </rss>`

    const path = `${process.cwd()}/public/podcast.rss`
    fs.writeFileSync(path, rss);
    console.log(rss, path)
  })
}
