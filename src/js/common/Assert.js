
/**
 * An Assert class to validate arguments
 */
Assert = {

    notNull: function(obj, elem, param, msg) {
        elem == null && this.doThrow("parameter \"" + param + "\" is null!: message=[ " + msg + " ], target=[ " + obj + " ]");
    },

    notNullAll: function(obj, elemDef) {
      for ( i = 0 ; i < elemDef.length ; i ++ ) {
        var elem = elemDef[i];
        this.notNull(obj, elem[0], elem[1], elem[2]);
      }
    },

    doThrow: function(msg) {
        throw new Error(msg);
    }
};
