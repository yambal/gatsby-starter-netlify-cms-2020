import mp3 from './mp3';
import HtmlToSSML from './HtmlToSSML';
import * as crypto from 'crypto';
import { GraphQLString } from 'gatsby/graphql';
import { createFilePath } from 'gatsby-source-filesystem'

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
                    (uri) => {
                      return cache.set(cacheKey, hash)
                        .then(
                          () => {
                            console.log(`\tmake cache:${cacheKey} = ${hash}`)
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
exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  console.log(52, 'setFieldsOnGraphQLNodeType')

  if (type.name !== `MarkdownRemark`) {
    return {}
  }

  return {
    mp3: {
      type: GraphQLString,
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

        if (templateKey === 'PodCast'){
          return `/${audioPath}/${fileName}`
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
exports.onPostBuild = ({ actions, reporter, graphql }) => {
  console.log(123, '---------------------------------------')
  // console.log(123, reporter)

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
          }
          mp3
        }
      }
    }
  }
  `).then(result => {
    const edges = result.data.allMarkdownRemark.edges
    edges.forEach(
      edge => {
        console.log(JSON.stringify(edge.node))
        const item = `<item>
        <title>${edge.node.frontmatter.title}</title>
        <description>${edge.node.frontmatter.description}</description>
        <pubDate>Tue, 14 Mar 2017 12:00:00 GMT</pubDate>
        <enclosure url="${edge.node.mp3}" type="audio/mpeg" length="34216300"/>
        <itunes:duration>30:00</itunes:duration>
        <guid isPermaLink="false">dzpodtop10</guid>
      </item>`
        console.log(item)
      }
    )
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