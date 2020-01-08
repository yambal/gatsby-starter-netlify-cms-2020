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
        </Helmet>
        <Navbar />
        {props.children}
        <Footer />
      </React.Fragment>
    </ThemeProvider>
  )
}

export default Layout
