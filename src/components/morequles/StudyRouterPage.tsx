import React from 'react'
import { Router } from "@reach/router"

interface iStudyRouterPage {
  path: string
  slug?: string
  studies: any
}

const getStudy = (slug, studies) => {
  return studies.filter((study) => {
    return study.node.frontmatter.slug === slug
  })[0]
}

const getPageNum = (pageNumString: string):number | null => {
  if (pageNumString.length > 0) {
    return parseInt(pageNumString)
  } else {
    return null
  }
}

const StudyRouterPage:React.FC<iStudyRouterPage> = (props) => {
  /** Study */
  const [study, setStudy] = React.useState(getStudy(props.slug, props.studies))
  React.useEffect(
    () => {
      setStudy(getStudy(props.slug, props.studies))
    },
    [props.slug, props.studies]
  )

  /** PageNum */
  const [pageNum, setPageNum] = React.useState(getPageNum(props['*']))
  React.useEffect(
    () => {
      setPageNum(getPageNum(props['*']))
    },
    [props['*']]
  )


  const [page, setPage] = React.useState(null)
  React.useEffect(
    () => {
      if (typeof pageNum === 'number') {
        return setPage(study.node.frontmatter.pages[pageNum])
      }else{
        return setPage(null)
      }
    },
    [study, pageNum]
  )

  return (
    <React.Fragment>
      {study &&
        <React.Fragment>
        <h1>{study.node.frontmatter.title}</h1>
        {page && <React.Fragment>
        <h2>{pageNum}. {page.pagetitle}</h2>
            <p>{page.pagedescription}</p>
            {page.sections.map(
              (s) => {
                return <React.Fragment>
                    <h3>{s.sectiontitle}</h3>
                    <p>{s.sectionescription}</p>
                  </React.Fragment>
              }
            )}
          </React.Fragment>}
        </React.Fragment>
      }
    </React.Fragment>
  )
}

export default StudyRouterPage