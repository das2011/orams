import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form } from 'react-redux-form'
import formProps from 'shared/form/formPropsSelector'
import Textfield from 'shared/form/Textfield'

class CreateReferralForm extends Component {
  static propTypes = {
    handleSearchSubmit: PropTypes.func.isRequired
  }

  handleSubmit(data) {
  }

  render() {
    const { model } = this.props

    return (
      <div>
        <Form model={model} id="createReferral" action="" onSubmit={data => this.handleSubmit(data)}>
          <Textfield
            model={`${model}.field1`}
            name="field1"
            id="field1"
            htmlFor="field1"
            label="field1"
            description="field1"
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
  ...formProps(state, 'createReferralForm')
})

export { Textfield, mapStateToProps, CreateReferralForm as Form }

export default connect(mapStateToProps)(CreateReferralForm)
