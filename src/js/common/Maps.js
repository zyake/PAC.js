
/**
 * A very simple map utility.
 *
 * # Basics
 * You can build key-value pairs by a variable array.
 *
 * # How to use
 * ```javascript
 *  // Create two key-value pairs.
 *  var keyValuePairs = Maps.putAll("key1", "value1", "key2", "value2");
 *
 *  // The result will be "value1".
 *  var value1 = keyValuePairs["key1"];
 *
 *  // The result will be "value2".
 *  var value2 = keyValuPairs["key2"];
 * ```
 */
this.Maps = {

    /**
     * Create a hash map.
     * @param arguments The key value pair argument. The length of the argument must be multiples of two.
     * @returns {{}} The result hash map.
     */
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
