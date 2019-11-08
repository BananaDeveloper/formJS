
import { isDOMNode, mergeObjects, runFunctionsSequence, validateFieldObjDefault } from './helpers';
import { isValid } from './isValid';

export function isValidField( fieldEl, options = {}, validationRules, validationErrors ){

    //field elem already set
    const self = this;

    let obj = mergeObjects({}, validateFieldObjDefault, {fieldEl});

    if( !isDOMNode(fieldEl) ){ return Promise.resolve(obj); }

    //options already merged
    let isValidValue =      fieldEl.value.trim().length > 0,
        isRequired =        fieldEl.required,
        isReqFrom =         fieldEl.matches('[data-required-from]'),
        isValidateIfFilled =fieldEl.matches('[data-validate-if-filled]');

    //before validation functions already set
    const rfsObject = {
        functionsList: options.fieldOptions.beforeValidationFns,
        data: {fieldEl}
    };

    //runfunctionsequence without self
    return runFunctionsSequence(rfsObject)
        .then(data => {

            let dataObj = data.pop();
            return new Promise(function(resolve){
                if(
                    (!isRequired && !isValidateIfFilled && !isReqFrom) ||   // IT IS A NORMAL FORM FIELD
                    (isValidateIfFilled && !isValidValue) ||                // IT IS data-validate-if-filled AND EMPTY
                    (isReqFrom && !isRequired )                             // IT IS data-required-from AND NOT required
                ){

                    dataObj.result = true;
                    resolve( dataObj );
                
                } else {

                    //validation rules and errors
                    resolve( isValid(fieldEl, options, validationRules, validationErrors) );
                    
                }

            });

        });

}
