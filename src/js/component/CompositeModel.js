
/**
 * A composition of models.
 *
 * It propagates events into child models.
 */
CompositeModel = Object.create(AbstractionProxy, {

    fields : { value : { models : { value : null, writable : true } } },

    create : { value : function (arg) {
        Assert.notNullAll(this, [ [ arg.id, "id" ], [ arg.models, "arg.models" ] ]);

        arg.reqResMap = {};
        arg.url = {};
        var model = AbstractionProxy.create.call(this, arg);
        model.models = arg.models;

        return model;
    }},

    doInitialize : { value : function () {
        for ( var key in this.models ) {
            var model = this.models[key];
            model.initialize(this.control);
        }
    }},

    notify : { value : function (event, arg) {
        for ( var key in this.models ) {
            var model = this.models[key];
            model.notify(event, arg);
        }
    }}
});