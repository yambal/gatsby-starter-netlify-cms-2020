import React from 'react'
import { Helmet } from 'react-helmet'
import Footer from './Footer'
import Navbar from './Navbar'
import useSiteMetadata from '../utils/SiteMetadata'
import { ThemeProvider } from 'styled-components'
import theme from '../theme'
import GlobalStyle from '../GlobalStyle'

interface iLayout {
  dark?: boolean
}

const Layout:React.FC<iLayout> = props => {
  const { title, description, lang } = useSiteMetadata()
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <GlobalStyle dark={props.dark} />
        <Helmet>
          <html lang={lang} />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="google-site-verification" content="w6usTsTWrWRLKf0S6C5g9O0G-jb5eWISBKXOTQoObd0" />
          <link rel="alternate" type="application/rss+xml" href="/podcast-test.rss" title="WWW.YAMBAL.NET Podcast" />
        </Helmet>
        <Navbar />
        {props.children}
        <Footer />
      </React.Fragment>
    </ThemeProvider>
  )
}

export default Layout
