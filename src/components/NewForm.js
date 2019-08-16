import React, { Component } from 'react'
import styled from 'styled-components'
import { auth, db } from '../firestore'

import Close from '@material-ui/icons/Close'

class NewForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      tag: 'Store',
      id: null,
      user: null,
      feedback: null
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user })
      }
    })
  }
  handleInputChange = e => this.setState({ [e.target.name]: e.target.value })
  createItem = item => {
    if (!item.name || !item.tag) {
      return this.setState({ feedback: 'Cannot add a blank item' })
    }
    db.collection('items')
      .add(item)
      .then(() => {
        this.setState({ name: '', tag: '', feedback: null })
        this.props.toggleNewForm()
      })
      .catch(feedback => this.setState({ feedback }))
  }

  render() {
    let newItem = {
      name: this.state.name,
      postedBy: this.state.user
        ? this.state.user.displayName.split(' ')[0]
        : 'Guest',
      tag: this.state.tag,
      done: false
    }
    return (
      <FormContainer>
        <FormContent
          onSubmit={e => {
            e.preventDefault()
            this.createItem(newItem)
          }}
        >
          <CloseButton onClick={this.props.toggleNewForm} />

          <h1>New Item</h1>
          <FormLabel>Item Name:</FormLabel>
          <Input
            name='name'
            placeholder='Item Name'
            value={this.state.name}
            onChange={this.handleInputChange}
          />
          <FormLabel>Tag:</FormLabel>
          <Dropdown
            name='tag'
            value={this.state.tag}
            onChange={this.handleInputChange}
          >
            <option value='store'>Store</option>
            <option value='home'>Home</option>
            <option value='dad'>Dad</option>
          </Dropdown>
          {this.state.feedback ? (
            <Feedback>{this.state.feedback}</Feedback>
          ) : null}
          <FormButton type='submit'>Create</FormButton>
        </FormContent>
      </FormContainer>
    )
  }
}

export default NewForm

const FormContainer = styled.div`
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  height: 100vh;
  justify-content: center;
  position: fixed;
  width: 100vw;
  z-index: 1;
`
const FormContent = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  position: relative;
  top: 20%;
  width: 100%;
  text-align: center;
`
const FormButton = styled.button`
  background: white;
  border: solid #282c34 5px;
  box-shadow: 0 0 3pt 2pt white;
  border-radius: 15px;
  color: #282c34;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 25px;
  padding: 15px 30px;
  :hover {
    background: #ddd;
    box-shadow: 0 0 3pt 2pt #ddd;
  }
`
const Input = styled.input`
  background: rgba(255, 255, 255, 0.2);
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: 2px solid white;
  border-radius: 10px;
  color: white;
  font-size: 1.5rem;
  margin: 0 0 25px 0;
  padding-left: 10px;
  :focus {
    outline: none;
  }
`
const Dropdown = styled.select`
  background: rgba(255, 255, 255, 0.2);
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: 2px solid white;
  border-radius: 10px;
  color: white;
  font-size: 1.25rem;
  margin: 0 0 25px 0;
  padding-left: 10px;
  :focus {
    outline: none;
  }
`
const FormLabel = styled.label`
  align-self: start;
  font-size: 0.75em;
  margin-bottom: 10px;
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
const Feedback = styled.p`
  color: red;
  font-size: 1rem;
  margin-top: 0;
`
