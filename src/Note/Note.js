import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApiContext from '../ApiContext'
import config from '../config'
import './Note.css'

export default class Note extends React.Component {
  static defaultProps ={
    onDeleteNote: () => {},
  }
  static contextType = ApiContext;

  handleClickDelete = e => {
    e.preventDefault()
    const note_id = this.props.id
    console.log(note_id)

    fetch(`${config.API_ENDPOINT}/notes/${note_id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => {
        console.log(res)
        if (!res.ok) {
          // console.log('I ran')
          return res.json().then(e => Promise.reject(e))
        }
        this.context.deleteNote(note_id)
        // allow parent to perform extra behaviour
        this.props.onDeleteNote(note_id)
        // return res.json()  // not being used
      })
      // .then(() => {
      //   this.context.deleteNote(note_id)
      //   // allow parent to perform extra behaviour
      //   this.props.onDeleteNote(note_id)
      // })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { name, id, date_modified } = this.props
    // console.log(this.props)
    return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${id}`}>
            {name}
          </Link>
        </h2>
        <button
          className='Note__delete'
          type='button'
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(date_modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
      </div>
    )
  }
}
