
/**
 * A html presentation component.
 *
 * Because Presentation is very simple and has no rendering logic,
 * you must extend it and implement own rendering logics.
 */
Presentation = {

    create: function(elem, id) {
      var presentation = Object.create(this);
      presentation.elem = elem;
      presentation.id = id;

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
    }
};