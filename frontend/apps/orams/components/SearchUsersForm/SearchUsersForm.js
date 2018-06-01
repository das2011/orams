import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-redux-form'
import Textfield from '../../../shared/form/Textfield'
import { required } from '../../../shared/validators'

import styles from './SearchUsersForm.scss'

const SearchUsersForm = props => {
  const { model, submitClicked, handleSubmit } = props

  return (
    <div className="row">
      <Form model={model} id="searchUsers" onSubmit={data => handleSubmit(data)}>
        <Textfield
          model={`${model}.search_users`}
          name="search_users"
          id="search_users"
          htmlFor="search_users"
          label="Search users by email"
          validators={required}
          messages={{
            required: 'A name or email is required'
          }}
        />
        <p className={styles.buttonWrapper}>
          <input className="au-btn" type="submit" value="Search User" onClick={submitClicked} />
        </p>
      </Form>
    </div>
  )
}

SearchUsersForm.propTypes = {
  model: PropTypes.string.isRequired,
  submitClicked: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default SearchUsersForm
