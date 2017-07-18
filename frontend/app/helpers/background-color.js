import Ember from 'ember';

const { isEmpty } = Ember;

export function backgroundColor([color, ...rest]) {
	let hexColor = isEmpty(color) ? "#cccccc" : color;
	return Ember.String.htmlSafe("background-color: " + hexColor);
}
export default Ember.Helper.helper(backgroundColor);