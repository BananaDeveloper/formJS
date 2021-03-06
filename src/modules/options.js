
import { defaultCallbacksInOptions } from './optionsUtils';
import { ajaxOptions } from './optionsAjax';
//import { ajaxOptions } from './optionsAjaxXhr';

export const options = {

    fieldOptions: {
        cssClasses: {
            dirty:              'is-dirty',
            error:              'has-error',
            errorEmpty:         'has-error-empty',
            errorRule:          'has-error-rule',
            valid:              'is-valid'
        },
        focusOnRelated:         true,
        handleFileUpload:       true,
        handleValidation:       true,
        maxFileSize:            10,
        onPastePrevented:       [],
        onValidation:           [defaultCallbacksInOptions.fieldOptions.onValidation],
        preventPasteFields:     '[type="password"], [data-equal-to]',
        skipUIfeedback:         false,
        strictHtmlValidation:   true,
        validateOnEvents:       'input change'
    },

    formOptions: {
        ajaxOptions:            ajaxOptions,
        ajaxSubmit:             true,
        beforeSend:             [],
        getFormData:            defaultCallbacksInOptions.formOptions.getFormData,
        handleSubmit:           true,
        onSubmitComplete:       [],
        onSubmitError:          [],
        onSubmitSuccess:        []
    }
    
}
