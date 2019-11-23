
import { executeCallback, mergeObjects } from './helpers';
import { isValidField } from './isValidField';
import { isValidForm } from './isValidForm';

export function validateField( fieldEl, options, validationRules, validationErrors ){
    const callFormValidation = !!options.fieldOptions.callFormValidation;

    delete options.fieldOptions.callFormValidation;
    
    return new Promise(function(resolve){

        const prom = isValidField( fieldEl, options.fieldOptions, validationRules, validationErrors );
        resolve( prom );

    }).then(obj => {

        return new Promise(resolve => {
            if( obj.fieldEl ){
            
                const runCallback = function( data, fieldOptions = {} ){
                    let options = mergeObjects({}, options, {fieldOptions});
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
