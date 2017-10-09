import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../../config/environment';
import { task } from 'ember-concurrency';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    session: Ember.inject.service(),
    fileUploader: task(function* (file) {
        let response = yield file.upload(config.localhost + '/api/voters/file_upload/' + this.get('session.currentUser').id, { accepts: 'text/csv' });
    }).enqueue(),

    actions: {
        uploadFile(file) {
            this.get('fileUploader').perform(file);
        }
    }
});
