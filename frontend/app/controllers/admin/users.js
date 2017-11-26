import Ember from 'ember';
import config from '../../config/environment';

const { service } = Ember.inject;

export default Ember.Controller.extend({
	session: service('session'),
	ajax: 	 service('ajax'),
	notify:  service('notify'),
	store: 	 service('store'),

	actions: {
		notAuthorized() {
			this.get('notify').alert("No tienes permisos para hacer este tipo de cambios, por favor contacta a Jorge.");
		},
		
		update(user) {
			this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
				this.get('ajax').put(config.localhost + '/api/users/' + user.get('id'), {
					headers: {
						[headerName]: headerValue
					},
					data: {
						user: { 
							email: user.get('email'), 
							first_name: user.get('firstName'),
							last_name:  user.get('lastName'),
							password:		user.get('password'),
							manager:  	user.get('manager'),
							supervisor: user.get('supervisor'),
							capturist:  user.get('capturist')
						}
					}
				})
				.then(() => {
					this.get('notify').success("Roles del usuario actualizados exitosamente!");
				})
				.catch(err => {
					console.log(err);
					this.get('notify').alert("Asegurate que todos los campos estan llenos de manera correcta.");
				});
			});
		},

		deleteUser(userId) {
			this.get('store').findRecord('user', userId, { backgroundReload: false }).then( user => {
				user.destroyRecord().then(() => {
					this.get('notify').alert("Deleted user successfully.", { closeAfter: null});
				}, (err) => {
					console.log(err);
					this.get('notify').alert("Error deleting user.", { closeAfter: null});
				});
			});
		}
	}
});