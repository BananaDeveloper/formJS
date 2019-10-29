/**
 * @function alwaysFalse
 * @description function that always return false
 *
 * @returns {boolean} false
 */
export const alwaysFalse = () => false;

export const

fieldsStringSelector = 'input:not([type="reset"]):not([type="submit"]):not([type=button]):not([type=hidden]), select, textarea',

addClass = function( element, cssClasses ){
    cssClasses.split(' ').forEach(function(className){
        element.classList.add( className );
    });
},

checkDirtyField = function( fields, cssClasses = this.options.fieldOptions.cssClasses.dirty ){

    var fields = (isNodeList(fields) ? Array.from( fields ) : [fields]);
    
    fields.forEach(function(fieldEl){
        if( fieldEl.type !== 'checkbox' && fieldEl.type !== 'radio' ){
            let containerEl = fieldEl.closest('[data-formjs-question]') || fieldEl;

            if( fieldEl.value ){
                
                addClass( containerEl, cssClasses );
                
            } else {
                
                removeClass( containerEl, cssClasses );
                
            }
        }
    });
    
},

checkFormEl = function( formEl ){
    let isString = typeof formEl,
        isValidNodeSelector = isString === 'string' && isDOMNode(document.querySelector(formEl)),
        isFormSelector = isValidNodeSelector && document.querySelector(formEl).tagName.toLowerCase() === 'form',
        obj = {
            result: isDOMNode(formEl) || isFormSelector,
            element: (isString === 'string' ? document.querySelector(formEl) : formEl)
        };

    return obj;
},

executeCallback = function( {fn = null, data = {}, options = {}} = {} ){
    let self = this,
        optionsNew = mergeObjects({}, self.options, options),
        callbackFnList = [];

    if( typeof fn === 'function' ){
        callbackFnList.push( fn );
    } else if( Array.isArray(fn) ) {
        callbackFnList = fn;
    }

    callbackFnList.forEach(function(promiseFn){
        promiseFn.call( self, data, optionsNew );
    });
},

getFilledFields = function( formEl ){
    return getUniqueFields( formEl.querySelectorAll(fieldsStringSelector) ).filter(fieldEl => {
        const name = fieldEl.name,
              type = fieldEl.type;

        const isCheckboxOrRadio = (type === 'checkbox' || type === 'radio'),
            fieldChecked = formEl.querySelector('[name="' + name + '"]:checked'),
            isReqFrom = fieldEl.matches('[data-required-from]'),
            reqMoreEl = (isReqFrom ? formEl.querySelector(fieldEl.getAttribute('data-required-from')) : null);

        fieldEl = fieldChecked || fieldEl;
        
        return  (!isCheckboxOrRadio && fieldEl.value) || 
                (isCheckboxOrRadio && fieldChecked !== null) ||
                (isReqFrom && reqMoreEl.checked)
    });
},

getSplitChar = function( string ){
    let splitChar = '.';

    if( string.indexOf(splitChar) === -1 ){
        if( string.indexOf('-') >= 0 ){
            splitChar = '-';
        } else if( string.indexOf('/') >= 0 ){
            splitChar = '/';
        }
    }

    return splitChar;
},

getUniqueFields = function( nodeList ){

    let currentFieldName = '',
        currentFieldType = '';

    return Array.from( nodeList ).filter(fieldEl => {
        const name = fieldEl.name,
              type = fieldEl.type;

        if( name === currentFieldName && type === currentFieldType ){
            return false;
        }
        
        if( !fieldEl.matches('[data-required-from]') ){
            currentFieldName = name;
            currentFieldType = type;
        }
        return true;
    });
    
},

isDOMNode = function( node ){
    return Element.prototype.isPrototypeOf( node );
},

isFieldForChangeEvent = function ( fieldEl ) {
    return fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]');
},

isNodeList = function( nodeList ){
    return NodeList.prototype.isPrototypeOf( nodeList );
},

isPlainObject = function( object ){
    return Object.prototype.toString.call( object ) === '[object Object]';
},

mergeObjects = function( out = {} ){
    for(let i=1; i<arguments.length; i++){
        let obj = arguments[i];

        if(!obj){ continue; }

        for(let key in obj){
            let isArray = Object.prototype.toString.call(obj[key]) === "[object Array]";
            let isObject = Object.prototype.toString.call(obj[key]) === "[object Object]";

            // COPY ONLY ENUMERABLE PROPERTIES
            if( obj.hasOwnProperty(key) ){
                if( isArray ){

                    if( typeof out[key] === 'undefined' ){
                        out[key] = [];
                    }
                    out[key] = out[key].concat( obj[key].slice(0) );

                } else if( isObject ){

                    out[key] = mergeObjects(out[key], obj[key]);

                } else {

                    // * STRING | NUMBER | BOOLEAN | FUNCTION
                    if( Array.isArray(out[key]) ){
                        // IF THIS IS ONE OF ABOVE (*) AND THE DESTINATION OBJECT IS AN ARRAY
                        out[key].push(obj[key]);
                    } else {
                        out[key] = obj[key];
                    }

                }
            }
        }
    }

    return out;
},

removeClass = function( element, cssClasses ){
    cssClasses.split(' ').forEach(function(className){
        element.classList.remove( className );
    });
},

runFunctionsSequence = ( { functionsList = [], data = {}, stopConditionFn = alwaysFalse } = {} ) => {
    const results = [];

    //Execute all the functions, break if stop condition is matched
    for( let i = 0; i < functionsList.length; i++ ) {
        const currentFunction = functionsList[i];

        const currentResult = currentFunction( data );

        if( stopConditionFn( currentResult ) ) {
            results.splice( 0, results.length, currentResult );
            break;
        }

        results.push( currentResult );
    }

    //Return a promise that will be resolved only when all the executed functions will be resolved
    return Promise.all( results ).then( resolve => {
        return results;
    } );
},

serializeObject = function( obj ){
    var objToString = (
            (obj && typeof obj === 'object' && obj.constructor === Object) ? 
            Object.keys(obj)
                .reduce(function(a,k){
                    a.push(k+'='+encodeURIComponent(obj[k]));
                    return a
                },[]).join('&') : 
            obj
    );
    return objToString;
},

toCamelCase = function( string ){
    return string.replace(/-([a-z])/ig, function(all, letter){ return letter.toUpperCase(); });
},

validateFieldObjDefault = { result: false, fieldEl: null },

validateFormObjDefault = { result: true, fields: [] }
