
/**
 * An assertion utility object to validating arguments.
 */
this.Assert = {

    /**
     * Assert that the argument is not null.
     *
     * @param obj The callee object.
     * @param elem The target element.
     * @param param The parameter name.
     * @param msg The error message.
     */
    notNull : function (obj, elem, param, msg) {
        elem == null && this.doThrow(
                "parameter \"" + param + "\" is null!: message=[ " + msg + " ], target=[ " + obj + " ]");
    },

    /**
     * Assert that the all of arguments are not null.
     *
     * @param obj The callee object.
     * @param elemDef The element definition that has three members and each of these are matched with notNull arguments.
     */
    notNullAll : function (obj, elemDef) {
        for ( var i = 0 ; i < elemDef.length ; i++ ) {
            var elem = elemDef[i];
            this.notNull(obj, elem[0], elem[1], elem[2]);
        }
    },

    /**
     * Throw an Error object with the specified message.
     *
     * @param msg error message.
     */
    doThrow : function (msg) {
        throw new Error(msg);
    }
};

Object.seal(this.Assert);
