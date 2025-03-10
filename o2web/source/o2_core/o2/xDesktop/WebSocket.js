MWF.xDesktop = MWF.xDesktop || {};
MWF.xApplication = MWF.xApplication || {};
MWF.require("MWF.xDesktop.Actions.RestActions", null, false);

MWF.xDesktop.WebSocket = new Class({
    Implements: [Options, Events],
    options: {},
    initialize: function(options){
        var addressObj = layout.serviceAddressList["x_message_assemble_communicate"];
        var defaultPort = layout.config.app_protocol==='https' ? "443" : "80";
        var appPort = addressObj.port || window.location.port;

        var uri = new URI(window.location.href);
        var scheme = uri.get("scheme");
        var wsScheme = (scheme.toString().toLowerCase()==="https") ? "wss" : "ws";
        this.ws = wsScheme+"://"+addressObj.host+( (!appPort || appPort.toString()===defaultPort) ? "" : ":"+appPort)+addressObj.context+"/ws/collaboration";

        this.reConnect = true;
        this.checking = false;
        this.heartTimeout = 30000;
        this.checkingTimeout = 4000;
        this.heartMsg = "heartbeat";
        this.maxErrorCount = 10;
        this.errorCount = 0;

        // var addressObj = layout.desktop.serviceAddressList["x_collaboration_assemble_websocket"];
        // this.ws = "ws://"+addressObj.host+(addressObj.port==80 ? "" : ":"+addressObj.port)+addressObj.context+"/ws/collaboration";
        //var ws = "ws://hbxa01.bf.ctc.com/x_collaboration_assemble_websocket/ws/collaboration";

        //使用轮询方式处理消息.....
        // this.webSocket = {
        //     "readyState":"1",
        //     "close": function(){},
        //     "open": function(){}
        // };
        // window.setInterval(function(){
        //     o2.Actions.get("")
        // }, 10000);

        ///*暂时不启用WebSocket了------------
        //this.ws = this.ws+"?x-token="+encodeURIComponent(Cookie.read("x-token"))+"&authorization="+encodeURIComponent(Cookie.read("x-token"));

        this.connect();
    },

    connect: function(){
        if (layout.config.webSocketEnable !== false){
            var ws = this.ws+"?"+o2.tokenName+"="+encodeURIComponent(layout.session.token);
            ws = o2.filterUrl(ws);

            try{
                this.webSocket = new WebSocket(ws);

                //this.webSocket = new WebSocket(this.ws);
                this.webSocket.onopen = function (e){this.onOpen(e);}.bind(this);
                this.webSocket.onclose = function (e){this.onClose(e);}.bind(this);
                this.webSocket.onmessage = function (e){this.onMessage(e);}.bind(this);
                this.webSocket.onerror = function (e){this.onError(e);}.bind(this);
                //---------------------------------*/
            }catch(e){
                //WebSocket.close();
                //this.webSocket = new WebSocket(this.ws);
                this.errorCount++;
                console.log("Unable to connect to the websocket server, will retry in "+(this.checkingTimeout/1000)+" seconds");
                this.checkRetry();
                // if (this.webSocket){
                //     this.close();
                //     //this.webSocket = new WebSocket(this.ws);
                // }
            }
        }
    },
    onOpen: function(e){
        this.errorCount = 0;
        console.log("websocket is open, You can receive system messages");
        this.heartbeat();

        //MWF.xDesktop.notice("success", {"x": "right", "y": "top"}, "websocket is open ...");
    },
    onClose: function(e){
        console.log("websocket is closed. ");
        //if (this.reConnect) this.checkRetry();
        //MWF.xDesktop.notice("success", {"x": "right", "y": "top"}, "websocket is closed ...");
    },
    onMessage: function(e){
        if (e.data){
            try{
                if (e.data===this.heartMsg){
                    this.heartbeat();
                    //console.log("get heartbeat...");
                    return true;
                }
                var data = JSON.decode(e.data);
                debugger;
                switch (data.category){
                    case "dialog":
                        switch (data.type){
                            case "text":
                                this.receiveChatMessage(data);
                                break;
                            default:
                        }
                        break;
                    default:
                        switch (data.type){
                            case "task":
                            case "task_create":
                            case "task_urge":
                            case "task_expire":
                            case "task_press":
                            case "task_delete":
                                this.receiveTaskMessage(data);
                                break;
                            case "read":
                            case "read_create":
                                this.receiveReadMessage(data);
                                break;
                            case "review":
                                this.receiveReviewMessage(data);
                                break;
                            case "fileEditor":
                            case "attachment_editor":
                            case "attachment_editorCancel":
                            case "attachment_editorModify":
                                this.receiveFileEditorMessage(data);
                                break;
                            case "fileShare":
                            case "attachment_share":
                            case "attachment_shareCancel":
                                this.receiveFileShareMessage(data);
                                break;
                            case "meetingInvite":
                            case "meeting_invite":
                                this.receiveMeetingInviteMessage(data);
                                break;
                            case "meetingDelete":
                            case "meeting_delete":
                                this.receiveMeetingDeleteInviteMessage(data);
                                break;
                            case "meetingCancel":
                            case "meeting_cancel":
                                this.receiveMeetingCancelMessage(data);
                                break;
                            case "meetingAccept":
                            case "meeting_accept":
                                this.receiveMeetingAcceptMessage(data);
                                break;
                            case "meetingReject":
                            case "meeting_reject":
                                this.receiveMeetingRejectMessage(data);
                                break;
                            case "attendanceAppealInvite":
                                this.receiveAttendanceAppealInviteMessage(data);
                                break;
                            case "attendanceAppealAccept":
                                this.receiveAttendanceAppealAcceptMessage(data);
                                break;
                            case "attendanceAppealReject":
                                this.receiveAttendanceAppealRejectMessage(data);
                                break;
                            case "calendar_alarm":
                                this.receiveCalendarAlarmMessage(data);
                                break;
                            case "teamwork_taskCreate":
                            case "teamwork_taskUpdate":
                            case "teamwork_taskDelelte":
                            case "teamwork_taskOvertime":
                            case "teamwork_taskChat":
                                this.receiveTeamWorkMessage(data);
                                break;
                            case "custom_create":
                                this.receiveCustomMessage(data);
                                break;
                            case "im_create":
                            case "im_revoke":
                            case "im_conv_update":
                            case "im_conv_delete":
                                this.receiveIMMessage(data);
                                break;
                            case "cms_publish" :
                                this.receiveCMSPublishMessage(data);
                                break;
                            case "bbs_replyCreate" :
                                this.receivBBSReplyCreateMessage(data);
                                break;
                            default:
                        }
                }
            }catch(e){}
        }
    },
    onError: function(e){
        this.errorCount++;
        //console.log(e);
        console.log("Unable to connect to the websocket server, will retry in "+(this.checkingTimeout/1000)+" seconds.");
        this.checkRetry();
        //MWF.xDesktop.notice("success", {"x": "right", "y": "top"}, "websocket is error ...");
    },
    checkRetry: function(){
        if (this.serverCheck) window.clearTimeout(this.serverCheck);
        if (this.heartbeatCheck) window.clearTimeout(this.heartbeatCheck);
        if (this.errorCount < this.maxErrorCount) this.serverCheck = window.setTimeout(function(){
            this.retry();
        }.bind(this), this.checkingTimeout);
    },
    retry: function(){
        if (this.webSocket){
            this.close();
        }
        console.log("Retry connect to websocket server. ("+this.errorCount+"/"+this.maxErrorCount+")");
        this.connect();
    },
    close: function(){
        this.reConnect = false;
        if (this.webSocket) this.webSocket.close();
        //WebSocket.close();
    },
    send: function(msg){
        if (!this.webSocket || this.webSocket.readyState != 1) {
            if (this.serverCheck) window.clearTimeout(this.serverCheck);
            this.retry();
        }
        // try{
        this.webSocket.send(JSON.encode(msg));
        // }catch(e){
        //     this.retry();
        //     this.webSocket.send(JSON.encode(msg));
        // }
    },
    heartbeat: function(){
        if (this.serverCheck) window.clearTimeout(this.serverCheck);
        if (this.heartbeatCheck) window.clearTimeout(this.heartbeatCheck);
        this.heartbeatCheck = window.setTimeout(function(){
            this.sendHeartbeat(this.heartMsg);
        }.bind(this), this.heartTimeout);
    },
    sendHeartbeat: function(msg){
        if (!this.webSocket || this.webSocket.readyState != 1) {
            if (this.serverCheck) window.clearTimeout(this.serverCheck);
            this.retry();
        }
        try{
            //console.log("send heartbeat ...");
            this.webSocket.send(msg);
            this.checkRetry();
        }catch(e){
            //console.log("send heartbeat error !!!");
            if (this.serverCheck) window.clearTimeout(this.serverCheck);
            this.retry();
            //this.initialize();
        }
    },
    receiveCMSPublishMessage: function(data){

        var content = "<font style='color: #ea621f'>"+(data.body.creatorPerson||"").split("@")[0]+"</font>"+MWF.LP.desktop.messsage.publishDocument+data.body.title;

        var msg = {
            "subject": data.body.msgTitle?data.body.msgTitle:data.body.categoryName,
            "content": data.body.msgContent?data.body.msgContent:content
        };
        var messageItem = layout.desktop.message.addMessage(msg);
        var tooltipItem = layout.desktop.message.addTooltip(msg);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            var appId = "cms.Document"+data.body.id;
            if ( layout.desktop.apps && layout.desktop.apps[appId] ) {
                layout.desktop.apps[appId].setCurrent();
            }else{
                var options = {"documentId": data.body.id, "appId": appId};
                layout.desktop.openApplication(e, "cms.Document", options);
            }
        });

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();

            var appId = "cms.Document"+data.body.id;
            if ( layout.desktop.apps && layout.desktop.apps[appId] ) {
                layout.desktop.apps[appId].setCurrent();
            }else{
                var options = {"documentId": data.body.id, "appId": appId};
                layout.desktop.openApplication(e, "cms.Document", options);
            }
        });
    },
    receiveChatMessage: function(data){
        if (layout.desktop.widgets["IMIMWidget"]) layout.desktop.widgets["IMIMWidget"].receiveChatMessage(data);
        //if (layout.desktop.top.userPanel) layout.desktop.top.userPanel.receiveChatMessage(data);
    },
    openWork: function(id, e){
        o2.Actions.get("x_processplatform_assemble_surface").loadWorkV2(id, function(){
            var options = {"workId": id, "appId": "process.Work"+id};
            layout.desktop.openApplication(e, "process.Work", options);
        }.bind(this), function(){
            layout.desktop.openApplication(e, "process.workcenter", null, {
                "status": {
                    "navi": "task"
                }
            });
            return true;
        }.bind(this));
    },
    receiveTaskMessage: function(data){

        var task = data.body;
        //var content = MWF.LP.desktop.messsage.receiveTask+"《"+task.title+"》, "+MWF.LP.desktop.messsage.activity+": <font style='color: #ea621f'>"+(task.activityName || "")+"</font>";
        var content = o2.txt(data.title);
        content += "<br/><font style='color: #333; font-weight: bold'>"+MWF.LP.desktop.messsage.appliction+": </font><font style='color: #ea621f'>"+o2.txt(task.applicationName)+"</font>;  "+
            "<font style='color: #333; font-weight: bold'>"+MWF.LP.desktop.messsage.process+": </font><font style='color: #ea621f'>"+o2.txt(task.processName)+"</font>";
        var msg = {
            "subject": MWF.LP.desktop.messsage.taskMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg, data.body.startTime);
        var tooltipItem = layout.desktop.message.addTooltip(msg, data.body.startTime);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            if( data.type !== "task_delete" )this.openWork(task.work,e);
        }.bind(this));
        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            if( data.type !== "task_delete" )this.openWork(task.work,e);
        }.bind(this));
    },
    receiveReadMessage: function(data){
        var read = data.body;
        //var content = MWF.LP.desktop.messsage.receiveRead+"《"+read.title+"》. ";
        var content = o2.txt(data.title);
        content += "<br/><font style='color: #333; font-weight: bold'>"+MWF.LP.desktop.messsage.appliction+": </font><font style='color: #ea621f'>"+o2.txt(read.applicationName)+"</font>;  "+
            "<font style='color: #333; font-weight: bold'>"+MWF.LP.desktop.messsage.process+": </font><font style='color: #ea621f'>"+o2.txt(read.processName)+"</font>";
        var msg = {
            "subject": MWF.LP.desktop.messsage.readMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg, data.body.startTime);
        var tooltipItem = layout.desktop.message.addTooltip(msg, data.body.startTime);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            this.openWork(read.work || read.workCompleted,e);
        }.bind(this));

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            this.openWork(read.work || read.workCompleted,e);
        }.bind(this));
    },
    receiveCustomMessage: function(data){
        var text =  o2.typeOf(data.body) === "string" ? data.body : data.title;
        var content = "<font style='color: #333; font-weight: bold'>"+MWF.LP.desktop.messsage.customMessage+"：</font>"+o2.txt(text);
        var msg = {
            "subject": MWF.LP.desktop.messsage.customMessageTitle,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg);
        var tooltipItem = layout.desktop.message.addTooltip(msg);
    },

    // im消息处理器 messageType 消息类型，如im_revoke im_create , callback处理函数
    addImListener: function(messageType, callback) {
        this.imListenerMap = this.imListenerMap || {};
        this.imListenerMap[messageType] = callback;
    },
    /// im消息处理
    receiveIMMessage: function(data){
        var imBody = data.body;
        // 更新会话或删除会话
        if (data.type === "im_conv_update" || data.type === "im_conv_delete") {
            // 执行im callback 刷新页面信息
            if (this.imListenerMap && this.imListenerMap["im_conversation"] && typeof this.imListenerMap["im_conversation"] == 'function') {
                this.imListenerMap["im_conversation"](imBody);
            }
            return;
        }
        // 撤回消息
        if (data.type == "im_revoke") {
            // 执行im callback 刷新页面信息
            if (this.imListenerMap && this.imListenerMap["im_revoke"] && typeof this.imListenerMap["im_revoke"] == 'function') {
                this.imListenerMap["im_revoke"](imBody);
            }
            return;
        }
        // im_create 暂时不变
        if (data.type == "im_create") {
            // 系统消息提示
            if (layout.desktop.message && data.person !== layout.session.user.distinguishedName) {
                var jsonBody = imBody.body;
                var conversationId = imBody.conversationId;
                var body = JSON.parse(jsonBody);
                var msgBody = body.body; //默认text 文本消息
                if (body.type && body.type === "emoji") { //表情 消息
                    msgBody = "["+MWF.LP.desktop.messsage.emoji+"]";
                } else if (body.type === "process") {
                    msgBody = "["+MWF.LP.desktop.messsage.processWork+"]";
                } else if (body.type === "cms") {
                    msgBody = "["+MWF.LP.desktop.messsage.cmsDoc+"]";
                }
                var content = "<font style='color: #333; font-weight: bold'>"+o2.txt(data.title)+"</font>: "+o2.txt(msgBody);
                var msg = {
                    "subject": MWF.LP.desktop.messsage.customMessageTitle,
                    "content": content
                };
                var messageItem = layout.desktop.message.addMessage(msg);
                var options = {"conversationId": conversationId};
                messageItem.contentNode.addEvent("click", function(e){
                    layout.desktop.message.addUnread(-1);
                    layout.desktop.message.hide();
                    layout.desktop.openApplication(e, "IMV2", options);
                }.bind(this));

                var tooltipItem = layout.desktop.message.addTooltip(msg);
                tooltipItem.contentNode.addEvent("click", function(e){
                    layout.desktop.message.hide();
                    layout.desktop.openApplication(e, "IMV2", options);
                }.bind(this));
            }
            // 执行im callback 刷新页面信息
            if (this.imListenerMap && this.imListenerMap["im_create"] && typeof this.imListenerMap["im_create"] == 'function') {
                this.imListenerMap["im_create"](imBody);
            }
            return;
        }

    },




    receiveReviewMessage: function(data){
        var content = MWF.LP.desktop.messsage.receiveReview+"《"+o2.txt(data.title)+"》. ";
        content += "<br/><font style='color: #333; font-weight: bold'>"+MWF.LP.desktop.messsage.appliction+": </font><font style='color: #ea621f'>"+o2.txt(data.applicationName)+"</font>;  "+
            "<font style='color: #333; font-weight: bold'>"+MWF.LP.desktop.messsage.process+": </font><font style='color: #ea621f'>"+o2.txt(data.processName)+"</font>";
        var msg = {
            "subject": MWF.LP.desktop.messsage.reviewMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg, data.body.startTime);
        var tooltipItem = layout.desktop.message.addTooltip(msg, data.body.startTime);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            layout.desktop.openApplication(e, "process.TaskCenter", null, {
                "status": {
                    "navi": "review"
                }
            });
        });

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            layout.desktop.openApplication(e, "process.TaskCenter", null, {
                "status": {
                    "navi": "review"
                }
            });
        });
    },

    receiveFileEditorMessage: function(data){

        var content = "<font style='color: #ea621f; font-weight: bold'>"+MWF.name.cn(data.body.person)+"</font> "+MWF.LP.desktop.messsage.receiveFileEditor+"“"+o2.txt(data.body.name)+"”. ";
        var msg = {
            "subject": MWF.LP.desktop.messsage.fileEditorMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg, ((data.body) ? data.body.startTime : ""));
        var tooltipItem = layout.desktop.message.addTooltip(msg, ((data.body) ? data.body.startTime : ""));
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            layout.desktop.openApplication(e, "File", null, {
                "status": {
                    "tab": "editor",
                    "node": data.person
                }
            });
        });

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            layout.desktop.openApplication(e, "File", null, {
                "status": {
                    "tab": "editor",
                    "node": data.person
                }
            });
        });
    },

    receiveFileShareMessage: function(data){

        var content = "<font style='color: #ea621f; font-weight: bold'>"+MWF.name.cn(data.body.person)+"</font> "+MWF.LP.desktop.messsage.receiveFileShare+"“"+o2.txt(data.body.name)+"”. ";
        var msg = {
            "subject": MWF.LP.desktop.messsage.fileShareMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg, ((data.body) ? data.body.createTime : ""));
        var tooltipItem = layout.desktop.message.addTooltip(msg, ((data.body) ? data.body.createTime : ""));
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();


            if(layout.serviceAddressList["x_pan_assemble_control"]){
                layout.desktop.openApplication(e, "Drive", null, {
                    "status": {
                        "tab": "share",
                        "node": data.person
                    }
                });
            }else{

                //应用市场中的云文件，门户cloudFile
                o2.Actions.load("x_portal_assemble_surface").PortalAction.get("cloudFile", function () {
                    layout.desktop.openApplication(e, "portal.Portal", {
                        portalId : "cloudFile"
                    });
                }, function(){
                    layout.desktop.openApplication(e, "File", null, {
                        "status": {
                            "tab": "share",
                            "node": data.person
                        }
                    });
                })
            }



        });

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();


            if(layout.serviceAddressList["x_pan_assemble_control"]){
                layout.desktop.openApplication(e, "Drive", null, {
                    "status": {
                        "tab": "share",
                        "node": data.person
                    }
                });
                return false;
            }else{
                layout.desktop.openApplication(e, "File", null, {
                    "status": {
                        "tab": "share",
                        "node": data.person
                    }
                });

            }



        });
    },
    getMeeting: function(data, callback){
        //this.action = new MWF.xDesktop.Actions.RestActions("/Actions/action.json", "x_meeting_assemble_control", "x_component_Meeting");
        //var action = new MWF.xDesktop.Actions.RestActions("/Actions/action.json", "x_meeting_assemble_control", "x_component_Meeting");
        if( data.body && typeOf( data.body ) === "object" ){
            var data = data.body;
            MWF.Actions.get("x_meeting_assemble_control").getRoom(data.room, function(roomJson){
                data.roomName = roomJson.data.name;
                MWF.Actions.get("x_meeting_assemble_control").getBuilding(roomJson.data.building, function(buildingJson){
                    data.buildingName = buildingJson.data.name;
                    if (callback) callback(data);
                }.bind(this));
            }.bind(this));
        }else{
            MWF.Actions.get("x_meeting_assemble_control").getMeeting(data.metting, function(json){
                var data = json.data;
                MWF.Actions.get("x_meeting_assemble_control").getRoom(data.room, function(roomJson){
                    data.roomName = roomJson.data.name;
                    MWF.Actions.get("x_meeting_assemble_control").getBuilding(roomJson.data.building, function(buildingJson){
                        data.buildingName = buildingJson.data.name;
                        if (callback) callback(data);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }
    },
    receiveMeetingInviteMessage: function(data){

        this.getMeeting(data, function(meeting){
            var content = MWF.LP.desktop.messsage.meetingInvite;
            content = content.replace(/{person}/g, MWF.name.cn(meeting.applicant));
            var date = Date.parse(meeting.startTime).format("%Y-%m-%d- %H:%M");
            content = content.replace(/{date}/g, date);
            content = content.replace(/{subject}/g, o2.txt(meeting.subject));
            content = content.replace(/{addr}/g, o2.txt(meeting.roomName+"("+meeting.buildingName+")"));

            var msg = {
                "subject": MWF.LP.desktop.messsage.meetingInviteMessage,
                "content": content
            };
            var messageItem = layout.desktop.message.addMessage(msg, ((data.body) ? data.body.startTime : ""));
            var tooltipItem = layout.desktop.message.addTooltip(msg, ((data.body) ? data.body.startTime : ""));
            tooltipItem.contentNode.addEvent("click", function(e){
                layout.desktop.message.hide();
                layout.desktop.openApplication(e, "Meeting", null);
            });

            messageItem.contentNode.addEvent("click", function(e){
                layout.desktop.message.addUnread(-1);
                layout.desktop.message.hide();
                layout.desktop.openApplication(e, "Meeting", null);
            });
        }.bind(this));
    },
    receiveMeetingDeleteInviteMessage: function(data){

        this.getMeeting(data, function(meeting){
            var content = MWF.LP.desktop.messsage.meetingDeleteInvite;
            content = content.replace(/{person}/g, MWF.name.cn(meeting.applicant));
            var date = Date.parse(meeting.startTime).format("%Y-%m-%d- %H:%M");
            content = content.replace(/{date}/g, date);
            content = content.replace(/{subject}/g, o2.txt(meeting.subject));
            content = content.replace(/{addr}/g, o2.txt(meeting.roomName+"("+meeting.buildingName+")"));

            var msg = {
                "subject": MWF.LP.desktop.messsage.meetingDeleteInviteMessage,
                "content": content
            };
            var messageItem = layout.desktop.message.addMessage(msg, ((data.body) ? data.body.startTime : ""));
            var tooltipItem = layout.desktop.message.addTooltip(msg, ((data.body) ? data.body.startTime : ""));
            tooltipItem.contentNode.addEvent("click", function(e){
                layout.desktop.message.hide();
                layout.desktop.openApplication(e, "Meeting", null);
            });

            messageItem.contentNode.addEvent("click", function(e){
                layout.desktop.message.addUnread(-1);
                layout.desktop.message.hide();
                layout.desktop.openApplication(e, "Meeting", null);
            });
        }.bind(this));
    },
    receiveMeetingCancelMessage: function(data){

        this.getMeeting(data, function(meeting){
            var content = MWF.LP.desktop.messsage.meetingCancel;
            content = content.replace(/{person}/g, MWF.name.cn(meeting.applicant));
            var date = Date.parse(meeting.startTime).format("%Y-%m-%d- %H:%M");
            content = content.replace(/{date}/g, date);
            content = content.replace(/{subject}/g, o2.txt(meeting.subject));
            content = content.replace(/{addr}/g, o2.txt(meeting.roomName+"("+meeting.buildingName+")"));

            var msg = {
                "subject": MWF.LP.desktop.messsage.meetingCancelMessage,
                "content": content
            };
            var messageItem = layout.desktop.message.addMessage(msg, ((data.body) ? data.body.startTime : ""));
            var tooltipItem = layout.desktop.message.addTooltip(msg, ((data.body) ? data.body.startTime : ""));
            tooltipItem.contentNode.addEvent("click", function(e){
                layout.desktop.message.hide();
                layout.desktop.openApplication(e, "Meeting", null);
            });

            messageItem.contentNode.addEvent("click", function(e){
                layout.desktop.message.addUnread(-1);
                layout.desktop.message.hide();
                layout.desktop.openApplication(e, "Meeting", null);
            });
        }.bind(this));
    },
    receiveMeetingAcceptMessage: function(data){

        this.getMeeting(data, function(meeting){
            var content = MWF.LP.desktop.messsage.meetingAccept;
            //content = content.replace(/{person}/g, MWF.name.cn(meeting.applicant));
            content = content.replace(/{person}/g, MWF.name.cn(data.body.fromPerson));
            var date = Date.parse(meeting.startTime).format("%Y-%m-%d- %H:%M");
            content = content.replace(/{date}/g, date);
            content = content.replace(/{subject}/g, o2.txt(meeting.subject));
            content = content.replace(/{addr}/g, o2.txt(meeting.roomName+"("+meeting.buildingName+")"));

            var msg = {
                "subject": MWF.LP.desktop.messsage.meetingAcceptMessage,
                "content": content
            };
            var messageItem = layout.desktop.message.addMessage(msg, ((data.body) ? data.body.startTime : ""));
            var tooltipItem = layout.desktop.message.addTooltip(msg, ((data.body) ? data.body.startTime : ""));
            tooltipItem.contentNode.addEvent("click", function(e){
                layout.desktop.message.hide();
                layout.desktop.openApplication(e, "Meeting", null);
            });

            messageItem.contentNode.addEvent("click", function(e){
                layout.desktop.message.addUnread(-1);
                layout.desktop.message.hide();
                layout.desktop.openApplication(e, "Meeting", null);
            });
        }.bind(this));
    },
    receiveMeetingRejectMessage: function(data){

        this.getMeeting(data, function(meeting){
            var content = MWF.LP.desktop.messsage.meetingReject;
            //content = content.replace(/{person}/g, MWF.name.cn(meeting.applicant));
            content = content.replace(/{person}/g, MWF.name.cn(data.body.fromPerson));
            var date = Date.parse(meeting.startTime).format("%Y-%m-%d- %H:%M");
            content = content.replace(/{date}/g, date);
            content = content.replace(/{subject}/g, o2.txt(meeting.subject));
            content = content.replace(/{addr}/g, o2.txt(meeting.roomName+"("+meeting.buildingName+")"));

            var msg = {
                "subject": MWF.LP.desktop.messsage.meetingRejectMessage,
                "content": content
            };
            var messageItem = layout.desktop.message.addMessage(msg, ((data.body) ? data.body.startTime : ""));
            var tooltipItem = layout.desktop.message.addTooltip(msg, ((data.body) ? data.body.startTime : ""));
            tooltipItem.contentNode.addEvent("click", function(e){
                layout.desktop.message.hide();
                layout.desktop.openApplication(e, "Meeting", null);
            });

            messageItem.contentNode.addEvent("click", function(e){
                layout.desktop.message.addUnread(-1);
                layout.desktop.message.hide();
                layout.desktop.openApplication(e, "Meeting", null);
            });
        }.bind(this));
    },
    receiveAttendanceAppealInviteMessage : function(data){
        var content = MWF.LP.desktop.messsage.attendanceAppealInvite;
        content = content.replace(/{subject}/g, o2.txt(data.subject));

        var msg = {
            "subject": MWF.LP.desktop.messsage.attendanceAppealInviteMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg);
        var tooltipItem = layout.desktop.message.addTooltip(msg);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            layout.desktop.openApplication(e, "Attendance", {"curNaviId":"13"});
        });

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            layout.desktop.openApplication(e, "Attendance", {"curNaviId":"13"});
        });
    },
    receiveAttendanceAppealAcceptMessage : function(data){
        var content = MWF.LP.desktop.messsage.attendanceAppealAccept;
        content = content.replace(/{subject}/g, o2.txt(data.subject));

        var msg = {
            "subject": MWF.LP.desktop.messsage.attendanceAppealAcceptMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg);
        var tooltipItem = layout.desktop.message.addTooltip(msg);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            layout.desktop.openApplication(e, "Attendance", {"curNaviId":"12"});
        });

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            layout.desktop.openApplication(e, "Attendance", {"curNaviId":"12"});
        });
    },
    receiveAttendanceAppealRejectMessage : function(data){
        var content = MWF.LP.desktop.messsage.attendanceAppealReject;
        content = content.replace(/{subject}/g, o2.txt(data.subject));

        var msg = {
            "subject": MWF.LP.desktop.messsage.attendanceAppealRejectMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg);
        var tooltipItem = layout.desktop.message.addTooltip(msg);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            layout.desktop.openApplication(e, "Attendance", {"curNaviId":"12"});
        });

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            layout.desktop.openApplication(e, "Attendance", {"curNaviId":"12"});
        });
    },
    receiveCalendarAlarmMessage: function(data){

        var content = MWF.LP.desktop.messsage.canlendarAlarm;
        content = content.replace(/{title}/g, o2.txt(data.title));

        var msg = {
            "subject": MWF.LP.desktop.messsage.canlendarAlarmMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg);
        var tooltipItem = layout.desktop.message.addTooltip(msg);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            if ( layout.desktop.apps && layout.desktop.apps["Calendar"] ) {
                if( layout.desktop.apps["Calendar"].openEvent ){
                    layout.desktop.apps["Calendar"].setCurrent();
                    layout.desktop.apps["Calendar"].openEvent( data.body.id );
                }else if(layout.desktop.apps["Calendar"].options){
                    layout.desktop.apps["Calendar"].options.eventId = data.body.id;
                    layout.desktop.apps["Calendar"].setCurrent();
                }else{
                    layout.desktop.openApplication(e, "Calendar", {"eventId": data.body.id });
                }
            }else{
                layout.desktop.openApplication(e, "Calendar", {"eventId": data.body.id });
            }
        });

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            if ( layout.desktop.apps && layout.desktop.apps["Calendar"] ) {
                if( layout.desktop.apps["Calendar"].openEvent ){
                    layout.desktop.apps["Calendar"].setCurrent();
                    layout.desktop.apps["Calendar"].openEvent( data.body.id );
                }else if(layout.desktop.apps["Calendar"].options){
                    layout.desktop.apps["Calendar"].options.eventId = data.body.id;
                    layout.desktop.apps["Calendar"].setCurrent();
                }else{
                    layout.desktop.openApplication(e, "Calendar", {"eventId": data.body.id });
                }
            }else{
                layout.desktop.openApplication(e, "Calendar", {"eventId": data.body.id });
            }
        });
    },
    receiveTeamWorkMessage: function(data){

        var task = data.body;
        //var content = MWF.LP.desktop.messsage.receiveTask+"《"+task.title+"》, "+MWF.LP.desktop.messsage.activity+": <font style='color: #ea621f'>"+(task.activityName || "")+"</font>";
        var content = o2.txt(data.title);
        //content += "<br/><font style='color: #333; font-weight: bold'>"+MWF.LP.desktop.messsage.teamwork.creatorPerson+": </font><font style='color: #ea621f'>"+task.creatorPerson+"</font>;  "+
        //    "<font style='color: #333; font-weight: bold'>"+MWF.LP.desktop.messsage.teamwork.executor+": </font><font style='color: #ea621f'>"+task.executor+"</font>";
        var msg = {
            "subject": task.name,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg);
        var tooltipItem = layout.desktop.message.addTooltip(msg);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            var options = {"taskId": task.id, "projectId": task.project};
            layout.desktop.openApplication(e, "TeamWork.Task", options);
        }.bind(this));
        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            var options = {"taskId": task.id, "projectId": task.project};
            layout.desktop.openApplication(e, "TeamWork.Task", options);
        }.bind(this));
    },
    receiveBBSSubjectCreateMessage: function (data) {
        var content = MWF.LP.desktop.messsage.canlendarAlarm;
        content = content.replace(/{title}/g, o2.txt(data.title));

        var msg = {
            "subject": MWF.LP.desktop.messsage.canlendarAlarmMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg);
        var tooltipItem = layout.desktop.message.addTooltip(msg);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            if ( layout.desktop.apps && layout.desktop.apps["Calendar"] ) {
                if( layout.desktop.apps["Calendar"].openEvent ){
                    layout.desktop.apps["Calendar"].setCurrent();
                    layout.desktop.apps["Calendar"].openEvent( data.body.id );
                }else if(layout.desktop.apps["Calendar"].options){
                    layout.desktop.apps["Calendar"].options.eventId = data.body.id;
                    layout.desktop.apps["Calendar"].setCurrent();
                }else{
                    layout.desktop.openApplication(e, "Calendar", {"eventId": data.body.id });
                }
            }else{
                layout.desktop.openApplication(e, "Calendar", {"eventId": data.body.id });
            }
        });

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            if ( layout.desktop.apps && layout.desktop.apps["Calendar"] ) {
                if( layout.desktop.apps["Calendar"].openEvent ){
                    layout.desktop.apps["Calendar"].setCurrent();
                    layout.desktop.apps["Calendar"].openEvent( data.body.id );
                }else if(layout.desktop.apps["Calendar"].options){
                    layout.desktop.apps["Calendar"].options.eventId = data.body.id;
                    layout.desktop.apps["Calendar"].setCurrent();
                }else{
                    layout.desktop.openApplication(e, "Calendar", {"eventId": data.body.id });
                }
            }else{
                layout.desktop.openApplication(e, "Calendar", {"eventId": data.body.id });
            }
        });
    },
    receivBBSReplyCreateMessage: function (data) {
        debugger;
        var content = MWF.LP.desktop.messsage.bbsReplyCreate;
        content = content.replace(/{title}/g, (data.body.createPerson||"").split("@")[0] + o2.txt(data.title));

        var msg = {
            "subject": MWF.LP.desktop.messsage.bbsReplyCreateMessage,
            "content": content
        };
        var messageItem = layout.desktop.message.addMessage(msg);
        var tooltipItem = layout.desktop.message.addTooltip(msg);
        tooltipItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.hide();
            var appId = "ForumDocument" + data.body.subjectId;
            if ( layout.desktop.apps && layout.desktop.apps[appId] ) {
                layout.desktop.apps[appId].setCurrent();
            }else{
                layout.desktop.openApplication(e, "ForumDocument", {"id": data.body.subjectId, "isEdited": false });
            }
        });

        messageItem.contentNode.addEvent("click", function(e){
            layout.desktop.message.addUnread(-1);
            layout.desktop.message.hide();
            var appId = "ForumDocument" + data.body.subjectId;
            if ( layout.desktop.apps && layout.desktop.apps[appId] ) {
                layout.desktop.apps[appId].setCurrent();
            }else{
                layout.desktop.openApplication(e, "ForumDocument", {"id": data.body.subjectId, "isEdited": false });
            }
        });
    }
});
