
/**
 * A control to mediate exchanging data among Presentation, Abstraction, and Widgets.
 */
Control = {

    create: function(id, widget, presentation, abstraction) {
        Assert.notNullAll([ [ id, "id" ], [ widget, "widget" ], [ presentation, "presentation" ],
            [ abstraction, "abstraction" ] ]);
        var control = Object.create(this, {
            id: { value: id },
            widget: { value: widget },
            presentation: { value: presentation },
            abstraction: { value: abstraction }
        });

        return control;
    },

    initialize: function() {
        this.abstraction.initialize(this);
        this.presentation.initialize(this);
    },

    raiseEvent: function(event, target, args) {
        Assert.notNullAll([ [ event, "event" ], [ target, "target" ] ,[ args, "args" ] ]);
        this.widget.raiseEvent(event, target, args);
    },

    addEventRef: function(id, eventRef) {
        Assert.notNullAll([ [ id, "id" ], [ eventRef, "eventRef" ] ]);
        this.widget.addEventRef(id, eventRef);
    },

    removeEventRef: function(id, eventRef) {
         Assert.notNullAll([ [ id, "id" ], [ eventRef, "eventRef" ] ]);
         this.widget.removeEventRef(id, eventRef);
    }
};