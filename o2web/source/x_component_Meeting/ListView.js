MWF.require("o2.widget.Paging", null, false);
MWF.xApplication.Meeting.ListView = new Class({
    Extends: MWF.widget.Common,
    Implements: [Options, Events],

    options: {
        "style": "default",
        "date": null,
        "action" : ""
    },
    initialize: function(node, app, options){
        this.setOptions(options);

        this.path = "../x_component_Meeting/$ListView/";
        this.cssPath = "../x_component_Meeting/$ListView/"+this.options.style+"/css.wcss";
        this._loadCss();
        this.app = app;
        this.container = $(node);
        this.date = this.options.date || new Date();
        this.load();
    },
    load: function(){
        this.node = new Element("div", {"styles": this.css.node}).inject(this.container);
        this.leftNode = new Element("div", {"styles": this.css.leftNode}).inject(this.node);
        this.contentAreaNode  = new Element("div.contentAreaNode", {"styles": this.css.contentAreaNode}).inject(this.node);
        this.contentNode  = new Element("div.contentNode", {"styles": this.css.contentNode}).inject(this.contentAreaNode);

        //this.loadSideBar();

        this.resetNodeSizeFun = this.resetNodeSize.bind(this);
        this.app.addEvent("resize", this.resetNodeSizeFun );

        this.loadLeftNavi();

        this.resetNodeSize();

    },
    resetNodeSize: function(){
        //var size = this.container.getSize();
        //if (this.app.meetingConfig.hideMenu=="static"){
        //    var y = size.y-120;
        //    this.node.setStyle("height", ""+y+"px");
        //    this.node.setStyle("margin-top", "60px");
        //}else{
        //    var y = size.y-20;
        //    this.node.setStyle("height", ""+y+"px");
        //}

        //if( this.app.inContainer )return;
        var size = this.container.getSize();
        var y = size.y-60;
        this.node.setStyle("margin-top", "60px");
        this.node.setStyle("height", ""+y+"px");

        var sideBar = this.app.sideBar ? this.app.sideBar.getSize() : { x : 0, y : 0 };
        //var x = size.x - sideBar.x;
        //this.node.setStyle("width", ""+x+"px");
        this.contentAreaNode.setStyle("margin-right",sideBar.x+"px");
    },
    loadLeftNavi: function(){
        var menuNode = new Element("div.menuNode", {"styles": this.css.menuNode, "text": this.app.lp.listNavi.myApply}).inject(this.leftNode);
        this.loadNaviItem(this.app.lp.listNavi.wait, "toApplyWait");
        this.loadNaviItem(this.app.lp.listNavi.processing, "toApplyProcessing");
        this.loadNaviItem(this.app.lp.listNavi.completed, "toApplyCompleted");

        this.loadNaviItem(this.app.lp.listNavi.apply, "toApply");


        var menuNode = new Element("div.menuNode", {"styles": this.css.menuNode, "text": this.app.lp.listNavi.myMeeting}).inject(this.leftNode);
        this.loadNaviItem(this.app.lp.listNavi.wait, "toMeetingWait");
        this.loadNaviItem(this.app.lp.listNavi.processing, "toMeetingProcessing");
        this.loadNaviItem(this.app.lp.listNavi.completed, "toMeetingCompleted");
        this.loadNaviItem(this.app.lp.listNavi.reject, "toMeetingReject");

        //var menuNode = new Element("div", {"styles": this.css.menuNode, "text": this.app.lp.listNavi.room}).inject(this.leftNode);
    },
    loadNaviItem: function(text, action){
        var itemNode = new Element("div", {"styles": this.css.menuItemNode, "text": text}).inject(this.leftNode);
        var _self = this;
        itemNode.addEvents({
            "mouseover": function(){if (_self.currentNavi != this) this.setStyles(_self.css.menuItemNode_over);},
            "mouseout": function(){if (_self.currentNavi != this) this.setStyles(_self.css.menuItemNode);},
            "click": function(){
                if (_self.currentNavi){
                    _self.currentNavi.setStyles(_self.css.menuItemNode);
                    _self.currentNavi.removeClass("mainColor_bg_opacity");
                    _self.currentNavi.removeClass("mainColor_color");
                }
                _self.currentNavi = this;
                this.setStyles(_self.css.menuItemNode_current);
                _self.currentNavi.addClass("mainColor_bg_opacity");
                _self.currentNavi.addClass("mainColor_color");
                if (_self[action]) _self[action]();
            }
        });
        itemNode.store("action",action);
        if( this.options.action == action){
            itemNode.click();
        }else if( action == "toApplyWait"){
            itemNode.click();
        }
    },

    toApplyWait: function(){
        if (this.currentView) this.currentView.destroy();
        this.currentView = new MWF.xApplication.Meeting.ListView.ApplyWait(this,{
            "meetingStatus" : "wait"
        });
    },
    toApplyProcessing: function(){
        if (this.currentView) this.currentView.destroy();
        this.currentView = new MWF.xApplication.Meeting.ListView.ApplyProcessing(this,{
            "meetingStatus" : "processing"
        });
    },
    toApplyCompleted: function(){
        if (this.currentView) this.currentView.destroy();
        this.currentView = new MWF.xApplication.Meeting.ListView.ApplyCompleted(this,{
            "meetingStatus" : "completed"
        });
    },
    toApply: function(){
        if (this.currentView) this.currentView.destroy();
        this.currentView = new MWF.xApplication.Meeting.ListView.Apply(this,{
            "meetingStatus" : "applying"
        });
    },
    toMeetingWait: function(){
        if (this.currentView) this.currentView.destroy();
        this.currentView = new MWF.xApplication.Meeting.ListView.MeetingWait(this);
    },
    toMeetingProcessing: function(){
        if (this.currentView) this.currentView.destroy();
        this.currentView = new MWF.xApplication.Meeting.ListView.MeetingProcessing(this);
    },
    toMeetingCompleted: function(){
        if (this.currentView) this.currentView.destroy();
        this.currentView = new MWF.xApplication.Meeting.ListView.MeetingCompleted(this);
    },
    toMeetingReject: function(){
        if (this.currentView) this.currentView.destroy();
        this.currentView = new MWF.xApplication.Meeting.ListView.MeetingReject(this);
    },




    hide: function(){
        var fx = new Fx.Morph(this.node, {
            "duration": "300",
            "transition": Fx.Transitions.Expo.easeOut
        });
        fx.start({
            "opacity": 0
        }).chain(function(){
            this.node.setStyle("display", "none");
        }.bind(this));

    },
    show: function(){
        this.node.setStyles(this.css.node);

        if( this.app.inContainer ){
            this.node.setStyles({
                "opacity": 1,
                "position": "static",
                "width": "auto"
            });
        }else{
            var fx = new Fx.Morph(this.node, {
                "duration": "800",
                "transition": Fx.Transitions.Expo.easeOut
            });
            this.app.fireAppEvent("resize");
            fx.start({
                "opacity": 1,
                "left": "0px"
            }).chain(function(){
                this.node.setStyles({
                    "position": "static",
                    "width": "auto"
                });
            }.bind(this));
        }

    },
    reload: function(){
        if( this.currentView ){
            this.currentView.reload();
        }else{
            this.app.reload();
        }
    },
    recordStatus : function(){
        var action = "";
        if( this.currentNavi )action = this.currentNavi.retrieve("action");
        return {
            action : action
        };
    },
    destroy : function(){
        if( this.currentView ){
            this.currentView.destroy()
        }
        this.app.removeEvent("resize", this.resetNodeSizeFun );
        this.node.destroy();
    }

});

