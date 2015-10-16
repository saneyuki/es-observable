import { TestRunner } from "moon-unit";

import constructor from "./constructor.js";
import observe from "./observe.js";
import forEach from "./forEach.js";
import map from "./map.js";
import filter from "./filter.js";
import observable from "./symbol-observable.js";
import species from "./symbol-species.js";
import ofTests from "./of.js";
import fromTests from "./from.js";

import observerNext from "./observer-next.js";
import observerError from "./observer-error.js";
import observerComplete from "./observer-complete.js";
import observerCancel from "./observer-cancel.js";
import observerClosed from "./observer-closed.js";


export function runTests(C) {

    return new TestRunner().inject({ Observable: C }).run({

        "Observable constructor": constructor,

        "Observable.prototype.observe": observe,
        "Observable.prototype.forEach": forEach,
        "Observable.prototype.filter": filter,
        "Observable.prototype.map": map,
        "Observable.prototype[Symbol.observable]": observable,

        "Observable.of": ofTests,
        "Observable.from": fromTests,
        "Observable[Symbol.species]": species,

        "SubscriptionObserver.prototype.next": observerNext,
        "SubscriptionObserver.prototype.error": observerError,
        "SubscriptionObserver.prototype.complete": observerComplete,
        "SubscriptionObserver.prototype.cancel": observerCancel,
        "SubscriptionObserver.prototype.closed": observerClosed,

    });
}
