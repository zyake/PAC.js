
/**
 * A control to mediate exchanging data among Presentation, Abstraction, and Widgets.
 */
Control = {

    create: function(id, widget, presentation, abstraction) {
        Assert.notNullAll(this, [ [ id, "id" ], [ widget, "widget" ], [ presentation, "presentation" ],
            [ abstraction, "abstraction" ] ]);
        var control = Object.create(this, {
            id: { value: id },
            widget: { value: widget },
            presentation: { value: presentation },
            abstraction: { value: abstraction }
        });
        Object.defineProperties(control, this.fields || {});
        Object.seal(control);

        return control;
    },

    initialize: function() {
        this.abstraction.initialize(this);
        this.presentation.initialize(this);
        this.doInitialize();
    },

    /**
     * For internal usage.
     */
    doInitialize: function() {
    },

    raiseEvent: function(event, target, args) {
        Assert.notNullAll(this, [ [ event, "event" ], [ target, "target" ] ,[ args, "args" ] ]);
        this.widget.raiseEvent(event, target, args);
    },

    addEventRef: function(id, eventRef) {
        Assert.notNullAll(this, [ [ id, "id" ], [ eventRef, "eventRef" ] ]);
        this.widget.addEventRef(id, eventRef);
    },

    removeEventRef: function(id, eventRef) {
         Assert.notNullAll(this, [ [ id, "id" ], [ eventRef, "eventRef" ] ]);
         this.widget.removeEventRef(id, eventRef);
    },

    toString: function() {
        return "id: " + this.id;
    }
};