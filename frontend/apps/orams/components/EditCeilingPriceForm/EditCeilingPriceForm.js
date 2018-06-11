import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Control } from 'react-redux-form'
import ErrorBox from 'shared/form/ErrorBox'
import Textfield from 'shared/form/Textfield'
import formProps from 'shared/form/formPropsSelector'
import { validMoreThanMinPrice } from 'shared/validators'
import styles from './EditCeilingPriceForm.scss'

class EditCeilingPriceForm extends Component {
  renderHeading() {
    const { serviceToEdit, supplier, goToStep, priceData } = this.props
    const { region } = priceData
    const supplierName = supplier ? supplier.name : ''

    return (
      <header>
        <h1 className="au-display-xl">
          {`${supplierName} - ${region.state} ${region.name} - ${serviceToEdit.serviceName}`}
        </h1>
        <h2 className="au-display-lg"> Update ceiling prices - edit ceiling price</h2>
        <div className={styles.stepTitle}>Step 3 of 3</div>
        <div className={styles.backLink} onClick={() => goToStep(2)}>
          Back to pricing information
        </div>
      </header>
    )
  }

  render() {
    const { model, action, submitClicked, priceData, handlePriceSubmit } = this.props
    let hasFocused = false

    const setFocus = e => {
      if (!hasFocused) {
        hasFocused = true
        e.focus()
      }
    }

    return (
      <div className={styles.container}>
        {this.renderHeading()}
        <article role="main">
          <ErrorBox model={model} setFocus={setFocus} submitClicked={submitClicked} />
          <Form
            model={model}
            action={action}
            id="EditCeilingPrice__create"
            onSubmit={data => handlePriceSubmit(data, priceData.capPriceId)}
          >
            <Textfield
              model={`${model}.ceilingPrice`}
              name="ceilingPrice"
              id="ceilingPrice"
              htmlFor="ceilingPrice"
              label="Enter a new ceiling price including GST"
              description={`The new ceiling price must not be less than $${priceData.price}`}
              defaultValue={priceData.capPrice}
              validators={{ validMoreThanMinPrice: validMoreThanMinPrice(priceData.price) }}
              messages={{
                validMoreThanMinPrice: `Ceiling price must be valid and more than $${priceData.price}`
              }}
            />
            <div className="question-heading au-text-input__label">
              Check box if you want to set current price to match
            </div>
            <div className={styles.ceilingPriceCheckbox}>
              <label className="au-control-input au-control-input--full" htmlFor="setCurrentPriceToCeiling">
                <Control.checkbox
                  model={`${model}.setCurrentPriceToCeiling`}
                  id="setCurrentPriceToCeiling"
                  name="setCurrentPriceToCeiling"
                  value="yes"
                  mapProps={{
                    className: 'au-control-input__input match-ceiling-price__checkbox'
                  }}
                />
                <span className="au-control-input__text">Set current price to match</span>
              </label>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-11">
                <button type="submit" className="au-btn">
                  Save and return to region list
                </button>
              </div>
            </div>
          </Form>
        </article>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...formProps(state, 'editCeilingPriceForm')
})

export { mapStateToProps, EditCeilingPriceForm as Form }

export default connect(mapStateToProps)(EditCeilingPriceForm)
