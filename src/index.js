import {mergeObjects} from './modules/helpers';
import {options} from './modules/options';
import {validationRules} from './modules/validationRules';
import {validationErrors} from './modules/validationErrors';

// CONSTRUCTOR FUNCTION & PUBLIC METHODS
import {constructorFn} from './modules/constructor';
import {destroy} from './modules/destroy';
import {getFormFields} from './modules/getFormFields';
import {init} from './modules/init';
import {validateField} from './modules/validateField';
import {validateForm} from './modules/validateForm';
import {
    isDOMNode,
    mergeObjects,
} from './modules/helpers';

const version = '3.2.0';

class Form {

    constructor(formEl, optionsObj) {
        constructorFn.call(this, formEl, optionsObj);
    }

    destroy() {
        destroy.call(this);
    }

    /**
     * @method getFormData
     * @description @simplySayHi What should I put here?
     *
     * @returns @simplySayHi what should I put here?
     */
    getFormData() {
        const formFields = getFormFields(this.formEl);

        return this.options.formOptions.getFormData(formFields);
    }

    init() {
        return init.call(this);
    }

    validateField(fieldEl, fieldOptions = {callFormValidation: true}) {
        const el = (isDOMNode(fieldEl) ? fieldEl : this.formEl.querySelector(fieldEl));
        const fieldOpt = mergeObjects({}, this.options.fieldOptions, fieldOptions);

        return validateField(el, fieldOpt, this.validationRules, this.validationErrors, this.options);
    }

    validateForm(fieldOptions) {
        return validateForm.call(this, fieldOptions);
    }

    static addValidationErrors(errorsObj) {
        this.prototype.validationErrors = mergeObjects({}, this.prototype.validationErrors, errorsObj);
    }

    static addValidationRules(rulesObj) {
        this.prototype.validationRules = mergeObjects({}, this.prototype.validationRules, rulesObj);
    }

    static setOptions(optionsObj) {
        this.prototype.options = mergeObjects({}, this.prototype.options, optionsObj);
    }

}

Form.prototype.isInitialized = false;
Form.prototype.options = options;
Form.prototype.validationErrors = validationErrors;
Form.prototype.validationRules = validationRules;
Form.prototype.version = version;

export default Form;
