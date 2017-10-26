import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import config from '../../config/environment';
import { task } from 'ember-concurrency';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    session: Ember.inject.service(),

    triedToUpload: false,

    uploadSuccesful: false,

    downloadAnswerFile: function(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    fileUploader: task(function* (file) {
        let response = yield file.upload(config.localhost + '/api/voters/file_upload/' + this.get('session.currentUser').id, { accepts: 'text/csv' });
        console.log(response)
        this.set('triedToUpload', true);
        this.set('uploadSuccesful', response['content-type'] !== 'text/csv');
        if(this.uploadSuccesful){
            //todos los datos fueron validos
        }else{
            //regreso el csv con errores
            this.downloadAnswerFile('filas invalidas.csv', response.body);
        }
    }).enqueue(),

    actions: {
        uploadFile(file) {
            this.get('fileUploader').perform(file);
        }
    }
});
