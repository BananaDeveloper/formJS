import { isValidField } from '../modules/isValidField';

describe('isValidField', () => {

    it('detects a non valid text field', () => {
        document.body.innerHTML = '<form><input name="name" type="text" data-length="[3,20]" class="form-control" required /></form>';

        return isValidField(document.querySelector('input'))
            .then(data => expect(data.result).toBe(false));


    });

    it('detects a valid text field', () => {
        document.body.innerHTML = '<form><input name="name" type="text" data-length="[3,20]" class="form-control" value="ciao" required /></form>';

        return isValidField(document.querySelector('input'))
            .then(data => expect(data.result).toBe(true));

    });

});