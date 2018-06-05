/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'
import UserProfile from 'orams/components/UserProfile/UserProfile'
import { loadUserProfileData } from 'orams/actions/adminSearchActions'

class UserProfilePage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  componentDidMount() {
    this.props.loadUserProfileData(this.props.match.params.id)
  }

  render() {
    const { match } = this.props

    return (
      <Switch>
        <Route exact path={match.url} render={() => <UserProfile id={match.params.id} {...this.props} />}/>
      </Switch>
    )
  }
}

UserProfilePage.propTypes = {
  match: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return {
    userProfileData: state.adminSearch.userProfileData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUserProfileData: id => dispatch(loadUserProfileData(id))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfilePage))
