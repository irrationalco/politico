import Ember from "ember";

export default function() {
    let durationSidebar = 2000;
    this.transition(
        this.hasClass('sidebar-box'),

        // this makes our rule apply when the liquid-if transitions to the
        // true state.
        this.toValue(true),
        this.use('toLeft', {durationSidebar}),

        // which means we can also apply a reverse rule for transitions to
        // the false state.
        this.reverse('toRight', {durationSidebar})
    );
};