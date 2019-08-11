import React, { Component } from 'react'
import styled from 'styled-components'
import { auth } from './firestore'

import Header from './components/Header'
import Login from './components/Login'
import ActionCard from './components/ActionCard'
import Checklist from './components/Checklist'
import ItemForm from './components/ItemForm'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLogin: false,
      user: null
    }
  }

  componentWillMount() {
    auth.onAuthStateChanged(user => {
      user && this.setState({ user })
    })
  }
  toggleLogin = () => this.setState({ showLogin: !this.state.showLogin })
  handlelogout = () => this.setState({ user: null })
  editItem = (bool, item) => {
    this.setState({ item, creating: bool })
  }

  render() {
    return (
      <AppContainer>
        <Header toggleLogin={this.toggleLogin} user={this.state.user} />
        <ActionCard />
        <Checklist />
        <ItemForm />

        {this.state.showLogin ? (
          <Login
            toggleLogin={this.toggleLogin}
            logout={this.handlelogout}
            user={this.state.user}
          />
        ) : null}
      </AppContainer>
    )
  }
}

export default App

const AppContainer = styled.div`
  align-items: center;
  background: #282c34;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  min-height: 100%;
  min-width: 100vw;
`
