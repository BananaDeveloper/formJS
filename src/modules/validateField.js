
import { executeCallback, mergeObjects } from './helpers';
import { isValidField } from './isValidField';
import { isValidForm } from './isValidForm';

export function validateField( fieldElem, fieldOptionsObj = {callFormValidation: true} ){

    const self = this,
          callFormValidation = !!fieldOptionsObj.callFormValidation,
          fieldEl = (typeof fieldElem === 'string' ? self.formEl.querySelector(fieldElem) : fieldElem),
          fieldOptions = mergeObjects({}, self.options.fieldOptions, fieldOptionsObj),
          validationRules = self.validationRules,
          validationErrors = self.validationErrors;
    
    fieldOptions.beforeValidation = fieldOptions.beforeValidation.map( func => func.bind( this ) );

    delete fieldOptions.callFormValidation;
    
    return new Promise(function(resolve){

        const prom = isValidField( fieldEl, fieldOptions, validationRules, validationErrors );
        resolve( prom );

    }).then(obj => {

        return new Promise(resolve => {
            if( obj.fieldEl ){
            
                const runCallback = function( data, fieldOptionsNew = {} ){
                    let options = mergeObjects({}, {fieldOptions}, {fieldOptions:fieldOptionsNew});
                    executeCallback.call( self, {fn: fieldOptions.onValidation, data, options} );
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
