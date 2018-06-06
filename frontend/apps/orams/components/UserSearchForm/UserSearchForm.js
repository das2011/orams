import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form } from 'react-redux-form'
import formProps from 'shared/form/formPropsSelector'
import Textfield from 'shared/form/Textfield'

class UserSearchForm extends Component {
  static propTypes = {
    handleSearchSubmit: PropTypes.func.isRequired
  }

  handleSubmit(data) {
    const { userSearchTerm } = data
    const { handleSearchSubmit } = this.props
    handleSearchSubmit(userSearchTerm)
  }

  render() {
    const { model } = this.props

    return (
      <div>
        <Form model={model} id="userSearch" action="" onSubmit={data => this.handleSubmit(data)}>
          <Textfield
            model={`${model}.userSearchTerm`}
            name="userSearchTerm"
            id="userSearchTerm"
            htmlFor="userSearchTerm"
            label="Find user by partial email"
            description="e.g. searching for ca would give all users that email contains ca"
          />
          <button type="submit" className="au-btn">
            Search
          </button>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...formProps(state, 'userSearchForm')
})

export { Textfield, mapStateToProps, UserSearchForm as Form }

export default connect(mapStateToProps)(UserSearchForm)
