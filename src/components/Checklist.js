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
      desc: false,
      allStatus: 'multiple',
      filter: 'all'
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
  renderBox = () => (this.state.allStatus === 'unchecked' ? <UnBox /> : <Box />)
  setFilter = e => this.setState({ filter: e.target.name })

  render() {
    return (
      <ChecklistContainer>
        <FilterBar>
          <FilterButton
            onClick={this.setFilter}
            active={this.state.filter === 'all'}
            name='all'
          >
            All
          </FilterButton>
          <FilterButton
            onClick={this.setFilter}
            active={this.state.filter === 'store'}
            name='store'
          >
            Store
          </FilterButton>
          <FilterButton
            onClick={this.setFilter}
            active={this.state.filter === 'home'}
            name='home'
          >
            Home
          </FilterButton>
          <FilterButton
            onClick={this.setFilter}
            active={this.state.filter === 'dad'}
            name='dad'
          >
            Dad
          </FilterButton>
        </FilterBar>
        <Titles>
          {this.renderBox()}
          <Name onClick={() => this.setState({ desc: !this.state.desc })}>
            Item
          </Name>
          <PostedBy>Poster</PostedBy>
        </Titles>
        <ItemList empty={this.state.items === null || !this.state.items.length}>
          {this.state.items.length ? (
            this.state.items
              .filter(item =>
                this.state.filter === 'all'
                  ? item
                  : item.tag === this.state.filter
              )
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
  max-width: 550px;
  width: 100%;
`
const FilterBar = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 1% 0 2% 0;
`
const FilterButton = styled.button`
  background: ${props => (props.active ? '#282c34' : 'white')};
  border: ${props => (props.active ? 'solid white 5px' : 'solid #282c34 5px')};
  box-shadow: ${props =>
    props.active ? '0 0 3pt 2pt #282c34' : '0 0 3pt 1pt white'};
  border-radius: 15px;
  color: ${props => (props.active ? 'white' : '#282c34')};
  font-size: 1rem;
  width: 15%;
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
