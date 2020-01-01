import React from 'react'
import { Link } from 'gatsby'
import Features from '../Features'
import BlogRoll from '../BlogRoll'
import styled from 'styled-components'
import Column from '../atoms/Column'

interface iIndexPagePage {
  image: any | string
  title: string
  heading: string
  subheading: string
  mainpitch: any
  description: string
  intro: {
    blurbs: any[]
  }
}

const Wrapper = styled.div``

const IndexPagePage:React.SFC<iIndexPagePage> = (props) => {
  const { image, title, heading, subheading, mainpitch, description, intro } = props

  return (
    <Wrapper>
      <Column>
        <div
          className="full-width-image margin-top-0"
          style={{
            backgroundImage: `url(${
              !!image.childImageSharp ? image.childImageSharp.fluid.src : image
            })`,
            backgroundPosition: `top left`,
            backgroundAttachment: `fixed`,
          }}
        >
          <h2>{title}</h2>
          {subheading}
        </div>
        <h3>{mainpitch.title}</h3>
        {mainpitch.description}

        {heading}
        {description}
        <Features gridItems={intro.blurbs} />

        <h3 className="has-text-weight-semibold is-size-2">
          Latest stories
        </h3>
        <BlogRoll />
        <Link className="btn" to="/blog">
          Read more
        </Link>
      </Column>
    </Wrapper>
  )
}

export default IndexPagePage
