import React from 'react'
var _ = require('lodash');
import { Link } from 'gatsby'
import Content from '../Content'

interface iBlogPostTemplate {
  content: any
  contentComponent: any
  description: string
  tags: string[]
  title: string
  helmet: any
}

export const BlogPostTemplate:React.FC<iBlogPostTemplate> = (props) => {
  const PostContent = props.contentComponent || Content

  return (
    <section className="section">
      {props.helmet || ''}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {props.title}
            </h1>
            <p>{props.description}</p>
            <PostContent content={props.content} />
            {props.tags && props.tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                <ul className="taglist">
                  {props.tags.map(tag => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${_.kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogPostTemplate
