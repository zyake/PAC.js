
/**
 * A control to mediate exchanging data among Presentation, Abstraction, and Widgets.
 */
function Control(widget, presentation, abstraction) {
    this.widget = widget;
    this.presentation = presentation;
    this.abstraction = abstraction;
}

Control.prototype = {

    initialize: function() {
        this.presentation.initialize(this);
        this.abstraction.initialize(this);
    },

    raiseEvent: function(event, args) {
        this.widget.raiseEvent(event, args);
    },

    addEventRef: function(id, eventRef) {
        this.widget.addEventRef(id, eventRef);
    },

    removeEventRef: function(id, eventRef) {
         this.widget.removeEventRef(id, eventRef);
    }
};