export function destroy(){
    const self = this,
          formEl = self.formEl,
          validationListenerNames = self.options.fieldOptions.validateOnEvents;

    if( formEl.querySelectorAll('[data-char-count]').length > 0 ){
        formEl.removeEventListener('input', self.listenerCallbacks.charCount, false);
    }

    if( self.options.fieldOptions.strictHtmlValidation ){
        formEl.removeEventListener('keypress', self.listenerCallbacks.keypressMaxlength, false);
    }

    if( self.options.fieldOptions.preventPasteFields ){
        formEl.removeEventListener('paste', self.listenerCallbacks.pastePrevent, false);
    }

    if( self.options.formOptions.handleSubmit ){
        formEl.removeEventListener('submit', self.listenerCallbacks.submit);
    }

    validationListenerNames.split(' ').forEach(function( eventName ){
        let useCapturing = (eventName === 'blur' ? true : false);
        formEl.removeEventListener(eventName, self.listenerCallbacks.validation, useCapturing);
    });
}