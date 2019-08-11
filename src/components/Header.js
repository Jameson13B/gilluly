import React from 'react'
import styled, { keyframes } from 'styled-components'

import logo from '../assets/mountain_logo.jpg'
import AccountCircle from '@material-ui/icons/AccountCircle'

const Header = props => {
  const handleMenuClick = () => props.toggleLogin()
  return (
    <HeaderContainer>
      <Logo src={logo} />
      <h3>Gilluly Planner</h3>
      {props.user ? (
        <Profile src={props.user.photoURL} onClick={handleMenuClick} />
      ) : (
        <AccountButton onClick={handleMenuClick} />
      )}
    </HeaderContainer>
  )
}

export default Header

const HeaderContainer = styled.div`
  align-items: center;
  background: white;
  color: #282c34;
  display: flex;
  height: 10vh;
  justify-content: space-between;
  padding: 15px;
  width: 100%;
`
const spin = keyframes`
  { 100% { transform:rotate(360deg); } }
`
const Logo = styled.img`
  border-radius: 50%;
  height: 100%;
  transform-origin: 50% 50%;
  :hover {
    animation: ${spin} 0.5s linear;
  }
`
const AccountButton = styled(AccountCircle)`
  font-size: 2rem !important;
  path {
    transform-origin: 50% 50%;
  }
  :hover {
    path {
      transform: scale(1.2);
    }
  }
`
const Profile = styled.img`
  border-radius: 50%;
  transform-origin: 50% 50%;
  width: 2.5rem;
  :hover {
    transform: scale(1.2);
  }
`
