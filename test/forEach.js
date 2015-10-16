import { testMethodProperty } from "./helpers.js";

export default {

    "Observable.prototype has a forEach property" (test, { Observable }) {

        testMethodProperty(test, Observable.prototype, "forEach", {
            configurable: true,
            writable: true,
            length: 1,
        });
    },

    "Argument must be a function" (test, { Observable }) {

        let result = Observable.prototype.forEach.call({}, {});

        test._("If the first argument is not a function, a promise is returned")
        .assert(result instanceof Promise);

        return result.then(_=> null, e => e).then(error => {

            test._("The promise is rejected with a TypeError")
            .assert(Boolean(error))
            .assert(error instanceof TypeError);
        });
    },

    "Observe is called on the 'this' value" (test, { Observable }) {

        let called = 0,
            observer = null;

        Observable.prototype.forEach.call({

            observe(x) {
                called++;
                observer = x;
            }

        }, _=> null);

        test._("The observe method is called with an observer")
        .equals(called, 1)
        .equals(typeof observer, "object")
        .equals(typeof observer.next, "function")
        ;
    },

    "Error rejects the promise" (test, { Observable }) {

        let error = new Error();

        return new Observable(observer => { observer.error(error) })
            .forEach(_=> null)
            .then(_=> null, e => e)
            .then(value => {
                test._("Sending error rejects the promise with the supplied value")
                .equals(value, error);
            });
    },

    "Complete resolves the promise" (test, { Observable }) {

        let token = {};

        return new Observable(observer => { observer.complete(token) })
            .forEach(_=> null)
            .then(x => x, e => null)
            .then(value => {
                test._("Sending complete resolves the promise with the supplied value")
                .equals(value, token);
            });
    },

    "The callback is called with the next value" (test, { Observable }) {

        let values = [];

        return new Observable(observer => {

            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();

        }).forEach(x => {

            values.push(x);

        }).then(_=> {

            test._("The callback receives each next value")
            .equals(values, [1, 2, 3]);

        });
    },

    "If the callback throws an error, the promise is rejected" (test, { Observable }) {

        let error = new Error();

        return new Observable(observer => { observer.next(1) })
            .forEach(_=> { throw error })
            .then(_=> null, e => e)
            .then(value => {
                test._("The promise is rejected with the thrown value")
                .equals(value, error);
            });
    },

};
