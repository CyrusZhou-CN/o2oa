MWF.xApplication.process.ProcessDesigner.LP = {
	"title": "流程编辑",
	"newProcess": "新流程",

    "tools": "工具",
	"unnamed": "未命名",
	"unknow": "未知",
	"unrealized": "此功能未实现",
	"activity": "活动",
	"route": "路由",
	"property": "属性",
	"showJson": "查看JSON",
	"all" : "全部",
	"showAdvanced": "显示高级属性",

    "phone": "手机",
    "mail": "邮件",
    "selectScript": "点击选择脚本: ",
    "condition": "条件",
    "unCategory": "未分类",
	"ok": "确定",
	"close": "关闭",
	"cancel": "取消",

	"notice":{
        "no_name": "请先输入流程名称",
		"save_success": "流程保存成功!",
		"save_process": "请先保存流程!",
		"one_begin": "每个流程只允许有一个“开始”活动",
		"deleteRoute": "您确定要删除选中的路由吗？",
		"deleteRouteTitle": "删除路由确认",
		"deleteActivityTitle": "删除活动确认",
		"deleteActivity": "删除活动将同时删除关联此活动的所有路由，您确定要删除选中的活动吗？",
		"saveRouteOrgNoName" : "标识和标题不能为空",
		"saveRouteOrgNumberId" : "标识不能为纯数字",
		"saveRouteOrgDoubleDotId" : "标识不能包含连续两个点号",
		"processCopyError": "活动粘贴失败，请重新复制后重试",
		"routeNameConfilct": "一个活动不能有两个同名路由！"
	},
	"menu": {
		"newRoute": "新建路由",
		"newActivity": "新建活动",
		"newActivityType": {
			"manual": "人工活动",
			"condition": "条件活动",
			"auto": "自动活动",
			"split": "拆分活动",
			"merge": "合并活动",
			"embed": "流程调用",
			"invoke": "服务调用",
			"service": "服务活动",
			"agent": "脚本活动",
			"delay": "定时活动",
			"publish": "数据发布",
			"message": "消息活动",
			"choice": "选择活动",
			"cancel": "取消活动",
			"begin": "开始活动",
			"end": "结束活动",
			"parallel": "并行活动"
		},

		"copyActivity": "复制活动",

		"deleteActivity": "删除活动",
		"deleteRoute": "删除路由",

		"saveProcess": "保存流程",
		"saveProcessNew": "保存为新版本",
		"checkProcess": "检查流程",
		"exportProcess": "导出流程",
		"printProcess": "打印流程",

		"showGrid": "显示网格",
		"hideGrid": "隐藏网格"
	},
    "intoScript": "点击此处，编写脚本代码",
    "serialSelectTitle": "编号可选属性",
    "serialActivityTitle": "执行编号活动",
    "delete": "删除",
    "serialRule": "编号规则",
    "serialTextTitle": "输入文本",
    "serialDateTitle": "时间",
    "serialCreatedDateTitle": "拟稿时间",
    "serialCurrentDateTitle": "编号时间",
    "serialCreated": "拟稿",
    "serialCurrent": "编号",
    "serialAttributeTitle": "输入属性名称",
    "serialScriptTitle": "请输入脚本",
    "serialNumberLongTitle": "流水号长度",
    "serialNumberByTitle": "流水号依据",
    "isSave": "正在保存，请稍候...",

    "dutyInputTitle": "添加职务参数",
    "dutyInput": "请为职务“{duty}”添加参数",
    "creatorCompany": "拟稿公司",
    "creatorDepartment": "拟稿部门",
    "currentCompany": "当前公司",
    "currentDepartment": "当前部门",
    "deleteDutyTitle": "移除职务确认",
    "deleteDutyText": "您确认要移除职务“{duty}”吗？",
    "selectIcon": "选择图标",
	"centerServer": "中心服务",

    "creatorUnit": "拟稿人所在组织",
    "currentUnit": "处理人所在组织",
    "selectUnit": "选择组织",
    "scriptUnit": "使用脚本",
	"preview" : "预览",
	"copy" : "从其他设置拷贝",

	"selectType" : "选择类型",
	"identity" : "身份",
	"unit" : "组织",
	"selectCount" : "选择数量",
	"deleteOrgConfirmTitle" : "删除选择确认",
	"deleteOrgConfirmContent" : "确定要删除该选择配置？",

	"projectionTitle": "映射业务数据",
	"projectionActionNode_add": "添加映射条目",
	"projectionActionNode_modify": "修改映射条目",
	"projectionDataName": "数据名称",
	"projectionPath": "数据路径",
	"projectionType":"数据类型",
    "projectionName":"列名",
	"projectionInputError": "请输入数据名称和数据路径",
	"projectionTypeCountError": "{type}类型的数据映射条目，最多允许{count}条。",
	"projectionSameNameError": "相同的数据名称已存在",
	"projectionDeleteItemTitle": "删除数据映射条目确认",
	"projectionDeleteItem": "您确定要删除名为“{name}”，路径为“{path}”的数据映射条目吗？",
	"projectionRunActionNode": "立即运行数据映射",
	"projectionRunTitle": "立即执行确认",
	"projectionRunText": "请确认立即执行数据映射",
	"projectionRunSuccess": "数据映射已开始执行",
	"projectionRunError": "不需要执行数据映射",

	"enable": "已启用",
	"notEnable": "未启用",
	"currentEdition": "当前版本",
	"editionUpdate": "最后修改",
	"editionDiscription":"请输入版本描述",

	"upgradeConfirm": "保存为新版本确认",
	"upgradeInfor": "<div style='overflow: hidden; line-height: 26px'>您是否确定要将当前流程保存为新版?<br/>选中\"同时启用新版本\"在保存完成之后,会将新版本设置为启用版本.</div><div style='margin-top:10px'><input type='checkbox' checked>同时启用新版本</div>",
	"inputDiscription": "请先输入版本描述",

	"edition_list":{
		"editionList": "查看流程版本",
		"number": "版本号",
		"update": "更新时间",
		"updatePerson": "更新人",
		"description": "版本描述",
		"enabled": "启用",
		"action": "操作",
		"yes": "是",
		"no": "否",
		"newProcess": "创建了新的流程。",
		"an": "个",

		"modifyProcess": "[流程] 修改了流程的属性 <b>\"{field}\"</b>，从：<span style='color: #ff0000'>\"{old}\"</span>，修改为：<span style='color: #0000ff'>\"{new}\"</span>",
		"modifyActivity": "[活动] 修改了<b>“{name}”</b>活动的属性 <b>\"{field}\"</b>，从：<span style='color: #ff0000'>\"{old}\"</span>，修改为：<span style='color: #0000ff'>\"{new}\"</span>",
		"modifyActivity_addRoute": "[路由] 增加了<b>“{name}”</b>活动的路由<b>“{rname}”</b>，指向<span style='color: #0000ff'>“{next}”</span>",
		"modifyActivity_deleteRoute": "[路由] 删除了<b>“{name}”</b>活动的路由<b>“{rname}”</b>，指向<span style='color: #ff0000'>“{next}”</span>",
		"modifyActivity_modifyRouteNext": "[路由] 修改了<b>“{name}”</b>活动的路由<b>“{rname}”</b>，从指向<span style='color: #ff0000'>“{oldnext}”</span>，修改为指向<span style='color: #0000ff'>“{newnext}”</span>",
		"modifyActivity_modifyRouteField": "[路由] 修改了<b>“{name}”</b>活动的路由<b>“{rname}”</b>， 属性<b>\"{field}\"</b> 从：<span style='color: #ff0000'>\"{old}\"</span>，修改为：<span style='color: #0000ff'>\"{new}\"</span>",
		"deleteActivity": "[活动] 删除了活动<b style='color: #ff0000'>“{name}”</b>",
		"addActivity": "[活动] 增加了活动<b style='color: #0000ff'>“{name}”</b>",
		"noDiffs": "与上一版本无差异",
		"hasDiffs": "与上一版本差异:",

		"open": "切换",
		"enable": "启用",
		"rollback": "回滚",
		"override": "覆盖",
		"del": "删除",

		"openInfor": "保存当前打开的版本，并打开版本”{v}“。",
		"enableInfor": "启用流程版本”{v}“",
		"rollbackInfor": "将流程设计回滚所选版本，所有所选版本之后的版本会被删除。",
		"overrideInfor": "用所选版本的设计覆盖当前版本。",
		"delInfor": "删除流程版本”{v}“。",

		"enabledProcessTitle": "启用流程确认",
		"enabledProcessInfor": "将当前流程设置为”启用“，原来已启用的流程版本将被设置为”未启用“。<br><br>已经在流转的流程实例不会受到影响，下次启动流程时，会以已启用的流程版本为模板创建流程实例。<br><br>您确定要将当前流程设置为”启用“吗？",

		"deleteEditionTitle": "删除版本确认",
		"deleteEditionInfor": "删除选中的流程版本”{v}“，同时也会删除流程版本”{v}“的流转中实例。您确定要删除流程版本”{v}“吗？"
	},
	"selectorButton" : {
		"ok" : "确　定",
		"cancel" : "取 消"
	},
	"orgEditor" : {
		"addOption" : "添加选择项",
		"modifyOption" : "修改选择项",
		"conflictNotice" : "该路由已经有重名配置",
		"copyConfig" : "拷贝选择配置"
	},
	"serial": {
		"text": ["文本", "固定文本"],
		"year": ["年", "拟稿时间年度"],
		"month": ["月", "拟稿时间月份"],
		"day": ["日", "拟稿时间日"],
		"unit": ["组织", "拟稿人所在直接组织"],
		"unitAttribute": ["组织属性", "拟稿人所在直接组织的属性"],
		"script": ["脚本", "脚本"],
		"number": ["流水号", "流水号"]
	},
	"propertyTemplate": {
		"base": "基本",
		"event": "事件",
		"html": "HTML",
		"json": "JSON",
		"person": "人员",
		"split": "拆分",

		"apiDoc": "点击此处查看API文档",

		"id": "标识",
		"name": "名称",
		"alias": "别名",
		"description": "描述",
		"creator": "创建人",
		"createTime": "创建时间",
		"updater": "更新人",
		"updateTime": "更新时间",
		"application": "应用",
		"icon": "图标",
		"type": "类型",
		"form": "表单",

		"routeAsOpinion": "使用路由名称作为缺省意见",
		"yes": "是",
		"no": "否",
		"opinionInfo": "(选择“否”：处理意见没填写则意见为空)",
		"version": "版 本",
		"versionName": "版本名称",
		"versionId": "版本标识",
		"versionDescription": "版本描述",

		"startup": "启 动",
		"startTerminal": "启动终端",
		"pcAndMobile": "PC端和移动端",
		"onlyPc": "仅PC端",
		"none": "无",
		"startMode": "启动模式",
		"instanceMode": "实例模式",
		"draftMode": "草稿模式",
		"instanceModeInfo": "(新建流程时直接创建流程实例，给拟稿人生成待办)",
		"draftModeInfo": "(新建流程时不创建流程实例，不生成待办，产生一个草稿文档，直到流转时才创建流程实例。在草稿模式中不能上传附件。)",

		"checkDraft": "新建检查",
		"checkDraftInfo": "(选择“是”：未保存过的流程实例不会保留)",
		"power": "权 限",
		"stratIdentity": "启动人",
		"startUnit": "启动组织",
		"starGroup": "启动群组",
		"manager": "流程实例维护人",
		"maintenanceIdentity": "找不到处理人时流转给谁",
		"managerScript": "流程实例维护人脚本",


		"number": "编号",
		"numberActivity": "编号活动",
		"trigger": "触发条件",
		"arrivals": "到达",
		"submit": "提交",

		"aging": "时效",
		"processTimeLimit": "流程超时",
		"noLimit": "不超时",
		"specifyDuration": "指定时长",
		"byScript": "通过脚本",
		"timeLimit": "超时时长",
		"days": "天",
		"hours": "小时",
		"workTimeOnly": "仅计算工作时间",
		"includeNoworkTime": "包含非工作时长",
		"script": "脚本",
		"returnJson": "脚本返回JSON数据",
		"hourTimeout": "几小时后超时",
		"hourWorkTimeout": "几个工作小时后超时",
		"specifyTimeout": "到达指定时间后超时",
		"oneOfThree": "三个值任选其一",

		"mapping": "映射",
		"mappingData": "映射业务数据",
		"dataName": "数据名称",
		"dataPath": "数据路径",
		"dataType": "数据类型",
		"mappingOnFlow": "每次流转刷新映射数据",
		"mappingDataToTable": "映射数据表",
		"mappingTableEnabled": "流转结束后将数据存储到数据表",
		"queryTable": "数据表",

		"data": "数据",
		"dataTrace": "业务数据跟踪",
		"dataTraceInfo": "启用业务数据跟踪可以记录指定业务字段的每次变化情况，可以在表单设计中设置查看业务数据的历史变化记录",
		"dataTraceInfo2": "",
		"dataTraceFields": "跟踪字段",
		"dataTraceDisabled": "无",
		"dataTraceCustom": "自定义",
		"dataTraceAll": "所有",
		"dataTraceDisabledInfo": "不跟踪任何业务数据字段",
		"dataTraceCustomInfo": "在下面的设置中定义要跟踪的业务字段",
		"dataTraceAllInfo": "跟踪所有业务数据字段（不包括数据表格、数据模板和长文本（Lob）类型的数据）",
		"dataTraceFieldNames": "字段名称",
		"dataTraceFieldNamesSelect": "选择表单字段",
		"selectForm": "表单",
		"selectField": "数据字段",
		"selectedField": "已选字段",



		"allowReroute": "是否允许调度",
		"allowRerouteTo": "允许调度到此活动",

		"mergeLayerThreshold": "合并层数",
		"mergeLayerThreshold0": "合并尽量多的层数",
		"mergeLayerThreshold1": "合并单层",
		"mergeLayerThresholdn": "合并{n}层",


		"reader": "待阅人",
		"readerId": "身份",
		"duty": "职务",
		"processData": "流程数据",
		"reviewer": "阅读人",
		"reviewerId": "身份",
		"unit": "组织",

		"participant": "流程角色",
		"participant_creator": "启动者",
		"participant_activity": "活动参与者",
		"participant_maintenance": "维护者",
		"participant_none": "无",

		"participant_creator_info": "将流程实例的启动者，作为当前活动的处理人",
		"participant_maintenance_info": "将流程的维护者，作为当前活动的处理人",
		"participant_activity_info": "将流程实例已经流转过的活动的处理人，作为当前活动的处理人，请在下面选择活动",

		"splitScript": "拆分依据脚本",
		"embed": "调用",
		"selectProcess": "选择流程",
		"embedType": "调用方式",
		"sync": "同步",
		"async": "异步",
		"copyData": "拷贝数据",
		"copyAttachment": "拷贝附件",
		"startPerson": "启动者",
		"currentCreator": "当前流程的启动者",
		"prevHandler": "上一个活动的处理人",
		"specifyPerson": "指定一个启动者",
		"personId": "启动者标识",
		"personScript": "启动者脚本",
		"titleScript": "标题脚本",
		"dataScript": "数据脚本",
		"getOldData": "获取原流程的业务数据",
		"setNewData": "设置新流程的业务数据",

		"cmsCreator": "发布者",
		"cmsCreatorId": "发布者标识",
		"specifyCmsCreator": "指定一个发布者",
		"useScript": "使用脚本",
		"cmsCreatorScript": "发布者脚本",

		"waitUntilCompletedTitle": "流程等待",
		"waitUntilCompleted": "如果选择“是”，主流程将在被调用流程流转过程中保持等待，直到等待被调用流程流转结束",
		"completedEventsInfo": "启用了流程等待，子流程结束后会触发主流程继续流转，下面的三个事件会被执行",
		"completedEndEvent": "子流程成功后",
		"completedEnd": "子流程成功后",
		"completedCancelEvent": "子流程取消后",
		"completedCancel": "子流程取消后",
		"completedEvent": "子流程完成后",
		"completed": "子流程完成后",
		"completedEndEventInfo": "当子流程流转到结束活动，此事件会被执行",
		"completedCancelEventInfo": "当子流程流转到取消活动，此事件会被执行",
		"completedEventInfo": "当子流程流转到结束或取消活动，此事件会被执行",

		"timer": "定时",
		"timerType": "定时方式",
		"delayTime": "延时指定的分钟后执行",
		"specifyTime": "指定一个时间点执行",
		"specifyMinute": "指定分钟",
		"specifyATime": "指定时间",
		"specifyData": "指定数据路径",

		"invoke": "调用",
		"protocol": "服务协议",
		"invokeType": "调用方式",
		"wsdlAddr": "WSDL地址",
		"method": "调用方法",
		"parameterScript": "参数脚本",
		"addParameter": "增加参数",
		"deleteParameter": "删除参数",
		"responseScript": "响应脚本",

		"use": "使用",
		"getJson": "获取响应内容。如果响应内容是JSON格式的字符串，则返回JSON对象；否则返回原始响应内容。如果调用本平台服务管理中的接口，在接口中返回的数据需放在data中，如:{ \"data\" : [] }",
		"systemRequest": "系统内请求",
		"restAddr": "REST地址",
		"requestBodyScript": "消息体脚本",
		"setRequestBody": "设置消息体内容",
		"requestHeaderScript": "消息头脚本",
		"addHeader": "增加http头信息",
		"delHeader": "删除http头信息",

		"setParameterInfo": "返回一个json对象来设置参数，请查看API文档",
		"setParameterInfo2": "返回一个数组来设置参数，请查看API文档",
		"setRequestBodyInfo": "返回一个json对象来设置消息体内容，请查看API文档",
		"setHeaderInfo": "返回一个json对象来设置消息头，请查看API文档",
		"getJaxws": "获取响应内容。响应类型取决于服务的返回",

		"service": "响应",
		"serviceResponseScript": "服务响应脚本",
		"responseInfo": "通过 this.request.getBody() 获取请求数据。返回 true，驱动流程继续流转；返回 false，表示不符合流转条件，等待下一次调用",

		"runScript": "执行脚本",

		"processType": "处理方式",
		"oneProcess": "只需一人处理",
		"single": "单人",
		"sameTime": "多人同时处理",
		"parallel": "并行",
		"queue": "串行",
		"queueInfo": "多人按顺序处理",
		"grab": "抢办",
		"grabInfo": "谁先打开待办就由谁处理",
		"readForUntreated": "给未处理待办的人发待阅",
		"mergeTask": "合并分支待办",
		"mergeTaskInfo": "（ 如果选“是”，当流程拆分状态下，同一身份在此活动上的多个待办会被合并为一个 ）",

        "mergeTaskProcess": "合并待办处理",
        "mergeTaskProcessInfo": "（ 如果选“是”，当同一人员的不同身份在此活动中产生多个待办时，只需要处理一次 ）",

		"activityGroup": "活动组",
		"opinionGroup": "意见组",
		"taskPerson": "处理人",
		"customData": "自定义属性",

		"identity": "身份",
		"group": "群组",
		"readGroup": "群组",
		"reviewGroup": "群组",
		"specifyTimeoutTime": "设置指定的超时时间",
		"setTimeoutAfterHours": "设置几小时后超时",
		"setTimeoutAfterWorkHours": "设置几个工作小时后超时",
		"activityPower": "权限",
		"allowDelete": "允许删除文件",
		"allowTerminate": "允许终止文件",
		"allowReset": "是否允许重置",
		"resetCount": "重置加签人数",
		"resetRange": "重置加签范围",
		"everyOne": "所有人",
		"directUnit": "直接组织",
		"topUnit": "顶层组织",
		"allowRetract": "是否允许撤回",
		"allowRapid": "允许快速处理",
		"allowAddSplit": "允许增加拆分分支",
		"allowRollback": "允许流程回溯",
		"allowPress": "允许发起办理提醒",
		"allowPause": "允许挂起",
        "allowAddTask": "允许加签",

		"backConfig": "退回配置",
		"allowBack": "允许退回",
		"multiTaskEnable": "多人并行时是否允许退回",
		"multiTaskEnableInfo": "多人并行处理时执行退回会取消其他未处理人的待办，直接退回到指定活动",
		"backType": "退回方式",
		"backPrev": "逐级退回",
		"backAny": "任意活动退回",
		"backDefine": "选择退回活动",
		"backPrevInfo": "逐级退回：用户选择“退回”，则将当前工作退回到上一个处理活动",
		"backAnyInfo": "任意活动退回：用户选择“退回”时，可选择任意一个已经处理过的活动",
		"backDefineInfo": "选择退回活动：定义允许退回的活动，用于可以退回到已允许的活动",
		"backWay": "退回后处理",
		"backWayDefault": "默认",
		"backWayStep": "按流程配置正常流转",
		"backWayJump": "直接回到退回人",
		"backWayCustom": "由退回人决定",

		"backActivitySelectTitle": "选择允许退回的活动",
		"backActivitySelectInfo": "您可以选择当前活动允许退回的活动节点，只有已经流转过的被允许活动，才能退回。您还可以为每个允许退回活动单独设置退回后的处理方式。",


		"beforeBegin": "流程启动前",
		"eventInfo1": "启动流程生成work实例",
		"afterBegin": "流程启动",
		"beforeArrive": "活动到达前",
		"eventInfo2": "执行Arrive操作，活动属性设置",
		"afterArrive": "活动到达后",
		"beforeExecute": "活动执行前",
		"eventInfo3": "执行Execute操作，执行自动活动任务",
		"afterExecute": "活动执行后",
		"beforeInquire": "路由查询前",
		"eventInfo4": "执行Inquire操作，查询到达下一个活动的路由",
		"afterInquire": "路由查询后",
		"beforeEnd": "流程结束前",
		"eventInfo5": "结束流程,生成workCompleted",
		"afterEnd": "流程结束",
		"beforeWorkArrive": "工作到达前",
		"beforeArriveActivity": "文件收到前",
		"afterArriveActivity": "文件收到后",
		"eventInfo6": "执行Arrive操作，活动属性设置，计算可能的活动所有者",
		"eventInfo7": "执行Execute操作，生成待办",
		"manualStay": "等待人工处理时",
		"eventInfo8": "用户流转待办",
		"manualBeforeTask": "待办处理前",
		"eventInfo9": "处理待办，转已办",
		"manualAfterTask": "待办处理后",
		"eventInfo10": "判断是否满足条件进入下一个活动",

		"eventInfo11": "执行所有流程流转任务，直到在某个活动停留或结束",
		"afterProcess": "活动流转完成",

		"updataTime": "更新时间",
		"num": "顺序号",
		"defaultOpinion": "默认意见",
		"opinionRequired": "意见必填",
		"routeType": "路由类型",
		"defaultRoute": "默认路由",
		"sole": "默认选中",
		"defaultRouteSelected": "默认选中路由",
		"backRoute": "回退路由",
		"appendTask": "转交（仅指向同活动时生效）",
		"appendTaskInfo": "转交活动不触发活动事件",
		"appendTo": "转交人员",
		"byRoute": "根据路由选择",
		"appendToScript": "转交人脚本",
		"asyncReturn": "异步返回",
		"expand": "扩展",
		"decisionGroup": "决策组",
		"decisionGroupInfo": "多个决策组请用#号分隔，名称前加整数为排序值。如“1同意#2不同意”。",
		"prefRouting": "优先路由",
		"routeNow": "立即路由",
		"routeNowInfo": "(当选择“是”，多人处理时只要选择此路由，则立即按此路由流转文档)",
		"autoFlowTime": "活动超时时自动流转",
		"autoFlowPerson": "与上一活动处理人相同时自动流转",
		"routeCheck": "路由校验",
		"routeCheckInfo": "(返回true通过，返回string为错误提示)",
		"showName": "显示名称",
		"hideCondition": "隐藏条件",
		"hideConditionInfo": "(返回true隐藏)",
		"select": "选择",

		"title": "标题",
		"titleInfo": "如：请选择部门经理",
		"defaultValue": "默认值",
		"defaultValueScript": "默认值脚本",
		"checkCount": "校验数量",
		"checkCountInfo": "选择的个数不少于",
		"verificationScript": "校验脚本",
		"unitSelectConfig": "人员组织选择配置",
		"selectType": "选择类型",
		"personIdentity": "身份",
		"selectCount": "选择数量",
		"checkEmpower": "检查待办授权",
		"onlyCustom": "只使用自定义选项",
		"unitRange": "组织范围",
		"allUnit": "所有组织",
		"specifyUnit": "指定组织",
		"draftUnit": "拟稿人所在的组织",
		"currentUnit": "当前人所在的组织",
		"inUnit": "直接所属组织",
		"levelIs": "第",
		"levelUnit": "层组织",
		"unitTypeIs": "类型为",
		"deUnit": "的组织",
		"expandNext": "展开下级",
		"selectUnit": "选择组织",
		"formData": "表单数据",
		"dutyRange": "职务范围",
		"all": "所有",
		"all2": "全部",
		"groupRange": "群组范围",
		"specifyGroup": "指定群组",
		"specifyDuty": "指定职务",
		"category": "分类",
		"byUnit": "按组织",
		"byDuty": "按职务",
		"showLevel": "展现层级",
		"byDutyUnit": "按职务所在组织",
		"byIdentityUnit": "按身份所在组织",
		"selectDuty": "选择职务",
		"customOption": "自定义选项",
		"useScriptAddId": "使用脚本添加身份",
		"unitType": "组织类型",
		"exclude": "排除",
		"excludeInfo": "通过编写脚本排除组织、身份、个人和群组的选择范围",
		"firstLevelSelectable": "允许选择第一层",
		"dataStructure": "数据保存",
		"complete": "完整",
		"simple": "精简",

		"section": "区段",
		"enableSection": "启用区段",
		"sectionBy": "区段依据",
		"handler": "处理人",
		"handlerUnit": "处理人所在组织",
		"activityId": "活动ID",
		"splitValue": "拆分值",

		"publish": "发布",
		"publishTarget": "发布目标",
		"cms": "内容管理",
		"table": "数据表",
		"cmsCategory": "内容管理分类",
		"selectCmsCategory": "选择分类",
		"categoryDataPath": "内容管理分类数据路径",
		"sendNotify": "消息推送范围字段",
		"readerFields": "读者字段",
		"authorFields": "作者字段",
		"pictureFields": "首页图片字段",
		"useProcessForm": "使用流程表单",
		"titleField": "标题字段",
		"useProcessFormNote": "注：如果选是，则发布到内容管理文档使用流程表单打开，否则使用内容管理分类设置的表单打开。",
		"setNewPublishData": "返回一个json对象来设置数据，请查看API文档。如",

		"querytable": "数据表",
		"querytableActionNode_add": "↑ 添加数据表配置条目 ↑",
		"querytableActionNode_modify": "↑ 修改数据表配置条目 ↑",
		"querytableInputError": "请选择数据表",
		"queryTableAssignDataScriptError": "数据脚本不能为空",
		"querytableDeleteItemTitle": "删除数据表配置条目确认",
		"querytableDeleteItem": "您确定要删除当前数据表配置条目吗？",
		"queryTableDataBy": "取值",
		"byDataPath": "通过数据路径",
		"byDataScript": "通过数据脚本",
		"publishTableConfig": "数据表发布配置",
		"queryTableDataPathNote": "注：根路径为空，数据表格填数据表格标识.data（如datatable1.data），数据模板填数据模板标识（如datatemplate1）。",
		"orgIdPlaceholder" : "如：departmentLeader"
	}
};