MWF.xApplication.Meeting.ListView.View = new Class({
    Implements: [Options, Events],
    options: {
        "meetingStatus" : "completed"
    },
    initialize: function(view,options){
        this.setOptions(options);
        this.view = view;
        this.css = this.view.css;
        this.container = this.view.contentNode;
        this.app = this.view.app;
        this.items = [];
        this.page = 1;
        this.pageSize = 10;

        this.action = o2.Actions.load("x_meeting_assemble_control");

        this.load();

    },
    reload : function(){
        this.items = [];
        this.container.empty();
        this.load();
    },
    load: function(){
        this.loadHead();

        MWF.require("MWF.widget.Mask", function(){
            this.mask = new MWF.widget.Mask({"style": "desktop"});
            this.mask.loadNode(this.view.contentAreaNode);
        }.bind(this));


        this.loadList();

        this.docPaginationNode = new Element("div").inject(this.container);
    },
    loadHead: function(){
        this.table = new Element("table", {
            "styles": this.css.listViewTable,
            "border": "0",
            "cellPadding": "0",
            "cellSpacing": "0",
            "html": "<tr><th>"+this.app.lp.applyPerson+"</th><th>"+this.app.lp.beginDate+"</th><th>"+this.app.lp.time+"</th><th>"+this.app.lp.subject+"</th><th>"+this.app.lp.room+"</th></tr>"
        }).inject(this.container);
        this.table.getElements("th").setStyles(this.css.listViewTableTh);

        this.tableBody = new Element("tbody").inject(this.table);
    },
    loadList: function() {
        this.tableBody.empty();
        this.action.MeetingAction.listApplyMeetingPaging(this.page,this.pageSize,{"meetingStatus" : this.options.meetingStatus},function (json) {
            this.loadLines(json.data);
            this.docTotal = json.count;
            this.loadDocPagination(  );
        }.bind(this));
    },
    loadDocPagination: function(text){
        this.docPaginationNode.empty();
        if( o2.typeOf(this.docTotal) === "number" && this.docTotal > 0 ){
            this.docPaging = new o2.widget.Paging(this.docPaginationNode, {
                style: "blue_round",
                countPerPage: this.pageSize,
                visiblePages: 9,
                currentPage: this.page,
                itemSize: this.docTotal,
                useMainColor: true,
                text: {
                    firstPage: "第一页",
                    lastPage: "最后一页"
                },
                // pageSize: pageSize,
                onJumpingPage: function (pageNum) {
                    this.page = pageNum;
                    this.loadList();
                }.bind(this),
                hasInfor: true,
                inforTextStyle: "",
                onPostLoad: function () {
                    // this.wraper.setStyle("border-top", "1px solid #4A90E2");
                    // this.wraper.addClass("mainColor_border");
                }
            });
            this.docPaging.load();
        }
    },
    loadLines: function(items){
        items.each(function(item){
            this.loadLine(item);
        }.bind(this));
        if (this.mask){
            this.mask.hide(function(){
                //MWF.release(this.mask);
                this.mask = null;
            }.bind(this));
        }
    },
    loadLine: function(item){
        this.items.push(new MWF.xApplication.Meeting.ListView.View.Line(this, item));
    },
    destroy: function(){
        this.items.each(function(item){
            item.destroy();
        });
        this.items = [];
        this.view.currentView = null;
        this.table.destroy();
        this.docPaginationNode.destroy();
    }

});


