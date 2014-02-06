
/**
 * A control to mediate exchanging data among Presentation, Abstraction, and Widgets.
 */
Control = {

    create: function(widget, presentation, abstraction) {
        var control = Object.create(this, {
            widget: { value: widget },
            presentation: { value: presentation },
            abstraction: { value: abstraction }
        });

        return control;
    },

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