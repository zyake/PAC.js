
/**
 * A html presentation component.
 *
 * Because Presentation is very simple and has no rendering logic,
 * you must extend it and implement own rendering logic.
 */
Presentation = {

    create: function(elem, id) {
      Assert.notNullAll([ [ elem, "elem" ], [ id, "id" ] ]);

      var presentation = Object.create(this, {
        elem: { value: elem },
        id: { value: id }
      });

      return presentation;
    },

    initialize: function(control) {
        Assert.notNull(control, "control");
        this.control = control;
    },

     getById: function(id) {
        Assert.notNull(id, "id");
        var elemById = this.elem.getElementById(id);
        Assert.notNull(elemById, "elemById");
        return elemById;
     },

    query: function(query) {
        Assert.notNull(query, "query");
        var queriedElem = this.elem.querySelector(query);
        Assert.notNull(queriedElem, "queriedElem");
        return queriedElem;
    },

    queryAll: function(query) {
        Assert.notNull(query, "query");
        var queriedElem = this.elem.querySelectorAll(query);
        Assert.notNull(query, "query");
        return queriedElem;
    },

    forEachNode: function(nodeList, func) {
        Assert.notNullAll([ [ nodeList, "nodeList" ], [ func, "func" ] ]);
        Array.prototype.slice.call(nodeList).forEach(func, this);
    },

    on: function(elem, event, callback) {
        Assert.notNullAll([ [ elem, "elem" ], [ event, "event" ],
         [ callback, "callback" ] ]);
        var me = this;
        elem.addEventListener(event, function(event) { return callback.call(me, event) });
    },

    raiseEvent: function(event, arg) {
        Assert.notNullAll([ [ event, "event" ], [ arg, "arg" ] ]);
        this.control.raiseEvent(event, this, arg);
    },

    addEventRef: function(id, event) {
        Assert.notNullAll([ [ id, "id" ], [ event, "event" ] ]);
        this.control.addEventRef(id, event);
    },

    doThrow: function(msg) {
        Assert.notNull(msg, "msg");
        throw new Error(msg);
    }
};