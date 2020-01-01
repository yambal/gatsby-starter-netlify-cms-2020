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
      </Column>

      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column is-10 is-offset-1">
                <div className="content">
                  
                  <div className="columns">
                    <div className="column is-12 has-text-centered">
                      <Link className="btn" to="/products">
                        See all products
                      </Link>
                    </div>
                  </div>
                  <div className="column is-12">
                    <h3 className="has-text-weight-semibold is-size-2">
                      Latest stories
                    </h3>
                    <BlogRoll />
                    <div className="column is-12 has-text-centered">
                      <Link className="btn" to="/blog">
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  )
}

export default IndexPagePage