MWF.xApplication.Meeting.ListView.ApplyWait = new Class({
    Extends: MWF.xApplication.Meeting.ListView.View
});
MWF.xApplication.Meeting.ListView.ApplyProcessing = new Class({
    Extends: MWF.xApplication.Meeting.ListView.View
});
MWF.xApplication.Meeting.ListView.ApplyCompleted = new Class({
    Extends: MWF.xApplication.Meeting.ListView.View
});

MWF.xApplication.Meeting.ListView.Apply = new Class({
    Extends: MWF.xApplication.Meeting.ListView.View
});

MWF.xApplication.Meeting.ListView.MeetingWait = new Class({
    Extends: MWF.xApplication.Meeting.ListView.View,
    loadList: function() {
        this.tableBody.empty();
        this.action.MeetingAction.listInviteMeetingPaging(this.page,this.pageSize,{"meetingStatus" : "wait"},function (json) {
            this.loadLines(json.data);
            this.docTotal = json.count;
            this.loadDocPagination(  );
        }.bind(this));
    }
});
MWF.xApplication.Meeting.ListView.MeetingProcessing = new Class({
    Extends: MWF.xApplication.Meeting.ListView.View,
    loadList: function() {
        this.tableBody.empty();
        this.action.MeetingAction.listInviteMeetingPaging(this.page,this.pageSize,{"meetingStatus" : "processing"},function (json) {
            this.loadLines(json.data);
            this.docTotal = json.count;
            this.loadDocPagination(  );
        }.bind(this));
    }
});
MWF.xApplication.Meeting.ListView.MeetingCompleted = new Class({
    Extends: MWF.xApplication.Meeting.ListView.View,
    loadList: function() {
        this.tableBody.empty();
        this.action.MeetingAction.listInviteMeetingPaging(this.page,this.pageSize,{"meetingStatus" : "completed"},function (json) {
            this.loadLines(json.data);
            this.docTotal = json.count;
            this.loadDocPagination(  );
        }.bind(this));
    }
});
MWF.xApplication.Meeting.ListView.MeetingReject = new Class({
    Extends: MWF.xApplication.Meeting.ListView.View,
    loadList: function() {
        this.tableBody.empty();
        this.action.MeetingAction.listInviteMeetingPaging(this.page,this.pageSize,{"meetingStatus" : "completed","rejectFlag":true},function (json) {
            this.loadLines(json.data);
            this.docTotal = json.count;
            this.loadDocPagination(  );
        }.bind(this));
    }
});

