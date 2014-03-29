/**
 * A composition of models.
 *
 * It propagates events into child models.
 */
CompositeModel = Object.create(AbstractionProxy, {

    fields: { value: { models: { value: null, writable: true } } },

    create: { value: function(id, models) {
        var model = AbstractionProxy.create.call(this, id, {}, "");
        model.models = models;

        return model;
    }},

    doInitialize: { value: function() {
        for ( key in this.models ) {
            var model = this.models[key];
            model.initialize(this.control);
        }
    }},

    notify: { value: function(event, arg) {
        for ( key in this.models ) {
            var model = this.models[key];
            model.notify(event, arg);
        }
    }}
});