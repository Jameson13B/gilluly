import React, { Component } from 'react'
import styled from 'styled-components'
import { auth, googleProvider } from '../firestore'

import logo from '../assets/mountain_logo.jpg'
import Close from '@material-ui/icons/Close'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentWillMount() {
    if (this.props.user) {
      this.setState({ user: this.props.user })
    } else {
      auth.onAuthStateChanged(user => {
        if (user) {
          this.setState({ user })
        }
      })
    }
  }
  closeMenu = () => this.props.toggleLogin()
  handleLogin = () => {
    auth.signInWithPopup(googleProvider)
  }
  handleLogout = () => {
    this.props.logout()
    auth.signOut().then(() => {
      this.setState({ user: null })
    })
  }

  render() {
    return (
      <LoginContainer>
        <LoginContent>
          <CloseButton onClick={this.closeMenu} />

          {this.state.user ? (
            <div>
              <ProfilePhoto src={this.state.user.photoURL} />
              <h1>Welcome</h1>
              <h3>{this.state.user.displayName}</h3>
              <LogoutButton onClick={this.handleLogout}>Logout</LogoutButton>
            </div>
          ) : (
            <div>
              <Logo src={logo} />
              <h1>Welcome!</h1>
              <h3>Login to customize your experience.</h3>
              <LoginButton onClick={this.handleLogin}>Login</LoginButton>
            </div>
          )}
        </LoginContent>
      </LoginContainer>
    )
  }
}

export default Login

const LoginContainer = styled.div`
  background: rgba(0, 0, 0, 0.9);
  height: 100vh;
  position: fixed;
  width: 100vw;
  z-index: 1;
`
const LoginContent = styled.div`
  position: relative;
  top: 20%;
  width: 100%;
  text-align: center;
`
const Logo = styled.img`
  border-radius: 50%;
  max-width: 100px;
  width: 50%;
`
const LoginButton = styled.button`
  background: white;
  border: solid #282c34 5px;
  box-shadow: 0 0 3pt 2pt white;
  border-radius: 15px;
  color: #282c34;
  font-size: 1rem;
  font-weight: bold;
  padding: 15px 30px;
  :hover {
    background: #ddd;
    box-shadow: 0 0 3pt 2pt #ddd;
  }
`
const ProfilePhoto = styled.img`
  border-radius: 50%;
  max-width: 210px;
  width: 50%;
`
const LogoutButton = styled.button`
  background: white;
  border: solid #282c34 5px;
  box-shadow: 0 0 3pt 2pt white;
  border-radius: 15px;
  color: #282c34;
  font-size: 1rem;
  font-weight: bold;
  padding: 15px 30px;
  :hover {
    background: #ddd;
    box-shadow: 0 0 3pt 2pt #ddd;
  }
`
const CloseButton = styled(Close)`
  font-size: 2.25rem !important;
  position: fixed;
  top: 20px;
  right: 20px;
  path {
    transform-origin: 50% 50%;
  }
  :hover {
    path {
      transform: scale(1.2);
    }
  }
`
