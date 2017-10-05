import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../../config/environment';
import { task } from 'ember-concurrency';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    fileUploader: task(function* (file) {
        let response = yield file.upload(config.localhost + '/api/voters/new/file_upload', { accepts: 'text/csv' });
    }).enqueue(),

    actions: {
        uploadFile(file) {
            this.get('fileUploader').perform(file);
        }
    }
});
