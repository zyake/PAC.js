
/**
 * A html presentation component.
 *
 * Because Presentation is very simple and has no rendering logic,
 * you must extend it and implement own rendering logic.
 */
Presentation = {

    create: function(elem, id) {
      var presentation = Object.create(this, {
        elem: { value: elem },
        id: { value: id }
      });

      return presentation;
    },

    initialize: function(control) {
        this.control = control;
    },

     getById: function(id) {
         return this.elem.getElementById(id);
     },

    query: function(query) {
        return this.elem.querySelector(query);
    },

    queryAll: function(query) {
        return this.elem.querySelectorAll(query);
    },

    forEachNode: function(nodeList, func) {
        Array.prototype.slice.call(nodeList).forEach(func, this);
    },

    on: function(elem, event, callback) {
        var me = this;
        elem.addEventListener(event, function(event) { return callback.call(me, event) });
    },

    raiseEvent: function(event, arg) {
        this.control.raiseEvent(event, arg);
    },

    addEventRef: function(id, event) {
        this.control.addEventRef(id, event);
    }
};