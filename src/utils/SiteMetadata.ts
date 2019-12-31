import { graphql, useStaticQuery } from 'gatsby'

interface iSiteMetaData {
  title: string
  description: string
  lang: string
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
          }
        }
      }
    `
  )
  return site.siteMetadata
}

export default useSiteMetadata
