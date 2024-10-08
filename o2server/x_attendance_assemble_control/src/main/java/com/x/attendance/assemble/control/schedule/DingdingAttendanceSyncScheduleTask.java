package com.x.attendance.assemble.control.schedule;

import java.util.Date;

import org.quartz.JobExecutionContext;

import com.x.attendance.assemble.control.ThisApplication;
import com.x.attendance.entity.DingdingQywxSyncRecord;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.schedule.AbstractJob;
import com.x.base.core.project.tools.DateTools;

/**
 * 钉钉考勤结果同步的定时器
 * 每天晚上1点同步前一天的结果
 * Created by fancyLou on 2020-03-26.
 * Copyright © 2020 O2. All rights reserved.
 */
public class DingdingAttendanceSyncScheduleTask extends AbstractJob {

    private static final Logger logger = LoggerFactory.getLogger(DingdingAttendanceSyncScheduleTask.class);

    @Override
    public void schedule(JobExecutionContext jobExecutionContext) throws Exception {
        try ( EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
            //前一天 0点到23点
            Date from = new Date();
            from = DateTools.addDay(from, -1);
            from = DateTools.floorDate(from, null);
            String toDay = DateTools.format(from, DateTools.format_yyyyMMdd);
            Date to = DateTools.parse(toDay+" 23:59:59");

            DingdingQywxSyncRecord record = new DingdingQywxSyncRecord();
            record.setDateFrom(from.getTime());
            record.setDateTo(to.getTime());
            record.setStartTime(new Date());
            record.setType(DingdingQywxSyncRecord.syncType_dingding);
            record.setStatus(DingdingQywxSyncRecord.status_loading);
            emc.beginTransaction(DingdingQywxSyncRecord.class);
            emc.persist(record);
            emc.commit();
            ThisApplication.dingdingQueue.send(record);
        }
    }
}
