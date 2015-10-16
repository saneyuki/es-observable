// Emits each element of the input stream until the control stream has emitted an
// element.
function takeUntil(stream, control) {

    return new Observable(sink => {

        let cancelSource = stream.observe(sink);

        let cancelInput = control.observe({

            next: x => sink.complete(x),
            error: x => sink.error(x),
            complete: x => sink.complete(x),
        });

        return _=> {

            cancelSource();
            cancelInput();
        };
    });
}

// For a nested stream, emits the elements of the inner stream contained within the
// most recent outer stream
function switchLatest(stream) {

    return new Observable(sink => {

        let inner = null;

        let outer = stream.observe({

            next(value) {

                if (inner)
                    inner();

                inner = value.observe({

                    next: x => sink.next(x),
                    error: x => sink.error(x),
                });
            },

            error: x => sink.error(x),
            complete: x => sink.complete(x),

        });

        return _=> {

            if (inner)
                inner();

            outer();
        };
    });
}

// Returns an observable of DOM element events
function listen(element, eventName) {

    return new Observable(sink => {

        function handler(event) { sink.next(event) }
        element.addEventListener(eventName, handler);
        return _=> element.removeEventListener(eventName, handler);
    });
}

// Returns an observable of drag move events for the specified element
function mouseDrags(element) {

    // For each mousedown, emit a nested stream of mouse move events which stops
    // when a mouseup event occurs
    let moveStreams = listen(element, "mousedown").map(e => {

        e.preventDefault();

        return takeUntil(
            listen(element, "mousemove"),
            listen(document, "mouseup"));
    });

    // Return a stream of mouse moves nested within the most recent mouse down
    return switchLatest(moveStreams);
}

let cancel = mouseDrags(document.body).observe({
    next(e) { console.log(`DRAG: <${ e.x }:${ e.y }>`) }
});

/*

(async _=> {

    for await (let e of mouseDrags(document.body))
        console.log(`DRAG: <${ e.x }:${ e.y }>`);

})();

*/
