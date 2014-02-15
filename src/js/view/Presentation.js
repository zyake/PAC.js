
/**
 * A html presentation component.
 *
 * Because Presentation is very simple and has no rendering logic,
 * you must extend it and implement own rendering logic.
 */
Presentation = {

    create: function(elem, id) {
      Assert.notNullAll(this, [ [ elem, "elem" ], [ id, "id" ] ]);

      var presentation = Object.create(this, {
        elem: { value: elem },
        id: { value: id }
      });

      return presentation;
    },

    initialize: function(control) {
        Assert.notNull(this, control, "control");
        this.control = control;
    },

     getById: function(id) {
        Assert.notNull(this, id, "id");
        var elemById = this.elem.getElementById(id);
        Assert.notNull(this, elemById, "elemById" ,"id=" + id);
        return elemById;
     },

    query: function(query) {
        Assert.notNull(this, query, "query");
        var queriedElem = this.elem.querySelector(query);
        Assert.notNull(this, queriedElem, "queriedElem", "query=" + query);
        return queriedElem;
    },

    queryAll: function(query) {
        Assert.notNull(this, query, "query");
        var queriedElem = this.elem.querySelectorAll(query);
        Assert.notNull(this, queriedElem, "queriedElem", "query=" + query);
        return queriedElem;
    },

    forEachNode: function(nodeList, func) {
        Assert.notNullAll(this, [ [ nodeList, "nodeList" ], [ func, "func" ] ]);
        Array.prototype.slice.call(nodeList).forEach(func, this);
    },

    on: function(elem, event, callback) {
        Assert.notNullAll(this, [ [ elem, "elem" ], [ event, "event" ],
         [ callback, "callback" ] ]);
        var me = this;
        elem.addEventListener(event, function(event) { return callback.call(me, event) });
    },

    raiseEvent: function(event, arg) {
        Assert.notNullAll(this, [ [ event, "event" ], [ arg, "arg" ] ]);
        this.control.raiseEvent(event, this, arg);
    },

    addEventRef: function(id, event) {
        Assert.notNullAll(this, [ [ id, "id" ], [ event, "event" ] ]);
        this.control.addEventRef(id, event);
    },

    doThrow: function(msg) {
        Assert.notNull(this, msg, "msg");
        throw new Error(msg);
    },

    toString: function() {
        return "id: " + this.id;
    }
};