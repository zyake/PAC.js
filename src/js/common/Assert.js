Assert = {

    notNull: function(elem, param) {
        elem == null && this.doThrow("parameter \"" + param + "\" is null!");
    },

    notNullAll: function(elemDef) {
      elemDef.forEach(function(elem) { this.notNull(elem[0], elem[1]) }, this);
    },

    doThrow: function(msg) {
        throw new Error(msg);
    }
};
