import React from 'react'
import { HTMLContent } from '../Content'
const remark = require('remark');
const remarkHTML = require('remark-html');
import { graphql } from 'gatsby'

interface iSyudyPage {
  title:string
  pageNum: number
  pageTitle: string
  pageSections: any []
}

const StudyPage:React.FC<iSyudyPage> = props => {

  return (
    <React.Fragment>
    <h1>{props.title}</h1>
    <h2>{props.pageNum}. {props.pageTitle}</h2>
    {props.pageSections.map(
      (section) => {
        const html = remark()
        .use(remarkHTML)
        .processSync(section.body)
        .toString();

        return <React.Fragment>
            <h3>{section.sectiontitle}</h3>
            <p>{section.sectionescription}</p>
            <HTMLContent content={html}/>
          </React.Fragment>
      }
    )}
    </React.Fragment>
  )
}

export default StudyPage