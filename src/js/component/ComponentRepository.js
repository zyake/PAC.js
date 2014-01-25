/**
 *  A central repository to manage components.
 *
 * 	A component can be registered as a factory basis, and
 *	the component will be instantiated when it retrieved at first time.
 *	The component instance will be cached in the repository.
 *
 * If you want to refer to other repository managed components,
 * you can refer to them using a get method in the factory method context.
 *
 * - for example
 * var repository = new ComponentRepository();
 * repository.addFactory("id", function() { return "ID-1" });
 * repository.addFactory("defaultName", function() { return this.get("id") + "-001" });
 *
 * // The value "ID-1-001" will be showed.
 * alert(repository.get("defaultName"));
 *
 * The central repository also supports hierarchical event propagating mechanism,
 * which can be used to notify a event data to parent repositories that
 * can manage a whole application configuration.
 */
function ComponentRepository(parent) {
    this.parent = parent;
    this.components = {};
    this.factories = {};
    this.events = {};
    this.children = [];
    this.routeStack = []; // This stack is used for detecting recursive references.

    if ( parent != null ) {
        parent.children.push(this);
    }
}

ComponentRepository.prototype.addFactory = function(id, factory, refEvents) {
    var duplicatedKey = this.factories[id] != null;
    if ( duplicatedKey ) {
        throw new Error("duplicated id: id=" + id);
    }

    this.factories[id] = factory;
    for ( key in refEvents ) {
        var refEvent = refEvents[key];
        this.events[refEvent] || (this.events[refEvent] = []);
        this.events[refEvent].push(id);
    }
}

ComponentRepository.prototype.raiseEvent = function(event, caller, args) {
    var noRefsFound = this.events[event] == null;
    if ( noRefsFound ) {
        return;
    }

    var listeners = this.events[event];
    for ( key in listeners ) {
        var listener = this.get(listeners[key]);
        listener.notify(event, args);
    }

    if ( this.parent != null && this.parent != caller ) {
       this.parent.raiseEvent(event, this, args);
    }

    for ( key in this.children ) {
        var child = this.children[key];
        if ( child != caller ) {
            child.raiseEvent(event, this, args);
        }
    }
}

ComponentRepository.prototype.get = function(id, args) {
    var recursiveRefFound = this.routeStack.indexOf(id) > -1;
    if ( recursiveRefFound ) {
        throw new Error("The recursive reference found: route=" + this.routeStack);
    }

    try {
        this.routeStack.push(id);
        var existsComponent = this.components[id] != null;
        if ( existsComponent ) {
            var component = this.components[id];
            return component;
        }

        var targetFactory = this.factories[id];
        if ( targetFactory  == null ) {
            if ( this.parent == null ) {
                throw new Error("target factory not found: id=" + id);
            }

            var component = this.parent.get(id, args);
            if ( component == null ) {
                throw new Error("target factory not found: id=" + id);
            }
            return component;
        }
        var newComponent = targetFactory.call(this, args);
        this.components[id] = newComponent;

        return newComponent;
    } finally {
        this.routeStack.pop();
    }
}