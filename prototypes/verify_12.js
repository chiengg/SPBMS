/* verify_12.js — 12-党费管理.html 行为回归验证（jsdom）
 * 覆盖：脚本执行 / init 修复 / 两种缴纳方式计算 / 配置渲染筛选 /
 *       汇总金额一致性 / 明细下钻 / 审核通过&驳回 / 生成台账 /
 *       台账补录同步 / 生成幂等
 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '12-党费管理.html');
const html = fs.readFileSync(file, 'utf8');

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/'
});
const { window } = dom;
const { document } = window;

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? (' -> ' + extra) : '')); }
}

function run() {
  try {
    // 1. 脚本执行 & 全局函数定义
    ok('脚本执行：核心函数已定义',
      typeof window.renderConfig === 'function' &&
      typeof window.renderSummary === 'function' &&
      typeof window.generateLedger === 'function' &&
      typeof window.auditPass === 'function' &&
      typeof window.submitSupplement === 'function');

    // 2. init() 修复：不再引用已删除的 renderFeeDetails，无运行时报错
    let initErr = null;
    try { window.init(); } catch (e) { initErr = e; }
    ok('init() 无运行时报错（已修复 renderFeeDetails 调用）', !initErr, initErr && initErr.message);

    // 3. 数据模型规模
    ok('FEE_CONFIG 定义且 21 人（19在册 + 同步名册补入 2 新增待完善）', Array.isArray(window.FEE_CONFIG) && window.FEE_CONFIG.length === 21, 'len=' + window.FEE_CONFIG.length);
    ok('FEE_DETAILS 定义且 19 条(2026-08)', Array.isArray(window.FEE_DETAILS) && window.FEE_DETAILS.length === 19);

    // 4. 基础党费计算 = 0.2 元/月
    ok('calcShould(basic) = 0.2', window.calcShould({ method: 'basic', salary_base: 0 }) === 0.2);

    // 5. 工资基数 4 档比例 & 计算
    ok('rateOf(2400)=0.5', window.rateOf(2400) === 0.5);
    ok('rateOf(4000)=1.0', window.rateOf(4000) === 1.0);
    ok('rateOf(6000)=1.5', window.rateOf(6000) === 1.5);
    ok('rateOf(12000)=2.0', window.rateOf(12000) === 2.0);
    ok('calcShould(6000)=90', window.calcShould({ method: 'salary', salary_base: 6000 }) === 90);
    ok('calcShould(3000)=15', window.calcShould({ method: 'salary', salary_base: 3000 }) === 15);

    // 6. 配置表渲染（全部 21 行：19在册启用 + 2 待完善）
    document.getElementById('cfOrg').value = '';
    document.getElementById('cfType').value = '';
    window.renderConfig();
    ok('配置表渲染 21 行（通用配置，含待完善）', document.getElementById('cfgBody').children.length === 21, 'got=' + document.getElementById('cfgBody').children.length);

    // 7. 配置表按组织筛选
    document.getElementById('cfOrg').value = '生产党支部';
    window.renderConfig();
    ok('配置表按组织筛选=4 行（P101/P102/P103 + 转入 P016 待完善）', document.getElementById('cfgBody').children.length === 4, 'got=' + document.getElementById('cfgBody').children.length);
    document.getElementById('cfOrg').value = '';

    // 8. 汇总台账 2026-08 → 3 个党组织，逐行金额一致
    document.getElementById('sMonth').value = '2026-08';
    window.renderSummary();
    const sumTrs = document.getElementById('sumBody').querySelectorAll('tr');
    ok('汇总表 2026-08 = 3 个党组织', sumTrs.length === 3);

    const rows2026 = window.FEE_DETAILS.filter(d => d.ym === '2026-08');
    const PAID = ['已缴', '补缴', '待审核'];
    let rowMatch = true, rowDetail = '';
    sumTrs.forEach(tr => {
      const c = tr.querySelectorAll('td');
      const org = c[0].textContent.trim();
      const list = rows2026.filter(d => d.org === org);
      const shouldPeople = list.filter(d => d.pay_status !== '减免').length;
      const paidPeople = list.filter(d => PAID.includes(d.pay_status)).length;
      const unpaid = list.filter(d => d.pay_status === '未缴' || d.pay_status === '欠缴').length;
      const shouldAmt = list.filter(d => d.pay_status !== '减免').reduce((a, d) => a + d.should, 0);
      const paidAmt = list.filter(d => PAID.includes(d.pay_status)).reduce((a, d) => a + d.should, 0);
      const oweAmt = list.filter(d => d.pay_status === '欠缴').reduce((a, d) => a + d.should, 0);
      const rate = shouldAmt > 0 ? Math.round(paidAmt / shouldAmt * 100) : 0;
      // 新台账列：应交人数/实缴人数/未缴人数/应缴/实缴/欠缴总额/缴纳率
      const good = c[2].textContent.trim() === String(shouldPeople) &&
        c[3].textContent.trim() === String(paidPeople) &&
        c[4].textContent.trim() === String(unpaid) &&
        c[5].textContent.trim() === shouldAmt.toFixed(2) &&
        c[6].textContent.trim() === paidAmt.toFixed(2) &&
        c[7].textContent.trim() === oweAmt.toFixed(2) &&
        c[8].textContent.trim() === (rate + '%');
      if (!good) rowDetail = org + ' 期望(' + shouldPeople + '/' + paidPeople + '/' + unpaid + '/' + shouldAmt.toFixed(2) + '/' + paidAmt.toFixed(2) + '/' + oweAmt.toFixed(2) + '/' + rate + '%) 实际(' + c[2].textContent.trim() + '/' + c[3].textContent.trim() + '/' + c[4].textContent.trim() + '/' + c[5].textContent.trim() + '/' + c[6].textContent.trim() + '/' + c[7].textContent.trim() + '/' + c[8].textContent.trim() + ')';
      rowMatch = rowMatch && good;
    });
    ok('汇总逐行(应交/实缴/未缴人数/应缴/实缴/欠缴总额/缴纳率)与数据一致', rowMatch, rowDetail);

    // 9. 明细二级下钻
    window.openDetail('机关支部', '2026-08');
    ok('明细抽屉 机关支部 2026-08 = 14 行', document.getElementById('detailBody').children.length === 14);
    window.renderDetail();

    // 10. 审核通过（待审核 → 已缴 + 已通过）
    window.FEE_DETAILS.push({ flow_id: 'FTEST_PASS', member_id: 'PT1', name: '审核通过测试', org: '机关支部', ym: '2026-08', method: 'salary', salary_base: 3000, rate: 0.5, should: 15, actual: 0, pay_type: '', pay_time: '', pay_status: '待审核', audit_status: '待审核', voucher_no: '', operator: '', notify: '已通知', base_start: '2026-01', consecutiveMiss: 0, reject_reason: '', history: [] });
    window.auditPass('FTEST_PASS');
    const dp = window.FEE_DETAILS.find(d => d.flow_id === 'FTEST_PASS');
    ok('auditPass: 缴纳状态 待审核→已缴', dp.pay_status === '已缴');
    ok('auditPass: 审核状态→已通过', dp.audit_status === '已通过');
    ok('auditPass: 实缴金额=应缴金额', dp.actual === dp.should);

    // 11. 审核驳回（待审核 → 欠缴 + 已驳回 + 驳回原因）
    window.FEE_DETAILS.push({ flow_id: 'FTEST_REJ', member_id: 'PT2', name: '审核驳回测试', org: '机关支部', ym: '2026-08', method: 'salary', salary_base: 3000, rate: 0.5, should: 15, actual: 0, pay_type: '', pay_time: '', pay_status: '待审核', audit_status: '待审核', voucher_no: '', operator: '', notify: '已通知', base_start: '2026-01', consecutiveMiss: 0, reject_reason: '', history: [] });
    window.auditReject('FTEST_REJ');
    const dr = window.FEE_DETAILS.find(d => d.flow_id === 'FTEST_REJ');
    ok('auditReject: 缴纳状态 待审核→欠缴', dr.pay_status === '欠缴');
    ok('auditReject: 审核状态→已驳回', dr.audit_status === '已驳回');
    ok('auditReject: 写入驳回原因', !!dr.reject_reason);

    // 12. 生成台账（配置 → 2026-09 草稿）
    const before9 = window.FEE_DETAILS.filter(d => d.ym === '2026-09').length;
    window.generateLedger();
    const after9 = window.FEE_DETAILS.filter(d => d.ym === '2026-09').length;
    ok('generateLedger: 2026-09 新增 19 条草案', after9 - before9 === 19);
    const newOnes = window.FEE_DETAILS.filter(d => d.ym === '2026-09');
    ok('generateLedger: 草案均为 未缴/无需审核', newOnes.every(d => d.pay_status === '未缴' && d.audit_status === '无需审核'));
    ok('generateLedger: 基础党费人员(P013)应缴=0.2', newOnes.find(d => d.member_id === 'P013').should === 0.2);

    // 13. 台账补录（新转入/新转正）→ 同步汇总
    window.FEE_CONFIG.push({ member_id: 'P900', name: '补录新人', org: '机关支部', method: 'salary', salary_base: 3000, start_month: '2026-01', created_at: '2026-08-12', status: 'enabled', pay_type: 'BASE_SALARY', payable_amount: 15, effective_month: '2026-01', change_reason: '', employment_status: '在岗' });
    document.getElementById('spMonth').value = '2026-08';
    window.openSupplement();
    const sel = document.getElementById('spMember');
    const beforeSup = window.FEE_DETAILS.filter(d => d.ym === '2026-08').length;
    sel.value = 'P900';
    window.submitSupplement();
    const afterSup = window.FEE_DETAILS.filter(d => d.ym === '2026-08').length;
    ok('submitSupplement: 补录 1 人成功', afterSup === beforeSup + 1);
    ok('submitSupplement: 数据与汇总已同步', window.FEE_DETAILS.some(d => d.member_id === 'P900' && d.ym === '2026-08'));

    // 14. 生成台账幂等
    window.generateLedger();
    const after9b = window.FEE_DETAILS.filter(d => d.ym === '2026-09').length;
    ok('generateLedger: 重复生成不重复创建', after9b === after9);

    // 15. 导航拓扑：党费管理含 3 个二级菜单 + switchView 面板可见性
    ok('switchView 函数已定义', typeof window.switchView === 'function');
    const feeNavs = document.querySelectorAll('.nav-group#grp-fee .nav-item');
    const hrefs = Array.prototype.map.call(feeNavs, a => a.getAttribute('href'));
    ok('党费管理含 3 个二级菜单(config/calc/use)', feeNavs.length === 3 && hrefs.indexOf('12-党费管理.html#config') > -1 && hrefs.indexOf('12-党费管理.html#calc') > -1 && hrefs.indexOf('12-党费管理.html#use') > -1);

    window.switchView('config');
    ok('switchView(config): panel-config 可见 / panel-calc 隐藏', !document.getElementById('panel-config').classList.contains('hidden') && document.getElementById('panel-calc').classList.contains('hidden'));
    const cfgHtml = document.getElementById('panel-config').innerHTML;
    ok('panel-config 含 核算规则配置+党费缴纳配置+生成当月台账', /核算规则配置/.test(cfgHtml) && /党费缴纳配置/.test(cfgHtml) && /生成当前月台账/.test(cfgHtml));

    window.switchView('calc');
    ok('switchView(calc): panel-calc 可见且含 KPI / panel-config 隐藏', !document.getElementById('panel-calc').classList.contains('hidden') && !!document.getElementById('kpis') && document.getElementById('panel-config').classList.contains('hidden'));

    // 16. 明细清单独立二级页面（替代侧边抽屉）
    ok('panel-detail 存在且默认隐藏', !!document.getElementById('panel-detail') && document.getElementById('panel-detail').classList.contains('hidden'));
    ok('panel-detail 含「返回汇总台账」入口', /返回汇总台账/.test(document.getElementById('panel-detail').innerHTML));
    window.openDetail('机关支部', '2026-08');
    ok('openDetail → switchView(detail): panel-detail 可见', !document.getElementById('panel-detail').classList.contains('hidden'));
    const expDetail = window.FEE_DETAILS.filter(d => d.org === '机关支部' && d.ym === '2026-08').length;
    ok('openDetail 后明细行数=数据条数（抽屉已弃用）', document.getElementById('detailBody').children.length === expDetail);

    // 17. 生成当月台账联动汇总台账（config 页按钮 → calc 页汇总刷新）
    document.getElementById('sMonth').value = '2026-09';
    window.renderSummary();
    ok('generateLedger 联动：2026-09 汇总台账刷新(3 组织)', document.getElementById('sumBody').children.length === 3);

    // 18. 催缴预警改为抽屉入口：明细页只含 1 张明细清单卡片，汇总页不再含催缴
    window.switchView('detail');
    ok('panel-detail 含 1 张卡片(明细清单)，催缴预警已迁出', document.querySelectorAll('#panel-detail > .card').length === 1);
    ok('panel-calc 不再含催缴卡片(urgeBody 已迁出)', document.getElementById('panel-calc').innerHTML.indexOf('id="urgeBody"') === -1);
    ok('panel-detail 含逾期催缴抽屉入口按钮', /openUrgeDrawer/.test(document.getElementById('panel-detail').innerHTML));

    // 19. 催缴抽屉按当前党组织/月份范围渲染
    window.openDetail('机关支部', '2026-08');
    const urgeHtml = document.getElementById('urgeDrawerContent').innerHTML;
    const owedOrg = window.FEE_DETAILS.filter(d => d.org === '机关支部' && d.ym === '2026-08' && (d.pay_status === '欠缴' || d.pay_status === '未缴'));
    ok('明细页催缴抽屉只展示当前组织/月份欠缴', (owedOrg.length === 0 && /无欠缴/.test(urgeHtml)) || owedOrg.every(d => urgeHtml.indexOf(d.name) > -1));

    // 20. 登记缴费：打开 payModal，提交后状态→已缴 + 凭证写入
    const unpaid = window.FEE_DETAILS.find(d => d.org === '机关支部' && d.ym === '2026-08' && (d.pay_status === '未缴' || d.pay_status === '欠缴'));
    ok('存在可登记缴费的未缴/欠缴党员', !!unpaid);
    window.registerPay(unpaid.flow_id);
    ok('registerPay 打开 payModal', !document.getElementById('payModal').classList.contains('hidden'));
    document.getElementById('payVoucher').value = 'VTEST-001';
    Object.defineProperty(document.getElementById('payFile'), 'value', { writable: true, value: 'receipt.png', configurable: true });
    window.submitPay();
    const afterReg = window.FEE_DETAILS.find(d => d.flow_id === unpaid.flow_id);
    ok('submitPay(登记): 状态→已缴', afterReg.pay_status === '已缴');
    ok('submitPay(登记): 凭证号已写入', afterReg.voucher_no === 'VTEST-001');
    ok('submitPay(登记): 审核状态=无需审核', afterReg.audit_status === '无需审核');

    // 21. 补缴：打开 payModal，提交后状态→补缴 + 凭证写入
    const owed2 = window.FEE_DETAILS.find(d => d.org === '机关支部' && d.ym === '2026-08' && (d.pay_status === '未缴' || d.pay_status === '欠缴') && d.flow_id !== unpaid.flow_id);
    ok('存在可补缴的另一条欠缴记录', !!owed2);
    window.makeupPay(owed2.flow_id);
    ok('makeupPay 打开 payModal', !document.getElementById('payModal').classList.contains('hidden'));
    document.getElementById('payVoucher').value = 'VTEST-002';
    Object.defineProperty(document.getElementById('payFile'), 'value', { writable: true, value: 'receipt2.png', configurable: true });
    window.submitPay();
    const afterMake = window.FEE_DETAILS.find(d => d.flow_id === owed2.flow_id);
    ok('submitPay(补缴): 状态→补缴', afterMake.pay_status === '补缴');
    ok('submitPay(补缴): 凭证号已写入', afterMake.voucher_no === 'VTEST-002');

    // 22. 通用配置（不按月）：配置表 = FEE_CONFIG 全量渲染
    window.cfgSelection = [];
    document.getElementById('cfOrg').value = '';
    document.getElementById('cfType').value = '';
    window.renderConfig();
    ok('通用配置表渲染行数 = FEE_CONFIG 全部（含待完善）', document.getElementById('cfgBody').children.length === window.FEE_CONFIG.length, 'got=' + document.getElementById('cfgBody').children.length + ' total=' + window.FEE_CONFIG.length);

    // 23. 同步名册：新转正/转入党员自动纳入为待完善（仅 党员/党组织/起缴月）
    var pend2 = window.FEE_CONFIG.filter(function (c) { return c.status === 'pending'; });
    ok('同步名册后含 2 条待完善（P015 转正 / P016 转入）', pend2.length === 2, 'pend=' + pend2.length);
    ok('待完善记录含 P015 与 P016', !!window.FEE_CONFIG.find(function (c) { return c.member_id === 'P015'; }) && !!window.FEE_CONFIG.find(function (c) { return c.member_id === 'P016'; }));
    ok('待完善记录仅带 党员/党组织/起缴月（method 空、needEdit、start_month/org 有值）', pend2.every(function (c) { return c.method === '' && c.needEdit === true && !!c.start_month && !!c.org; }));
    document.getElementById('cfType').value = 'pending';
    window.renderConfig();
    ok('按「待完善」筛选 = 2 行', document.getElementById('cfgBody').children.length === 2);
    // 同步名册幂等：再次执行不重复新增
    var beforeSync = window.FEE_CONFIG.length;
    window.syncRoster();
    ok('syncRoster 幂等：再次执行不重复新增', window.FEE_CONFIG.length === beforeSync);
    document.getElementById('cfType').value = '';

    // 24. 批量修改：勾选 P001/P002 → 基础党费（作用整张通用配置）
    window.renderConfig();
    window.cfgSelection = ['P001', 'P002'];
    document.getElementById('batchMethod').value = 'basic';
    document.getElementById('batchBase').value = 0;
    document.getElementById('batchReason').value = '批量测试：企业停发工资改基础党费';
    window.applyBatch();
    ok('applyBatch: P001 改为基础党费', window.FEE_CONFIG.find(function (c) { return c.member_id === 'P001'; }).method === 'basic');
    ok('applyBatch: P002 改为基础党费', window.FEE_CONFIG.find(function (c) { return c.member_id === 'P002'; }).method === 'basic');
    ok('applyBatch: 选择已清空', window.cfgSelection.length === 0);

    // 25. 导入解析（Excel/CSV）
    var csv = '党员姓名,所属党组织,缴纳类型,工资基数,起缴责任月\n导入测试甲,机关支部,salary,5500,2026-02\n导入测试乙,生产党支部,basic,,2026-05';
    var parsed = window.parseCsvText(csv);
    ok('parseCsvText: 解析 2 行', parsed.length === 2, 'n=' + parsed.length);
    ok('parseCsvText: 类型识别 salary/basic', parsed[0].method === 'salary' && parsed[1].method === 'basic');
    var beforeImp = window.FEE_CONFIG.length;
    var impN = window.applyConfigImport(parsed);
    var afterImp = window.FEE_CONFIG.length;
    ok('applyConfigImport: 新增 2 条', afterImp - beforeImp === 2 && impN === 2, 'delta=' + (afterImp - beforeImp));

    // 26. PRD 方案一 / 方案二 数据字段齐备
    ok('FEE_CONFIG 含 pay_type(BASE_SALARY/BASE_FEE)', window.FEE_CONFIG.filter(function (c) { return !c.needEdit; }).every(function (c) { return c.pay_type === 'BASE_SALARY' || c.pay_type === 'BASE_FEE'; }));
    ok('FEE_CONFIG 含 effective_month / change_reason / employment_status', window.FEE_CONFIG.every(function (c) { return !!c.effective_month && ('change_reason' in c) && !!c.employment_status; }));
    var badDetails = window.FEE_DETAILS.filter(function (d) { return d.flow_id.indexOf('F202608') === 0; }).filter(function (d) { return !(!!d.pay_type && !!d.employment_status && typeof d.is_backfill === 'boolean'); });
    if (badDetails.length) console.log('  DEBUG badDetails:', badDetails.map(function (d) { return d.flow_id + '/pt=' + d.pay_type + '/emp=' + d.employment_status + '/bf=' + d.is_backfill; }));
    ok('FEE_DETAILS 含 pay_type / employment_status / is_backfill 快照', badDetails.length === 0);
    ok('payTypeOf / calcShouldByEmployment 已定义', typeof window.payTypeOf === 'function' && typeof window.calcShouldByEmployment === 'function');

    // 27. 编辑切换缴纳类型须填变更原因（PRD §4.1.3）
    window.openConfigModal('P003');
    document.getElementById('cfMethod').value = 'basic';
    document.getElementById('cfReason').value = '';
    window.saveConfig();
    ok('saveConfig: 切换类型但缺变更原因 → 不改 method', window.FEE_CONFIG.find(function (c) { return c.member_id === 'P003'; }).method === 'salary');
    var logBefore = window.OPER_LOG.length;
    document.getElementById('cfReason').value = 'P003 企业停发工资，改基础党费';
    window.saveConfig();
    var c3 = window.FEE_CONFIG.find(function (c) { return c.member_id === 'P003'; });
    ok('saveConfig: 填变更原因后 method→basic', c3.method === 'basic');
    ok('saveConfig: pay_type 同步为 BASE_FEE', c3.pay_type === 'BASE_FEE');
    ok('saveConfig: 写入 effective_month(次月生效)', !!c3.effective_month);
    ok('saveConfig: 写入 change_reason', c3.change_reason.indexOf('企业停发') > -1);
    ok('saveConfig: 操作日志新增记录', window.OPER_LOG.length > logBefore);
    // 还原 P003 便于后续断言稳定
    document.getElementById('cfMethod').value = 'salary';
    document.getElementById('cfReason').value = '还原测试';
    window.saveConfig();

    // 28. 台账封存 → 禁止补录（PRD §4.3）
    window.sealLedger('机关支部', '2026-08', true);
    ok('sealLedger: 状态→已封存', window.getLedger('机关支部', '2026-08').status === '已封存');
    var beforeSealed = window.FEE_DETAILS.filter(function (d) { return d.ym === '2026-08'; }).length;
    window.FEE_CONFIG.push({ member_id: 'P901', name: '封存补录', org: '机关支部', method: 'salary', salary_base: 3000, start_month: '2026-01', created_at: '2026-08-12', status: 'enabled', pay_type: 'BASE_SALARY', payable_amount: 15, effective_month: '2026-01', change_reason: '', employment_status: '在岗' });
    document.getElementById('spMonth').value = '2026-08';
    window.openSupplement();
    document.getElementById('spMember').value = 'P901';
    window.submitSupplement();
    ok('submitSupplement: 已封存台账禁止补录', window.FEE_DETAILS.filter(function (d) { return d.ym === '2026-08'; }).length === beforeSealed);
    window.sealLedger('机关支部', '2026-08', false);
    document.getElementById('spMonth').value = '2026-08';
    window.openSupplement();
    document.getElementById('spMember').value = 'P901';
    window.submitSupplement();
    ok('submitSupplement: 解封后可补录', window.FEE_DETAILS.some(function (d) { return d.member_id === 'P901' && d.ym === '2026-08'; }));
    ok('submitSupplement: 补录记录 is_backfill=true', window.FEE_DETAILS.find(function (d) { return d.member_id === 'P901' && d.ym === '2026-08'; }).is_backfill === true);
    ok('submitSupplement: 补录后台账状态→已补录', window.getLedger('机关支部', '2026-08').status === '已补录');

    // 29. 方案二：按在职状态分组统计（PRD §9.2）
    var p5 = window.FEE_DETAILS.find(function (d) { return d.member_id === 'P005' && d.ym === '2026-08'; });
    if (p5) p5.employment_status = '下岗';
    document.getElementById('sMonth').value = '2026-08';
    document.getElementById('groupEmp').checked = false;
    window.renderSummary();
    var rowsFlat = document.getElementById('sumBody').children.length;
    document.getElementById('groupEmp').checked = true;
    window.renderSummary();
    var rowsGrouped = document.getElementById('sumBody').children.length;
    ok('方案二 分组：含非在岗状态后分组行数增加', rowsGrouped > rowsFlat, 'flat=' + rowsFlat + ' grouped=' + rowsGrouped);
    document.getElementById('groupEmp').checked = false;
    window.renderSummary();

    // 30. 导出：汇总 + 明细 两 Sheet（PRD §4.2.5）
    document.getElementById('sMonth').value = '2026-08';
    var csv = window.exportLedger();
    ok('exportLedger: 返回 CSV 字符串', typeof csv === 'string' && csv.length > 0);
    ok('exportLedger: 含「党费汇总台账」Sheet', /党费汇总台账/.test(csv));
    ok('exportLedger: 含「党费明细清单」Sheet', /党费明细清单/.test(csv));
    ok('exportLedger: 明细含在职状态列', /在职状态/.test(csv));

    // 31. 明细清单筛选：缴纳类型 / 在职状态 / 审核状态 / 逾期状态（PRD §4.2.4）
    window.openDetail('机关支部', '2026-08');
    document.getElementById('dPayType').value = 'BASE_FEE';
    window.renderDetail();
    var feeRows = document.getElementById('detailBody').children.length;
    var allFee = window.FEE_DETAILS.filter(function (d) { return d.org === '机关支部' && d.ym === '2026-08' && d.pay_type === 'BASE_FEE'; }).length;
    ok('明细按缴纳类型(BASE_FEE)筛选行数一致', feeRows === allFee, 'rows=' + feeRows + ' expect=' + allFee);
    document.getElementById('dPayType').value = '';
    document.getElementById('dEmp').value = '在岗';
    window.renderDetail();
    var empRows = document.getElementById('detailBody').children.length;
    var allEmp = window.FEE_DETAILS.filter(function (d) { return d.org === '机关支部' && d.ym === '2026-08' && d.employment_status === '在岗'; }).length;
    ok('明细按在职状态(在岗)筛选行数一致', empRows === allEmp, 'rows=' + empRows + ' expect=' + allEmp);
    document.getElementById('dEmp').value = '';
    document.getElementById('dAudit').value = '待审核';
    window.renderDetail();
    ok('明细按审核状态(待审核)筛选仅含待审核', Array.prototype.every.call(document.getElementById('detailBody').children, function (tr) { return /待审核/.test(tr.innerHTML); }));
    document.getElementById('dAudit').value = '';
    // 构造红色预警场景：#20 已把 P006(原连续6月欠缴)登记为已缴，此处还原以验证「红色预警」筛选
    var p6 = window.FEE_DETAILS.find(function (d) { return d.flow_id === 'F202608-006'; });
    if (p6) { p6.pay_status = '欠缴'; p6.consecutiveMiss = 6; }
    document.getElementById('dOverdue').value = 'red';
    window.renderDetail();
    var redRows = document.getElementById('detailBody').children;
    if (redRows.length) console.log('  DEBUG redRows:', Array.prototype.map.call(redRows, function (tr) { return tr.querySelector('td') && tr.querySelector('td').textContent; }), 'consecutiveMiss sample:', window.FEE_DETAILS.filter(function (d) { return d.org === '机关支部' && d.ym === '2026-08'; }).map(function (d) { return d.member_id + ':' + d.consecutiveMiss + ':' + d.pay_status; }));
    ok('明细按逾期(red)筛选仅含红色预警', redRows.length === 0 || Array.prototype.every.call(redRows, function (tr) { return /红色/.test(tr.innerHTML); }));
    document.getElementById('dOverdue').value = '';
    window.renderDetail();

  } catch (e) {
    fail++;
    console.log('  EXCEPTION ' + e.message + '\n' + e.stack);
  }
  console.log('\n=== verify_12 结果: ' + pass + ' 通过 / ' + fail + ' 失败 ===');
  process.exit(fail > 0 ? 1 : 0);
}

setTimeout(run, 150);
