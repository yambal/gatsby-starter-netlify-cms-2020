import mp3 from './libs/mp3'
import HtmlToSSML from './libs/html-to-ssml'
import { buildMDHash, buildFileName } from './libs/file-name-builder'
import { getAudioPath } from './libs/option-parser'
import * as fs from 'fs'

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
      let edgeNum = edges.length
      edges.forEach(
        (edge) => {
          const html = edge.node.html
          const title = edge.node.frontmatter.title
          
          // const cacheKey = `podcast-${edge.node.id}`
          // const hash = buildMDHash(title, edge.node.rawMarkdownBody)
          const fileName = buildFileName(edge.node.frontmatter.slug, title, edge.node.rawMarkdownBody, 'mp3')
          const checkPath = `${process.cwd()}/public/${getAudioPath(pluginOptions)}/${fileName}`

          try {
            fs.statSync(checkPath);
            console.log(`${checkPath} is exists (${edgeNum}/${edges.length})`);
            edgeNum--
            edgeNum <= 0 && cb && cb()
          } catch (error) {
            return mp3(HtmlToSSML(title, html), fileName, getAudioPath(pluginOptions))
            .then(
              () => {
                console.log(`${checkPath} saved (${edgeNum}/${edges.length})`);
                edgeNum--
                edgeNum <= 0 && cb && cb()
              }
            )
          }
  
          /*
          return cache.get(cacheKey)
            .then(
              nodeIdHash => {
                console.log('cache check:', cacheKey, hash, nodeIdHash)

                if (nodeIdHash !== hash){
                  return mp3(HtmlToSSML(title, html), fileName, getAudioPath(pluginOptions))
                    .then(
                      (response) => {
                        console.log(response)
                        return cache.set(cacheKey, hash)
                          .then(
                            () => {
                              console.log('cache saved:', cacheKey, hash)
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
          */
        }
      )
    })
  }
  