import { graphql, useStaticQuery } from 'gatsby'

interface iSiteMetaData {
  title: string
  description: string
  lang: string
  activeEnv: string
}

const useSiteMetadata = ():iSiteMetaData => {
  const { site } = useStaticQuery(
    graphql`
      query SITE_METADATA_QUERY {
        site {
          siteMetadata {
            title
            description
            lang
            activeEnv
          }
        }
      }
    `
  )
  return site.siteMetadata
}

export default useSiteMetadata
