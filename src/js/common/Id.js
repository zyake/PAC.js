
/**
 * A builder object to create event id.
 *
 * You can build event id that refers to other components in the same control.
 * Using the id object, you can remove string id literal from your code.
 *
 * - for example
 * this.referEvent(this.id, Id.onAbstraction(this).load());
 *
 * In the former example, you can determine the id of the abstraction
 * that resides in the same control on the presentation.
 * And the format of the id string is following.
 * ${WIDGET_ID}.${CONTROL_ID}.[${PRESENTATION_ID} | ${ABSTRACTION_ID}].${ACTION_CODE}
 */
Id = {

    idString : "",

    LOAD: ".load",

    START: ".start",

    CHANGE: ".change",

    FAILURE: ".failure",

    OTHER: ".other",

    onAbstraction : function (target) {
        Assert.notNull(this, target, "target");

        var id = Object.create(this, {
            target : { value : target },
            idString : { value : "", writable : true, configurable : true } });

        if ( Presentation.isPrototypeOf(target) ) {
            id.idString = target.control.widget.id;
            id.idString += "." + target.control.id;
            id.idString += "." + target.control.abstraction.id;
        } else if ( AbstractionProxy.isPrototypeOf(target) ) {
            id.idString += target.control.widget.id;
            id.idString += ("." + target.control.id);
            id.idString += ("." + target.control.abstraction.id);
        } else if ( Control.isPrototypeOf(target) ) {
            id.idString = target.widget.id;
            id.idString += ("." + target.id);
            id.idString += ("." + target.abstraction.id);
        } else {
            Assert.doThrow("invalid target:" + target);
        }

        return id;
    },

    onPresentation : function (target) {
        Assert.notNull(this, target, "target");

        var id = Object.create(this, {
            target : { value : target },
            idString : { value : "", writable : true, configurable : true } });

        if ( Presentation.isPrototypeOf(target) ) {
            id.idString = target.control.widget.id;
            id.idString += ("." + target.control.id);
            id.idString += ("." + target.control.presentation.id);
        } else if ( AbstractionProxy.isPrototypeOf(target) ) {
            id.idString = target.control.widget.id;
            id.idString += ("." + target.control.id);
            id.idString += ("." + target.control.presentation.id);
        } else if ( Control.isPrototypeOf(target) ) {
            id.idString = target.widget.id;
            id.idString += ("." + target.id);
            id.idString += ("." + target.presentation.id);
        } else {
            Assert.doThrow("invalid target:" + target);
        }
        return id;
    },

    onThis : function (target) {
        Assert.notNull(this, target, "target");

        if ( Presentation.isPrototypeOf(target) ) {
            return Id.onPresentation(target);
        } else if ( AbstractionProxy.isPrototypeOf(target) ) {
            return Id.onAbstraction(target);
        } else {
            Assert.doThrow("invalid target:" + target);
        }
    },

    load : function () {
        return this.idString + this.LOAD;
    },

    start : function () {
        return this.idString + this.START;
    },

    change : function () {
        return this.idString + this.CHANGE;
    },

    failure : function () {
        return this.idString + this.FAILURE;
    },

    other : function () {
        return this.idString + this.OTHER;
    },

    checkAction : function (target, event) {
        Assert.notNullAll(this, [
            [ target, "target" ],
            [ event, "event" ]
        ]);
        return target.endWith(event.idString);
    },

    on : function (idStr) {
        Assert.notNull(this, idStr, "idStr");

        var id = Object.create(this, {
            idString : { value : "", writable : true, configurable : true } });
        id.idString = idStr;

        return id;
    },

    getAction : function (event) {
        var separatorIndex = event.lastIndexOf(".");
        if ( separatorIndex < 0 ) {
            Assert.doThrow("separator couldn't find!: event=" + event);
        }
        return event.substring(separatorIndex);
    },

    toString : function () {
        return "idString: " + this.idString + ", target: " + this.target;
    }
};

Object.seal(Id);