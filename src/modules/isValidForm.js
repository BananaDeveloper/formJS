
import { fieldsStringSelector, getUniqueFields, mergeObjects, validateFormObjDefault } from './helpers';
import { isValidField } from './isValidField';
import { validationErrors } from './validationErrors';

export function isValidForm( fieldOptionsObj = {} ){

    const self = this,
          formEl = self.formEl,
          obj = mergeObjects({}, validateFormObjDefault),
          fieldOptions = mergeObjects( {}, self.options.fieldOptions, fieldOptionsObj, {focusOnRelated: false} ),
          fieldsList = getUniqueFields( formEl.querySelectorAll(fieldsStringSelector) )
          validationRules = self.validationRules,
          validationErrors = self.validationErrors;
    
    fieldOptions.beforeValidation = fieldOptions.beforeValidation.map( func => func.bind( this ) );

    return Promise.all( fieldsList.map(function( fieldEl ){
        
        return isValidField( fieldEl, fieldOptions, validationRules, validationErrors );

    }) ).then(list => {

        let areAllFieldsValid = list.filter(fieldObj => !fieldObj.result).length === 0;
        obj.result = areAllFieldsValid;
        obj.fields = list;

        return obj;

    });

}
