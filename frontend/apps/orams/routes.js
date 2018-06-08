import React from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'
import PrivateRoute from 'orams/OramsAuthenticatedRoute'
import HomePage from 'orams/pages/HomePage'
import LoginPage from 'orams/pages/LoginPage'
import LogoutPage from 'orams/pages/LogoutPage'
import EditProfilePage from 'orams/pages/EditProfilePage'
import SellerCataloguePage from 'orams/pages/SellerCataloguePage'
import SellerProfilePage from 'orams/pages/SellerProfilePage'
import ProfilePage from 'orams/pages/ProfilePage'
import UserProfilePage from 'orams/pages/UserProfilePage'
import ReferralBuilderPage from 'orams/pages/ReferralBuilderPage'
import ViewReferralPage from 'orams/pages/ViewReferralPage'
import NotFound from 'shared/NotFound'
import ResetPasswordPage from 'orams/pages/ResetPasswordPage'
import PriceHistoryPage from 'orams/pages/PriceHistoryPage'
import TermsPage from 'orams/pages/TermsPage'
import PrivacyPolicyPage from 'orams/pages/PrivacyPolicyPage'
import SecurityPage from 'orams/pages/SecurityPage'
import DisclaimerPage from 'orams/pages/DisclaimerPage'
import CopyrightPage from 'orams/pages/CopyrightPage'
import SignupPage from 'orams/pages/SignupPage'
import InvitationPage from 'orams/pages/InvitationPage'
import CreatePasswordPage from 'orams/pages/CreatePasswordPage'
import AdminPage from 'orams/pages/AdminPage'

export const Routes = () =>
  <Switch>
    <Route exact path={'/'} component={HomePage} />
    <Route path={`/signup`} component={SignupPage} />
    <Route path={`/login`} component={LoginPage} />
    <Route path={`/logout`} component={LogoutPage} />
    <PrivateRoute path={`/admin`} component={AdminPage} />
    <PrivateRoute path={`/edit-profile`} component={EditProfilePage} />
    <PrivateRoute path={`/seller-catalogue`} component={SellerCataloguePage} />
    <PrivateRoute path={`/seller-profile/:id`} component={SellerProfilePage} />
    <PrivateRoute path={`/referral-builder/:id`} component={ReferralBuilderPage} />
    <PrivateRoute path={`/referrals/:id`} component={ViewReferralPage} />
    <PrivateRoute path={`/price-history`} component={PriceHistoryPage} />
    <PrivateRoute path={`/profile`} component={ProfilePage} />
    <PrivateRoute path={`/user-profile/:id`} component={UserProfilePage} />
    <Route path={`/reset-password`} component={ResetPasswordPage} />
    <Route path={`/terms-of-use`} component={TermsPage} />
    <Route path={`/privacy-policy`} component={PrivacyPolicyPage} />
    <Route path={`/security`} component={SecurityPage} />
    <Route path={`/disclaimer`} component={DisclaimerPage} />
    <Route path={`/copyright`} component={CopyrightPage} />
    <Route path={`/send-invite/:token`} component={InvitationPage} />
    <Route path={`/create-user/:token`} component={CreatePasswordPage} />
    <Route component={NotFound} />
  </Switch>

const RootContainer = withRouter(Routes)

export default RootContainer
