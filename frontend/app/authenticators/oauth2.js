import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from '../config/environment';

export default OAuth2PasswordGrantAuthenticator.extend({
  serverTokenEndpoint: config.localhost + "/api/sessions"
});