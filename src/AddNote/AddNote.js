import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import ValidationError from '../ValidationError/ValidationError'
import config from '../config'
import './AddNote.css'

export default class AddNote extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      noteName: '',
      noteFolder: '',
      noteNameValid: false,
      noteFolderValid: false,
      formValid: false,
      validationMessages: {
        noteTitle: '',
        noteFolder: ''
      }
    }
  }

  updateNoteName(noteName) {
    this.setState({noteName}, () => {this.validateNoteName(noteName)});
  }

  updateNoteFolder(noteFolder) {
    this.setState({noteFolder}, () => {this.validateNoteFolder(noteFolder)});
  }

  validateNoteName(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.noteTitle = 'Please type a Name for this Note';
      hasError = true;
    }

    this.setState({
      validationMessages: fieldErrors,
      noteNameValid: !hasError
    }, this.formValid);
  }

  validateNoteFolder(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    if(fieldValue === "empty") {
      fieldErrors.noteFolder = 'Please select a folder';
      hasError = true;
    }

    this.setState({
      validationMessages: fieldErrors,
      noteFolderValide: !hasError
    }, this.formValid);
  }

  formValid() {
    this.setState({
      formValide: this.state.noteNameValid && this.state.noteFolderValid
    });
  }

  static contextType = ApiContext;

  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
      name: e.target['note-name'].value,
      content: e.target['note-content'].value,
      folder_id: e.target['note-folder-id'].value,
      date_modified: new Date(),
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/folder/${note.folder_id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='note-name' onChange={e => this.updateNoteName(e.target.value)} />
            <ValidationError hasError={!this.state.noteNameValid} message={this.state.validationMessages.noteTitle} />
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content' />
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id' onChange={e => this.updateNoteFolder(e.target.value)}>
              <option value="empty">...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
            <ValidationError hasError={!this.state.noteFolderValid} message={this.state.validationMessages.noteFolder} />
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.formValid}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
