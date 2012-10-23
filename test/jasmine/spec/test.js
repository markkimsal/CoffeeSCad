// Generated by CoffeeScript 1.3.3

describe("toto", function() {
  return it('can do jokes', function() {
    return expect(true).toBe(true);
  });
});

define(function(require) {
  var $, Library, Project, ProjectFile, _, _ref;
  $ = require('jquery');
  _ = require('underscore');
  _ref = require("modules/project"), Library = _ref.Library, Project = _ref.Project, ProjectFile = _ref.ProjectFile;
  describe("library", function() {
    var lib;
    lib = null;
    return beforeEach(function() {
      return lib = new Library();
    });
  });
  describe("project", function() {
    var project;
    project = null;
    beforeEach(function() {
      return project = new Project({
        name: "test_project"
      });
    });
    it('can add files to itself', function() {
      var part;
      part = new ProjectFile({
        name: "a part",
        ext: "coscad",
        content: ""
      });
      project.add(part);
      expect(project.files.length).toBe(1);
      return expect(project.files[0]).toBe("a part");
    });
    return it('can remove files from itself', function() {
      var part;
      part = new ProjectFile({
        name: "a part",
        ext: "coscad",
        content: ""
      });
      project.add(part);
      project.remove(part);
      return expect(project.files.length).toBe(0);
    });
  });
  return describe("projectFile", function() {
    var part, project;
    project = null;
    part = null;
    beforeEach(function() {
      project = new Project({
        name: "test_project"
      });
      part = new ProjectFile({
        name: "test_part",
        ext: "coscad",
        content: ""
      });
      return project.add(part);
    });
    afterEach(function() {
      part.destroy();
      localStorage.removeItem("Library-test_project");
      return localStorage.removeItem("Library-test_project-parts");
    });
    it('flags itself as dirty on change', function() {
      part.set("content", "DummyContent");
      return expect(part.dirty).toBe(true);
    });
    return it('flags itself as not dirty on save', function() {
      part.set("content", "DummyContent");
      part.save();
      return expect(part.dirty).toBe(false);
    });
  });
});
