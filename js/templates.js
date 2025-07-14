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
        this.populate([...root.children], data);
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
          for (const key in this.data) {
              this.renderTemplates(this.data[key]);
          };
        }
        this.removeTemplates();
    };

    // process all templates
    this.renderTemplates = (data) => {
        const that = this;
        // store all available template types
        let alltypes = [];
        this.templates.forEach((template) => {
            template.getAttribute('data-type').split(' ').forEach((type) => {
                alltypes.push(type);
            });
        });
       // process data with matching templates
       this.templates.forEach((template) => {
          // get types from current template
          const templtypes = template.getAttribute('data-type').split(' ');
          // use type template if matches data type
          // use dafault template if no type template matching data type exists
          if ((templtypes.indexOf(data.type) !== -1) || (templtypes.indexOf('default') !== -1 && alltypes.indexOf(data.type) === -1)) {
             that.renderTemplate(template.cloneNode(true),data);
          }
      });
    }

    // process single template
    this.renderTemplate = (template, data) => {
        let rendered = this.processTemplate(template,data);
        this.anchor.after(rendered);
        this.showElement(rendered);
        this.anchor = rendered;
    };

    // itarate through template DOM and update all elements and text nodes
    this.processTemplate = (element, data) => {
        switch (element.nodeType) {
            //tag
            case 1:
                if (!element.getAttribute('data-for-each')) {
                    // loop processing IS NOT defined for given element
                    // update attributes
                    const attributes =  element.attributes;
                    for (let m = 0; m < attributes.length; m++) {
                        // remove attributes configured to be removed
                        if (attributes[m].name.indexOf(this.attributesToRemove) !== -1) {
                            element.removeAttribute(attributes[m].name);
                        }
                    }
                    for (let j = 0; j < attributes.length; j++) {
                        // update values of all attributes
                        element.setAttribute(attributes[j].name, this.updateValue(element.getAttribute(attributes[j].name),data));
                    }
                    for (let l = 0; l < attributes.length; l++) {
                        // alter attributes configured to be altered
                        if (attributes[l].name.indexOf(this.attributesToAlter) !== -1) {
                            // because of 'some' browsers values cannot be used directly, but stored prior processing 
                            const newVal = element.getAttribute(attributes[l].name);
                            const newName = attributes[l].name.replace('data-','');
                            element.removeAttribute(attributes[l].name);
                            element.setAttribute(newName,newVal);
                        }
                    }
                    if (element.getAttribute('data-process')) {
                        // element is set as a root for further processing
                        // create data from processing target
                        let dataSubset = this.createDataSubset(data[element.getAttribute('data-process')]);
                        // set undefined type as default and store all childeren as templates
                        let templates = [];
                        for (let i = 0; i < element.children.length; i++) {
                            if (!element.children[i].getAttribute('data-type')) element.children[i].setAttribute('data-type','default');
                            templates.push(element.children[i]);
                        }
                        // remove processing flag to avoid endless recursion
                        element.removeAttribute('data-process');
                        // start processing
                        let inner = new TemplatingFactory();
                        inner.populate(templates, dataSubset);
                        inner.renderData();
                        inner.removeTemplates();
                    } else {
                        //proceed with all children
                        for (let k = 0; k < element.childNodes.length; k++) {
                            this.processTemplate(element.childNodes[k],data);
                        }
                    }
                } else {
                    // loop processing IS defined for given element
                    // create data from processing target
                    let dataSubset = this.createDataSubset(data[element.getAttribute('data-for-each')]);
                    // set undefined type as default 
                    if (!element.getAttribute('data-type')) element.setAttribute('data-type','default');
                    // remove loop processing flag to avoid endless recursion
                    element.removeAttribute('data-for-each');
                    // start processing
                    let inner = new TemplatingFactory();
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

    // set style to make element visible
    this.showElement = (element) => {
        const actStyle = window.getComputedStyle(element, null);
        if (actStyle.getPropertyValue('visibility') == 'hidden') {
            element.style.visibility ='visible';
        }
        if (actStyle.getPropertyValue('display') == 'none') {
            element.style.display ='block';
        }
    }

    // create data subset
    this.createDataSubset = (data) => {
        let subset = {};
        if (data) {
            subset = JSON.parse(JSON.stringify(data));
            // set undefined type to default on data
            for (const key in subset) {
               if (!subset[key].type) subset[key].type = 'default';
            }
        }
        return subset;
    }

    // remove all templates
    this.removeTemplates = () => {
        this.templates.forEach((template) => {
            template.remove();
        });
    };
}
