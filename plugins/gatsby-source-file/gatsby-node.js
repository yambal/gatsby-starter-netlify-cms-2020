const mp3 = require('./mp3');
const HtmlToSSML = require('./HtmlToSSML');
const audioPath = 'audio'
var crypto = require("crypto");

const buildMDHash = (title, rawMarkdownBody) => {
  return crypto.createHash('md5').update(`${title}-${rawMarkdownBody}` , 'utf8').digest('hex')
}

const buildFileName = (slag, title, rawMarkdownBody, exe) => {
  return `${slag}-${buildMDHash(title, rawMarkdownBody)}.${exe}`
}

exports.createPages = ({ cache, actions, graphql }, pluginOptions, cb) => {

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
                    }
                  )
              } else {
                console.log(`\tskip: hash ${hash}`)
                return
              }
            }
          )
      }
    )

    cb && cb()
  })
}

// =====================================================
const {
  GraphQLString
} = require(`gatsby/graphql`);

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
