import React, { Component } from 'react'
import styled from 'styled-components'
import { auth, db } from '../firestore'

class ItemForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      user: null
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
    if (!item.name) {
      return alert('Cannot add a blank item')
    }
    db.collection('items')
      .add(item)
      .then(this.setState({ name: '' }))
      .catch(feedback => this.setState({ feedback }))
  }

  render() {
    let newItem = {
      name: this.state.name,
      postedBy: this.state.user
        ? this.state.user.displayName.split(' ')[0]
        : 'Guest',
      done: false
    }
    return (
      <Form
        onSubmit={e => {
          e.preventDefault()
          this.createItem(newItem)
        }}
        autoComplete='none'
      >
        <Input
          name='name'
          type='text'
          value={this.state.name}
          placeholder='Item Name'
          onChange={this.handleInputChange}
        />
        <SubmitButton type='submit'>Create Item</SubmitButton>
        {this.state.feedback ? (
          <Feedback>{this.state.feedback}</Feedback>
        ) : null}
      </Form>
    )
  }
}

export default ItemForm

const Form = styled.form`
  background: #282c34
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 4%;
  max-width: 550px;
  padding-top: 10px;
  width: 92%;
  z-index: 1;
`
const Input = styled.input`
  background: #282c34;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: 1px solid white;
  color: white;
  font-size: 1.25rem;
  margin: 0 0 15px 0;
  :focus {
    outline: none;
  }
`
const SubmitButton = styled.button`
  background: transparent;
  border: 1px solid white;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 10px;
  margin: 0 0 0 10px;
  :hover {
    background: #444;
  }
`
const Feedback = styled.p`
  color: red;
  font-size: 1rem;
  margin-top: 5px;
`
