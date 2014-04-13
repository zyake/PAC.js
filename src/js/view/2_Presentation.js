
/**
 * A html visual component.
 *
 * It accommodates all of html elements and some states
 * and acts as both View and Control in MVC frameworks.
 * It also provides some useful methods to manipulate DOM elements.
 *
 * The "elem" field is root element of a Presentation and
 * a Presentation expects all of queried elements exist in the "elem".
 * - for example
 * // This method queries on the "elem" field and bind elements into each fields.
 * this.doQueries({ button : ".button", input: ".input" });
 *
 * To send requests to abstractions and receive responses from abstractions,
 * you can use event method.
 * - for example
 * // To send a request to an abstraction
 * this.event().raise().load({ name: "test" });
 * // To receive a response from an abstraction
 * this.event().onAbstraction().change(this.receive); // register a callback method.
 *
 * Because Presentation has no rendering logic,
 * you must extend it and implement own rendering logic.
 * At least, you should override the "doInitialize" method and
 * register DOM and framework events.
 * - for example
 * // Implements initialization logic
 * doInitialize: { value: function() {
 *  // Load elements into fields.
 *  this.doQueries({ button: ".button" });
 *
 *  // Register a DOM event
 *  this.on(button, "click", this.submit);
 *
 *  // Register a framework event on an abstraction
 *  this.event().onAbstraction().load(this.onLoad);
 *
 *  // Raise a framework event
 *  this.event().rase().load({ text: "completed!" });
 * }}
 */
this.Presentation = {

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

    onQuery: function(query, event, callback) {
        var elem = this.query(query);
        this.on(elem, event, callback);
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

    toString : function () {
        return "id: " + this.id;
    }
};

Object.seal(this.Presentation);
