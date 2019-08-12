import React, { Component } from 'react'
import styled from 'styled-components'
import { auth } from './firestore'

import Header from './components/Header'
import Login from './components/Login'
import ActionCard from './components/ActionCard'
import Checklist from './components/Checklist'
import NewForm from './components/NewForm'
import UpdateForm from './components/UpdateForm'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLogin: false,
      showNewForm: false,
      showUpdateForm: false,
      updateItemId: null,
      user: null
    }
  }

  componentWillMount() {
    auth.onAuthStateChanged(user => {
      user && this.setState({ user })
    })
  }
  toggleLogin = () => this.setState({ showLogin: !this.state.showLogin })
  toggleNewForm = () => this.setState({ showNewForm: !this.state.showNewForm })
  toggleUpdateForm = id =>
    this.setState({
      showUpdateForm: !this.state.showUpdateForm,
      updateItemId: id
    })
  handlelogout = () => this.setState({ user: null })
  editItem = (bool, item) => {
    this.setState({ item, creating: bool })
  }

  render() {
    return (
      <AppContainer>
        <Header toggleLogin={this.toggleLogin} user={this.state.user} />
        <ActionCard />
        <Checklist toggleUpdateForm={this.toggleUpdateForm} />
        <NewItemButton onClick={this.toggleNewForm}>Create Item</NewItemButton>

        {/* Modals */}
        {this.state.showLogin ? (
          <Login
            toggleLogin={this.toggleLogin}
            logout={this.handlelogout}
            user={this.state.user}
          />
        ) : null}
        {this.state.showNewForm ? (
          <NewForm toggleNewForm={this.toggleNewForm} />
        ) : null}
        {this.state.showUpdateForm ? (
          <UpdateForm
            updateItemId={this.state.updateItemId}
            toggleUpdateForm={this.toggleUpdateForm}
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
const NewItemButton = styled.button`
  background: white;
  border: solid #282c34 5px;
  box-shadow: 0 0 3pt 2pt white;
  border-radius: 15px;
  color: #282c34;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 25px;
  max-width: 500px;
  padding: 15px 30px;
  width: 100%;
  :hover {
    background: #ddd;
    box-shadow: 0 0 3pt 2pt #ddd;
  }
`
