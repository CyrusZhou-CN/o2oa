package com.x.organization.assemble.control.jaxrs.unitduty;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.apache.commons.lang3.StringUtils;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.project.cache.Cache.CacheKey;
import com.x.base.core.project.cache.CacheManager;
import com.x.base.core.project.gson.GsonPropertyObject;
import com.x.base.core.project.http.ActionResult;
import com.x.organization.assemble.control.Business;
import com.x.organization.core.entity.UnitDuty;
import com.x.organization.core.entity.UnitDuty_;

class ActionDistinctName extends BaseAction {

	ActionResult<Wo> execute() throws Exception {
		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
			Business business = new Business(emc);
			ActionResult<Wo> result = new ActionResult<>();
			CacheKey cacheKey = new CacheKey(this.getClass());
			Optional<?> optional = CacheManager.get(business.cache(), cacheKey);
			if (optional.isPresent()) {
				result.setData((Wo) optional.get());
			} else {
				Wo wo = this.list(business);
				CacheManager.put(business.cache(), cacheKey, wo);
				result.setData(wo);
			}
			return result;
		}
	}

	public static class Wo extends GsonPropertyObject {

		/** 组织职务名称 */
		private List<String> nameList = new ArrayList<>();

		public List<String> getNameList() {
			return nameList;
		}

		public void setNameList(List<String> nameList) {
			this.nameList = nameList;
		}
	}

	private Wo list(Business business) throws Exception {
		EntityManager em = business.entityManagerContainer().get(UnitDuty.class);
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<String> cq = cb.createQuery(String.class);
		Root<UnitDuty> root = cq.from(UnitDuty.class);
		cq.select(root.get(UnitDuty_.name));
		List<String> list = em.createQuery(cq).getResultList().stream().distinct().collect(Collectors.toList());
		list = list.stream().filter(o -> {
			return StringUtils.isNotEmpty(o);
		}).sorted().collect(Collectors.toList());
		Wo wo = new Wo();
		wo.setNameList(list);
		return wo;
	}

}
