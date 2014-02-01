
/**
 * A proxy of a abstraction.
 *
 * It is a proxy for a abstraction that resides in a application server.
 * Using json interface, the proxy don't have to realize
 * the actual implementation of the abstraction.
 *
 * If a AbstractionProxy was received a request event,
 * it sends a request event as json to a abstraction that
 * resides in a server.
 */
 function AbstractionProxy(id, requestKey, responseKey, url, reqHandler, resHandler) {
    this.id = id;
    this.control = null;
    this.httpClient = HttpClient;
    this.isRequesting = false;
    this.requestKey = requestKey;
    this.responseKey = responseKey;
    this.url = url;
    this.reqHandler = reqHandler || AbstractionProxy.FOR_DEFAULT;
    this.resHandler = resHandler || AbstractionProxy.AS_DEFAULT;
 }

AbstractionProxy.AS_JSON = function(xhr) {
    return JSON.parse(xhr.responseText);
}

AbstractionProxy.AS_TEXT= function(xhr) {
    return xhr.responseText;
}

AbstractionProxy.AS_DEFAULT = AbstractionProxy.AS_JSON;

AbstractionProxy.FOR_JSON = function(obj, xhr) {
    return JSON.stringify(obj);
}

AbstractionProxy.FOR_TEXT = function(obj, xhr) {
    return obj.toString();
}

AbstractionProxy.FOR_DEFAULT = AbstractionProxy.FOR_JSON;

AbstractionProxy.prototype = {

    initialize: function(control) {
        this.control = control;
        this.control.addEventRef(this.id, this.requestKey);
    },

    fetch: function(args) {
        if ( this.isRequesting == true ) {
            return;
        }
        this.isRequesting = true;
        var me = this;
        this.httpClient.send(this.url, function(xhr) {
            me.isRequesting = false;
            if ( me.httpClient.isSuccess(xhr) ) {
                me.successCallback(xhr);
            } else {
                me.failureCallback(xhr);
            }
        }, args, this.reqHandler);
    },

    notify: function(event, args) {
        this.fetch(args);
    },

    successCallback: function(xhr) {
        var responseData = this.resHandler(xhr);
        this.control.raiseEvent(this.responseKey, this, responseData);
    },

    failureCallback: function(xhr) {
        this.control.raiseEvent(this.id + ".error", this, xhr.responseText);
    }
};