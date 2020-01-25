const mp3 = require('./mp3');
const path = require('path')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

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
        console.log(JSON.stringify(edge, null, 2))
        mp3('Hello', edge.node.frontmatter.slug, 'audio')
          .then(
            (uri) => {
              console.log(39, uri)
              console.log(uri)
            }
          )
      }
    )
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
          frontmatter
        } = MDNode

        const { templateKey, slug } = frontmatter

        if (templateKey === 'PodCast'){
          return `${slug}`
        }

        return null
      }
    }
  }
}
