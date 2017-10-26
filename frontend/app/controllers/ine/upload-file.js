import Ember from 'ember';
import { task } from 'ember-concurrency';
import config from '../../config/environment';

export default Ember.Controller.extend({
    session: Ember.inject.service(),

    triedUpload: false,

    succesfulUpload: false,

    errorString: '',

    downloadAnswerFile: function (filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    fileUploader: task(function* (file) {
        console.log(file)
        let response = yield file.upload(config.localhost + '/api/voters/file_upload/' + this.get('session.currentUser').id, { accepts: 'text/csv' });
        console.log(response)
        this.set('triedUpload', true);
        this.set('succesfulUpload', response.status === 201);
        if (response.status === 201) {
            //succes
        } else if (response.status === 200) {
            //errores en algunos datos
            //regreso el csv con errores
            this.downloadAnswerFile('filas invalidas.csv', response.body);
            this.set('errorString', 'Se encontraron datos invalidos en el archivo, se empezará su descarga inmediatamente');
        } else {
            //algun otro error en el camino al server
            this.set('errorString', 'Hubo un error al subir el archivo, verifique su conección a internet');
        }
    }).enqueue(),

    actions: {
        uploadFile(file) {
            this.get('fileUploader').perform(file);
        }
    }
});