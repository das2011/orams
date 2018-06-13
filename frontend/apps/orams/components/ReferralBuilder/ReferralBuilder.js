/* eslint-disable */
import React, { Component } from 'react'
import { withRouter, Switch, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import NotFound from 'shared/NotFound'
import PropTypes from 'prop-types'
import LoadingIndicatorFullPage from 'shared/LoadingIndicatorFullPage/LoadingIndicatorFullPage'
import LocalNav from 'shared/LocalNav'
import styles from './ReferralBuilder.scss'
import { uniqueID } from 'shared/utils/helpers'

import ReferralBuilder1Form from 'orams/components/ReferralBuilderForms/ReferralBuilder1Form'
import ReferralBuilder2Form from 'orams/components/ReferralBuilderForms/ReferralBuilder2Form'
import ReferralBuilder3Form from 'orams/components/ReferralBuilderForms/ReferralBuilder3Form'
import classNames from 'classnames'

class ReferralBuilder extends Component {
  static propTypes = {
    handleReferralBuilder1FormSubmit: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  goBack = () => {
    this.props.history.goBack()
  }

  handleReferralBuilder1FormSubmit = model => {
    const { handleReferralBuilder1FormSubmit } = this.props
    handleReferralBuilder1FormSubmit(model)
    window.scrollTo(0, 0)
  }

  steps = [
    {
      id: 'step1',
      label: 'step1 label',
      component: ReferralBuilder1Form,
      pattern: `/referral-builder/step1`,
      formKey: 'referralBuilder1Form'
    },
    {
      id: 'step2',
      label: 'step2 label',
      component: ReferralBuilder2Form,
      pattern: '/referral-builder/step2',
      formKey: 'referralBuilder2Form'
    },
    {
      id: 'step3',
      label: 'step3 label',
      component: ReferralBuilder3Form,
      pattern: '/referral-builder/step3',
      formKey: 'referralBuilder3Form'
    }
  ]

  renderReferralInfo() {
    const { referralInfoData, organisation } = this.props

    return (
      <div>
        <div>
          <main>
            <div className="row">
              <div className="col-xs-12 col-sm-9">
                <div className="au-display-xl">Send Referral</div>
              </div>
            </div>
          </main>
        </div>

        <div className={styles.separator}/>

        <div className={styles.informationSection}>
          <main>
            <div className="row">
              <div className="col-sm-8 col-xs-12">
                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Supplier</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div>
                      {referralInfoData.supplierName}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Services</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div>
                      {`${referralInfoData.categoryName} - ${referralInfoData.serviceName}`}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Operates in</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div>
                      {`${referralInfoData.regionState} ${referralInfoData.regionName}`}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Price</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div>
                      <span className={styles.priceElements}>
                        <div className={styles.price}>
                          {`$${referralInfoData.price} inc GST`}
                        </div>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-3 col-xs-12">
                    <div className={styles.title}>Buyer Organisation</div>
                  </div>
                  <div className="col-sm-8 col-sm-push-1 col-xs-12">
                    <div>
                      {organisation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <div className="row">
          <LocalNav className="col-xs-12 col-sm-3" navClassName="step-navigation" id="main-navigation">
            {this.steps.map(({ pattern, label }, id = uniqueID()) => {
              const isActive = location.pathname === pattern
              return (<li key={id}>
                  <Link to={pattern} className={classNames({ 'is-active is-current': isActive })}>
                    <span>{label}</span>
                  </Link>
                </li>
              )
            })}
          </LocalNav>

          <article className={'col-xs-12 col-sm-8 col-sm-push-1'}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={() => <ReferralBuilder1Form handleSubmit={this.handleReferralBuilder1FormSubmit}/>}
              /> />
              <Route
                path={`${match.url}/step2`}
                render={() => <ReferralBuilder2Form handleSubmit={this.handleReferralBuilder1FormSubmit}/>}
              /> />
              <Route
                path={`${match.url}/step3`}
                render={() => <ReferralBuilder3Form handleSubmit={this.handleReferralBuilder1FormSubmit}/>}
              /> />
              <Route component={NotFound}/>
            </Switch>
          </article>
        </div>

        <div/>

        <div>
          <main/>
        </div>
      </div>
    )
  }

  render() {
    const { referralInfoData, organisation } = this.props
    if (referralInfoData && organisation) {
      return this.renderReferralInfo()
    }
    return (
      <div>
        <LoadingIndicatorFullPage/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

export default connect(mapStateToProps)(ReferralBuilder)
