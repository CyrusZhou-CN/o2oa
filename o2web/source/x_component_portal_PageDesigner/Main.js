MWF.APPPOD = MWF.xApplication.portal.PageDesigner;
MWF.APPPOD.options = {
	"multitask": true,
	"executable": false
};
//MWF.xDesktop.requireApp("portal.PortalManager", "Actions.RestActions", null, false);
MWF.xDesktop.requireApp("portal.PageDesigner", "Module.Package", null, false);
//MWF.xDesktop.requireApp("portal.PageDesigner", "Module.Page", null, false);
MWF.xApplication.portal.PageDesigner.Main = new Class({
	Extends: MWF.xApplication.Common.Main,
	Implements: [Options, Events],
	options: {
		"style": "default",
        "template": "page.json",
        "templateId": "",
        "name": "portal.PageDesigner",
        "icon": "icon.png",
        "title": MWF.APPPOD.LP.title,
        "appTitle": MWF.APPPOD.LP.title,
        "id": "",
        "actions": null,
        "category": null,
        "processData": null,
        "mvcStyle": "style.css"
	},
	onQueryLoad: function(){
        this._loadCss();
        this.shortcut = true;
		if (this.status){
			this.options.id = this.status.id;
		}
		if (!this.options.id){
			this.options.desktopReload = false;
			this.options.title = this.options.title + "-"+MWF.APPPOD.LP.newPage;
		}
        if( this.options.application ){
            if( !this.application  )this.application = this.options.application;
        }
        this.actions = MWF.Actions.get("x_portal_assemble_designer");
		//this.actions = new MWF.xApplication.portal.PortalManager.Actions.RestActions();

		this.lp = MWF.xApplication.portal.PageDesigner.LP;
	},

	loadApplication: function(callback){
		this.createNode();
		if (!this.options.isRefresh){
			this.maxSize(function(){
				this.openPage();
			}.bind(this));
		}else{
			this.openPage();
		}

        this.addKeyboardEvents();
		if (callback) callback();
	},
    addKeyboardEvents: function(){
        this.addEvent("copy", function(){
            this.copyModule();
        }.bind(this));
        this.addEvent("paste", function(e){
            if( e.target && e.target.tagName && e.target.tagName.toLowerCase() === "textarea" )return;
            this.pasteModule();
            e.preventDefault();
        }.bind(this));
        this.addEvent("cut", function(){
            this.cutModule();
        }.bind(this));
        this.addEvent("keySave", function(e){
            this.keySave(e);
        }.bind(this));
        this.addEvent("keyDelete", function(e){
            this.keyDelete(e);
        }.bind(this));
    },
    keySave: function(e){
        if (this.shortcut) {
            if (this.page) this.savePage();
            e.preventDefault();
        }
    },
    keyDelete: function(e){
        if (this.page){
            if (this.shortcut){
                if (this.page.currentSelectedModule){
                    var module = this.page.currentSelectedModule;
                    if (module.moduleType!="page" && module.moduleName.indexOf("$")==-1){
                        module["delete"](module.node);
                    }
                }
            }
        }
    },
    copyModule: function(){
        if (this.shortcut) {
            if (this.page) {
                if (this.page.currentSelectedModule) {
                    var module = this.page.currentSelectedModule;
                    if (module.moduleType != "page" && module.moduleName.indexOf("$") == -1) {

                        this.page.fireEvent("queryGetPageData", [module.node]);
                        var html = module.getHtml();
                        var json = module.getJson();
                        this.page.fireEvent("postGetPageData", [module.node]);

                        MWF.clipboard.data = {
                            "type": "page",
                            "data": {
                                "html": html,
                                "json": json
                            }
                        };
                    } else {
                        MWF.clipboard.data = null;
                    }
                }
            }
        }
    },
    cutModule: function(){
        if (this.shortcut) {
            if (this.page) {
                if (this.page.currentSelectedModule) {
                    var module = this.page.currentSelectedModule;
                    if (module.moduleType != "page" && module.moduleName.indexOf("$") == -1) {
                        this.copyModule();
                        // module.destroy();
                        // module.page.selected();
                        var _page = module.form;

                        if( _page.history ){
                            module.addHistoryLog("cut");
                        }

                        module.destroy();
                        _page.currentSelectedModule = null;
                        _page.selected();
                        _page = null;
                    }
                }
            }
        }
    },
    pasteModule: function(){
        if (this.shortcut) {
            if (this.page) {
                if (MWF.clipboard.data) {
                    if (MWF.clipboard.data.type == "page") {
                        var datatemplateJsons = [];
                        var idMap = {};
                        var html = MWF.clipboard.data.data.html;
                        var json = Object.clone(MWF.clipboard.data.data.json);
                        var tmpNode = new Element("div", {
                            "styles": {"display": "none"},
                            "html": html
                        }).inject(this.content);

                        var originalIds = {};
                        Object.each(json, function (moduleJson){
                            originalIds[moduleJson.id] = true;
                        });

                        Object.each(json, function (moduleJson) {
                            var oid = moduleJson.id;
                            var id = moduleJson.id;
                            var idx = 1;
                            while (this.page.json.moduleList[id] || ( originalIds[id] && idx > 1 ) ) {
                                id = oid + "_" + idx;
                                idx++;
                            }
                            if (oid != id) {
                                idMap[oid] = id;
                                moduleJson.id = id;
                                var moduleNode = tmpNode.getElementById(oid);
                                if (moduleNode) moduleNode.set("id", id);
                            }
                            if( moduleJson.type === "Datatemplate" )datatemplateJsons.push(moduleJson);
                            this.page.json.moduleList[moduleJson.id] = moduleJson;
                        }.bind(this));
                        json = null;

                        datatemplateJsons.each(function (json) {
                            this.checkDatatemplateRelativeId(json, idMap);
                        }.bind(this));

                        var injectNode = this.page.node;
                        var where = "bottom";
                        var parent = this.page;
                        if (this.page.currentSelectedModule) {
                            var toModule = this.page.currentSelectedModule;
                            injectNode = toModule.node;
                            parent = toModule;

                            if (toModule.moduleType != "container" && toModule.moduleType != "page") {
                                where = "after";
                                parent = toModule.parentContainer;
                            }
                        }

                        var moduleList = [];
                        var copyModuleNode = tmpNode.getFirst();
                        while (copyModuleNode) {
                            copyModuleNode.inject(injectNode, where);
                            var copyModuleJson = this.page.getDomjson(copyModuleNode);
                            var module = this.page.loadModule(copyModuleJson, copyModuleNode, parent);
                            module._setEditStyle_custom("id");
                            module.selected();
                            moduleList.push( module );

                            copyModuleNode = tmpNode.getFirst();
                        }
                        tmpNode.destroy();
                        tmpNode = null;

                        if( this.page.history && moduleList.length){
                            moduleList[0].addHistoryLog("paste", moduleList);
                        }
                    }
                }
            }
        }
    },
	createNode: function(){
		this.content.setStyle("overflow", "hidden");
		this.node = new Element("div", {
			"styles": {"width": "100%", "height": "100%", "overflow": "hidden"}
		}).inject(this.content);
	},
	openPage: function(){
		this.initOptions();
		this.loadNodes();
		this.loadToolbar();
		this.loadPageNode();
		this.loadProperty();
		//this.loadTools();
        this.loadTools(function(){
            this.resizeNode();
            this.addEvent("resize", this.resizeNode.bind(this));
        }.bind(this));

		// this.resizeNode();
		// this.addEvent("resize", this.resizeNode.bind(this));
		this.loadPage();

		if (this.toolbarContentNode){
			this.setScrollBar(this.toolbarContentNode, null, {
				"V": {"x": 0, "y": 0},
				"H": {"x": 0, "y": 0}
			});
		}
        MWF.require("MWF.widget.ScrollBar", function(){
            new MWF.widget.ScrollBar(this.propertyDomScrollArea, {
                "style":"default", "where": "before", "distance": 30, "friction": 4, "indent": false, "axis": {"x": false, "y": true}
            });
        }.bind(this));
        MWF.require("MWF.widget.ScrollBar", function(){
            new MWF.widget.ScrollBar(this.historyScrollArea, {
                "style":"default", "where": "before", "distance": 30, "friction": 4, "indent": false, "axis": {"x": false, "y": true}
            });
        }.bind(this));
	},
	initOptions: function(){
		this.toolsData = null;
		this.toolbarMode = "all";
		this.tools = [];
        this.toolGroups = [];
		this.toolbarDecrease = 0;

		this.designNode = null;
		this.page = null;
	},
	loadNodes: function(){
		this.toolbarNode = new Element("div", {
			"styles": this.css.toolbarNode,
			"events": {"selectstart": function(e){e.preventDefault();}}
		}).inject(this.node);
		this.propertyNode = new Element("div", {
			"styles": this.css.propertyNode
		}).inject(this.node);
		this.pageNode = new Element("div", {
			"styles": this.css.pageNode
		}).inject(this.node);

        if (this.options.style=="bottom") this.propertyNode.inject(this.pageNode, "after");
	},

	//loadToolbar----------------------
	loadToolbar: function(){
		this.toolbarTitleNode = new Element("div", {
			"styles": this.css.toolbarTitleNode,
			"text": MWF.APPPOD.LP.tools
		}).inject(this.toolbarNode);

		this.toolbarTitleActionNode = new Element("div", {
			"styles": this.css.toolbarTitleActionNode,
			"events": {
				"click": function(e){
					this.switchToolbarMode();
				}.bind(this)
			}
		}).inject(this.toolbarNode);

        this.toolbarTitleCategoryActionNode = new Element("div", {
            "styles": this.css.toolbarTitleCategoryActionNode
        }).inject(this.toolbarNode);

        this.categoryActionMenu = new o2.xDesktop.Menu(this.toolbarTitleCategoryActionNode, {
            "event": "click", "style": "flatUser", "offsetX": 0, "offsetY": 0, "container": this.node,
            "onQueryShow": this.showCategoryMenu.bind(this)
        });
        this.categoryActionMenu.load();

        this.toolbarGroupContentNode = new Element("div", {"styles": this.css.toolbarGroupContentNode}).inject(this.toolbarNode);
        this.toolbarGroupContentNode.addEvent("selectstart", function(e){
            e.preventDefault();
            e.stopPropagation();
        });

		// this.toolbarContentNode = new Element("div", {
		// 	"styles": this.css.toolbarContentNode,
		// 	"events": {
		// 		"selectstart": function(e){
        //             e.preventDefault();
        //             e.stopPropagation();
		// 		}
		// 	}
		// }).inject(this.toolbarNode);
	},
    showCategoryMenu: function(){
        this.categoryActionMenu.items.each(function(item){
            debugger;
            if (this.currentToolGroup && this.currentToolGroup.data.text==item.options.text){
                item.setDisable(true);
                var imgDiv = item.item.getFirst();
                var img = imgDiv.getElement("img");
                if (!img) img = new Element("img", {"styles": item.menu.css.menuItemImg}).inject(imgDiv);
                img.set("src", this.path+this.options.style+"/check.png");
            }else{
                item.setDisable(false);
                var imgDiv = item.item.getFirst();
                var img = imgDiv.getElement("img");
                if (img) img.destroy();
            }
        }.bind(this));
    },
	switchToolbarMode: function(){
		if (this.toolbarMode=="all"){
			var size = this.toolbarNode.getSize();
			this.toolbarDecrease = (size.x.toFloat())-60;

			this.tools.each(function(node){
				node.getLast().setStyle("display", "none");
			});
			this.toolbarTitleNode.set("text", "");

			this.toolbarNode.setStyle("width", "60px");

			var pageMargin = this.pageNode.getStyle("margin-left").toFloat();
			pageMargin = pageMargin - this.toolbarDecrease;

			this.pageNode.setStyle("margin-left", ""+pageMargin+"px");

			this.toolbarTitleActionNode.setStyles(this.css.toolbarTitleActionNodeRight);

            this.toolbarGroupContentNode.getElements(".o2formModuleTools").hide();

			this.toolbarMode="simple";
		}else{
			sizeX = 60 + this.toolbarDecrease;
			var pageMargin = this.pageNode.getStyle("margin-left").toFloat();
			pageMargin = pageMargin + this.toolbarDecrease;

			this.toolbarNode.setStyle("width", ""+sizeX+"px");
			this.pageNode.setStyle("margin-left", ""+pageMargin+"px");

			this.tools.each(function(node){
				node.getLast().setStyle("display", "block");
			});

			this.toolbarTitleNode.set("text", MWF.APPPOD.LP.tools);

			this.toolbarTitleActionNode.setStyles(this.css.toolbarTitleActionNode);

            this.toolbarGroupContentNode.getElements(".o2formModuleTools").show();

			this.toolbarMode="all";
		}

	},

	//loadPageNode------------------------------
	loadPageNode: function(){
		this.pageToolbarNode = new Element("div", {
			"styles": this.css.pageToolbarNode
		}).inject(this.pageNode);
		this.loadPageToolbar();

		this.pageContentNode = new Element("div", {
			"styles": this.css.pageContentNode
		}).inject(this.pageNode);
		this.loadPageContent(function(){
			if (this.designDcoument) this.designDcoument.body.setStyles(this.css.designBody);
			if (this.designNode) this.designNode.setStyles(this.css.designNode);
		}.bind(this));
	},
    loadDesignerActionNode: function(){
        this.pcDesignerActionNode = this.pageToolbarNode.getElement("#MWFPCDesignerAction");
        this.mobileDesignerActionNode = this.pageToolbarNode.getElement("#MWFMobileDesignerAction");
        this.currentDesignerMode = "PC";

        this.pcDesignerActionNode.setStyles(this.css.designerActionNode_current);
        this.mobileDesignerActionNode.setStyles(this.css.designerActionNode);

        var iconNode = new Element("div", {"styles": this.css.designerActionPcIconNode}).inject(this.pcDesignerActionNode);
        iconNode = new Element("div", {"styles": this.css.designerActionMobileIconNode}).inject(this.mobileDesignerActionNode);

        var textNode = new Element("div", {"styles": this.css.designerActiontextNode, "text": "PC"}).inject(this.pcDesignerActionNode);
        textNode = new Element("div", {"styles": this.css.designerActiontextNode, "text": "Mobile"}).inject(this.mobileDesignerActionNode);

        this.pcDesignerActionNode.addEvent("click", function(){
            if (this.currentDesignerMode!="PC"){
                this.changeDesignerModeToPC();
            }
        }.bind(this));
        this.mobileDesignerActionNode.addEvent("click", function(){
            if (this.currentDesignerMode=="PC"){
                this.changeDesignerModeToMobile();
            }
        }.bind(this));
    },
    changeDesignerModeToPC: function(){
        this.pcDesignerActionNode.setStyles(this.css.designerActionNode_current);
        this.mobileDesignerActionNode.setStyles(this.css.designerActionNode);

        this.designMobileNode.setStyle("display", "none");
        this.designNode.setStyle("display", "block");

        if (this.page.currentSelectedModule){
            if (this.page.currentSelectedModule==this){
                return true;
            }else{
                this.mobilePreSelectedModule = this.page.currentSelectedModule;
                this.page.currentSelectedModule.unSelected();
            }
        }
        if (this.page.propertyMultiTd){
            this.page.propertyMultiTd.hide();
            this.page.propertyMultiTd = null;
        }
        this.page.unSelectedMulti();

        if( this.mobilePage )this.mobilePage.hideDomTree();

        if (this.page.designTabPageScriptAreaNode) this.page.designTabPageScriptAreaNode.hide();
        this.page = this.pcPage;
        this.pcPage.showDomTree();
        ( this.pcPreSelectedModule || this.pcPage ).selected();

        if ((this.scriptPage && this.scriptPage.isShow) || this.scriptPanel){
            this.loadAllScript();
        }

        this.currentDesignerMode = "PC";

        this.historyArea.show();
        this.historyAreaMobile.hide();
        this.currentHistoryNode = this.historyArea;
    },

    changeDesignerModeToMobile: function(){
        this.pcDesignerActionNode.setStyles(this.css.designerActionNode);
        this.mobileDesignerActionNode.setStyles(this.css.designerActionNode_current);

        this.designMobileNode.setStyle("display", "block");
        this.designNode.setStyle("display", "none");

        if (this.page.currentSelectedModule){
            if (this.page.currentSelectedModule==this){
                return true;
            }else{
                this.pcPreSelectedModule = this.page.currentSelectedModule;
                this.page.currentSelectedModule.unSelected();
            }
        }
        if (this.page.propertyMultiTd){
            this.page.propertyMultiTd.hide();
            this.page.propertyMultiTd = null;
        }
        this.page.unSelectedMulti();

        if( this.pcPage )this.pcPage.hideDomTree();

        if (!this.mobilePage){
            this.designMobileNode.set("id", "designMobileNode");
            this.mobilePage = new MWF.PCPage(this, this.designMobileNode, {"mode": "Mobile"});
            if (!Object.keys(this.pageMobileData.json.moduleList).length){
                this.pageMobileData = Object.clone(this.pageData);
            }
            this.mobilePage.load(this.pageMobileData);

            // this.mobilePage = new MWF.PCPage(this, this.designMobileNode, {"mode": "Mobile"});
            // this.mobilePage.load(this.pageMobileData);
        }else{
            this.mobilePage.showDomTree();
            ( this.mobilePreSelectedModule || this.mobilePage ).selected();
        }

        if (this.page.designTabPageScriptAreaNode) this.page.designTabPageScriptAreaNode.hide();
        this.page = this.mobilePage;

        //if (this.page.designTabPageScriptAreaNode && this.page.designTabPageScriptAreaNode.isDisplayed()){
        if ((this.scriptPage && this.scriptPage.isShow) || this.scriptPanel){
            this.loadAllScript();
        }

        this.currentDesignerMode = "Mobile";

        this.historyArea.hide();
        this.historyAreaMobile.show();
        this.currentHistoryNode = this.historyAreaMobile;
    },


    loadPageToolbar: function(callback){
		this.getToolbarHTML(function(toolbarNode){
			var spans = toolbarNode.getElements("span");
			spans.each(function(item, idx){
				var img = item.get("MWFButtonImage");
				if (img){
					item.set("MWFButtonImage", this.path+""+this.options.style+"/pageToolbar/"+img);
				}
			}.bind(this));

			$(toolbarNode).inject(this.pageToolbarNode);
			MWF.require("MWF.widget.Toolbar", function(){
				this.pageToolbar = new MWF.widget.Toolbar(toolbarNode, {"style": "ProcessCategory"}, this);
				this.pageToolbar.load();

                this.loadDesignerActionNode();
				if (callback) callback();
			}.bind(this));
		}.bind(this));
	},
	getToolbarHTML: function(callback){
		var toolbarUrl = this.path+this.options.style+"/pageToolbars.html";
        MWF.getRequestText(toolbarUrl, function(responseText, responseXML){
            var htmlString = responseText;
            htmlString = o2.bindJson(htmlString, {"lp": this.lp.formToolbar});
            var temp = new Element('div').set('html', htmlString);
            if (callback) callback( temp.childNodes[0] );
        }.bind(this));
	},
	loadPageContent: function(callback){
        MWF.require("MWF.widget.Tab", null, false);
        this.designTabNode = new Element("div").inject(this.pageContentNode);
        this.designTab = new MWF.widget.Tab(this.designTabNode, {"style": "design"});
        this.designTab.load();

        this.designTabPageAreaNode = Element("div");

        this.designNode = new Element("div", {
            "styles": this.css.designNode
        }).inject(this.designTabPageAreaNode);

        this.designMobileNode = new Element("div", {
            "styles": this.css.designMobileNode
        }).inject(this.designTabPageAreaNode);

        this.designTabScriptAreaNode = Element("div", {"styles": this.css.designTabScriptAreaNode});
        // this.designTabScriptPcAreaNode = Element("div", {"styles": this.css.designTabScriptPcAreaNode}).inject(this.designTabScriptAreaNode);
        // this.designTabScriptMobileAreaNode = Element("div", {"styles": this.css.designTabScriptMobileAreaNode}).inject(this.designTabScriptAreaNode);
        //this.designTabHtmlAreaNode = Element("div", {"styles": this.css.designTabHtmlAreaNode});
        //this.designTabCssAreaNode = Element("div", {"styles": this.css.designTabScriptAreaNode});

        this.designPage = this.designTab.addTab(this.designTabPageAreaNode, this.lp.design);
        this.scriptPage = this.designTab.addTab(this.designTabScriptAreaNode, this.lp.script);
        //this.htmlPage = this.designTab.addTab(this.designTabHtmlAreaNode, this.lp.html);
        //this.cssPage = this.designTab.addTab(this.designTabCssAreaNode, this.lp.css);

        this.setScriptPageEvent();

        this.designPage.showTabIm();

        // this.cssPage.addEvent("postShow", function(){
        //     this.loadCssPage();
        //     this.fireEvent("resize");
        // }.bind(this));

        // this.htmlPage.addEvent("postShow", function(){
        //     this.loadHtmlPage();
        //     this.fireEvent("resize");
        // }.bind(this));

        this.scriptPage.addEvent("postShow", function(){
            this.checkLoadAllScript();
            this.fireEvent("resize");
        }.bind(this));
        this.designPage.addEvent("postShow", function(){
            this.fireEvent("resize");
        }.bind(this));


        // this.designNode = new Element("div#designNode", {
        //     "styles": this.css.designNode
        // }).inject(this.pageContentNode);
        //
        // this.designMobileNode = new Element("div", {
        //     "styles": this.css.designMobileNode
        // }).inject(this.pageContentNode);
	},
    /*
    loadCssPage: function(){
        if (!this.cssPageLoaded){
            if (!this.page.json.css || typeOf(this.page.json.css)!=="object") this.page.json.css = {"code": "", "html": ""};
            var cssContent = this.page.json.css
            MWF.require("MWF.widget.CssArea", function(){
                var cssArea = new MWF.widget.CssArea(this.designTabCssAreaNode, {
                    "title": "CSS",
                    "maxObj": this.content,
                    "isload": true,
                    "onChange": function(){
                        if (!this.page.json.css) this.page.json.css = {"code": "", "html": ""};
                        var json = cssArea.toJson();
                        this.page.json.css.code = json.code;
                        cssArea.isChanged = true;
                        //this.data[name].html = json.html;
                    }.bind(this),
                    "onBlur": function(){
                        if (cssArea.isChanged){
                            this.page._setEditStyle("css", null, "");
                            cssArea.isChanged = false;
                        }
                    }.bind(this),
                    "onSave": function(){
                        if (cssArea.isChanged){
                            this.page._setEditStyle("css", null, "");
                            cssArea.isChanged = false;
                        }
                        this.saveForm();
                    }.bind(this),
                    "style": "page"
                });
                cssArea.load(cssContent);
                //cssArea.loadEditor(cssContent);
            }.bind(this));
            this.cssPageLoaded = true;
        }
    },
    loadHtmlPage: function(){
        if (!this.htmlPageLoaded){
            MWF.widget.ace.load(function(){
                ace.require("ace/ext/language_tools");
                this.htmlEditor = ace.edit(this.designTabHtmlAreaNode);
                this.htmlEditor.session.setMode("ace/mode/html");
                this.htmlEditor.setTheme("ace/theme/eclipse");
                this.htmlEditor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: false
                });

                debugger;
                o2.load("JSBeautifier_html", function(){
                    this.htmlEditor.setValue(html_beautify(this.page.node.get("html")));
                }.bind(this));

                // var Mode = require('ace/mode/html').Mode;
                // this.htmlEditor.getSession().setMode(new Mode());

                //this.htmlEditor.focus();
                //this.htmlEditor.navigateFileStart();

                this.htmlEditor.commands.addCommand({
                    name: 'save',
                    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
                    exec: function(htmlEditor) {
                        this.fireEvent("save");
                    }.bind(this),
                    readOnly: false // false if this command should not apply in readOnly mode
                });
                this.htmlEditor.commands.addCommand({
                    name: 'help',
                    bindKey: {win: 'Ctrl-Q|Ctrl-Alt-Space|Ctrl-Space|Alt-/',  mac: 'Command-Q'},
                    exec: function(editor, e, e1) {
                        this.fireEvent("reference", [editor, e, e1]);
                    }.bind(this),
                    readOnly: false // false if this command should not apply in readOnly mode
                });

                this.node.addEvent("keydown", function(e){
                    e.stopPropagation();
                });
            }.bind(this));
        }
    },
    */
    createScriptPanel: function(p, s){
        MWF.require("MWF.widget.Panel", function(){
            this.scriptPanel = new MWF.widget.Panel(this.designTabScriptAreaNode, {
                "title": this.lp.script,
                "minLeft": "500",
                "minTop": "1",
                "style": "page",
                "target": this.content,
                "limitMove": false,
                "isClose": false,
                "width": s.x,
                "height": s.y,
                "top": p.y,
                "left": p.x,
                "onPostLoad": function(){
                    this.loadAllScript();
                    this.fireEvent("resize");
                }.bind(this),
                "onResize": function(){
                    this.fireEvent("resize");
                }.bind(this),
                "onDrag": function(el, e){
                    if (el.getStyle("top").toInt()<0) el.setStyle("top", "0px");
                    if (!this.scriptPage.tab.tabNodeContainer.isOutside(e)){
                        this.scriptPage.tabNode.show();
                        this.scriptPanel.container.setStyle("opacity", "0.5");
                    }else{
                        this.scriptPage.tabNode.hide();
                        this.scriptPanel.container.setStyle("opacity", "1");
                    }
                }.bind(this),
                "onCompleteMove": function(el, e){
                    if (!this.scriptPage.tab.tabNodeContainer.isOutside(e)){
                        this.scriptPage.tabNode.show();

                        this.designTabScriptAreaNode.inject(this.designTab.contentNodeContainer.getLast());
                        this.fireEvent("resize");
                        this.scriptPage.showTabIm();

                        this.scriptPanel.closePanel();
                        this.scriptPanel = null;
                    }
                }.bind(this)
            });
            this.scriptPanel.load();
        }.bind(this));
    },
    createScriptPageDragNode: function(e){
        var size = this.scriptPage.tab.contentNodeContainer.getSize();
        var position = this.scriptPage.tab.contentNodeContainer.getPosition(this.content);
	    if (!this.scriptPageContentDrag){
            var dragNode = new Element("div", {"styles": this.css.scriptPageDragNode}).inject(this.content);

            this.scriptPageContentDrag = new Drag.Move(dragNode, {
                "droppables": [this.scriptPage.tab.tabNodeContainer],
                "onEnter": function(el, drop){
                    this.scriptPage.tabNode.show();
                    this.designTabScriptAreaNode.show();

                    // this.scriptPageContentDrag.stop();
                    // this.scriptPageContentDrag.detach();
                    this.scriptPageContentDrag = null;
                    dragNode.destroy();

                    this.scriptPageDrag.start(e);
                }.bind(this),
                "onComplete": function(el, e){
                    if (this.scriptPage.tab.tabNodeContainer.isOutside(e)){
                        this.createScriptPanel(dragNode.getPosition(this.content), dragNode.getSize());
                        this.designPage.showTabIm();
                    }
                    this.scriptPageContentDrag = null;
                    if (dragNode) dragNode.destroy();
                    this.designTabScriptAreaNode.show();
                }.bind(this)

            });
        }

        var tabPosition = this.scriptPage.tabNode.getPosition();
	    var dx = e.page.x-tabPosition.x;
        var dy = e.page.y-tabPosition.y;

        this.scriptPage.tabNode.hide();
        this.designTabScriptAreaNode.hide();

        var w = size.x*0.7;
        var h = size.y*0.7;
        var x = position.x+dx;
        var y = position.y+dy-20;

        dragNode.setStyles({
            "width": ""+w+"px",
            "height": ""+h+"px",
            "top": ""+y+"px",
            "left": ""+x+"px"
        });
        this.scriptPageContentDrag.start(e);

    },
    setScriptPageEvent: function(){
        this.scriptPageDrag =  new Drag(this.scriptPage.tabNode, {
            "snap": 20,
            "onStart": function(el,e){
                el.setStyle("position", "static");
            },
            "onDrag": function(el,e){
                if (this.scriptPage.tab.tabNodeContainer.isOutside(e)){
                    this.scriptPageDrag.stop();
                    el.setStyle("left", "auto");
                    this.createScriptPageDragNode(e);
                }
            }.bind(this),
            "onComplete": function(el){
                el.setStyle("left", "auto");
                //el.setStyle("position", "relative");
            }.bind(this)
        });
    },
    clearNoDomModule: function(e){
        var _self = this;
        this.confirm("warn", e.picNode,  MWF.APPPOD.LP.clearNoDomModuleTitle, MWF.APPPOD.LP.clearNoDomModuleContent, 460, 120, function(){
            _self.page._clearNoDomModule();
            this.close();
        }, function(){
            this.close();
        });
    },
    checkLoadAllScript: function(){
        if (this.page || this.form){
            this.loadAllScript();
        }else{
            this.designPage.showTabIm();
        }
    },
    loadAllScript: function(){
        var page = (this.page || this.form);
        if (!page.designTabPageScriptAreaNode) page.designTabPageScriptAreaNode = Element("div", {"styles": this.css.designTabScriptPcAreaNode}).inject(this.designTabScriptAreaNode);
        page.designTabPageScriptAreaNode.show();

        if (!page.scriptDesigner){
            MWF.xDesktop.requireApp("portal.PageDesigner", "Script", function(){
                page.scriptDesigner = new MWF.xApplication.portal.PageDesigner.Script(this, page.designTabPageScriptAreaNode, page.json);
                // var moduleJson = this.pageData.json;
                // if (moduleJson.jsheader){
                //     if (moduleJson.jsheader.code){
                //
                //     }
                // }
            }.bind(this));
        }
    },
    loadAllPcScript: function(){
        if (!this.pcScriptDesigner){
            MWF.xDesktop.requireApp("portal.PageDesigner", "Script", function(){
                this.pcScriptDesigner = new MWF.xApplication.portal.PageDesigner.Script(this, this.designTabScriptPcAreaNode, this.pageData.json);
                // var moduleJson = this.pageData.json;
                // if (moduleJson.jsheader){
                //     if (moduleJson.jsheader.code){
                //
                //     }
                // }
            }.bind(this));
        }
    },
    loadAllMobileScript: function(){
        //this.pageMobileData
    },

    reloadPropertyStyles: function(){
        //MWF.release(this.css);
        this.css = null;
        this.cssPath = "../x_component_"+this.options.name.replace(/\./g, "_")+"/$Main/"+this.options.style+"/css.wcss";
        this._loadCss();

        if (this.options.style=="bottom"){
            this.propertyNode.inject(this.pageNode, "after");
            this.propertyTitleNode.setStyle("cursor", "row-resize");
            this.loadPropertyResizeBottom();

        }else{
            this.propertyNode.inject(this.pageNode, "before");
            this.propertyTitleNode.setStyle("cursor", "default");
            if (this.propertyResizeBottom) this.propertyResizeBottom.detach();
        }

        this.pageNode.clearStyles(false);
        this.pageNode.setStyles(this.css.pageNode);

        this.propertyNode.clearStyles(false);
        this.propertyNode.setStyles(this.css.propertyNode);

        this.propertyTitleNode.clearStyles(false);
        this.propertyTitleNode.setStyles(this.css.propertyTitleNode);

        this.propertyResizeBar.clearStyles(false);
        this.propertyResizeBar.setStyles(this.css.propertyResizeBar);

        this.propertyContentNode.clearStyles(false);
        this.propertyContentNode.setStyles(this.css.propertyContentNode);

        this.propertyDomContentArea.clearStyles(false);
        this.propertyDomContentArea.setStyles(this.css.propertyDomContentArea);

        this.propertyDomScrollArea.clearStyles(false);
        this.propertyDomScrollArea.setStyles(this.css.propertyDomScrollArea);

        this.propertyDomArea.clearStyles(false);
        this.propertyDomArea.setStyles(this.css.propertyDomArea);

        this.propertyContentArea.clearStyles(false);
        this.propertyContentArea.setStyles(this.css.propertyContentArea);

        this.propertyContentResizeNode.clearStyles(false);
        this.propertyContentResizeNode.setStyles(this.css.propertyContentResizeNode);

        this.propertyTitleActionNode.clearStyles(false);
        this.propertyTitleActionNode.setStyles(this.css.propertyTitleActionNode);

        this.resizeNode();
    },
	//loadProperty------------------------
	loadProperty: function(){
        this.propertyTitleActionNode = new Element("div", {
            "styles": this.css.propertyTitleActionNode
        }).inject(this.propertyNode);
        this.propertyTitleActionNode.addEvent("click", function(){
            this.options.style = (this.options.style=="default") ? "bottom" : "default";
            MWF.UD.putData("pageDesignerStyle", {"style": this.options.style});
            this.reloadPropertyStyles();
        }.bind(this));

		this.propertyTitleNode = new Element("div", {
			"styles": this.css.propertyTitleNode,
			"text": MWF.APPPOD.LP.property
		}).inject(this.propertyNode);
        if (this.options.style=="bottom"){
            this.propertyTitleNode.setStyle("cursor", "row-resize");
            this.loadPropertyResizeBottom();
        }

		this.propertyResizeBar = new Element("div", {
			"styles": this.css.propertyResizeBar
		}).inject(this.propertyNode);
		this.loadPropertyResize();

		this.propertyContentNode = new Element("div", {
			"styles": this.css.propertyContentNode
		}).inject(this.propertyNode);

        this.propertyDomContentArea = new Element("div", {
            "styles": this.css.propertyDomContentArea
        }).inject(this.propertyContentNode);

        this.propertyDomTabArea = new Element("div").inject(this.propertyDomContentArea);

        //this.propertyDomScrollArea = new Element("div", {
        //    "styles": this.css.propertyDomScrollArea
        //}).inject(this.propertyDomContentArea);

		//this.propertyDomArea = new Element("div", {
		//	"styles": this.css.propertyDomArea
		//}).inject(this.propertyDomScrollArea);

        this.loadPropertyTab();

		this.propertyDomPercent = 0.4;
		this.propertyContentResizeNode = new Element("div", {
			"styles": this.css.propertyContentResizeNode
		}).inject(this.propertyContentNode);

		this.propertyContentArea = new Element("div", {
			"styles": this.css.propertyContentArea
		}).inject(this.propertyContentNode);


		this.loadPropertyContentResize();
	},
    loadPropertyTab: function (callback) {
        var _self = this;
        MWF.require("MWF.widget.Tab", null, false);

        this.propertyDomTab = new MWF.widget.Tab(this.propertyDomTabArea, {"style": "formPropertyList"});
        this.propertyDomTab.load();

        this.tabDomNode = Element("div");
        this.propertyDomScrollArea = new Element("div", {
            "styles": this.css.propertyDomScrollArea
        }).inject(this.tabDomNode);
        this.propertyDomArea = new Element("div", {
            "styles": this.css.propertyDomArea
        }).inject(this.propertyDomScrollArea);

        this.tabHistoryNode = Element("div");
        this.historyScrollArea = new Element("div", {
            "styles": this.css.propertyDomScrollArea
        }).inject(this.tabHistoryNode);
        this.historyArea = new Element("div", {
            "styles": this.css.propertyDomArea
        }).inject(this.historyScrollArea);
        this.historyAreaMobile = new Element("div", {
            "styles": this.css.propertyDomArea
        }).inject(this.historyScrollArea);
        this.historyAreaMobile.hide();
        this.currentHistoryNode = this.historyArea;

        this.domPage = this.propertyDomTab.addTab(this.tabDomNode, this.lp.componentTree);
        this.historyPage = this.propertyDomTab.addTab(this.tabHistoryNode, this.lp.history);

        this.domPage.showTabIm();

        this.domPage.addEvent("postShow", function () {
            var module = this.page.currentSelectedModule;
            if (module && module.treeNode){
                (new Fx.Scroll(this.propertyDomScrollArea)).toElement(module.treeNode.node);
            }
        }.bind(this));

        // this.runPage.addEvent("postShow", function () {
        //     this.selected();
        // }.bind(this));
    },
    loadPropertyResizeBottom: function(){
        if (!this.propertyResizeBottom){
            this.propertyResizeBottom = new Drag(this.propertyTitleNode,{
                "snap": 1,
                "onStart": function(el, e){
                    var x = (Browser.name=="firefox") ? e.event.clientX : e.event.x;
                    var y = (Browser.name=="firefox") ? e.event.clientY : e.event.y;
                    el.store("position", {"x": x, "y": y});

                    var size = this.propertyNode.getSize();
                    el.store("initialWidth", size.x);
                    el.store("initialHeight", size.y);
                }.bind(this),
                "onDrag": function(el, e){
                    //   var x = e.event.x;
                    var y = (Browser.name=="firefox") ? e.event.clientY : e.event.y;
                    var bodySize = this.content.getSize();
                    var position = el.retrieve("position");
                    var initialHeight = el.retrieve("initialHeight").toFloat();
                    var dy = position.y.toFloat()-y.toFloat();

                    var height = initialHeight+dy;
                    if (height> bodySize.y/1.5) height =  bodySize.y/1.5;
                    if (height<40) height = 40;

                    var percent = 1-(height/bodySize.y);
                    this.resizeNode(percent);

                    //var pageNodeHeight = bodySize.y-height;
                    //this.pageNode.setStyle("height", ""+pageNodeHeight+"px");
                    //this.propertyNode.setStyle("height", ""+height+"px");
                }.bind(this)
            });
        }else{
            this.propertyResizeBottom.attach();
        }
    },
	loadPropertyResize: function(){
//		var size = this.propertyNode.getSize();
//		var position = this.propertyResizeBar.getPosition();
		this.propertyResize = new Drag(this.propertyResizeBar,{
			"snap": 1,
			"onStart": function(el, e){
				var x = (Browser.name=="firefox") ? e.event.clientX : e.event.x;
				var y = (Browser.name=="firefox") ? e.event.clientY : e.event.y;
				el.store("position", {"x": x, "y": y});

				var size = this.propertyNode.getSize();
				el.store("initialWidth", size.x);
			}.bind(this),
			"onDrag": function(el, e){
				var x = (Browser.name=="firefox") ? e.event.clientX : e.event.x;
//				var y = e.event.y;
				var bodySize = this.content.getSize();
				var position = el.retrieve("position");
				var initialWidth = el.retrieve("initialWidth").toFloat();
				var dx = position.x.toFloat()-x.toFloat();

				var width = initialWidth+dx;
				if (width> bodySize.x/2) width =  bodySize.x/2;
				if (width<40) width = 40;
				this.pageNode.setStyle("margin-right", width+1);
				this.propertyNode.setStyle("width", width);
			}.bind(this)
		});
	},
    propertyResizeDragTopBottom: function(el, e){
        var size = this.propertyContentNode.getSize();

        //			var x = e.event.x;
        var y = e.event.y;
        var position = el.retrieve("position");
        var dy = y.toFloat()-position.y.toFloat();

        var initialHeight = el.retrieve("initialHeight").toFloat();
        var height = initialHeight+dy;
        if (height<40) height = 40;
        if (height> size.y-40) height = size.y-40;

        this.propertyDomPercent = height/size.y;

        this.setPropertyContentResize();
    },
    propertyResizeDragLeftRight: function(el, e){
        var size = this.propertyContentNode.getSize();
        var x = (Browser.name=="firefox") ? e.event.clientX : e.event.x;
        //var y = e.event.y;
        var position = el.retrieve("position");
        var dx = x.toFloat()-position.x.toFloat();

        var initialWidth = el.retrieve("initialWidth").toFloat();
        var width = initialWidth+dx;
        if (width<40) width = 40;
        if (width> size.x-40) width = size.x-40;

        this.propertyDomPercent = width/size.x;

        this.setPropertyContentResizeBottom();
    },
	loadPropertyContentResize: function(){
		this.propertyContentResize = new Drag(this.propertyContentResizeNode, {
			"snap": 1,
			"onStart": function(el, e){
				var x = (Browser.name=="firefox") ? e.event.clientX : e.event.x;
				var y = (Browser.name=="firefox") ? e.event.clientY : e.event.y;
				el.store("position", {"x": x, "y": y});

				var size = this.propertyDomContentArea.getSize();
				el.store("initialHeight", size.y);
                el.store("initialWidth", size.x);
			}.bind(this),
			"onDrag": function(el, e){
                if (this.options.style=="bottom"){
                    this.propertyResizeDragLeftRight(el, e);
                }else{
                    this.propertyResizeDragTopBottom(el, e);
                }
			}.bind(this)
		});
	},
    setPropertyContentResizeBottom: function(){
        var size = this.propertyContentNode.getSize();
        var resizeNodeSize = this.propertyContentResizeNode.getSize();
        var width = size.x-resizeNodeSize.x-6;

        var domWidth = this.propertyDomPercent*width;
        var contentMargin = domWidth+resizeNodeSize.x+6;

        this.propertyDomContentArea.setStyle("width", ""+domWidth+"px");
        this.propertyContentArea.setStyle("margin-left", ""+contentMargin+"px");
    },
	setPropertyContentResize: function(){
		var size = this.propertyContentNode.getSize();
		var resizeNodeSize = this.propertyContentResizeNode.getSize();
		var height = size.y-resizeNodeSize.y;

		var domHeight = this.propertyDomPercent*height;
		var contentHeight = height-domHeight;

		this.propertyDomContentArea.setStyle("height", ""+domHeight+"px");
        this.propertyDomScrollArea.setStyle("height", ""+(domHeight-28)+"px");
        this.historyScrollArea.setStyle("height", ""+(domHeight-28)+"px");
		this.propertyContentArea.setStyle("height", ""+contentHeight+"px");

		if (this.page){
			if (this.page.currentSelectedModule){
				if (this.page.currentSelectedModule.property){
					var tab = this.page.currentSelectedModule.property.propertyTab;
					if (tab){
						var tabTitleSize = tab.tabNodeContainer.getSize();

						tab.pages.each(function(page){
							var topMargin = page.contentNodeArea.getStyle("margin-top").toFloat();
							var bottomMargin = page.contentNodeArea.getStyle("margin-bottom").toFloat();

							var tabContentNodeAreaHeight = contentHeight - topMargin - bottomMargin - tabTitleSize.y.toFloat()-15;
							page.contentNodeArea.setStyle("height", tabContentNodeAreaHeight);
						}.bind(this));

					}
				}
			}
		}
	},

	//loadTools------------------------------
    loadTools: function(callback){
        o2.loadCss("../o2_lib/vue/element/index.css");
        this.getToolResource(function(){
            this.toolsGroupData.forEach(function(o){
                //var o = this.toolsGroupData[key];
                this.toolGroups.push(new MWF.xApplication.portal.PageDesigner.ToolsGroup(o, this, o.name === this.currentUserDefaultTool));
            }, this);

            if (callback) callback();
        }.bind(this));
    },
    getToolResource: function(callback){
	    var check = function () {
	        var list = this.toolsGroupData.filter(function(o){
                return o.name === this.currentUserDefaultTool
            }.bind(this));
	        if( list.length < 1 )this.currentUserDefaultTool = "default";
            callback();
        }.bind(this);
	    this.getGroups(function(){
            if(this.toolsGroupData && this.currentUserDefaultTool )check();
        }.bind(this));
        this.getDefaultTool(function(){
            if(this.toolsGroupData && this.currentUserDefaultTool )check();
        }.bind(this));
    },
    getGroups: function(callback){
        if (this.toolsGroupData){
            if (callback) callback();
        }else{
            var toolsGroupDataUrl = this.path+this.options.style+"/toolsGroup.json";
            o2.JSON.get(toolsGroupDataUrl, function(responseJSON){
                this.toolsGroupData = responseJSON;
                if (callback) callback();
            }.bind(this));
        }
    },
    getDefaultTool: function(callback){
	    if( typeOf(this.currentUserDefaultTool) === "string" ){
            if (callback) callback();
        }else{
            o2.UD.getDataJson("portalTools", function (json) {
                this.currentUserDefaultTool = (json && json.defaultTool) || "default";
                if (callback) callback();
            }.bind(this));
        }
    },
    setDefaultTool: function(defaultTools, callback){
        o2.UD.getDataJson("portalTools", function (json) {
            if(!json)json = {};
            json.defaultTool = defaultTools;
            o2.UD.putData("portalTools", json, function () {
                if (callback) callback();
            }.bind(this));
        }.bind(this));
    },

// 	loadTools: function(){
// 		var designer = this;
// 		this.getTools(function(){
// 			Object.each(this.toolsData, function(value, key){
// 				var toolNode = new Element("div", {
// 					"styles": this.css.toolbarToolNode,
// 					"title": value.text,
// 					"events": {
// 						"mouseover": function(e){
// 							try {
// 								this.setStyles(designer.css.toolbarToolNodeOver);
// 							}catch(e){
// 								this.setStyles(designer.css.toolbarToolNodeOverCSS2);
// 							};
// 						},
// 						"mouseout": function(e){
// 							try {
// 								this.setStyles(designer.css.toolbarToolNode);
// 							}catch(e){};
// 						},
// 						"mousedown": function(e){
// 							try {
// 								this.setStyles(designer.css.toolbarToolNodeDown);
// 							}catch(e){
// 								this.setStyles(designer.css.toolbarToolNodeDownCSS2);
// 							};
// 						},
// 						"mouseup": function(e){
// 							try {
// 								this.setStyles(designer.css.toolbarToolNodeUp);
// 							}catch(e){
// 								this.setStyles(designer.css.toolbarToolNodeUpCSS2);
// 							};
// 						}
// 					}
// 				}).inject(this.toolbarContentNode);
// 				toolNode.store("toolClass", value.className);
//
// 				var iconNode = new Element("div", {
// 					"styles": this.css.toolbarToolIconNode
// 				}).inject(toolNode);
// 				iconNode.setStyle("background-image", "url("+this.path+this.options.style+"/icon/"+value.icon+")");
//
// 				var textNode = new Element("div", {
// 					"styles": this.css.toolbarToolTextNode,
// 					"text": value.text
// 				});
// 				textNode.inject(toolNode);
//
// //				var designer = this;
// 				toolNode.addEvent("mousedown", function(e){
//
// 					var className = this.retrieve("toolClass");
// 					designer.page.createModule(className, e);
// 				});
//
// 				this.tools.push(toolNode);
// 			}.bind(this));
// 		}.bind(this));
// 	},
// 	getTools: function(callback){
//
// 		if (this.toolsData){
// 			if (callback) callback();
// 		}else{
// 			var toolsDataUrl = this.path+this.options.style+"/tools.json";
// 			var r = new Request.JSON({
// 				url: toolsDataUrl,
// 				secure: false,
// 				async: false,
// 				method: "get",
// 				noCache: true,
// 				onSuccess: function(responseJSON, responseText){
// 					this.toolsData = responseJSON;
// 					if (callback) callback();
// 				}.bind(this),
// 				onError: function(text, error){
// 				    debugger;
// 					this.notice("request tools data error: "+error, "error");
// 				}.bind(this)
// 			});
// 			r.send();
// 		}
// 	},

	//resizeNode------------------------------------------------
    resizeNodeLeftRight: function(){
        var nodeSize = this.node.getSize();
        this.toolbarNode.setStyle("height", ""+nodeSize.y+"px");
        this.pageNode.setStyle("height", ""+nodeSize.y+"px");
        this.propertyNode.setStyle("height", ""+nodeSize.y+"px");
        //nodeSize = {"x": nodeSize.x, "y": nodeSize.y*0.6};

        var pageToolbarMarginTop = this.pageToolbarNode.getStyle("margin-top").toFloat();
        var pageToolbarMarginBottom = this.pageToolbarNode.getStyle("margin-bottom").toFloat();
        var allPageToolberSize = this.pageToolbarNode.getComputedSize();
        var y = nodeSize.y - allPageToolberSize.totalHeight - pageToolbarMarginTop - pageToolbarMarginBottom;
        this.pageContentNode.setStyle("height", ""+y+"px");

        var tabSize = this.designTab.tabNodeContainer.getComputedSize();
        var tabMarginTop = this.designTab.tabNodeContainer.getStyle("margin-top").toFloat();
        var tabMarginBottom = this.designTab.tabNodeContainer.getStyle("margin-bottom").toFloat();
        y = y-tabSize.totalHeight-tabMarginTop-tabMarginBottom;
        this.designTab.contentNodeContainer.setStyle("height", ""+y+"px");

        if (this.designNode){
            var designMarginTop = this.designNode.getStyle("margin-top").toFloat();
            var designMarginBottom = this.designNode.getStyle("margin-bottom").toFloat();
            y = y - designMarginTop - designMarginBottom;
            this.designNode.setStyle("height", ""+y+"px");
        }


        var titleSize = this.toolbarTitleNode.getSize();
        var titleMarginTop = this.toolbarTitleNode.getStyle("margin-top").toFloat();
        var titleMarginBottom = this.toolbarTitleNode.getStyle("margin-bottom").toFloat();
        var titlePaddingTop = this.toolbarTitleNode.getStyle("padding-top").toFloat();
        var titlePaddingBottom = this.toolbarTitleNode.getStyle("padding-bottom").toFloat();

        y = titleSize.y+titleMarginTop+titleMarginBottom+titlePaddingTop+titlePaddingBottom;
        y = nodeSize.y-y;

        this.toolbarGroupContentNode.setStyle("height", ""+y+"px");
        var groupHeight = 0;
        var contentHeight = y-groupHeight-5;
        this.toolGroups.each(function(g){
            g.setContentHeight(contentHeight);
        });

        //this.toolbarContentNode.setStyle("height", ""+y+"px");


        titleSize = this.propertyTitleNode.getSize();
        titleMarginTop = this.propertyTitleNode.getStyle("margin-top").toFloat();
        titleMarginBottom = this.propertyTitleNode.getStyle("margin-bottom").toFloat();
        titlePaddingTop = this.propertyTitleNode.getStyle("padding-top").toFloat();
        titlePaddingBottom = this.propertyTitleNode.getStyle("padding-bottom").toFloat();

        y = titleSize.y+titleMarginTop+titleMarginBottom+titlePaddingTop+titlePaddingBottom;
        y = nodeSize.y-y;
        this.propertyContentNode.setStyle("height", ""+y+"px");
        this.propertyResizeBar.setStyle("height", ""+y+"px");
    },
    resizeNodeTopBottom: function(percent){
        var nodeSize = this.node.getSize();
        this.toolbarNode.setStyle("height", ""+nodeSize.y+"px");

        var percentNumber = percent || 0.6;
        var designerHeight = nodeSize.y*percentNumber;
        var propertyHeight = nodeSize.y - designerHeight;

        this.pageNode.setStyle("height", ""+designerHeight+"px");
        this.propertyNode.setStyle("height", ""+propertyHeight+"px");

        var pageToolbarMarginTop = this.pageToolbarNode.getStyle("margin-top").toFloat();
        var pageToolbarMarginBottom = this.pageToolbarNode.getStyle("margin-bottom").toFloat();
        var allPageToolberSize = this.pageToolbarNode.getComputedSize();
        var y = designerHeight - allPageToolberSize.totalHeight - pageToolbarMarginTop - pageToolbarMarginBottom;
    //    this.pageContentNode.setStyle("height", ""+designerHeight+"px");

        var tabSize = this.designTab.tabNodeContainer.getComputedSize();
        var tabMarginTop = this.designTab.tabNodeContainer.getStyle("margin-top").toFloat();
        var tabMarginBottom = this.designTab.tabNodeContainer.getStyle("margin-bottom").toFloat();
        y = y-tabSize.totalHeight-tabMarginTop-tabMarginBottom;
        this.designTab.contentNodeContainer.setStyle("height", ""+y+"px");

        if (this.designNode){
            var designMarginTop = this.designNode.getStyle("margin-top").toFloat();
            var designMarginBottom = this.designNode.getStyle("margin-bottom").toFloat();
            y = y - designMarginTop - designMarginBottom;
            this.designNode.setStyle("height", ""+y+"px");
        }

        var titleSize = this.toolbarTitleNode.getSize();
        var titleMarginTop = this.toolbarTitleNode.getStyle("margin-top").toFloat();
        var titleMarginBottom = this.toolbarTitleNode.getStyle("margin-bottom").toFloat();
        var titlePaddingTop = this.toolbarTitleNode.getStyle("padding-top").toFloat();
        var titlePaddingBottom = this.toolbarTitleNode.getStyle("padding-bottom").toFloat();

        y = titleSize.y+titleMarginTop+titleMarginBottom+titlePaddingTop+titlePaddingBottom;
        y = nodeSize.y-y;

        this.toolbarGroupContentNode.setStyle("height", ""+y+"px");
        var groupHeight = 0;
        // this.toolGroups.each(function(g){
        //     groupHeight += g.toolbarGroupTitleNode.getSize().y;
        // });
        var contentHeight = y-groupHeight-5;
        this.toolGroups.each(function(g){
            g.setContentHeight(contentHeight);
        });

        //this.toolbarContentNode.setStyle("height", ""+y+"px");

        titleSize = this.propertyTitleNode.getSize();
        titleMarginTop = this.propertyTitleNode.getStyle("margin-top").toFloat();
        titleMarginBottom = this.propertyTitleNode.getStyle("margin-bottom").toFloat();
        titlePaddingTop = this.propertyTitleNode.getStyle("padding-top").toFloat();
        titlePaddingBottom = this.propertyTitleNode.getStyle("padding-bottom").toFloat();

        y = titleSize.y+titleMarginTop+titleMarginBottom+titlePaddingTop+titlePaddingBottom;
        y = propertyHeight-y;
        this.propertyContentNode.setStyle("height", ""+y+"px");
        this.propertyResizeBar.setStyle("height", ""+y+"px");

        this.propertyDomContentArea.setStyle("height", ""+y+"px");
        this.propertyDomScrollArea.setStyle("height", ""+(y-28)+"px");
        this.historyScrollArea.setStyle("height", ""+(y-28)+"px");

        this.propertyContentResizeNode.setStyle("height", ""+y+"px");
        this.propertyContentArea.setStyle("height", ""+y+"px");

        if (this.page){
            if (this.page.currentSelectedModule){
                if (this.page.currentSelectedModule.property){
                    var tab = this.page.currentSelectedModule.property.propertyTab;
                    if (tab){
                        var tabTitleSize = tab.tabNodeContainer.getSize();

                        tab.pages.each(function(page){
                            var topMargin = page.contentNodeArea.getStyle("margin-top").toFloat();
                            var bottomMargin = page.contentNodeArea.getStyle("margin-bottom").toFloat();

                            var tabContentNodeAreaHeight = y - topMargin - bottomMargin - tabTitleSize.y.toFloat()-15;
                            page.contentNodeArea.setStyle("height", tabContentNodeAreaHeight);
                        }.bind(this));

                    }
                }
            }
        }
    },

	resizeNode: function(percent){
		if (this.options.style=="bottom"){
            this.resizeNodeTopBottom(percent);
            this.setPropertyContentResizeBottom();
        }else{
            this.resizeNodeLeftRight(percent);
            this.setPropertyContentResize();
        }
	},

	//loadPage------------------------------------------
	loadPage: function(){
		this.getPageData(function(){
			this.pcPage = new MWF.PCPage(this, this.designNode, {
			    "onPostLoad": function(){
                    this.fireEvent("postPageLoad");
                }.bind(this)
            });
			this.pcPage.load(this.pageData);

            this.page = this.pcPage;
		}.bind(this));
	},
	getPageData: function(callback){
		if (!this.options.id){
            if (this.options.templateId){
                this.loadNewPageDataFromTemplate(callback);
            }else{
                this.loadNewPageData(callback);
            }
		}else{
			this.loadPageData(callback);
		}
	},
	loadNewPageData: function(callback){
        var url = "../x_component_portal_PageDesigner/Module/Page/template/"+this.options.template;
        MWF.getJSON(url, {
			"onSuccess": function(obj){
				this.pageData = obj.pcData;
                this.pageData.id="";
                this.pageData.isNewPage = true;

                this.pageMobileData = obj.mobileData;
                this.pageMobileData.id="";
                this.pageMobileData.isNewPage = true;
				if (callback) callback();
			}.bind(this),
			"onerror": function(text){
				this.notice(text, "error");
			}.bind(this),
			"onRequestFailure": function(xhr){
				this.notice(xhr.responseText, "error");
			}.bind(this)
		});
	},
    getPageTemplate : function(templateId, callback){
        this.actions.getPageTemplate(templateId, function(page){
            if(callback)callback(page);
        }.bind(this))
    },
    loadNewPageDataFromTemplate: function(callback){
        this.getPageTemplate(this.options.templateId, function(page){
            if (page){
                this.pageData = JSON.decode(MWF.decodeJsonString(page.data.data));
                this.pageData.isNewPage = true;
                this.pageData.json.id = "";

                if (page.data.mobileData){
                    this.pageMobileData = JSON.decode(MWF.decodeJsonString(page.data.mobileData));
                    this.pageMobileData.isNewPage = true;
                    this.pageMobileData.json.id = "";
                }else{
                    this.pageMobileData = Object.clone(this.pageData);
                }
                if (callback) callback();
            }
        }.bind(this));
    },
    getPage : function(id, callback){
        this.actions.getPage(id, function(page){
            if(callback)callback(page);
        }.bind(this))
    },
    getApplication : function(portal, callback){
        this.actions.getApplication(portal, function(page){
            if(callback)callback(page);
        }.bind(this))
    },
	loadPageData: function(callback){
		this.getPage(this.options.id, function(page){
			if (page){

				this.pageData = JSON.decode(MWF.decodeJsonString(page.data.data));
				this.pageData.isNewPage = false;
				this.pageData.json.id = page.data.id;

                if (page.data.mobileData){
                    this.pageMobileData = JSON.decode(MWF.decodeJsonString(page.data.mobileData));
                    this.pageMobileData.isNewPage = false;
                    this.pageMobileData.json.id = page.data.id;
                }else{
                    this.pageMobileData = Object.clone(this.pageData);
                }


				this.setTitle(this.options.appTitle + "-"+this.pageData.json.name);
				if (this.taskitem) this.taskitem.setText(this.options.appTitle + "-"+this.pageData.json.name);
				this.options.appTitle = this.options.appTitle + "-"+this.pageData.json.name;

                if (!this.application){
                    this.getApplication(page.data.portal, function(json){
                        this.application = {"name": json.data.name, "id": json.data.id};
                        if (callback) callback();
                    }.bind(this));
                }else{
                    if (callback) callback();
                }
			}
		}.bind(this));
	},
    getFieldList: function(){
        dataTypes = {
            "string": ["htmledit", "radio", "select", "textarea", "textfield"],
            "person": ["personfield","org"],
            "date": ["calender"],
            "number": ["number"],
            "array": ["checkbox"]
        };
        fieldList = [];
        this.pcPage.moduleList.each(function(moudle){
            var key = "";
            for (k in dataTypes){
                if (dataTypes[k].indexOf(moudle.moduleName.toLowerCase())!=-1){
                    key = k;
                    break;
                }
            }
            if (key){
                fieldList.push({
                    "name": moudle.json.id,
                    "dataType": key
                });
            }
        }.bind(this));
        return fieldList;
    },
    getWidgetList: function(data){
        widgetList = [];

        Object.each(data.moduleList, function(moudle){
            if (moudle.type.toLowerCase()=="widget"){
                if (moudle.widgetType == "select" && moudle.widgetSelected ){
                    widgetList.push(moudle.widgetSelected);
                }
            }
        }.bind(this));
        return widgetList;
    },
    saveForm: function(){
        this.savePage()
    },
    _savePage : function(pcData, mobileData, fieldList, success, failure ){
        this.actions.savePage(pcData, mobileData, fieldList, function(responseJSON){
            success(responseJSON)
        }.bind(this), function(xhr, text, error){
            failure(xhr, text, error)
        }.bind(this));
    },
	savePage: function(){
        if (!this.isSave){
            var pcData, mobileData;
            if (this.pcPage){
                this.pcPage._getPageData();
                this.pcPage.json.widgetList = this.getWidgetList(this.pcPage.json);
                pcData = this.pcPage.data;
            }
            if (this.mobilePage){
                this.mobilePage._getPageData();
                this.mobilePage.json.widgetList = this.getWidgetList(this.mobilePage.json);
                mobileData = this.mobilePage.data;
            }else{
                if (this.pageMobileData) mobileData = this.pageMobileData;
            }

            this.isSave = true;
            var fieldList = this.getFieldList();

            this._savePage(pcData, mobileData, fieldList, function(responseJSON){
                this.notice(MWF.APPPOD.LP.notice["save_success"], "ok", null, {x: "left", y:"bottom"});
                if (!this.pcPage.json.name) this.pcPage.treeNode.setText("<"+this.json.type+"> "+this.json.id);
                this.pcPage.treeNode.setTitle(this.pcPage.json.id);
                this.pcPage.node.set("id", this.pcPage.json.id);

                if (this.mobilePage){
                    if (!this.mobilePage.json.name) this.mobilePage.treeNode.setText("<"+this.mobilePage.json.type+"> "+this.mobilePage.json.id);
                    this.mobilePage.treeNode.setTitle(this.mobilePage.json.id);
                    this.mobilePage.node.set("id", this.mobilePage.json.id+"_"+this.options.mode);
                }

                var name = this.pcPage.json.name;
                if (this.pcPage.data.isNewPage) this.setTitle(this.options.appTitle + "-"+name);
                this.pcPage.data.isNewPage = false;
                if (this.mobilePage) this.mobilePage.data.isNewPage = false;

                this.options.desktopReload = true;
                this.options.id = this.pcPage.json.id;

                if (pcData) pcData.isNewPage = false;
                if (mobileData) mobileData.isNewPage = false;
                this.isSave = false;

            }.bind(this), function(xhr, text, error){
                this.isSave = false;

                var errorText = error+":"+text;
                if (xhr) errorText = xhr.responseText;
                MWF.xDesktop.notice("error", {x: "right", y:"top"}, "request json error: "+errorText);
            }.bind(this));
        }else{
            MWF.xDesktop.notice("info", {x: "right", y:"top"}, this.lp.isSave);
        }
	},
	previewPage: function(){
        this.savePage();
		this.page.preview();
	},
    printPage: function(){
        this.previewPage();
    },
    pageExplode: function(){
        this.page.explode();
    },
    pageImplode: function(){
        this.page.implode();
    },
    htmlImplode: function(){
        this.page.implodeHTML();
    },
    officeImplode: function(){
        this.page.implodeOffice();
    },

    pageHelp: function(){
        //widnow.open("http://www.o2oa.io");
    },
	recordStatus: function(){
		return {"id": this.options.id};
	},
    showFormVersion: function(){
        this.page.showFormVersion();
    },
    onPostClose: function(){
        if (this.pcPage){
            MWF.release(this.pcPage.moduleList);
            MWF.release(this.pcPage.moduleNodeList);
            MWF.release(this.pcPage.moduleContainerNodeList);
            MWF.release(this.pcPage.moduleElementNodeList);
            MWF.release(this.pcPage.moduleComponentNodeList);
            MWF.release(this.pcPage);
        }
        if (this.mobilePage){
            MWF.release(this.mobilePage.moduleList);
            MWF.release(this.mobilePage.moduleNodeList);
            MWF.release(this.mobilePage.moduleContainerNodeList);
            MWF.release(this.mobilePage.moduleElementNodeList);
            MWF.release(this.mobilePage.moduleComponentNodeList);
            MWF.release(this.mobilePage);
        }
    },
    setTemplatePageNode: function(pageNode){
        var html = "<table align=\"center\" width=\"100%\" height=\"90%\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\">" +
            "<tr><td colSpan=\"2\" style=\"height: 50px; line-height: 60px; text-align: center; font-size: 24px; font-weight: bold\">" +
            this.lp.saveTemplate+"</td></tr>" +

            "<tr><td style=\"height: 40px;\" width=\"80px\">" +this.lp.templateName+"</td><td>"+
            "<input value=\""+this.pcPage.json.name+"\" type=\"text\" style=\"width: 98%; height: 22px; border: 1px solid #cccccc\"/>"+"</td></tr>" +

            "<tr><td style=\"height: 40px;\">" +this.lp.templateCategory+"</td><td>"+
            "<select style=\"width: 30%; height: 24px; border: 1px solid #cccccc\"></select>"+
            "<input type=\"text\" style=\"width: 68%; height: 22px; border: 1px solid #cccccc\"/>"+"</td></tr>" +

            "<tr><td style=\"height: 40px;\">" +this.lp.templateDescription+"</td><td>"+
            "<textarea type=\"text\" style=\"width: 98%; height: 44px; border: 1px solid #cccccc\">"+this.pcPage.json.description+"</textarea>"+"</td></tr>" +

            "<tr><td colSpan=\"2\" id=\"page_templatePreview\">" +
            "<div style=\"position: relative; width: 180px; height: 180px; margin: 20px auto 0px auto;  overflow: hidden\"></div>" +
            "</td></tr>" +
            "</table>";

        pageNode.set("html", html);
        var tds = pageNode.getElements("td");
        var iconNode = tds[tds.length-1].getFirst();
        var previewNode = this.pcPage.node.clone();
        previewNode.setStyles({
            "transform-origin": "0px 0px",
            "transform": "scale(0.15,0.15)",
            "position": "absolute",
            "top": "0px",
            "left": "0px"
        }).inject(iconNode);
        return iconNode;
    },
    setCategorySelect: function(categorySelect){
        if (categorySelect){
            new Element("option", {"value": "$newCategory","text": this.lp.newCategory}).inject(categorySelect);
            this.actions.listPageTemplateCategory(function(json){
                json.data.each(function(category){
                    new Element("option", {"value": category.name,"text": category.name}).inject(categorySelect);
                }.bind(this));
            }.bind(this));
        }
    },
    setTemplateActions: function(markNode, areaNode, pageNode, iconNode, nameNode, categorySelect, newCategoryNode, descriptionNode){
        var actionAreaNode= new Element("div", {
            "styles": this.css.templateActionNode
        }).inject(pageNode);

        var cancelActionNode = new Element("div", {
            "styles": this.css.templateCancelActionNode,
            "text": this.lp.cancel,
            "events":{
                "click": function(){
                    markNode.destroy();
                    areaNode.destroy();
                }
            }
        }).inject(actionAreaNode);
        var saveActionNode = new Element("div", {
            "styles": this.css.templateSaveActionNode,
            "text": this.lp.save,
            "events":{
                "click": function(){
                    this.saveTemplate(markNode, areaNode, iconNode, nameNode, categorySelect, newCategoryNode, descriptionNode);
                }.bind(this)
            }
        }).inject(actionAreaNode);
    },
    addPageTemplate : function(pcData, mobileData, data, success, failure){
        this.actions.addPageTemplate( pcData, mobileData, data, function(json){
            if(success)success(json);
        }.bind(this), function(xhr, text, error){
            if(failure)failure(xhr, text, error);
        }.bind(this))
    },
    saveTemplate: function(markNode, areaNode, iconNode, nameNode, categorySelect, newCategoryNode, descriptionNode){
        var pcData, mobileData;
        if (this.pcPage){
            this.pcPage._getPageData();
            pcData = this.pcPage.data;
        }
        if (this.mobilePage){
            this.mobilePage._getPageData();
            mobileData = this.mobilePage.data;
        }

        var name = nameNode.get("value");
        var category = (categorySelect.options[categorySelect.selectedIndex].value=="$newCategory") ? newCategoryNode.get("value") : categorySelect.options[categorySelect.selectedIndex].value;
        var description = descriptionNode.get("value");
        if (!name){
            this.notice(MWF.APPPOD.LP.notice["saveTemplate_inputName"], "error", nameNode, {x: "left", y:"top"});
            return false;
        }
        if (categorySelect.options[categorySelect.selectedIndex].value=="$newCategory" && !newCategoryNode.get("value")){
            this.notice(MWF.APPPOD.LP.notice["saveTemplate_inputCategory"], "error", categorySelect, {x: "left", y:"top"});
            return false;
        }

        var data = {
            "name": name,
            "category": category,
            "description": description,
            "outline": iconNode.get("html")
        };
        this.addPageTemplate(pcData, mobileData, data, function(){
            this.notice(MWF.APPPOD.LP.notice["saveTemplate_success"], "ok", null, {x: "left", y:"bottom"});
            markNode.destroy();
            areaNode.destroy();
        }.bind(this), function(xhr, text, error){
            var errorText = error+":"+text;
            if (xhr) errorText = xhr.responseText;
            MWF.xDesktop.notice("error", {x: "right", y:"top"}, "request json error: "+errorText);
        });
    },
    createTemplateSaveNode: function(){
        var markNode = new Element("div", {
            "styles": this.css.templateMarkNode,
            "events": {
                "mouseover": function(e){e.stopPropagation();},
                "mouseout": function(e){e.stopPropagation();}
            }
        }).inject(this.content);

        var areaNode = new Element("div", {
            "styles": this.css.templateAreaNode
        }).inject(this.content);

        var createNode = new Element("div", {
            "styles": this.css.templateInfoNode
        }).inject(areaNode);

        var pageNode = new Element("div", {
            "styles": this.css.templatePageNode
        }).inject(createNode);

        var iconNode = this.setTemplatePageNode(pageNode);

        var nodes = pageNode.getElements("input");
        var nameNode = nodes[0];
        var newCategoryNode = nodes[1];
        var descriptionNode = pageNode.getElement("textarea");
        var categorySelect = pageNode.getElement("select");

        this.setCategorySelect(categorySelect);

        this.setTemplateActions(markNode, areaNode, pageNode, iconNode, nameNode, categorySelect, newCategoryNode, descriptionNode);
    },
    savePageAsTemplate: function(){
        if (!this.isSave){
            this.createTemplateSaveNode();
        }else{
            MWF.xDesktop.notice("info", {x: "right", y:"top"}, this.lp.isSave);
        }
    },
    styleBrush: function(status, bt){
        if (status==="on"){
            var module = this.page.currentSelectedModule;
            if (module && module.json.type!=="Form"){
                this.page.brushStyle = module.json.styles;
                this.brushCursor = new Element("div", {"styles": {
                    "position": "absolute",
                    "width": "16px",
                    "height": "16px",
                    "z-index": 20000,
                    "background": "url("+this.path+this.options.style+"/pageToolbar/wand.png)"
                }}).inject(this.content);
                this.brushCursorMoveFun = this.brushCursorMove.bind(this);
                this.contentPosition = this.content.getPosition();
                this.content.addEvent("mousemove", this.brushCursorMoveFun);


                //this.designNode.setStyle("cursor", "url(/"+this.path+this.options.style+"/pageToolbar/brush.png)");
            }else{
                bt.off();
            }
        }else{
            this.page.brushStyle = null;
            if (this.brushCursorMoveFun) this.content.removeEvent("mousemove", this.brushCursorMoveFun);
            if (this.brushCursor){
                this.brushCursor.destroy();
                this.brushCursor = null;
            }
        }
    },
    brushCursorMove: function(e){
        if (this.brushCursor){
            // var x = e.event.layerX+10;
            // var y = e.event.layerY+10;
            var x = e.page.x-this.contentPosition.x+10;
            var y = e.page.y-this.contentPosition.y+10;
            this.brushCursor.setStyles({
                "left": ""+x+"px",
                "top": ""+y+"px"
            });
        }
    },
    checkDatatemplateRelativeId: function( json, idMap ){
        ["outerAddActionId","outerDeleteActionId","outerSelectAllId",
            "addActionId","deleteActionId","sequenceId","selectorId"].each(function(key){
            var str = json[key];
            if(str){
                var strArr;
                if( str.indexOf("/") > -1 ) {
                    strArr = str.split("/");
                }else if(str.indexOf(".*.") > -1){
                    strArr = str.split(".*.");
                }
                if(strArr){
                    strArr = strArr.map(function (s) {
                        return idMap[s] || s;
                    });
                    json[key] = strArr.join("/");
                }else{
                    if( str && idMap[str] ){
                        json[key] = idMap[str];
                    }
                }
            }

        }.bind(this));
    },
    openApp: function (){
        layout.openApplication(null, 'portal.PortalManager', {
            application: this.application,
            appId: 'portal.PortalManager'+this.application.id
        }, {
            "navi": 0
        });
    },
    copyPropertyToModule: function (){
        if( !this.page.currentSelectedModule ){
            this.notice( MWF.APPPOD.LP.selectCopyModuleNotice, 'info');
            return;
        }
        var module = this.page.currentSelectedModule;
        var modulesTypes = [
            ['Org', 'OOOrg','Author','Reader'],
            ['Checkbox', 'OOCheckGroup', 'Radio', 'OORadioGroup', 'Select', 'OOSelect'],
            ['Calendar', 'OODatetime'],
            ['Textfield', 'Textarea', 'OOInput', 'OOTextarea'],
            ['Button', 'OOButton']
        ].filter(function (types){
            return types.contains( module.json.type );
        });
        modulesTypes = modulesTypes.length ? modulesTypes[0] : [module.json.type];

        this.selector = new MWF.O2Selector(this.content, {
            count: 1,
            title: MWF.APPPOD.LP.selectCopyModule,
            type: 'FieldProperty',
            moduleTypes: modulesTypes,
            currentFormFields: Object.values(this.page.json.moduleList),
            onComplete: function (items){
                if( !items.length )return;
                for( var key in items[0].data ){
                    var value = items[0].data[key];
                    if( !['id', 'type', 'pid'].contains(key) && module.json[key] !== value ){
                        module.json[key] = value;
                        module.setPropertiesOrStyles(key, value);
                        module._setEditStyle(key, null, value);
                        // this.setScriptJsEditor(module, change.name, change.fromValue);
                    }
                }
                if( module.property ){
                    module.property.reset();
                }
            }.bind(this)
        });
    },
});

