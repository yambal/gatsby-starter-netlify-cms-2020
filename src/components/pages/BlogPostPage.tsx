import React from 'react'
var _ = require('lodash');
import { Link } from 'gatsby'
import Content from '../Content'
import styled from 'styled-components';
import Container from '../Container';
import Column from '../atoms/Column';

interface iBlogPostPage {
  content: any
  contentComponent: any
  description: string
  tags: string[]
  title: string
  helmet: any
}

const Wrapper = styled.section``

export const BlogPostPage:React.FC<iBlogPostPage> = (props) => {
  const PostContent = props.contentComponent || Content

  return (
    <Wrapper>
      <Container>
        <h1>{props.title}</h1>
        <Column>
          <p>{props.description}</p>
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
