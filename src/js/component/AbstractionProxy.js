
/**
 * A proxy of an abstraction.
 *
 * # Basics
 * It is a proxy for an abstraction that resides in an application server.
 * Using json and text interface, the proxy doesn't have to realize
 * the actual implementation of the abstraction.
 *
 * So, you can reuse all of existing resources like JSP based frameworks
 * (Struts, Spring MVC etc...), java code, libraries, and tools.
 *
 * As it adopts the Interceptor design pattern, you can arbitrarily replace
 * object of http request handling and http response handling.
 * - for example
 *  - request -> POST(JSON, FormData, XML), GET(query string) etc...
 *  - response -> TEXT(JSP that are produced by Struts, Spring MVC etc...), JSON etc...
 *
 * If an AbstractionProxy was received a request event,
 * it sends the event as json to an abstraction that
 * resides in a server.
 *
 * # How to use
 * Unlike Presentation, AbstractionProxy is basically usable for most usages.
 * In following example code, an AbstractionProxy object is defined in a Widget definition.
 * ```javascript
 * Object.create(Widget, {
 *   ...
 *   myModel: {
 *       // Reuse AbstractionProxy
 *       target: AbstractionProxy,
 *
 *       // Define request-response event mapping.
 *       reqResMap: Maps.putAll(
 *           Id.START, Id.LOAD,
 *           Id.CHANGE, Id.LOAD),
 *
 *       // Map a request into a JSON object.
 *       reqHandler: AbstractionProxy.TO_JSON,
 *
 *       // Map a response into a JSON object.
 *       // If you want to use server side template engines (ex. JSP),
 *       // you should specify "AbstractionProxy.AS_TEXT".
 *       resHandler: AbstractionProxy.AS_JSON,
 *
 *       // Specify a destination url.
 *       url: "/api/blogic001"
 *
 *       // Specify a HTTP method.
 *       method: "POST"
 * });
 * ```
 */
this.AbstractionProxy = {

    /**
     * A response handler for JSON.
     * It parses the responseText as a JSON object.
     *
     * @param xhr The target XMLHttpRequest object.
     * @returns {*} The parsed JSON object.
     */
    AS_JSON : function (xhr) {
        Assert.notNull(this, xhr, "xhr");
        return JSON.parse(xhr.responseText);
    },

    /**
     * A response handler for plain text.
     *
     * @param xhr The target XMLHttpRequest object.
     * @returns {string} The responseText of the XMLHttpRequest object.
     */
    AS_TEXT : function (xhr) {
        Assert.notNull(this, xhr, "xhr");
        return xhr.responseText;
    },

    /**
     * A request handler for JSON.
     *
     * @param obj The target object for a request body.
     * @param xhr The target XMLHttpRequest object.
     * @returns {*} The parsed JSON object.
     */
    FOR_JSON : function (obj, xhr) {
        Assert.notNullAll(this, [
            [ obj, "obj" ],
            [ xhr, "xhr" ]
        ]);
        xhr.setRequestHeader("Content-Type", "application/json");
        return JSON.stringify(obj);
    },

    /**
     * A request handler for plain text.
     *
     * @param obj The target object for a request body.
     * @param xhr The target XMLHttpRequest object.
     * @returns {*} The stringfied object.
     */
    FOR_TEXT : function (obj, xhr) {
        Assert.notNullAll(this, [
            [ obj, "obj" ],
            [ xhr, "xhr" ]
        ]);
        return obj.toString();
    },

    /**
     * Create a AbstractionProxy object.
     *
     * @param arg The argument object. The properties of the argument are following.
     * - id -> Required. The object id.
     * - reqResMap -> Required. The requests to responses event map.
     * - url -> Required. The request url.
     * - reqHandler -> Optional. The request handler callback. Some handlers are predefined
     * (FOR_JSON, FOR_TEXT) and the default value is FOR_JSON.
     * - resHandler -> Optional The response handler callback. Some handlers are predefined
     * (AS_JSON, AS_TEXT) and the default value is AS_JSON.
     * - method -> Optional. The http method for requesting. The default value is "GET".
     */
    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.id, "arg.id" ],
            [ arg.reqResMap, "arg.reqResMap" ],
            [ arg.url, "arg.url" ]
        ]);

        var proxy = Object.create(this, {
            id : { value : arg.id },
            reqResMap : { value : arg.reqResMap },
            url : { value : arg.url },
            httpClient : { value : window.HttpClient },
            isRequesting : { value : false, writable: true },
            reqHandler : { value : arg.reqHandler || AbstractionProxy.FOR_JSON, writable : true },
            resHandler : { value : arg.resHandler || AbstractionProxy.AS_JSON, writable : true },
            control : { value : null, writable : true },
            method : { value : arg.method || "GET", writable : true },
            eventBuilder : { value : null, writable : true }
        });
        proxy.eventBuilder = EventBuilder.create(proxy);
        Object.defineProperties(proxy, this.fields || {});
        for ( var key in arg ) {
            proxy[key] == null && (proxy[key] = arg[key]);
        }
        Object.seal(proxy);

        return proxy;
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
        for ( var key  in this.reqResMap ) {
            this.event().ref().onPresentation()[key.substring(1)](this.notify);
        }
        this.doInitialize();
    },

    /**
     * For internal usage.
     * You should override this method in inherited objects.
     */
    doInitialize : function () {
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
     * Fetch a HTTP entity from the server.
     * This method uses an asynchronous XMLHttpRequest call.
     *
     * @param eventKey The request event key.
     * @param args The request data.
     */
    fetch : function (eventKey, args) {
        Assert.notNull(this, args, "args");
        if ( this.isRequesting == true ) {
            return;
        }
        this.isRequesting = true;
        var me = this;
        this.httpClient.send(this.url, function (event) {
            var xhr = event.target;
            me.isRequesting = false;
            if ( me.httpClient.isSuccess(xhr) ) {
                me.successCallback(eventKey, xhr);
            } else {
                me.failureCallback(eventKey, xhr);
            }
        }, args, this.reqHandler, this.method);
    },

    /**
     * Start a fetch call.
     *
     * @param event The request event id.
     * @param args The request data.
     */
    notify : function (event, args) {
        Assert.notNullAll(this, [
            [ event, "event" ],
            [ args, "args" ]
        ]);
        this.fetch(event, args);
    },

    /**
     * The fetch success callback.
     *
     * @param event The request event id.
     * @param xhr The XMLHttpRequest object that has been completed.
     */
    successCallback : function (event, xhr) {
        Assert.notNull(this, event, "event");
        Assert.notNull(this, xhr, "xhr");
        var responseData = this.resHandler(xhr);
        var resKey = this.reqResMap[Id.getAction(event)].substring(1);
        var on = Id.onAbstraction(this);
        this.event().raise()[resKey](responseData);
    },

    /**
     * The fetch failure callback.
     *
     * @param event The request event id.
     * @param xhr The XMLHttpRequest object that has been failed.
     */
    failureCallback : function (event, xhr) {
        Assert.notNull(this, event, "event");
        Assert.notNull(this, xhr, "xhr");
        this.event().raise().failure(xhr.responseText);
    },

    toString : function () {
        return "id: " + this.id + ", url: " + this.url;
    }
};

Object.seal(this.AbstractionProxy);