MWF.xApplication.portal.PageDesigner.ToolsGroup = new Class({
    Implements: [Events],

    initialize: function(data, app, showing){
        this.data = data;
        this.app = app;
        this.css = this.app.css;
        this.tools = [];
        this.showing = showing;
        this.load();
    },
    load: function(){
        this.toolbarGroupNode = new Element("div", {
            "styles": this.css.toolbarGroupNode,
        }).inject(this.app.toolbarGroupContentNode);

        this.toolbarContentNode = new Element("div", {
            "styles": this.css.toolbarContentNode,
        }).inject(this.toolbarGroupNode);

        this.loadTools();

        if (this.toolbarContentNode){
            this.app.setScrollBar(this.toolbarContentNode, null, {
                "V": {"x": 0, "y": 0},
                "H": {"x": 0, "y": 0}
            }, function(scrollBar){
                this.scrollBar = scrollBar;
            }.bind(this));
        }

        this.toolbarContentNode.setStyle("height", "0px");
        this.toolbarContentNode.hide();

        var memuItem = this.app.categoryActionMenu.addMenuItem(this.data.text, "click", function(){this.show();}.bind(this));
    },
    setContentHeight: function(height){
        this.height = height;
        if (this.isShow){
            this.toolbarContentNode.setStyle("height", ""+this.height+"px");
        }
    },
    show: function(notSetDefault){
        if (this.app.currentToolGroup != this){
            if (this.app.currentToolGroup) this.app.currentToolGroup.hide();
            this.toolbarContentNode.show();
            this.toolbarContentNode.setStyle("height", this.height);
            if (this.scrollBar && this.scrollBar.scrollVAreaNode) this.scrollBar.scrollVAreaNode.show();
            this.app.currentToolGroup = this;
            this.isShow = true;

            if (this.app.toolbarMode=="all") this.app.toolbarTitleNode.set("text", this.data.text);
            if(!notSetDefault)this.app.setDefaultTool( this.data.name );
        }
    },
    hide: function(){
        if (this.app.currentToolGroup==this) this.app.currentToolGroup = null;
        this.toolbarContentNode.hide();
        if (this.scrollBar && this.scrollBar.scrollVAreaNode) this.scrollBar.scrollVAreaNode.hide();
        this.isShow = false;
    },

    loadTools: function(){
        var designer = this.app;
        var group = this;
        this.getTools(function(){
            Object.each(this.toolsData, function(value, key){
                var toolNode = new Element("div", {
                    "styles": this.css.toolbarToolNode,
                    "title": value.text,
                    "events": {
                        "mouseover": function(e){
                            try {
                                this.setStyles(designer.css.toolbarToolNodeOver);
                            }catch(e){
                                this.setStyles(designer.css.toolbarToolNodeOverCSS2);
                            };
                        },
                        "mouseout": function(e){
                            try {
                                this.setStyles(designer.css.toolbarToolNode);
                            }catch(e){};
                        },
                        "mousedown": function(e){
                            try {
                                this.setStyles(designer.css.toolbarToolNodeDown);
                            }catch(e){
                                this.setStyles(designer.css.toolbarToolNodeDownCSS2);
                            };
                        },
                        "mouseup": function(e){
                            try {
                                this.setStyles(designer.css.toolbarToolNodeUp);
                            }catch(e){
                                this.setStyles(designer.css.toolbarToolNodeUpCSS2);
                            };
                        }
                    }
                }).inject(this.toolbarContentNode);
                toolNode.store("toolClass", value.className);

                var iconNode = new Element("div", {
                    "styles": this.css.toolbarToolIconNode
                }).inject(toolNode);
                if (value.icon) iconNode.setStyle("background-image", "url("+this.app.path+this.app.options.style+"/icon/"+value.icon+")");
                if (value.fontIcon){
                    iconNode.addClass("mainColor_color");
                    iconNode.set("html", "<i class=\""+value.fontIcon+"\"></i>");
                }

                var textNode = new Element("div.o2formModuleTools", {
                    "styles": this.css.toolbarToolTextNode,
                    "text": value.text
                });
                textNode.inject(toolNode);

                toolNode.addEvent("mousedown", function(e){
                    var className = this.retrieve("toolClass");
                    designer.page.createModule(className, e, group.data.name);
                });

                this.tools.push(toolNode);
            }.bind(this));

            //if (this.data.name==="default") this.show();
            if( this.showing )this.show( true );
        }.bind(this));
    },

    getTools: function(callback){
        if (this.toolsData){
            if (callback) callback();
        }else{
            var toolsDataUrl = this.app.path+this.app.options.style+"/"+this.data.json;
            o2.JSON.get(toolsDataUrl, function(responseJSON){
                this.toolsData = responseJSON;

                if (!this.app.toolsData){
                    this.app.toolsData = this.toolsData;
                }else{
                    this.app.toolsData = Object.merge(this.app.toolsData, this.toolsData)
                }

                if (callback) callback();
            }.bind(this));
        }
    },
});
