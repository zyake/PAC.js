
/**
 * A composition of models(AbsctractionProxy objects).
 *
 * # Basics
 * It propagates events into child models.
 * CompositeModel can be used if a view requires more than one AbstractionProxy objects.
 *
 * # How to use
 * ```javascript
 * var compositeModel = CompositeModel.create({
 *  id: "compositeModel1",
 *  models: [model1, model2] });
 * ```
 */
this.CompositeModel = Object.create(this.AbstractionProxy, {

    fields : { value : { models : { value : null, writable : true } } },

    /**
     *
     * @param arg The argument. The properties of the argument are following.
     * - id -> Required. The object id.
     * - models -> Required. The target models(AbstractionProxy objects).
     */
    create : { value : function (arg) {
        Assert.notNullAll(this, [ [ arg.id, "id" ], [ arg.models, "arg.models" ] ]);

        arg.reqResMap = {};
        arg.url = {};
        var model = AbstractionProxy.create.call(this, arg);
        model.models = arg.models;

        return model;
    }},

    /**
     * Initialize all of the enclosed models.
     */
    doInitialize : { value : function () {
        for ( var key in this.models ) {
            var model = this.models[key];
            model.initialize(this.control);
        }
    }},

    /**
     * Notify the event to the enclosed models.
     */
    notify : { value : function (event, arg) {
        for ( var key in this.models ) {
            var model = this.models[key];
            model.notify(event, arg);
        }
    }}
});

Object.seal(this.CompositeModel);
