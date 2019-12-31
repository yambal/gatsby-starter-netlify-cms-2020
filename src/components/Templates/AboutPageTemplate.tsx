import React from 'react'
import Content from '../Content'

interface iAboutPageTemplate {
  title: string
  content: any
  contentComponent: any
}

const AboutPageTemplate:React.FC<iAboutPageTemplate> = (props) => {
  const PageContent = props.contentComponent || Content

  return (
    <section className="section section--gradient">
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="section">
              <h2 className="title is-size-3 has-text-weight-bold is-bold-light">
                {props.title}
              </h2>
              <PageContent className="content" content={props.content} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPageTemplate