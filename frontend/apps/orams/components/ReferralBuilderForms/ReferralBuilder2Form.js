/* eslint-disable */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form } from 'react-redux-form'

import { required, limitNumbers, validLinks, validABN } from 'shared/validators'
import Layout from 'shared/Layout'
import BaseForm from 'shared/form/BaseForm'
import ErrorBox from 'shared/form/ErrorBox'
import Textfield from 'shared/form/Textfield'
import formProps from 'shared/form/formPropsSelector'
import LoadingButton from 'shared/LoadingButton/LoadingButton'

import './ReferralBuilderForm.scss'

class ReferralBuilder2Form extends BaseForm {
  static propTypes = {
    action: PropTypes.string
  }

  render() {
    const {
      submitClicked,
      action,
      model,
      handleSubmit
    } = this.props
    let hasFocused = false
    const setFocus = e => {
      if (!hasFocused) {
        hasFocused = true
        e.focus()
      }
    }

    return (
      <Layout>
        <header>
          <h1 className="au-display-xl" tabIndex="-1">
            Please fill in details below step 2
          </h1>
        </header>
        <article role="main">
          <ErrorBox model={model} setFocus={setFocus} submitClicked={submitClicked}/>
          <Form
            model={model}
            action={action}
            id="ReferralBuilder2Form"
            validateOn="submit"
            onSubmit={data => handleSubmit(data)}
          >
            <Textfield
              model={`${model}.supervisorName`}
              name="supervisorName"
              id="supervisorName"
              htmlFor="supervisorName"
              label="Supervisor Name"
              validators={{ required }}
              messages={{
                required: 'Supervisor Name is required'
              }}
            />

            <Textfield
              model={`${model}.employerAgency`}
              name="employerAgency"
              id="employerAgency"
              htmlFor="employerAgency"
              label="Employer Agency"
              messages={{
                validABN: 'Employer Agency is required'
              }}
            />

            <button type="submit" className="au-btn">
              Continue
            </button>
          </Form>
        </article>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...formProps(state, 'referralBuilder2Form')
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export { Textfield, mapStateToProps, ReferralBuilder2Form as Form }

export default connect(mapStateToProps, mapDispatchToProps)(ReferralBuilder2Form)
