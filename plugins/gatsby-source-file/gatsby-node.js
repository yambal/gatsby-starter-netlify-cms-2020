const mp3 = require('./mp3');
const HtmlToSSML = require('./HtmlToSSML');
const audioPath = 'audio'
var crypto = require("crypto");

const buildFileName = (slag, rawMarkdownBody, exe) => {
  const hash = crypto.createHash('md5').update(rawMarkdownBody , 'utf8').digest('hex')
  return `${slag}-${hash}.${exe}`
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
        console.log(edge.node.id)

        const html = edge.node.html
        const title = edge.node.frontmatter.title
        const hashKey = `podcast-${edge.node.id}`
        const hsashSeed = `${edge.node.id} ${title} ${html}`
        const hash = crypto.createHash('md5').update(hsashSeed , 'utf8').digest('hex')
        const fileName = buildFileName(edge.node.frontmatter.slug, edge.node.rawMarkdownBody, 'mp3')

        cache.get(hashKey)
          .then(
            (nodeIdHash) => {
              if (nodeIdHash !== hash){
                mp3(HtmlToSSML(title, html), fileName, audioPath)
                  .then(
                    (uri) => {
                      console.log(`\t${uri}`)
                      cache.set(hash)
                    }
                  )
              } else {
                console.log(`\tskip: hash ${hash}`)
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

        console.log(94, rawMarkdownBody)

        const { templateKey, slug } = frontmatter

        const fileName = buildFileName(slug, rawMarkdownBody, 'mp3')

        if (templateKey === 'PodCast'){
          return `/${audioPath}/${fileName}`
        }

        return null
      }
    }
  }
}