MWF.xApplication.Meeting.ListView.View.Line = new Class({
    initialize: function(table, item){

        this.table = table;
        this.view = this.table.view;
        this.css = this.view.css;
        this.container = this.table.tableBody;
        this.app = this.view.app;
        this.data = item;
        this.load();
    },
    load: function(){
        var sTime = Date.parse(this.data.startTime);

        var bdate = sTime.format(this.app.lp.dateFormatDay);

        var btime = sTime.format("%H:%M");
        var etime = Date.parse(this.data.completedTime).format("%H:%M");

        //this.app.actions.getRoom(this.data.room, function (json){
        var room = "";
        if( this.data.woRoom ){
            var roomData = this.data.woRoom;
            var bulidingData = this.getBulidingData( roomData.building );

            room = roomData.name+"("+bulidingData.name+((roomData.roomNumber) ? " #"+roomData.roomNumber : "")+")";
        }

        // this.node = new Element("tr",{
        //     "html": "<td></td><td>"+bdate+"</td><td>"+btime+"-"+etime+"</td><td>"+this.data.subject+"</td><td>"+room+"</td>"
        // }).inject(this.container);

        this.node = new Element("tr",{
            "html": "<td></td><td></td><td></td><td></td><td></td>"
        }).inject(this.container);
        this.node.getElements("td").each(function (td, i) {
            switch (i) {
                case 1:
                    td.set("text", bdate); break;
                case 2:
                    td.set("text", btime+"-"+etime); break;
                case 3:
                    td.set("text", this.data.subject); break;
                case 4:
                    td.set("text", room); break;
            }
        }.bind(this));

        this.personNode = this.node.getFirst("td");
        if (this.data.applicant){
            // var explorer = {
            //     "actions": this.app.personActions,
            //     "app": {
            //         "lp": this.app.lp
            //     }
            // };
            MWF.require("MWF.widget.O2Identity", function(){
                var person = new MWF.widget.O2Person({"displayName": this.data.applicant.split("@")[0], "name": this.data.applicant}, this.personNode, {"style": "room"});
            }.bind(this));
        }

        this.node.getElements("td").setStyles(this.css.listViewTableTd);

        this.node.addEvent("click", function(e){
            this.openMeeting(e);
        }.bind(this));
    },
    getBulidingData : function( id ){
        if( !this.bulidingList )this.bulidingList = {};
        if( !this.bulidingList[ id ] ){
            this.app.actions.getBuilding(id, function (bjson){
                this.bulidingList[ id ] = bjson.data;
            }.bind(this), null, false)
        }

        return this.bulidingList[ id ];
    },
    openMeeting: function(e){
        this.form = new MWF.xApplication.Meeting.MeetingForm(this,this.data, {}, {app:this.app});
        this.form.view = this.view;
        this.form.open();
    },
    destroy: function(){
        if (this.node) this.node.destroy();
        //MWF.release(this);
    }
});
