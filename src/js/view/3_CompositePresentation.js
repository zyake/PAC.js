/**
 * A composition of presentations
 *
 * It propagates events into child presentations.
 */
CompositePresentation = Object.create(Presentation, {

    fields : { value : { views : { value : null, writable : true } } },

    create : { value : function (arg) {
        Assert.notNullAll(this, [ [ arg.id, "arg.id" ], [ arg.views, "arg.views" ] ]);
        var presentation = Presentation.create.call(this, { id: arg.id, rootQuery: {} });
        presentation.views = arg.views;

        return presentation;
    }},

    doInitialize : { value : function () {
        for ( var key in this.views ) {
            var view = this.views[key];
            view.initialize(this.control);
        }
    }},

    notify : { value : function (event, arg) {
        for ( var key in this.views ) {
            var view = this.views[key];
            view.notify(event, arg);
        }
    }}
});