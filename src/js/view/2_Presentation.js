
/**
 * A html presentation component.
 *
 * Because Presentation is very simple and has no rendering logic,
 * you must extend it and implement own rendering logic.
 */
Presentation = {

    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.rootQuery, "arg.rootQuery" ],
            [ arg.id, "arg.id" ]
        ]);

        var presentation = Object.create(this, {
            elem : { value : null, writable: true },
            rootQuery: { value: arg.rootQuery },
            id : { value : arg.id },
            control : { value : null, writable : true },
            eventBuilder : { value : null, writable : true }
        });
        presentation.eventBuilder = EventBuilder.create(presentation);
        ;
        Object.defineProperties(presentation, this.fields || {});
        for ( var key in arg ) {
            presentation[key] == null && (presentation[key] = arg[key]);
        }
        Object.seal(presentation);

        return presentation;
    },

    initialize : function (control) {
        Assert.notNull(this, control, "control");
        this.control = control;
        this.elem = this.query(this.rootQuery, control.getElement());
        this.doInitialize();
    },

    /**
     * For internal usage.
     */
    doInitialize : function () {
    },

    getById : function (id) {
        Assert.notNull(this, id, "id");
        var elemById = this.elem.getElementById(id);
        Assert.notNull(this, elemById, "elemById", "id=" + id);
        return elemById;
    },

    query : function (query, target /* can be null! */) {
        Assert.notNull(this, query, "query");
        target == null && (target = this.elem);
        var queriedElem = target.querySelector(query);
        Assert.notNull(this, queriedElem, "queriedElem", "query=" + query);
        return queriedElem;
    },

    queryAll : function (query, target /* can be null */) {
        Assert.notNull(this, query, "query");
        target == null && (target = this.elem);
        var queriedElem = target.querySelectorAll(query);
        Assert.notNull(this, queriedElem, "queriedElem", "query=" + query);
        return queriedElem;
    },

    forEachNode : function (nodeList, func) {
        Assert.notNullAll(this, [
            [ nodeList, "nodeList" ],
            [ func, "func" ]
        ]);
        Array.prototype.slice.call(nodeList).forEach(func, this);
    },

    on : function (elem, event, callback) {
        Assert.notNullAll(this, [
            [ elem, "elem" ],
            [ event, "event" ],
            [ callback, "callback" ]
        ]);
        var me = this;
        elem.addEventListener(event, function (event) {
            return callback.call(me, event)
        });
    },

    event : function () {
        return this.eventBuilder;
    },

    notify : function (event, arg) {
        this.event().handle(event, arg);
    },

    doQueries : function (queryMap) {
        Assert.notNullAll(this, [
            [ queryMap, "queryMap" ]
        ]);
        for ( var key in queryMap ) {
            var query = queryMap[key];
            this[key] = this.query(query);
        }
    },

    doThrow : function (msg) {
        Assert.notNull(this, msg, "msg");
        throw new Error(msg);
    },

    toString : function () {
        return "id: " + this.id;
    }
};