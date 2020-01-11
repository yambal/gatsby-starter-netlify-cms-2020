import React from 'react'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { Router } from "@reach/router"
import { Link } from 'gatsby'

const StudyIndex: React.FC = () => {
  let Home = () => <div>Home</div>
  let Dash = () => <div>Dash</div>

  return(
    <Layout dark>
      <Container>
        <Link to="study/dashboard">test</Link>
        <Router>
          <Home path="study" />
          <Dash path="study/dashboard" />
        </Router>
      </Container>
    </Layout>
  )
}

export default StudyIndex