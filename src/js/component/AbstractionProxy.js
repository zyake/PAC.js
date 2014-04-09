
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
 */
AbstractionProxy = {

    AS_JSON : function (xhr) {
        Assert.notNull(this, xhr, "xhr");
        return JSON.parse(xhr.responseText);
    },

    AS_TEXT : function (xhr) {
        Assert.notNull(this, xhr, "xhr");
        return xhr.responseText;
    },

    FOR_JSON : function (obj, xhr) {
        Assert.notNullAll(this, [
            [ obj, "obj" ],
            [ xhr, "xhr" ]
        ]);
        xhr.setRequestHeader("Content-Type", "application/json");
        return JSON.stringify(obj);
    },

    FOR_TEXT : function (obj, xhr) {
        Assert.notNullAll(this, [
            [ obj, "obj" ],
            [ xhr, "xhr" ]
        ]);
        return obj.toString();
    },

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
            isRequesting : { value : false },
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
     */
    doInitialize : function () {
    },

    event : function () {
        return this.eventBuilder;
    },

    notify : function (event, arg) {
        this.event().handle(event, arg);
    },

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

    notify : function (event, args) {
        Assert.notNullAll(this, [
            [ event, "event" ],
            [ args, "args" ]
        ]);
        this.fetch(event, args);
    },

    successCallback : function (event, xhr) {
        Assert.notNull(this, event, "event");
        Assert.notNull(this, xhr, "xhr");
        var responseData = this.resHandler(xhr);
        var resKey = this.reqResMap[Id.getAction(event)].substring(1);
        var on = Id.onAbstraction(this);
        this.event().raise()[resKey](responseData);
    },

    failureCallback : function (event, xhr) {
        Assert.notNull(this, event, "event");
        Assert.notNull(this, xhr, "xhr");
        this.event().raise().failure(xhr.responseText);
    },

    toString : function () {
        return "id: " + this.id + ", url: " + this.url;
    }
};