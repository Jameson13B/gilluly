import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { db, Timestamp } from '../firestore'

const ActionCard = (props) => {
  const [editing, setEditing] = useState(false)
  const [date, setDate] = useState(null)
  const [input, setInput] = useState()
  const [dateId, setDateId] = useState()

  useEffect(() => {
    db.collection('nextEvent')
      .where('done', '==', false)
      .onSnapshot((res) => {
        setDateId(res.docs[0].id)
        setDate(res.docs[0].data().date.toDate())
      })
  }, [])

  const saveDate = (e) => {
    const isNotSameDate = new Date(input + ' 12:00:00 AM') !== date

    if (isNotSameDate) {
      const collection = db.collection('nextEvent')

      // Add new event
      collection
        .add({
          date: Timestamp.fromDate(new Date(input + ' 12:00:00 AM')),
          done: false,
        })
        .then((res) => {
          // Update the last date to done
          collection.doc(dateId).update({
            done: true,
          })
          // Set the new date ID
          setDateId(res.id)
          // Set the new date
          setDate(input)
          // Return to default view
          setEditing(false)
        })
    } else if (!isNotSameDate) {
      alert('Current date is already saved.')
    }
  }
  const getTodayDate = (todaysDate) => {
    const year = todaysDate.getFullYear()
    const month = ('0' + (todaysDate.getMonth() + 1)).slice(-2)
    const day = ('0' + todaysDate.getDate()).slice(-2)

    return year + '-' + month + '-' + day
  }

  return (
    <ActionCardContainer>
      {editing ? (
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <input
            value={moment(input).format('YYYY-MM-DD')}
            onChange={(e) => setInput(e.target.value)}
            onBlur={saveDate}
            min={getTodayDate(new Date())}
            type="date"
          />
        </div>
      ) : (
        <h4 onClick={() => setEditing(true)}>
          Next Camping Event: {date ? moment(date).format('MMMM Do') : 'Loading...'}
        </h4>
      )}
    </ActionCardContainer>
  )
}

export default ActionCard

const ActionCardContainer = styled.div`
  background: white;
  border-radius: 15px;
  color: #282c34;
  height: 6%;
  margin: 2% 0 1% 0;
  max-width: 550px;
  text-align: center;
  width: 92%;
  h4 {
    margin: 0;
    cursor: pointer;
    line-height: 10vh;
  }
  input {
    border: 3px solid orange;
    font-size: 1.5rem;
    margin: 6% auto;
  }
  button {
    background: orange;
    border: 1px solid orange;
    border-radius: 15px;
    color: #282c34;
    margin: 6% auto;
  }
`
