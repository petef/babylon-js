Screw.Unit(function() {
    describe("Babylon.StatusHandler", function() {
        var router = {};
        var observer = {};
        var handler = {};

        before(function(){
            router = {};
            router.routed_stanza = null;
            router.executed_routes = [];

            router.route = function(stanza) {
                this.routed_stanza = stanza;
            };

            router.execute_route = function(obs, event, obj) {
                this.executed_routes.push([obs, event, obj]);
            };

            observer = new Babylon.Observer();
            observer.add_connection_observer("event", "obs");

            handler = new Babylon.StatusHandler(router, observer);
        });

        describe("init", function() {
            it("should set the observer and router", function() {
                expect(handler.router).to_not(equal, null);
                expect(handler.router).to_not(equal, undefined);

                expect(handler.observer).to_not(equal, null);
                expect(handler.observer).to_not(equal, undefined);
            });
        });

        describe("call_on_observers", function() {
            it("should call observer.call_on_observers with the event and a routing function", function() {
                handler.call_on_observers("event", {status: "running"});
                expect(router.executed_routes.pop()).to(equal, ["obs", "event", {status: "running"}]);
            });
        });
        describe("on_status_change", function() {
        });

        describe("on_stanza", function() {
            it("should call router.route passing in the stanza", function() {
                var s = $msg({to: 'someone', from: 'someone_else'});
                handler.on_stanza(s);
                expect(router.routed_stanza).to(equal, Strophe.serialize(s));
            });
        });
    });
});