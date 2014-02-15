
/**
 * A widget to manage underlying controls.
 *
 * A widget is a unit of reusable component,
 * which manages all of components
 * that make up of a widget.
 *
 * Components are classified in the following two categories:
 * - Component: general purpose component
 * - Control: a central control point of a UI component
 *
 * All of components that reside in a widget communicate
 * each other using widget event mechanism.
 * Because a widget has a hierarchy repository structure,
 * the event that was raised by a component may be
 * propagated to parent repositories and other widgets.
 */
Widget  = {

    create: function(id, elem, parentRepository /* can be null! */) {
        Assert.notNullAll(this, [ [ id, "id" ], [ elem ,"elem" ] ]);
        var widget = Object.create(this, {
            id: { value: id },
            elem: { value: elem },
            controls: { value: [] },
            components: { value: [] },
            initialized: { value: false },
            repository: { value: ComponentRepository.create(id + "Repository", parentRepository) }
        });
        Object.seal(widget);
        return widget;
    },

    initialize: function() {
        if ( this.initialized ) {
            return;
        }
        this.initialized = true;
        this.controls.forEach(function(controlId) { this.repository.get(controlId, this).initialize(); }, this);
    },

    defineComponents: function(def) {
       Assert.notNull(this, def, "def");
       for ( id in def ) {
        this.components.push(id);
        this.repository.addFactory(id, def[id]);
        }

        return this;
    },

    getComponent: function(id, args) {
        Assert.notNullAll(this, [ [ id, "id" ], [ args, "args" ] ]);
        this.components.indexOf(id) == -1 && this.doThrow(id + " is not component!");
        return this.repository.get(id, args);
    },

    defineControls: function(def) {
        Assert.notNull(this, def, "def");
        for( id in def ) {
            this.controls.push(id);
            this.repository.addFactory(id, def[id]);
        }

        return this;
    },

    getControl: function(id) {
        Assert.notNull(this, id, "id");
        this.controls.indexOf(id) == -1 && this.doThrow(id + " is not control!");
        return this.repository.get(id, this);
    },

    raiseEvent: function(event, target, args) {
        Assert.notNullAll(this, [ [ event, "event" ], [ target, "target" ], [ args, "args" ] ]);
        this.repository.raiseEvent(event, target, args);
    },

    addEventRef: function(id, eventRef) {
        Assert.notNullAll(this, [ [ id, "id" ], [ eventRef, "eventRef" ] ]);
        this.repository.addEventRef(id, eventRef);
    },

    removeEventRef: function(id, eventRef) {
        Assert.notNullAll(this, [ [ id, "id" ], [ eventRef, "eventRef" ] ]);
        this.repository.removeEventRef(id, eventRef);
    },

    doThrow: function(msg) {
        Assert.notNull(this, msg, "msg");
        throw new Error(msg);
    },

    toString: function() {
        return "id: " + this.id;
    }
};