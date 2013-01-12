define (require)->
  $ = require 'jquery'
  _ = require 'underscore'
  Backbone = require 'backbone'
  LocalStorage = require 'localstorage'
  
  
  class Settings extends Backbone.Collection
    localStorage: new Backbone.LocalStorage("Settings")
    
    constructor:(options)->
      super options
      @settingNames = new Object()
      @bind("reset", @onReset)
      @init()
    
    init:()=>
      @add new GeneralSettings()
      @add new KeyBindings()
      
    save:()=>
      @each (model)-> 
        model.save()
    
    registerSettingClass:(settingName, settingClass)->
      #register a new setting class by name (a setting object containing params for a specific sub app)
      @settingNames[settingName] = settingClass
      #yuck
      @add new settingClass()
      @            
    
    parse: (response)=>
      #TODO yuck, do we really need custom classes for each piece of settings?
      for i, v of response
        response[i]= new  @settingNames[v.name](v)
        
        ###
        switch v.name
          when "General"
            response[i]= new  GeneralSettings(v)
          when "GlView"
            response[i]= new  GlViewSettings(v)
          when "Editor"
            response[i]= new  EditorSettings(v)
          when "Keys"
            response[i]= new  KeyBindings(v)
          when "Gists"
            response[i]= new  GitHubSettings(v)
       ###
      return response
      
    clear:()=>
      @each (model)-> 
        model.destroy()
      
    onReset:()->
      if @models.length == 0
        #console.log "fetched empty collection"
        @init()
      ###
      console.log "collection reset" 
      console.log @
      console.log "_____________"
      ###
      
    getByName:(name)->
      """Return a specific sub setting by name"""
      result = this.filter (setting)->
        return setting.get('name')==name
      return result[0]
      
  class GeneralSettings extends Backbone.Model
    idAttribute: 'name'
    defaults:
      name: "General"
      title: "General"
      maxRecentFilesDisplay:  5
      theme: "slate"
      
    constructor:(options)->
      super options
  
  class KeyBindings extends Backbone.Model
    idAttribute: 'name'
    defaults:
      name: "Keys"
      title: "Key Bindings"
      general:
        ["undo":   "CTRL+Z",
        "redo":   "CTRL+Y"]
      
    constructor:(options)->
      super options
  

  return Settings