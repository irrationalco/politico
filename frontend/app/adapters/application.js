import DS from 'ember-data';
import config from '../config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
	// host: config.host,
	host: 'http://localhost:3000',
  namespace: 'api',
  authorizer: 'authorizer:oauth2'
});