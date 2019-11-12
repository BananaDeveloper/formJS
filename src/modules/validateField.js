
import { executeCallback, mergeObjects } from './helpers';
import { isValidField } from './isValidField';
import { isValidForm } from './isValidForm';

export function validateField( fieldElem, fieldOptions, validationRules, validationErrors, fieldOptionsObj = {callFormValidation: true}, options ){
    const callFormValidation = !!fieldOptionsObj.callFormValidation;

    delete fieldOptions.callFormValidation;
    
    return new Promise(function(resolve){

        const prom = isValidField( fieldElem, fieldOptions, validationRules, validationErrors );
        resolve( prom );

    }).then(obj => {

        return new Promise(resolve => {
            if( obj.fieldEl ){
            
                const runCallback = function( data, fieldOptionsNew = {} ){
                    let options = mergeObjects({}, options, {fieldOptions}, {fieldOptions:fieldOptionsNew});
                    executeCallback( {fn: fieldOptions.onValidation, data, options} );
                };

                runCallback( [obj] );

                if( callFormValidation && obj.result ){
                    resolve( isValidForm().then(dataForm => {
                        runCallback( dataForm.fields, {skipUIfeedback: true} );
                        return obj;
                    }) );
                }
            }
            resolve( obj );
        });
        
    });
    
}
