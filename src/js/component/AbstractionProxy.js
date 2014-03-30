
/**
 * A proxy of an abstraction.
 *
 * It is a proxy for an abstraction that resides in anapplication server.
 * Using json interface, the proxy doesn't have to realize
 * the actual implementation of the abstraction.
 *
 * If an AbstractionProxy was received a request event,
 * it sends the event as json to an abstraction that
 * resides in a server.
 */
AbstractionProxy = {

    AS_JSON: function(xhr) {
        Assert.notNull(this, xhr, "xhr");
        return JSON.parse(xhr.responseText);
     },

    AS_TEXT: function(xhr) {
        Assert.notNull(this, xhr, "xhr");
        return xhr.responseText;
    },

    FOR_JSON:  function(obj, xhr) {
        Assert.notNullAll(this, [ [ obj,  "obj" ], [ xhr, "xhr" ] ]);
        xhr.setRequestHeader("Content-Type", "application/json");
        return JSON.stringify(obj);
    },

    FOR_TEXT: function(obj, xhr) {
        Assert.notNullAll(this, [ [ obj, "obj" ], [ xhr, "xhr" ] ]);
        return obj.toString();
    },

    create: function(id,  reqResMap, url) {
        Assert.notNullAll(this, [ [ id,  "id" ], [ reqResMap,  "reqResMap" ], [ url, "url" ] ]);

        var proxy = Object.create(this, {
          id: { value: id },
          reqResMap: { value: reqResMap },
          url: { value: url },
          httpClient: { value: window.HttpClient },
          isRequesting: { value: false },
          reqHandler: { value: this. FOR_JSON, writable: true },
          resHandler: { value: this.AS_JSON, writable: true },
          control: { value: null, writable: true },
          method: { value: "GET" , writable: true },
          eventBuilder: { value: null, writable: true }
        });
        proxy.eventBuilder = EventBuilder.create(proxy);
        Object.defineProperties(proxy, this.fields || {});
        Object.seal(proxy);

        return proxy;
    },

    initialize: function(control) {
        Assert.notNull(this, control, "control");
        this.control = control;
        var on = Id.onPresentation(this);
        for ( key  in this.reqResMap ) {
            this.event().ref().onPresentation()[key.substring(1)]();
        }
        this.doInitialize();
    },

    /**
     * For internal usage.
     */
    doInitialize: function() {
    },

    event: function() {
        return this.eventBuilder;
    },

    fetch: function(eventKey, args) {
        Assert.notNull(this, args, "args");
        if ( this.isRequesting == true ) {
            return;
        }
        this.isRequesting = true;
        var me = this;
        this.httpClient.send(this.url, function(event) {
            var xhr = event.target;
            me.isRequesting = false;
            if ( me.httpClient.isSuccess(xhr) ) {
                me.successCallback(eventKey, xhr);
            } else {
                me.failureCallback(eventKey, xhr);
            }
        }, args, this.reqHandler, this.method);
    },

    notify: function(event, args) {
        Assert.notNullAll(this, [ [ event, "event" ], [ args, "args" ] ]);
        this.fetch(event, args);
    },

    successCallback: function(event, xhr) {
        Assert.notNull(this, event, "event");
        Assert.notNull(this, xhr, "xhr");
        var responseData = this.resHandler(xhr);
        var resKey = this.reqResMap[Id.getAction(event)].substring(1);
        var on = Id.onAbstraction(this);
        this.event().raise()[resKey](responseData);
    },

    failureCallback: function(event, xhr) {
        Assert.notNull(this, event, "event");
        Assert.notNull(this, xhr, "xhr");
        this.event().raise().failure(xhr.responseText);
    },

    toString: function() {
        return "id: " + this.id + ", url: " + this.url;
    }
};