import { executeCallback } from '../modules/helpers';

describe( 'eecuteCallback helper', () => {

    it( 'executes a single callback', () => {
        const cb1 = jest.fn();

        executeCallback( { fn: cb1 } );

        expect( cb1 ).toHaveBeenCalled();        

    } );

    it( 'executes a series of callbacks', () => {
        const cb1 = jest.fn();
        const cb2 = jest.fn();
        const cb3 = jest.fn();

        executeCallback( { fn: [ cb1, cb2, cb3 ] } );

        expect( cb1 ).toHaveBeenCalled();
        expect( cb2 ).toHaveBeenCalled();
        expect( cb3 ).toHaveBeenCalled();        

    } );

} );