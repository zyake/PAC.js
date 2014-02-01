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
function Widget(id, elem, parentRepository) {
    this.id = id;
    this.elem = elem;
    this.controls = [];
    this.components = [];
    this.initialized = false;
    this.repository = new ComponentRepository(parentRepository);
}

Widget.prototype.initialize = function() {
    if ( this.initialized ) {
        return;
    }
    this.initialized = true;
    this.controls.forEach(function(controlId) { this.repository.get(controlId, this).initialize(); }, this);
}

Widget.prototype.finish = function() {
    this.controls.forEach(function(controlId) { this.repository.get(controlId, this).finish(); }, this);
}

Widget.prototype.defineComponents= function(def) {
   for ( id in def ) {
    this.components.push(id);
    this.repository.addFactory(id, def[id]);
    }

    return this;
}

Widget.prototype.getComponent = function(id, args) {
    this.components.indexOf(id) == -1 && this.doThrow(id + " is not component!");
    return this.repository.get(id, args);
}

Widget.prototype.defineControls = function(def) {
    for( id in def ) {
        this.controls.push(id);
        this.repository.addFactory(id, def[id]);
    }

    return this;
}

Widget.prototype.getControl = function(id) {
    this.controls.indexOf(id) == -1 && this.doThrow(id + " is not control!");
    return this.repository.get(id, this);
}

Widget.prototype.raiseEvent = function(event, args) {
    this.repository.raiseEvent(event, args);
}

Widget.prototype.addEventRef = function(id, eventRef) {
    this.repository.addEventRef(id, eventRef);
}

Widget.prototype.removeEventRef = function(id, eventRef) {
     this.repository.removeEventRef(id, eventRef);
}

Widget.prototype.doThrow = function(msg) {
    throw new Error(msg);
}