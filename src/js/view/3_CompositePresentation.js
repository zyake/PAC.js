/**
 * A composition of views(Presentation objects).
 *
 * # Basics
 * It propagates events into child views.
 * CompositePresentation can be used if a view requires more than one Presentation objects.
 *
 * # How to use
 * ```javascript
 * var compositePresentation = CompositePresentation.create({
 *  id: "compositeView1",
 *  views: [view1, view2] });
 * ```
 */
this.CompositePresentation = Object.create(this.Presentation, {

    fields : { value : { views : { value : null, writable : true } } },

    /**
     * Create a CompositePresentation object.
     *
     * @param arg The argument. The properties of the argument are following.
     * - id -> Required. The object id.
     * - views -> Required. The target views(Presentation objects).
     */
    create : { value : function (arg) {
        Assert.notNullAll(this, [ [ arg.id, "arg.id" ], [ arg.views, "arg.views" ] ]);

        var presentation = Presentation.create.call(this, arg);
        presentation.views = arg.views;

        return presentation;
    }},

    /**
     * Initialize the Presentation object.
     * Unlike Presentation, it doesn't use the rootQuery argument.
     *
     * @param control The enclosing control object.
     */
    initialize : { value: function (control) {
        Assert.notNull(this, control, "control");
        this.control = control;
        this.doInitialize();
    }},

    /**
     * Initialize all of the enclosed Presentation objects.
     */
    doInitialize : { value : function () {
        for ( var key in this.views ) {
            var view = this.views[key];
            view.initialize(this.control);
        }
    }},

    /**
     * Notify an event into the enclosed Presentation objects.
     */
    notify : { value : function (event, arg) {
        for ( var key in this.views ) {
            var view = this.views[key];
            view.notify(event, arg);
        }
    }}
});

Object.seal(this.CompositePresentation);
