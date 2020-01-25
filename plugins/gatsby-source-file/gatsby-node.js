const mp3 = require('./mp3');
const path = require('path')

exports.createPages = ({ actions, graphql }) => {
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
        console.log('.fields.slug', edge.node.fields.slug)

        // const dir = `${process.cwd()}/public/audio${edge.node.fields.slug}`
        
        // console.log('rootParh', dir)

        mp3('Hello', edge.node.frontmatter.slug)
      }
    )
  })
}
