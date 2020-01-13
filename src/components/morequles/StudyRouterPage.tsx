import React from 'react'
import StudyPage from '../pages/StadyPage';

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
      {study && page && <StudyPage
        title={study.node.frontmatter.title}
        pageTitle={page.pagetitle}
        pageNum={pageNum}
        pageSections={page.sections}
      />}
    </React.Fragment>
  )
}

export default StudyRouterPage