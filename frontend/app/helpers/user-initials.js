import Ember from 'ember';

export default Ember.Helper.helper( arrayName => {
	let name = arrayName[0] + " " + arrayName[1];
	let initials = name.replace(/[^\x00-\x7F]/g, '').match(/\b[a-zA-Z]/g);

	if(initials) { 
		return initials.join('').slice(0,2).toUpperCase();
	} else {
		return '-';
	}
});
