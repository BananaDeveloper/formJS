
import { mergeObjects, toCamelCase } from './helpers';
import { validationRulesAttributes } from './validationRules';

/**
 * 
 * @function isValid
 * @description Check the validity of the provided field element
 * 
 * @param {HTMLElement} fieldEl Element to be checked for validity
 * @param {Object} [fieldOptions={}] Field options
 * @param {*} [validationRules={}] Validation rules
 * @param {*} [validationErrors={}] Validation errors
 * 
 * @returns {Promise<Object>} Promise that will return an object containing validity results/error
 */
export function isValid( fieldEl, fieldOptions = {}, validationRules = {}, validationErrors = {} ){

    const fieldType = ( fieldEl.matches('[data-subtype]') ? toCamelCase( fieldEl.getAttribute('data-subtype') ) : fieldEl.type ),
          fieldValue = fieldEl.value,
          isValidValue = fieldValue.trim().length > 0,
          // ALPHABETICAL REVERSE ORDER
          fieldAttributes = Array.from(fieldEl.attributes).sort(function(a,b){ return a.name < b.name });

    let attrValidations = [],
        attrValidationsResult = isValidValue,
        obj = { result: isValidValue, fieldEl };

    if( !obj.result ){
        obj.errors = { empty: true };
        return Promise.resolve(obj);
    }

    // COLLECT SPECIFIC VALIDATIONS FOR validationRulesAttributes
    fieldAttributes.forEach(function(attr){
        // FOR data-* ATTRIBUTES -> REMOVE "data-" AND TRANSFORM TO CAMELCASE
        let attrName = toCamelCase( attr.name.replace('data-', '') ),
            attrValue = attr.value,
            isAttrValueWithFn = attrName === 'type' && typeof validationRulesAttributes[attrValue] === 'function',
            isAttrNameWithFn = typeof validationRulesAttributes[attrName] === 'function';

        if( isAttrValueWithFn || isAttrNameWithFn ){

            let extraValObj = {
                    attrName: (isAttrValueWithFn ? attrValue : attrName),
                    attrValue: attrValue,
                    fieldEl,
                    fieldOptions
                };

            if( isAttrValueWithFn || attrName === 'requiredFrom' ){
                // THESE VALIDATIONS MUST RUN BEFORE ALL OTHERS
                attrValidations.unshift( extraValObj );
            } else {
                attrValidations.push( extraValObj );
            }

        }
    });

    return new Promise(function(resolve){

        // RUN SPECIFIC VALIDATIONS FOR validationRulesAttributes
        attrValidations.forEach(function(item){
            let extraVal = validationRulesAttributes[item.attrName]( item );
            if( !extraVal.result ){
                obj = mergeObjects({}, obj, extraVal);
                attrValidationsResult = false;
            }
        });

        // RUN VALIDATIONS FOR validationRules
        if( typeof validationRules[fieldType] === 'function' ){
            resolve( validationRules[fieldType](fieldValue, fieldEl) );
        } else {
            resolve( obj );
        }

    }).then(data => {

        obj = mergeObjects( {}, obj, data, {fieldEl} );
        obj.result = obj.result && attrValidationsResult;

        if( !obj.result ){
            let fieldErrors = (typeof validationErrors[fieldType] === 'function' ? validationErrors[fieldType](fieldValue, fieldEl) : {});
            if( typeof obj.errors === 'undefined' ){
                obj.errors = {};
            }
            obj.errors.rule = true;
            obj.errors = mergeObjects({}, obj.errors, fieldErrors);
        }
        
        return obj;

    });

}
