
/**
 * A event builder class that can define view and model events by fluent interface.
 *
 * - for example
 *
 * EventBuilder.create(target)
 *  .ref().onAbstraction().load(this.load)
 *  .ref().onAbstraction().start(this.start)
 *  .raise().start({});
 */
EventBuilder = {

    REF_INVOKER : {

        target : null,
        id : null,
        builder : null,

        load : function (handler) {
            this.target.control.addEventRef(this.id.load(), this.target);
            this.builder.eventMap[this.id.load()] = handler;
            return this.builder;
        },

        start : function (handler) {
            this.target.control.addEventRef(this.id.start(), this.target);
            this.builder.eventMap[this.id.start()] = handler;
            return this.builder;
        },

        change : function (handler) {
            this.target.control.addEventRef(this.id.change(), this.target);
            this.builder.eventMap[this.id.change()] = handler;
            return this.builder;
        },

        failure : function (handler) {
            this.target.control.addEventRef( this.id.failure(), this.target);
            this.builder.eventMap[this.id.failure()] = handler;
            return this.builder;
        },

        other : function (handler) {
            this.target.control.addEventRef(this.id.other(),  this.target);
            this.builder.eventMap[this.id.other()] = handler;
            return this.builder;
        }
    },

    RAISE_INVOKER : {

        target : null,
        id : null,
        builder : null,

        load : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.load(), this.target, args);
            return this.builder;
        },

        start : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.start(), this.target, args);
            return this.builder;
        },

        change : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.change(), this.target, args);
            return this.builder;
        },

        failure : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.failure(), this.target, args);
            return this.builder;
        },

        other : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.other(), this.target, args);
            return this.builder;
        }
    },

    create : function (target) {
        Assert.notNullAll(this, [
            [ target, "target"]
        ]);
        Assert.notNull(this, target, "target");

        var builder = Object.create(this,
            { target : { value : target }, eventMap : { value : [] } });
        Object.seal(builder);

        return builder;
    },

    ref : function () {
        var me = this;
        return {

            target : this.target,

            onAbstraction : function () {
                return Object.create(EventBuilder.REF_INVOKER,
                    { target : { value : this.target }, builder : { value : me },
                        id : { value : Id.onAbstraction(this.target) } });
            },

            onPresentation : function () {
                return Object.create(EventBuilder.REF_INVOKER,
                    { target : { value : this.target }, builder : { value : me },
                        id : { value : Id.onPresentation(this.target) } });
            },

            on : function (event) {
                Assert.notNullAll(this, [
                    [ event, "event"]
                ]);
                return Object.create(EventBuilder.REF_INVOKER,
                    { target : { value : this.target }, builder : { value : me },
                        id : { value : Id.on(event) } });
            }
        };
    },

    raise : function () {
        var me = this;
        var raise = Object.create(EventBuilder.RAISE_INVOKER, {
            target : { value : this.target }, builder : { value : me },
            id : { value : Id.onThis(this.target) }
        });
        Object.seal(raise);

        return raise;
    },

    handle : function (id, arg) {
        if ( this.eventMap[id] != null ) {
            this.eventMap[id].call(this.target, arg, id);
        } else {
            this.eventMap[Id.other()] && this.eventMap[Id.other()].call(this.target, arg, id);
        }
    }
};

Object.seal(EventBuilder);