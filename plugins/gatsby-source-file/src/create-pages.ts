import mp3 from './libs/mp3'
import HtmlToSSML from './libs/html-to-ssml'
import { buildMDHash, buildFileName } from './libs/file-name-builder'
import { getAudioPath } from './libs/option-parser'

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
                  return mp3(HtmlToSSML(title, html), fileName, getAudioPath(pluginOptions))
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
  