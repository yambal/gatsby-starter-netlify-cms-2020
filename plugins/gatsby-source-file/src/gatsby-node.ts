import mp3 from './mp3'
import HtmlToSSML from './HtmlToSSML'
import * as crypto from 'crypto'
import { GraphQLObjectType, GraphQLString } from 'gatsby/graphql'
import { getMp3Duration } from './getMp3Duration'
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
    url: { type: GraphQLString },
    path: { type: GraphQLString }
  },
});

exports.setFieldsOnGraphQLNodeType = ({ type }, option) => {
  console.log(52, 'setFieldsOnGraphQLNodeType')
  console.log(option.siteURL)

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

        if (templateKey === 'PodCast'){
          return {
            url: `${option.siteURL}/${audioPath}/${fileName}`,
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
exports.onPostBuild = ({ actions, reporter, graphql }, option) => {
  console.log(123, '---------------------------------------')
  

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
            url
            path
          }
        }
      }
    }
  }
  `).then(result => {
    const edges = result.data.allMarkdownRemark.edges
    const items = []

    edges.forEach(
      edge => {
        /** Duration(MP3の長さ)を取得する */
        const path = edge.node.mp3.path
        const buffer = fs.readFileSync(path)
        const duration = getMp3Duration(buffer) // ms
        const h = Math.floor(duration / 1000 / 3600)
        const m = Math.floor((duration / 1000 - h * 3600) / 60)
        const s = Math.floor(duration / 1000 - h * 3600 - m * 60) + 1
        const strDuration = `${('00' + h).slice(-2)}:${('00' + m).slice(-2)}:${('00' + s).slice(-2)}`

        /** Length(ファイルサイズ)を取得する */
        const size = fs.statSync(path).size

        /** pubDate */
        const pub = new Date(edge.node.frontmatter.date)
        const UTCPubDate = pub.toUTCString()

        const item = `<item>
        <title>${edge.node.frontmatter.title}</title>
        <description>${edge.node.frontmatter.description}</description>
        <pubDate>${UTCPubDate}</pubDate>
        <enclosure url="${edge.node.mp3.url}" type="audio/mpeg" length="${size}"/>
        <itunes:duration>${strDuration}</itunes:duration>
        <guid isPermaLink="false">${edge.node.mp3.url}</guid>
        <link>${option.siteURL}${edge.node.fields.slug}</link>
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
        <link>${option.siteURL}/</link>
        ${items.join('\n')}
      </channel>
    </rss>`

    const path = `${process.cwd()}/public/podcast.rss`
    fs.writeFileSync(path, rss);
    console.log(rss, path)
  })
}

/**
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Dafna's Zebra Podcast</title>
    <googleplay:author>Dafna</googleplay:author>
    <description>A pet-owner's guide to the popular striped equine.</description>
    <googleplay:image href="http://www.example.com/podcasts/dafnas-zebras/img/dafna-zebra-pod-logo.jpg"/>
    <language>en-us</language>
    <link>https://www.example.com/podcasts/dafnas-zebras/</link>
    <item>
      <title>Top 10 myths about caring for a zebra</title>
      <description>Here are the top 10 misunderstandings about the care, feeding, and breeding of these lovable striped animals.</description>
      <pubDate>Tue, 14 Mar 2017 12:00:00 GMT</pubDate>
      <enclosure url="https://www.example.com/podcasts/dafnas-zebras/audio/toptenmyths.mp3"
                 type="audio/mpeg" length="34216300"/>
      <itunes:duration>30:00</itunes:duration>
      <guid isPermaLink="false">dzpodtop10</guid>
    </item>
    <item>
      <title>Keeping those stripes neat and clean</title>
      <description>Keeping your zebra clean is time consuming, but worth the effort.</description>
      <pubDate>Fri, 24 Feb 2017 12:00:00 GMT</pubDate>
      <enclosure url="https://www.example.com/podcasts/dafnas-zebras/audio/cleanstripes.mp3"
                 type="audio/mpeg" length="26004388"/>
      <itunes:duration>22:48</itunes:duration>
      <guid>dzpodclean</guid>
    </item>
  </channel>
</rss>
 */
