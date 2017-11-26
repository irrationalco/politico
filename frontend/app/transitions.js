import Ember from "ember";

export default function() {
    let duration = 600;
    this.transition(
        this.fromRoute('polls.sections.approval'),
        this.toRoute('polls.sections.vote'),
        this.use('toRight', {duration: duration }),
        this.reverse('toLeft', { duration: duration })
    );

    this.transition(
    	this.hasClass('expandedVoter'),

		  // this makes our rule apply when the liquid-if transitions to the
		  // true state.
		  this.toValue(true),
		  this.use('toDown', {duration: 300}),

		  // which means we can also apply a reverse rule for transitions to
		  // the false state.
		  this.reverse('toUp', {duration: 300})
  	);
}

