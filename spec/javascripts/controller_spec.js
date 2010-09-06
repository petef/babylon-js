describe("Babylon.Controller", function() {
  
  var controller, xml_view_object;
  var action  = 'test-action';
  var name    = 'test-controller';

  beforeEach(function(){
    controller        = new Babylon.Controller();
    controller.name   = name;
    var c_mock        = new Mock(controller);
    controller.stubs('an_action');
    
    Babylon.Runner.connection = {};
    var b_mock        = new Mock(Babylon.Runner.connection);
    Babylon.Runner.connection.stubs('send');
    
    xml_view_object = xml("iq");
    Babylon.Views.add(name, action, function(){ return xml_view_object; });
  });

  afterEach(function() {
    Babylon.Views.clear();
    // controller = undefined;
  });

  describe("perform", function() {

    it("should set the action_name parameter", function() {
      controller.perform('an_action');
      expect(controller.action_name).toEqual('an_action');
    });

    it("should call the action specified", function() {
      controller.expects('an_action');
      controller.perform('an_action');
    });
  }); // end describe

  describe("render_and_send", function() {
    
    var view_mock = function(){};
    
    beforeEach(function() {
      var v_mock              = new Mock(Babylon.Views);
      controller.name         = 'test-controller';
      controller.action_name  = 'test-action';
    }); // end before
    
    it("should set the options to default when not passed in", function() {
      Babylon.Views.expects('get').passing('test-controller', 'test-action').returns(view_mock);
      controller.render_and_send();
    }); // end it
    
    it("should over ride the default options when passed in", function() {
      Babylon.Views.expects('get').passing('override-controller', 'override-action').returns(view_mock);
      controller.render_and_send({ controller: 'override-controller', action_name: 'override-action' });
    }); // end it
    
  }); // end describe

  describe("render_with_callbacks", function() {
    
    beforeEach(function() {
      Babylon.Runner.connection = {};
      Babylon.Runner.connection.connection = {};
      var con_mock = new Mock(Babylon.Runner.connection.connection);
      
      controller.action_name = action;
    }); // end before
    
    it("should call the sendIQ method of Strophe", function() {
      // TODO this matcher should match against the xml_view_object but jsmocha is not correctly matching the objects
      Babylon.Runner.connection.connection.expects('sendIQ').passing(Match.an_object, Match.a_function, Match.a_function, 10000);
      controller.render_with_callbacks({ data: 'blah', success: function(){}, fail: function(){} });
    }); // end it
  }); // end describe
}); // end describe
