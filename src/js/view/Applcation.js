
function Application(appElem) {
    this.centralRepository = new ComponentRepository();
    this.transitionManager = new TransitionManager(appElem, this.centralRepository);
}

Application.prototype ={

    defineWidgets: function() {
        // please, override!
    }
    ,
    start: function(initWidgetId) {
        this.defineWidgets();
        var me = this;
        window.addEventListener("hashchange", function(event) {
            var newWidgetId = event.newUrl.substring(1);
             me.transitionManager.transit(newWidgetId);
        });
        this.transitionManager.transit(initWidgetId);
    }
};