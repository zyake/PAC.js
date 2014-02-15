Assert = {

    notNull: function(obj, elem, param) {
        elem == null && this.doThrow("parameter \"" + param + "\" is null!: " + obj);
    },

    notNullAll: function(obj, elemDef) {
      for ( i = 0 ; i < elemDef.length ; i ++ ) {
        var elem = elemDef[i];
        this.notNull(obj, elem[0], elem[1]);
      }
    },

    doThrow: function(msg) {
        throw new Error(msg);
    }
};
