import React from 'react'
import styled from 'styled-components'

import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBox from '@material-ui/icons/CheckBox'
import { db } from '../firestore'

const Item = props => {
  let buttonPressTimer

  const handleLongPress = e => {
    e.persist()
    const id = e.currentTarget.dataset.id
    buttonPressTimer = setTimeout(() => deleteItem(id), 2000)
  }
  const handleLongRelease = e => {
    e.persist()
    console.log('clear timeout')
    clearTimeout(buttonPressTimer)
  }
  const handleToggleStatus = (id, bool) => {
    db.collection('items')
      .doc(id)
      .update({ done: bool })
      .then(res => props.handleMultipleCheck())
      .catch()
  }
  const deleteItem = id => {
    db.collection('items')
      .doc(id)
      .delete()
      .catch(feedback => this.setState({ feedback }))
  }

  return (
    <ItemContainer
      data-id={props.item.id}
      onTouchStart={handleLongPress}
      onTouchEnd={handleLongRelease}
      onTouchMove={handleLongRelease}
      onMouseDown={handleLongPress}
      onMouseUp={handleLongRelease}
      onMouseLeave={handleLongRelease}
    >
      {props.item.done ? (
        <Checked onClick={() => handleToggleStatus(props.item.id, false)} />
      ) : (
        <UnChecked onClick={() => handleToggleStatus(props.item.id, true)} />
      )}
      <Name done={props.item.done}>{props.item.name}</Name>
      <PostedBy done={props.item.done}>{props.item.postedBy}</PostedBy>
    </ItemContainer>
  )
}

export default Item

const ItemContainer = styled.div`
  align-items: center;
  border: 1px solid white;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  margin: 15px 10px;
  padding: 0 10px 0 0;
`
const UnChecked = styled(CheckBoxOutlineBlank)`
  flex: 1;
  margin: 10px;
  transform-origin: 50% 50%;
  :hover {
    transform: scale(1.2);
  }
`
const Checked = styled(CheckBox)`
  flex: 1;
  margin: 10px;
  transform-origin: 50% 50%;
  :hover {
    transform: scale(1.2);
  }
`
const Name = styled.h5`
  flex: 3;
  margin: 10px;
  overflow: hidden;
  text-decoration: ${props => (props.done ? 'line-through' : 'none')};
`
const PostedBy = styled.h5`
  flex: 1;
  font-style: italic;
  margin: 10px;
  overflow: hidden;
  text-decoration: ${props => (props.done ? 'line-through' : 'none')};
`
