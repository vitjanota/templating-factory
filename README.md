# Templating Factory

> If even the simplest framework is an overkill.

## Overview

- simple library for easy JSON data presentation.
- updates page elements denoted as *templates* with values from JSON data.
- for each data entry new instance of template is created and all placeholders (wrapped in %%) present in template are replaced by corresponding values from JSON data entry (placeholder name represents a key in JSON key/value pairs).

## Dependences

- so far based on jQuery.

## Usage

- link `templates.js` into your page, define templates and create/fetch data.
- invoke templating factory by\
`factory = new templatingFactory();`
- start processing either by full init\
`factory.populate([templates],data,anchor);`\
`factory.renderData();`
- or via simplified method (covering the most common user case)\
`facory.renderRoot(root,data);`
- `[templates]` is an array of jQuery objects representing particular templates and `anchor` is jQuery object representing element after which newly created content is placed.
- if `root` is specified all its children are automatically considered as templates and as anchor is used the very last of them.

## Inner repetitive processing
- data entry can contain list of subentries which can be processed within given template the same way.
- particular sub-template has to be denoted by `data-for-each` attribute with value equal to corresponding list key.

## Data - template binding
- this is just a view. No conditional logic in placeholders selection. All data logic needs to be done on backend.
- however particular template can be bound to particular data entries via *type*: template with `data-type` attribute specified is used exclusively for data entries with `type` attribute of the same value.
- if no such template is present, all data is processed by default templates regardless of their type.
- template *type* can contain space separated list of types.
