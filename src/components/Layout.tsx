import React from 'react'
import { Helmet } from 'react-helmet'
import Footer from './Footer'
import Navbar from './Navbar'
import useSiteMetadata from '../utils/SiteMetadata'

const Layout:React.FC = (props) => {
  const { title, description, lang } = useSiteMetadata()
  return (
    <div>
      <Helmet>
        <html lang={lang} />
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Navbar />
      <div>{props.children}</div>
      <Footer />
    </div>
  )
}

export default Layout
