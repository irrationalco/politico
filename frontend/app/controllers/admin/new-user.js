import Ember from 'ember';
import config from '../../config/environment';

const { service } = Ember.inject;

export default Ember.Controller.extend({
	session: service('session'),
	ajax: 	 service('ajax'),

	actions: {
		create() {
			let { email, password } = this.getProperties('email', 'password');
			console.log("Have to create a new user and save it;");
			this.get('ajax').post(config.localhost + '/api/users', {
				data: {
					user: { email: email, password: password }
				}
			})
			.then(response => {
				console.log(response);
			})
			.catch(error => {
				console.log("Hubo error;");
				console.log(error);
			});

		}
	}

});


// export default Ember.Route.extend({
//   ajax: Ember.inject.service(),
//   model() {
//     const ajax = this.get('ajax');

//     return ajax.request('/user/doesnotexist')
//       .catch(function(error) {
//         if (isNotFoundError(error)) {
//           // handle 404 errors here
//           return;
//         }

//         if (isForbiddenError(error)) {
//           // handle 403 errors here
//           return;
//         }

//         if(isAjaxError(error)) {
//           // handle all other AjaxErrors here
//           return;
//         }

//         // other errors are handled elsewhere
//         throw error;
//       });
//   }
// });