
/**
 * A control to mediate exchanging data among Presentation, Abstraction, and Widgets.
 *
 * It makes up of a "PAC agent".
 */
Control = {

    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.id, "arg.id" ],
            [ arg.widget, "arg.widget" ],
            [ arg.presentation, "arg.presentation" ],
            [ arg.abstraction, "arg.abstraction" ]
        ]);
        var control = Object.create(this, {
            id : { value : arg.id },
            widget : { value : arg.widget },
            presentation : { value : arg.presentation },
            abstraction : { value : arg.abstraction }
        });
        Object.defineProperties(control, this.fields || {});
        for ( var key in arg ) {
            control[key] == null && (control[key] = arg[key]);
        }
        Object.seal(control);

        return control;
    },

    initialize : function () {
        this.abstraction.initialize(this);
        this.presentation.initialize(this);
        this.doInitialize();
    },

    /**
     * For internal usage.
     */
    doInitialize : function () {
    },

    raiseEvent : function (event, target, args) {
        Assert.notNullAll(this, [
            [ event, "event" ],
            [ target, "target" ] ,
            [ args, "args" ]
        ]);
        this.widget.raiseEvent(event, target, args);
    },

    addEventRef : function (id, eventRef) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ eventRef, "eventRef" ]
        ]);
        this.widget.addEventRef(id, eventRef);
    },

    removeEventRef : function (id, eventRef) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ eventRef, "eventRef" ]
        ]);
        this.widget.removeEventRef(id, eventRef);
    },

    getElement: function() {
        return this.widget.elem;
    },

    toString : function () {
        return "id: " + this.id;
    }
};

Object.seal(Control);