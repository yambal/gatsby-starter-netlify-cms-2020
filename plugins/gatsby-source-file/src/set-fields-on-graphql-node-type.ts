import { GraphQLObjectType, GraphQLString } from 'gatsby/graphql'
import { buildMDHash, buildFileNameShort } from './libs/file-name-builder'
import { getAudioPath, getSiteUrl } from './libs/option-parser'

// =====================================================
let MP3Type = new GraphQLObjectType({
    name: 'Mp3',
    fields: {
      absoluteUrl: { type: GraphQLString },
      url: { type: GraphQLString },
      path: { type: GraphQLString }
    },
  });
  
  module.exports = ({ type }, option) => {
    const siteUrl = getSiteUrl(option)
  
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
  
          const { templateKey, slug, title, channel } = frontmatter
          const audioPath = getAudioPath(option)
  
          const fileName = buildFileNameShort(channel, slug, 'mp3') // (slug, title, rawMarkdownBody, 'mp3')
          const mp3FilePath = `${process.cwd()}/.cache/${audioPath}/${fileName}`
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