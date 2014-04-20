
/**
 * A html visual component.
 *
 * # Basics
 * It accommodates all of html elements and some states
 * and acts as both View and Control in MVC frameworks.
 * It also provides some useful methods to manipulate DOM elements.
 *
 * The "elem" field is root element of a Presentation and
 * a Presentation expects all of queried elements exist in the "elem".
 * For example...
 * ```javascript
 * // This method queries on the "elem" field and bind elements into each fields.
 * this.doQueries({ button : ".button", input: ".input" });
 * ```
 *
 * To send requests to abstractions and receive responses from abstractions,
 * you can use event method.
 * For example...
 * ```javascript
 * // To send a request to an abstraction
 * this.event().raise().load({ name: "test" });
 * // To receive a response from an abstraction
 * this.event().onAbstraction().change(this.receive); // register a callback method.
 * ```
 *
 * # How to use
 * Because Presentation has no rendering logic,
 * you must extend it and implement own rendering logic.
 * At least, you should override the "doInitialize" method and
 * register DOM and framework events.
 * For example...
 * ```javascript
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
 * ```
 */
this.Presentation = {

    /**
     * Create a Presentation object.
     *
     * @param arg The argument. The properties of the argument are following.
     * - rootQuery -> The root CSS selector query to obtain the root HTML element of the Presentation object.
     * - id -> The object id.
     */
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

    /**
     * Initialize the object.
     * This method will be called from a control.
     *
     * @param control The control object.
     */
    initialize : function (control) {
        Assert.notNull(this, control, "control");
        this.control = control;
        this.elem = this.query(this.rootQuery, control.getElement());
        this.doInitialize();
    },

    /**
     * For internal usage.
     * You should override this method in inherited objects.
     */
    doInitialize : function () {
    },

    /**
     * Get a HTML element by id form the root HTML element of the Presentation object.
     *
     * @param id The id attribute of the root HTML element.
     * @returns {HTMLElement}
     */
    getById : function (id) {
        Assert.notNull(this, id, "id");
        var elemById = this.elem.getElementById(id);
        Assert.notNull(this, elemById, "elemById", "id=" + id);
        return elemById;
    },

    /**
     * Query a HTML element form the root HTML element of the Presentation object.
     *
     * @param query The CSS Selector.
     * @param target The target HTML element.
     * @returns {Node}
     */
    query : function (query, target /* can be null! */) {
        Assert.notNull(this, query, "query");
        target == null && (target = this.elem);
        var queriedElem = target.querySelector(query);
        Assert.notNull(this, queriedElem, "queriedElem", "query=" + query);
        return queriedElem;
    },

    /**
     * Query HTML elements form the root HTML element of the Presentation object.
     *
     * @param query The CSS Selector.
     * @param target The target HTML element.
     * @returns {Node}
     */
    queryAll : function (query, target /* can be null */) {
        Assert.notNull(this, query, "query");
        target == null && (target = this.elem);
        var queriedElem = target.querySelectorAll(query);
        Assert.notNull(this, queriedElem, "queriedElem", "query=" + query);
        return queriedElem;
    },

    /**
     * Iterate the HTMLNodeCollection and call the callback.
     *
     * @param nodeList The HTMLNodeCollection.
     * @param func The callback.
     */
    forEachNode : function (nodeList, func) {
        Assert.notNullAll(this, [
            [ nodeList, "nodeList" ],
            [ func, "func" ]
        ]);
        Array.prototype.slice.call(nodeList).forEach(func, this);
    },

    /**
     * Bind a callback to a DOM event by event name.
     *
     * @param elem The target HTML element.
     * @param event The event name.
     * @param callback  The event callback.
     */
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

    /**
     * Bind a callback to a DOM event by CSS selector.
     *
     * @param query The CSS selector query to obtain a HTML element.
     * @param event The event name.
     * @param callback The event callback.
     */
    onQuery: function(query, event, callback) {
        var elem = this.query(query);
        this.on(elem, event, callback);
    },

    /**
     * Get the EventBuilder for this object.
     * You can use this method for custom logic.
     *
     * @returns {*|presentation.eventBuilder|c.eventBuilder|proxy.eventBuilder|proxy|eventBuilder}
     */
    event : function () {
        return this.eventBuilder;
    },

    /**
     * Handle an event.
     * The event will be handled by the enclosed EventBuilder object.
     *
     * @param event The event id.
     * @param arg The event argument.
     */
    notify : function (event, arg) {
        this.event().handle(event, arg);
    },

    /**
     * Bind queried HTML elements into the fields.
     *
     * It obtains HTML elements by specified CSS selector queries and
     * bind these elements into the fields.
     * The fields must be defined before invocation.
     *
     * @param queryMap The CSS selector query to field name map.
     */
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
