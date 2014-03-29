
/**
 * A composition of presentations
 *
 * It propagates events into child presentations.
 */
CompositePresentation = Object.create(Presentation, {

    fields: { value: { views: { value: null, writable: true } } },

    create: { value: function(id, views) {
        var presentation = Presentation.create.call(this, {}, id);
        presentation.views = views;

        return presentation;
    }},

    doInitialize: { value: function() {
        for ( key in this.views ) {
            var view = this.views[key];
            view.initialize(this.control);
        }
    }},

    notify: { value: function(event, arg) {
        for ( key in this.views ) {
            var view = this.views[key];
            view.notify(event, arg);
        }
    }}
});