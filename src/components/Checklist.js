import React, { Component } from 'react'
import styled from 'styled-components'
import orderBy from 'lodash/orderBy'

import Item from './Item'
import CheckBox from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank'
import { db } from '../firestore'

class Checklist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: null,
      desc: false,
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
          <Name onClick={() => this.setState({ desc: !this.state.desc })}>
            Item
          </Name>
          <PostedBy>Poster</PostedBy>
        </Titles>
        <ItemList empty={this.state.items === null || !this.state.items.length}>
          {this.state.items === null ? (
            <h3>List Empty</h3>
          ) : this.state.items.length ? (
            this.state.items
              .sort((a, b) =>
                this.state.desc
                  ? b.name.localeCompare(a.name)
                  : a.name.localeCompare(b.name)
              )
              .map(item => (
                <Item
                  key={item.id}
                  item={item}
                  onClick={this.props.toggleUpdateForm}
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
  cursor: pointer;
  flex: 1;
  margin: 10px;
  transform-origin: 50% 50%;
  :hover {
    transform: scale(1.2);
  }
`
const UnBox = styled(CheckBoxOutlineBlank)`
  cursor: pointer;
  flex: 1;
  margin: 10px;
  transform-origin: 50% 50%;
  :hover {
    transform: scale(1.2);
  }
`
const Name = styled.h4`
  cursor: pointer;
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
