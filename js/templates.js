// ======================== templating factory ========================
// version 0.2
function TemplatingFactory() {

    this.templates = [];
    this.data = {};
    this.anchor = {};
    // list of "service" attributes which should not be outputted
    this.attributesToRemove = ["data-type"];
    // list of attributes which shoud be outputted without "data-" prefix (because 'some' browsers remove invalid attr values)
    this.attributesToAlter = ["data-style"];

    // populate factory
    this.populate = function(templates, data, anchor) {
        var that = this;
        this.data = data;
        this.templates = [];
        templates.forEach(function(template) {
            // undefined type set as default and store all templates
            if (!template.attr("data-type")) template.attr("data-type","default");
            that.templates.push(template);
        });
        // if rendering anchor is not defined, place result after the last template by default
        this.anchor = anchor ? anchor : templates[templates.length - 1];
    };

    // automatic factory setup
    this.renderRoot = function(root, data) {
        var templates = [];
        for (var i = 0; i < root.children().length; i++) {
            templates.push($(root.children()[i]));
        }
        this.populate(templates, data);
        this.renderData();
    };

    // start processing
    this.renderData = function() {
        var that = this, type, types = [];
        //process data with matching templates
        for (var key in this.data) {
            type = this.data[key].type;
            // store all available templete types
            this.templates.forEach(function(template) {
                template.attr("data-type").split(" ").forEach(function(tp) {
                    types.push(tp);
                });
            });
            this.templates.forEach(function(template) {
                // if template type is of data type use it
                if (template.attr("data-type").split(" ").indexOf(type) !== -1) {
                    that.renderTemplate(template.clone(true),that.data[key]);
                    // use default template only if no data type tempalte exists
                } else if (template.attr("data-type").split(" ").indexOf("default") !== -1 && $.inArray(type, types) === -1) {
                    that.renderTemplate(template.clone(true),that.data[key]);
                }
            });
        }
        this.removeTemplates();
    };

    // process single template
    this.renderTemplate = function(template, data) {
        var rendered;
        rendered = this.processTemplate(template,data);
        this.anchor.after(rendered);
        rendered.css("visibility","visible");
        this.anchor = rendered;
    };

    // itarate through template DOM and update all elements and text nodes
    this.processTemplate = function(element, data) {
        var attributes, children, child = {}, dataSubset, templates = [], newVal, newName, inner, key;
        switch (element[0].nodeType) {
            //tag
            case 1:
                // is loop processing defined for given element?
                if (!element.attr("data-for-each")) {
                    attributes =  element[0].attributes;
                    children = element[0].childNodes;
                    for (var m = 0; m < attributes.length; m++) {
                        // remove attributes configured to be removed
                        if (attributes[m].name.indexOf(this.attributesToRemove) !== -1) {
                            element.removeAttr(attributes[m].name);
                        }
                    }
                    // update attributes
                    for (var j = 0; j < attributes.length; j++) {
                        // update values of all attributes
                        element.attr(attributes[j].name, this.updateValue(element.attr(attributes[j].name),data));
                    }
                    for (var l = 0; l < attributes.length; l++) {
                        // alter attributes configured to be altered
                        if (attributes[l].name.indexOf(this.attributesToAlter) !== -1) {
                            // because of 'some' browsers values cannot be used directly, but stored into variables prior processing 
                            newVal = element.attr(attributes[l].name);
                            newName = attributes[l].name.replace("data-","");
                            element.removeAttr(attributes[l].name);
                            element.attr(newName,newVal);
                        }
                    }
                    if (element.attr("data-for-each-wrapper")) {
                        // if element is set as a wrapper for loop processing
                        // start loop procssing on its children
                        dataSubset = JSON.parse(JSON.stringify(data[element.attr("data-for-each-wrapper")]));
                        // set undefined type to default on data
                        for (key in dataSubset) {
                            if (!dataSubset[key].type) dataSubset[key].type = "default";
                        }
                        // set undefined type as default and store all templates
                        for (var i = 0; i < element.children().length; i++) {
                            child = $(element.children()[i]);
                            if (!child.attr("data-type")) child.attr("data-type","default");
                            templates.push(child);
                        }
                        element.removeAttr("data-for-each-wrapper");
                        // start processing
                        inner = new TemplatingFactory();
                        inner.populate(templates, dataSubset);
                        inner.renderData();
                        inner.removeTemplates();
                    } else {
                        //proceed with all children
                        for (var k = 0; k < children.length; k++) {
                            this.processTemplate($(children[k]),data);
                        }
                    }
                } else {
                    // set both template and data to default processing type
                    // and remove loop processing flag to avoid endless recursion 
                    dataSubset = JSON.parse(JSON.stringify(data[element.attr("data-for-each")]));
                    for (key in dataSubset) {
                        dataSubset[key].type = "default";
                    }
                    element.attr("data-type","default").removeAttr("data-for-each");
                    // start processing
                    inner = new TemplatingFactory();
                    inner.populate([element], dataSubset);
                    inner.renderData();
                    inner.removeTemplates();
                }
                break;
            //text 
            case 3:
                //update value
                element[0].data = this.updateValue(element[0].data,data);
                break;
            }
        return element;
    };

    // expand reference in given value
    this.updateValue = function(val,data) {
        var parsedVal =  val.split("%%"),
            upVal = "";
        for (var i = 0; i < parsedVal.length ; i++) {
            if (i % 2 === 0) {
                upVal += data[parsedVal[i + 1]] ? parsedVal[i] + data[parsedVal[i + 1]] : parsedVal[i];
            }
        }
        return upVal;
    };

    // remove all templates
    this.removeTemplates = function() {
        this.templates.forEach(function(template){
            template.remove();
        });
    };
}
