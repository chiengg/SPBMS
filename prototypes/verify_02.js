/* verify_02_smoke.js — 02-组织与党员.html 方案二「在职状态」冒烟验证 */
const { JSDOM } = require('jsdom');
const fs = require('fs');

const SRC = '/Users/chien/Documents/4洛克/党建管理系统/prototypes/02-组织与党员.html';
let html = fs.readFileSync(SRC, 'utf8');
// 暴露 let 声明的内部状态（jsdom 中 let 不挂到 window），仅用于测试读取/注入
html = html.replace('</body>', '<script>window.__ARC_OVERRIDES=ARC_OVERRIDES;window.__CUR=function(){return CUR_ARCHIVE;};window.__ROSTER_TOTAL=function(){return ROSTER_TOTAL;};</script></body>');

let pass = 0, fail = 0;
function ok(name, cond, extra) { if (cond) { pass++; console.log('  PASS ' + name); } else { fail++; console.log('  FAIL ' + name + (extra ? (' -> ' + extra) : '')); } }

try {
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/' });
  const { window } = dom;
  const { document } = window;

  ok('脚本执行：renderRoster/empTag2/openArchive/archiveHTML 已定义',
    typeof window.renderRoster === 'function' && typeof window.empTag2 === 'function' &&
    typeof window.openArchive === 'function' && typeof window.archiveHTML === 'function');

  // 名册数据含 employment_status，且取值覆盖多类
  const all = window.scopeMembers('中共XX集团委员会');
  ok('scopeMembers 返回成员', Array.isArray(all) && all.length > 0, 'n=' + all.length);
  ok('成员均含 employment_status', all.every(m => !!m.employment_status));
  const kinds = {};
  all.forEach(m => { kinds[m.employment_status] = (kinds[m.employment_status] || 0) + 1; });
  ok('在职状态取值多元（含在岗/离退休/其他）', !!kinds['在岗'] && !!kinds['离退休'], JSON.stringify(kinds));

  // 表头含「在职状态」列
  ok('表头含「在职状态」列', /在职状态/.test(document.querySelector('#ov-roster table thead').innerHTML));
  ok('名册已渲染行（默认全部）', document.getElementById('rosterBody').children.length > 0);

  // 筛选：离退休 —— 校验（分页后）所有可见行均为离退休
  document.getElementById('fEmp').value = '离退休';
  window.refreshRoster();
  const retireRows = Array.from(document.getElementById('rosterBody').children);
  ok('筛选 离退休：可见行全部为离退休', retireRows.every(tr => /离退休/.test(tr.innerHTML)) && retireRows.length > 0, 'rows=' + retireRows.length);
  ok('筛选 离退休：总数=离退休成员数', window.__ROSTER_TOTAL() === kinds['离退休'], 'total=' + window.__ROSTER_TOTAL() + ' expect=' + kinds['离退休']);

  // 筛选：下岗
  document.getElementById('fEmp').value = '下岗';
  window.refreshRoster();
  const xgRows = Array.from(document.getElementById('rosterBody').children);
  ok('筛选 下岗：可见行全部为下岗', xgRows.every(tr => /下岗/.test(tr.innerHTML)) && xgRows.length > 0, 'rows=' + xgRows.length);
  ok('筛选 下岗：总数=下岗成员数', window.__ROSTER_TOTAL() === kinds['下岗'], 'total=' + window.__ROSTER_TOTAL() + ' expect=' + kinds['下岗']);

  // 重置
  document.getElementById('fEmp').value = '全部';
  window.refreshRoster();

  // openArchive 写入 employment_status（通过暴露的 __CUR 读取）
  window.openArchive('张三*', '机关支部', '正式党员', '2020-01-01', 'id', 'phone', '在岗');
  ok('openArchive 写入 CUR_ARCHIVE.employment_status=在岗', window.__CUR() && window.__CUR().employment_status === '在岗', JSON.stringify(window.__CUR()));
  ok('档案抽屉含「在职状态」标签(在岗=green)', /在职状态[\s\S]*tag green/.test(document.getElementById('arcDrawerBody').innerHTML));

  // 变更日志路径：注入 empLog 覆盖项，验证档案「操作记录」渲染在职状态变更
  window.__ARC_OVERRIDES['李四*'] = { employment_status: '停薪留职', empLog: [{ date: '2026-08-13', text: '在职状态变更：在岗 → 停薪留职 · 同步党费核算（PRD §9）' }] };
  window.openArchive('李四*', '机关支部', '正式党员', '2020-01-01', 'id', 'phone', '停薪留职');
  ok('档案抽屉含变更日志（在职状态变更）', /在职状态变更/.test(document.getElementById('arcDrawerBody').innerHTML));
  ok('档案抽屉含 empTag2 标签(停薪留职=blue)', /tag blue/.test(document.getElementById('arcDrawerBody').innerHTML));

} catch (e) {
  fail++;
  console.log('  EXCEPTION ' + e.message + '\n' + e.stack);
}

console.log('\n=== verify_02 冒烟: ' + pass + ' 通过 / ' + fail + ' 失败 ===');
process.exit(fail > 0 ? 1 : 0);
