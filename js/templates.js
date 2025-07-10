// ======================== templating factory ========================
// version 0.3
function TemplatingFactory() {

    this.templates = [];
    this.data = {};
    this.anchor = {};
    // list of "service" attributes which should not be outputted
    this.attributesToRemove = ['data-type'];
    // list of attributes which shoud be outputted without "data-" prefix (because 'some' browsers remove invalid attr values)
    this.attributesToAlter = ['data-style'];

    // populate factory
    this.populate = (templates, data, anchor) => {
        let that = this;
        this.data = data;
        this.templates = [];
        templates.forEach((template) => {
            // undefined type set as default and store all templates
            if (!template.getAttribute('data-type')) template.setAttribute('data-type','default');
            that.templates.push(template);
        });
        // if rendering anchor is not defined, place result after the last template by default
        this.anchor = anchor ? anchor : templates[templates.length - 1];
    };

    // automatic factory setup
    this.renderRoot = (root, data) => {
        const templates = [...root.children];
        this.populate(templates, data);
        this.renderData();
    };

    // start processing
    this.renderData = () => {
        if (Array.isArray(this.data)) {
            // data is an array
            this.data.forEach((item) => {
              this.renderTemplates(item);
            });
        } else {
          // data is an object
          for (let key in this.data) {
              this.renderTemplates(this.data[key]);
          };
        }
        this.removeTemplates();
    };

    // process all templates
    this.renderTemplates = (data) => {
        const that = this;
        // store all available template types
        let types = [];
        this.templates.forEach((template) => {
            template.getAttribute('data-type').split(' ').forEach((tp) => {
                types.push(tp);
            });
        });
       //process data with matching templates
       this.templates.forEach((template) => {
          const templtypes = template.getAttribute('data-type').split(' ');
          // use type template if matches data type
          // use dafault template if no type template matching data type exists
          // if ((templtypes.indexOf(data.type) !== -1) || (templtypes.indexOf('default') !== -1 && $.inArray(data.type, types) === -1)) {
          if ((templtypes.indexOf(data.type) !== -1) || (templtypes.indexOf('default') !== -1 && types.indexOf(data.type) === -1)) {
             that.renderTemplate(template.cloneNode(true),data);
          }
      });
    }

    // process single template
    this.renderTemplate = (template, data) => {
        let rendered = this.processTemplate(template,data);
        this.anchor.after(rendered);
        rendered.style.visibility ='visible';
        this.anchor = rendered;
    };

    // itarate through template DOM and update all elements and text nodes
    this.processTemplate = (element, data) => {
        let attributes, children, child = {}, dataSubset = {}, templates = [], newVal, newName, inner, key;
        switch (element.nodeType) {
            //tag
            case 1:
                // is loop processing defined for given element?
                if (!element.getAttribute('data-for-each')) {
                    attributes =  element.attributes;
                    children = element.childNodes;
                    for (let m = 0; m < attributes.length; m++) {
                        // remove attributes configured to be removed
                        if (attributes[m].name.indexOf(this.attributesToRemove) !== -1) {
                            element.removeAttribute(attributes[m].name);
                        }
                    }
                    // update attributes
                    for (let j = 0; j < attributes.length; j++) {
                        // update values of all attributes
                        element.setAttribute(attributes[j].name, this.updateValue(element.getAttribute(attributes[j].name),data));
                    }
                    for (let l = 0; l < attributes.length; l++) {
                        // alter attributes configured to be altered
                        if (attributes[l].name.indexOf(this.attributesToAlter) !== -1) {
                            // because of 'some' browsers values cannot be used directly, but stored into variables prior processing 
                            newVal = element.getAttribute(attributes[l].name);
                            newName = attributes[l].name.replace('data-','');
                            element.removeAttribute(attributes[l].name);
                            element.setAttribute(newName,newVal);
                        }
                    }
                    if (element.getAttribute('data-process')) {
                        // if element is set as a wrapper for loop processing
                        // start loop procssing on its children
                        if (data[element.getAttribute('data-process')]) {
                          dataSubset = JSON.parse(JSON.stringify(data[element.getAttribute('data-process')]));
                        }
                        // set undefined type to default on data
                        for (key in dataSubset) {
                            if (!dataSubset[key].type) dataSubset[key].type = 'default';
                        }
                        // set undefined type as default and store all templates
                        for (let i = 0; i < element.children.length; i++) {
                            child = element.children[i];
                            if (!child.getAttribute('data-type')) child.setAttribute('data-type','default');
                            templates.push(child);
                        }
                        element.removeAttribute('data-process');
                        // start processing
                        inner = new TemplatingFactory();
                        inner.populate(templates, dataSubset);
                        inner.renderData();
                        inner.removeTemplates();
                    } else {
                        //proceed with all children
                        for (let k = 0; k < children.length; k++) {
                            this.processTemplate(children[k],data);
                        }
                    }
                } else {
                    // set both template and data to default processing type
                    // and remove loop processing flag to avoid endless recursion 
                    if (data[element.getAttribute('data-for-each')]) {
                      dataSubset = JSON.parse(JSON.stringify(data[element.getAttribute('data-for-each')]));
                      for (key in dataSubset) {
                        dataSubset[key].type = 'default';
                      }
                    }
                    element.setAttribute('data-type','default');
                    element.removeAttribute('data-for-each');
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
                element.data = this.updateValue(element.data,data);
                break;
            }
        return element;
    };

    // expand reference in given value
    this.updateValue = (val,data) => {
        const parsedVal =  val.split('%%');
        let upVal = '';
        for (let i = 0; i < parsedVal.length ; i++) {
            if (i % 2 === 0) {
                upVal += data[parsedVal[i + 1]] ? parsedVal[i] + data[parsedVal[i + 1]] : parsedVal[i];
            }
        }
        return upVal;
    };

    // remove all templates
    this.removeTemplates = () => {
        this.templates.forEach((template) => {
            template.remove();
        });
    };
}
