/* ===========================================================================
 * 教育局端数据统计大屏 · 模拟数据（集中管理，便于替换为真实接口）
 * ---------------------------------------------------------------------------
 * 替换真实接口时：保持下方数据结构不变，用后端返回填充即可。
 *   - REGION_TREE   区域树（省 > 市 > 区），含每个区下属学校
 *   - buildMetrics(scope)  根据筛选范围返回一整套大屏数据
 * scope = { province, city, district, school, range }
 * =========================================================================== */
(function (global) {
  "use strict";

  // ---- 区域树：省 > 市 > 区（每个区带若干学校）------------------------------
  const REGION_TREE = [
    {
      name: "长沙市", districts: [
        { name: "岳麓区", schools: ["长沙市第一中学", "岳麓区第二小学", "麓山国际实验学校", "博才咸嘉小学"] },
        { name: "芙蓉区", schools: ["育英学校", "芙蓉区大同小学", "长沙市实验小学"] },
        { name: "天心区", schools: ["天心区仰天湖小学", "长郡天心实验学校", "青园中信小学"] },
        { name: "雨花区", schools: ["砂子塘小学", "雨花区枫树山小学", "长郡雨花外国语学校"] },
      ],
    },
    {
      name: "株洲市", districts: [
        { name: "天元区", schools: ["天元区白鹤小学", "株洲市外国语学校", "泰山学校"] },
        { name: "芦淞区", schools: ["芦淞区何家坳小学", "株洲市第四中学"] },
      ],
    },
    {
      name: "湘潭市", districts: [
        { name: "岳塘区", schools: ["岳塘区火炬学校", "湘潭市第一中学"] },
        { name: "雨湖区", schools: ["雨湖区风车坪学校", "湘潭市江声实验学校"] },
      ],
    },
    {
      name: "衡阳市", districts: [
        { name: "雁峰区", schools: ["雁峰区成章实验小学", "衡阳市第八中学"] },
        { name: "石鼓区", schools: ["石鼓区人民路小学", "衡阳市第一实验学校"] },
      ],
    },
    {
      name: "岳阳市", districts: [
        { name: "岳阳楼区", schools: ["岳阳楼区朝阳小学", "岳阳市第一中学"] },
        { name: "君山区", schools: ["君山区良心堡镇学校", "岳阳市君山实验学校"] },
      ],
    },
    {
      name: "常德市", districts: [
        { name: "武陵区", schools: ["武陵区育才小学", "常德市第一中学"] },
        { name: "鼎城区", schools: ["鼎城区逸迩阁学校", "常德芷兰实验学校"] },
      ],
    },
  ];
  const PROVINCE = "湖南省";

  // ---- 各市"权重"，用于生成排行/分布/联动的模拟数值 --------------------------
  const CITY_WEIGHT = {
    "长沙市": 1.0, "株洲市": 0.62, "湘潭市": 0.55,
    "衡阳市": 0.7, "岳阳市": 0.66, "常德市": 0.58,
  };

  // 简单确定性伪随机（保证同一筛选下数值稳定）
  function seeded(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return ((h >>> 0) % 1000) / 1000;
  }

  function allSchoolsUnder(province, city, district) {
    const out = [];
    REGION_TREE.forEach((c) => {
      if (city && c.name !== city) return;
      c.districts.forEach((d) => {
        if (district && d.name !== district) return;
        d.schools.forEach((s) => out.push({ school: s, city: c.name, district: d.name }));
      });
    });
    return out;
  }

  // scope -> 规模系数（全部最大，越细化越小），让筛选有"联动感"
  function scopeFactor(scope) {
    let f = 1;
    if (scope.city) f *= (CITY_WEIGHT[scope.city] || 0.5) * 0.9;
    if (scope.district) f *= 0.42 + seeded(scope.district) * 0.3;
    if (scope.school) f *= 0.16 + seeded(scope.school) * 0.12;
    return f;
  }

  const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  function buildMetrics(scope) {
    scope = scope || {};
    const f = scopeFactor(scope);
    const r = (base) => Math.max(1, Math.round(base * f));

    // ---- 核心指标 --------------------------------------------------------
    const schoolsTotal = allSchoolsUnder(scope.province, scope.city, scope.district).length;
    const openedSchools = scope.school ? 1 : Math.max(1, Math.round(schoolsTotal * (0.82 + 0.1 * f)));
    const usedClasses = r(3860);
    const students = r(148600);
    const totalPeriods = r(58200);
    const donePeriods = Math.round(totalPeriods * (0.74 + seeded("done" + (scope.city || "")) * 0.08));
    const completeRate = totalPeriods ? (donePeriods / totalPeriods) * 100 : 0;

    const kpis = [
      { key: "openedSchools", label: "开通学校数", value: openedSchools, unit: "所", trend: +6.2, icon: "school", color: "cyan" },
      { key: "usedClasses", label: "使用班级数", value: usedClasses, unit: "个", trend: +8.5, icon: "grid", color: "blue" },
      { key: "students", label: "学生数量", value: students, unit: "人", trend: +12.4, icon: "users", color: "violet" },
      { key: "totalPeriods", label: "总课时", value: totalPeriods, unit: "节", trend: +5.3, icon: "clock", color: "sky" },
      { key: "donePeriods", label: "已完成课时", value: donePeriods, unit: "节", trend: +7.8, icon: "check", color: "green" },
      { key: "completeRate", label: "课时完成率", value: +completeRate.toFixed(1), unit: "%", trend: +2.6, icon: "gauge", color: "amber" },
    ];

    // ---- 开通学校数增长曲线（按月累计）----------------------------------
    const schoolGrowth = MONTHS.map((m, i) => {
      const progress = Math.pow((i + 1) / MONTHS.length, 0.82);
      const value = Math.max(1, Math.round(openedSchools * (0.22 + 0.78 * progress)));
      return { label: m, value: Math.min(openedSchools, value) };
    });

    // ---- 班级增长（新增 + 累计）----------------------------------------
    let cum = Math.round(1200 * f);
    const classGrowth = MONTHS.map((m, i) => {
      const add = Math.round((80 + seeded(m + "cg") * 120) * f * (0.7 + 0.5 * Math.sin((i / 11) * Math.PI)));
      cum += add;
      return { label: m, add, total: cum };
    });

    // ---- 课时完成情况（环形）------------------------------------------
    const completion = { total: totalPeriods, done: donePeriods, rate: +completeRate.toFixed(1) };

    // ---- 区域完成率排行 ----------------------------------------------
    const regionRanking = REGION_TREE
      .filter((c) => !scope.city || c.name === scope.city)
      .map((c) => ({ name: c.name, rate: +(72 + seeded(c.name + "rate") * 24).toFixed(1) }))
      .sort((a, b) => b.rate - a.rate);

    // ---- 学校活跃度排行（Top）----------------------------------------
    const schoolActivity = allSchoolsUnder(scope.province, scope.city, scope.district)
      .map((s) => ({ name: s.school, city: s.city, score: Math.round(2200 + seeded(s.school + "act") * 3600) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // ---- 区域开课分布（用于地图占位/热力）----------------------------
    const regionDist = REGION_TREE.map((c) => ({
      name: c.name,
      value: r(Math.round(380 * (CITY_WEIGHT[c.name] || 0.5))),
      heat: +(0.4 + seeded(c.name + "heat") * 0.6).toFixed(2),
    })).sort((a, b) => b.value - a.value);

    return {
      updatedAt: new Date(),
      scope, kpis, schoolGrowth, classGrowth, completion, regionRanking, schoolActivity, regionDist,
    };
  }

  global.BigScreenData = { PROVINCE, REGION_TREE, allSchoolsUnder, buildMetrics, MONTHS };
})(window);
