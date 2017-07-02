import Ember from "ember";

export default function() {
    let duration = 600;
    this.transition(
        this.fromRoute('polls.sections.approval'),
        this.toRoute('polls.sections.vote'),
        this.use('toRight', {duration: duration }),
        this.reverse('toLeft', { duration: duration })
    );
};