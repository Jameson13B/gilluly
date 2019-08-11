import React, { Component } from 'react'
import styled from 'styled-components'

import Item from './Item'
import CheckBox from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank'
import { db } from '../firestore'

class Checklist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      allStatus: 'multiple'
    }
  }

  componentDidMount() {
    db.collection('items').onSnapshot(res => {
      let items = []
      res.forEach(doc => {
        let item = doc.data()
        item.id = doc.id
        items.push(item)
      })
      this.setState({ items })
    })
  }
  handleToggleAll = (allStatus, bool) => {
    db.collection('items')
      .get()
      .then(items => {
        items.forEach(doc => {
          var itemRef = db.collection('items').doc(doc.id)

          this.setState({ allStatus })

          return itemRef.update({
            done: bool
          })
        })
      })
  }
  handleMultipleCheck = () => this.setState({ allStatus: 'multiple' })
  renderBox = () =>
    this.state.allStatus === 'unchecked' ? (
      <UnBox onClick={() => this.handleToggleAll('checked', false)} />
    ) : (
      <Box onClick={() => this.handleToggleAll('unchecked', true)} />
    )

  render() {
    return (
      <ChecklistContainer>
        <Titles>
          {this.renderBox()}
          <Name>Item</Name>
          <PostedBy>Poster</PostedBy>
        </Titles>
        <ItemList empty={!this.state.items.length}>
          {this.state.items.length ? (
            this.state.items.map(item => (
              <Item
                key={item.id}
                item={item}
                handleMultipleCheck={this.handleMultipleCheck}
              />
            ))
          ) : (
            <h3>Loading...</h3>
          )}
        </ItemList>
      </ChecklistContainer>
    )
  }
}

export default Checklist

const ChecklistContainer = styled.div`
  flex: auto;
  max-height: 60vh;
  max-width: 550px;
  width: 100%;
`
const Titles = styled.div`
  align-items: center;
  display: flex;
  height: 10%;
  margin: 0 10px;
  justify-content: space-between;
  padding: 0 10px 0 0;
`
const Box = styled(CheckBox)`
  flex: 1;
  margin: 10px;
  transform-origin: 50% 50%;
  :hover {
    transform: scale(1.2);
  }
`
const UnBox = styled(CheckBoxOutlineBlank)`
  flex: 1;
  margin: 10px;
  transform-origin: 50% 50%;
  :hover {
    transform: scale(1.2);
  }
`
const Name = styled.h4`
  flex: 3;
  margin: 0 10px;
`
const PostedBy = styled.h4`
  flex: 1;
  margin: 0 10px;
`
const ItemList = styled.div`
  overflow: auto;
  max-height: 55vh;
  height: 55vh;
  text-align: ${props => (props.empty ? 'center' : 'left')};
`
