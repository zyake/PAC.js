
/**
 * A control to mediate exchanging data among Presentation, Abstraction, and Widgets.
 *
 * # Basics
 * It makes up of a "PAC agent".
 * It must have a participating widget and a controlling presentation and abstraction.
 *
 * # How to use
 * The Control object will be used for most usages so you can simply use this object.
 * ```javascript
 * Object.create(Widget, {
 *   ...
 *   controlDefs: {
 *      searchBoxControl: {
 *          target: Control,
 *          ref: { abstraction: "abstraction1", presentation: "presentation1" }
 *      }
 *   }
 * });
 * ```
 */
this.Control = {

    /**
     * Create a Control object.
     *
     * @param arg The argument. The properties of the argument is following.
     * - id -> Required. The object id.
     * - widget -> Required. The enclosing widget.
     * - presentation -> Required. The enclosed presentation.
     * - abstraction -> Required. The enclosed abstraction.
     */
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

    /**
     * Initialize the enclosed abstraction and presentation.
     */
    initialize : function () {
        this.abstraction.initialize(this);
        this.presentation.initialize(this);
        this.doInitialize();
    },

    /**
     * For internal usage.
     * You should override this method in inherited objects.
     */
    doInitialize : function () {
    },

    /**
     * Raise an event.
     * The raised event will be propagated to the enclosing widget.
     *
     * @param event The raised event.
     * @param target The event caller.
     * @param args The event argument.
     */
    raiseEvent : function (event, target, args) {
        Assert.notNullAll(this, [
            [ event, "event" ],
            [ target, "target" ] ,
            [ args, "args" ]
        ]);
        this.widget.raiseEvent(event, target, args);
    },

    /**
     * Add an event reference.
     *
     * @param id The target event id.
     * @param eventRef The event callback.
     */
    addEventRef : function (id, eventRef) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ eventRef, "eventRef" ]
        ]);
        this.widget.addEventRef(id, eventRef);
    },

    /**
     * Remove an event reference.
     *
     * @param id The target event id.
     * @param eventRef The event callback.
     */
    removeEventRef : function (id, eventRef) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ eventRef, "eventRef" ]
        ]);
        this.widget.removeEventRef(id, eventRef);
    },

    /**
     * Get the enclosed HTML element of the widget.
     *
     * @returns {.target.create.elem|*|prevWidget.elem|currentWidget.elem|presentation.elem|widget.elem}
     */
    getElement: function() {
        return this.widget.elem;
    },

    toString : function () {
        return "id: " + this.id;
    }
};

Object.seal(this.Control);
