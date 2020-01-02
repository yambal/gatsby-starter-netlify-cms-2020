import React from 'react'
var _ = require('lodash');
import { Link } from 'gatsby'
import Content from '../Content'
import styled from 'styled-components';
import Container from '../Container';
import Column from '../atoms/Column';
import { Helmet } from 'react-helmet';
import PageTitle from '../atoms/PageTitle';

interface iBlogPostPage {
  content: any
  contentComponent: any
  description: string
  tags: string[]
  title: string
  date: Date
}

const Wrapper = styled.section``

export const BlogPostPage:React.FC<iBlogPostPage> = (props) => {
  const PostContent = props.contentComponent || Content

  return (
    <Wrapper>
      <Helmet>
        <title>{`${props.title}`}</title>
        <meta
          name="description"
          content={`${props.description}`}
        />
      </Helmet>
      <PageTitle
        description={props.description}
        date={props.date}
      >
        {props.title}
      </PageTitle>
      <Container>
        <Column>
          <PostContent content={props.content} />
          {props.tags && props.tags.length ? (
            <div style={{ marginTop: `4rem` }}>
              <h4>Tags</h4>
                {props.tags.map(tag => (
                  <Link to={`/tags/${_.kebabCase(tag)}/`}>{tag}</Link>
                ))}
            </div>
          ) : null}
        </Column>
      </Container>
    </Wrapper>
  )
}

export default BlogPostPage
