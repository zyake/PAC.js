
/**
 * A proxy of a abstraction.
 *
 * It is a proxy for a abstraction that resides in a application server.
 * Using json interface, the proxy don't have to realize
 * the actual implementation of the abstraction.
 *
 * If a AbstractionProxy was received a request event,
 * it sends the event as json to a abstraction that
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
        return JSON.stringify(obj);
    },

    FOR_TEXT: function(obj, xhr) {
        Assert.notNullAll(this, [ [ obj, "obj" ], [ xhr, "xhr" ] ]);
        return obj.toString();
    },

    AS_DEFAULT: this.AS_JSON,
    FOR_DEFAULT: this.FOR_JSON,

    create: function(id,  requestKey, responseKey, url) {
        Assert.notNullAll(this, [ [ id,  "id" ], [ requestKey,  "requestKey" ],
            [ responseKey, "responseKey" ], [ url, "url" ] ]);

        var proxy = Object.create(this, {
          id: { value: id },
          requestKey: { value: requestKey },
          responseKey: { value: responseKey },
          url: { value: url },
          httpClient: { value: window.HttpClient },
          isRequesting: { value: false },
          reqHandler: { value: this. FOR_DEFAULT, writable: true },
          resHandler: { value: this.AS_DEFAULT, writable: true },
          control: { value: null, writable: true }
        });
        Object.defineProperties(proxy, this.fields || {});
        Object.seal(proxy);

        return proxy;
    },

    initialize: function(control) {
        Assert.notNull(this, control, "control");
        this.control = control;

        var eventKey = this.requestKey.substring(1);
        var on = Id.onPresentation(this);
        this.control.addEventRef(this.id, on[eventKey]());
    },

    fetch: function(args) {
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
                me.successCallback(xhr);
            } else {
                me.failureCallback(xhr);
            }
        }, args, this.reqHandler);
    },

    notify: function(event, args) {
        Assert.notNullAll(this, [ [ event, "event" ], [ args, "args" ] ]);
        this.fetch(args);
    },

    successCallback: function(xhr) {
        Assert.notNull(this, xhr, "xhr");
        var responseData = this.resHandler(xhr);
        var eventKey = this.responseKey.substring(1);
        var on = Id.onAbstraction(this);
        this.control.raiseEvent(on[eventKey](), this, responseData);
    },

    failureCallback: function(xhr) {
        Assert.notNull(this, xhr, "xhr");
        this.control.raiseEvent(this.id + ".error", this, xhr.responseText);
    },

    toString: function() {
        return "id: " + this.id + ", url: " + this.url;
    }
};