
/**
 * Very simple map utility.
 */
this.Maps = {

    putAll: function() {
        arguments.length % 2 != 0 && Assert.doThrow(
            "\"arguments\" must be multiple of two!: arguments=" + arguments);

        var map = {};
        for ( var key = 0 ; key < arguments.length ; key +=2 ) {
            map[arguments[key]] = arguments[key + 1];
        }

        return map;
    }
};

Object.seal(this.Maps);
