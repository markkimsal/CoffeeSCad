// Generated by CoffeeScript 1.3.3
(function() {

  define(function(require) {
    var $, CodeEditorView, CsgProcessor, GlThreeView, GlViewSettings, Library, LoadView, MainContentLayout, MainMenuView, ModalRegion, Project, ProjectFile, ProjectView, SaveView, Settings, SettingsView, app, marionette, modTest, testcode, testcode_alt, _, _ref, _ref1;
    $ = require('jquery');
    _ = require('underscore');
    marionette = require('marionette');
    require('bootstrap');
    CodeEditorView = require("views/codeView");
    MainMenuView = require("views/menuView");
    ProjectView = require("views/projectsview");
    _ref = require("modules/project"), Library = _ref.Library, Project = _ref.Project, ProjectFile = _ref.ProjectFile;
    modTest = require("views/fileSaveLoadView");
    ModalRegion = modTest[0];
    SaveView = modTest[1];
    LoadView = modTest[2];
    SettingsView = modTest[3];
    Settings = require("modules/settings");
    CsgProcessor = require("modules/csg.processor");
    MainContentLayout = require("views/mainContentView");
    _ref1 = require("views/glThreeView"), GlViewSettings = _ref1.GlViewSettings, GlThreeView = _ref1.GlThreeView;
    testcode_alt = "#test with prefix removal (see missing CAG. before the \"fromPoints method\")\nshape1 = fromPoints([[0,0], [150,50], [0,-50]])\n\nshape = shape1.expand(15, 30)\n\nshape=shape.extrude({offset:[0, 0, 50]}) \nreturn shape.setColor(1,0.5,0)";
    testcode = "class CubeClass\n  constructor: (@width=10,@length=20,@height=20, @pos=[0,0,0], @rot=[0,0,0]) ->\n    return @render()\n  \n  render: =>\n    result = new CSG()\n    cube1 =CSG.cube({center: [0, 0, @height/2],radius: [@width/2, @length/2, @height/2]})\n    result = cube1\n    return result.translate(@pos).rotateX(@rot[0]).rotateY(@rot[1]).rotateZ(@rot[2]) \n\ncubeStuff = new CubeClass(75,50,50,[-20,10,10])\ncubeStuff2 = new CubeClass(50,100,50)\n\n\nreturn cubeStuff2.subtract(cubeStuff).color([0,1,0])";
    testcode = "class Thingy\n  constructor: (@thickness=10, @pos=[0,0,0], @rot=[0,0,0]) ->\n  \n  render: =>\n    result = new CSG()\n    shape1 = fromPoints([[0,0], [150,50], [0,-50]])\n    shape = shape1.expand(20, 25)\n    shape = shape.extrude({offset:[0, 0, @thickness]}) \n    cyl = new Cylinder({start: [0, 0, -50],end: [0, 0, 50],radius:10, resolution:12})\n    result = shape.subtract(cyl)\n    return result.translate(@pos).rotateX(@rot[0]).\n    rotateY(@rot[1]).rotateZ(@rot[2]).color([1,0.5,0])\n\nthing = new Thingy(35)\nthing2 = new Thingy(25)\n\nres = thing.render().union(thing2.render().mirroredX().color([0.2,0.5,0.6])) \nreturn res";
    app = new marionette.Application({
      root: "/opencoffeescad",
      cadProcessor: null,
      updateSolid: function() {
        return app.cadProcessor.setCoffeeSCad(app.cadEditor.getValue());
      }
    });
    app.addRegions({
      navigationRegion: "#navigation",
      mainRegion: "#mainContent",
      statusRegion: "#statusBar",
      modal: ModalRegion
    });
    app.on("start", function(opts) {
      return console.log("at start");
    });
    app.on("initialize:after", function() {
      return console.log("after init");
    });
    app.addInitializer(function(options) {
      var displayTheThing, displayTheThing2,
        _this = this;
      app.settings = new Settings;
      app.csgProcessor = new CsgProcessor;
      app.lib = new Library;
      app.project = new Project({
        name: "MyProject",
        content: "this is the first project's content"
      });
      app.project2 = new Project({
        name: "toto",
        content: "something completely different"
      });
      app.lib.add(app.project);
      app.lib.add(app.project2);
      app.model = new ProjectFile({
        name: "main",
        ext: "coscad",
        content: testcode
      });
      app.codeEditorView = new CodeEditorView({
        model: this.model
      });
      app.mainMenuView = new MainMenuView({
        model: this.lib
      });
      app.projectView = new ProjectView({
        collection: this.lib
      });
      app.glThreeView = new GlThreeView({
        model: this.model
      });
      app.mainContentLayout = new MainContentLayout;
      this.mainRegion.show(this.mainContentLayout);
      this.mainContentLayout.edit.show(this.codeEditorView);
      this.mainContentLayout.gl.show(this.glThreeView);
      app.navigationRegion.show(app.mainMenuView);
      app.statusRegion.show(app.projectView);
      app.modal.app = app;
      displayTheThing = function(params) {
        console.log("SaveRequested");
        return console.log("params: " + params);
      };
      displayTheThing2 = function(params) {
        console.log("LoadRequested");
        return console.log("params: " + params);
      };
      app.vent.bind("fileSaveRequest", displayTheThing);
      app.vent.bind("fileLoadRequest", displayTheThing2);
      app.mainMenuView.on("project:new:mouseup", function() {});
      app.mainMenuView.on("file:new:mouseup", function() {
        console.log("newfile");
        _this.project.remove(_this.model);
        _this.model = new ProjectFile({
          name: "main",
          ext: "coscad",
          content: ""
        });
        _this.project.add(_this.model);
        _this.codeEditorView.close();
        _this.codeEditorView = new CodeEditorView({
          model: _this.model
        });
        return _this.mainRegion.show(_this.codeEditorView);
      });
      app.mainMenuView.on("file:save:mouseup", function() {
        app.modView = new SaveView;
        app.modal.show(_this.modView);
        return console.log("savefile");
        /*
              @project.save null,
                success: (project, response) ->
                  console.log "sucess"
                  #console.log project
                error: (project, response) ->
                  console.log 'failed'
        */

      });
      app.mainMenuView.on("file:load:mouseup", function() {
        app.modView = new LoadView;
        app.modal.show(_this.modView);
        return console.log("loadfile");
        /*
              @project.fetch 
                success: (project, response)=> 
                  console.log "sucess"
                  @codeEditorView = new CodeEditorView
                    model: @model
                  @mainRegion.show @codeEditorView
                error: -> 
                  console.log "error"
        */

      });
      app.mainMenuView.on("settings:mouseup", function() {
        app.modView = new SettingsView({
          model: app.settings
        });
        return app.modal.show(_this.modView);
      });
      app.project.on("change", function() {
        return console.log("project changed");
      });
      return app.glThreeView.fromCsg();
    });
    /*return _.extend app,
      module: (additionalProps)->
        return _.extend
          Views: {}
          additionalProps
    */

    return app;
  });

}).call(this);
