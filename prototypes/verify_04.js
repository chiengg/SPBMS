const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const file = '04-监督考核.html';
const html = fs.readFileSync(path.join(__dirname, file), 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'file://' + __dirname + '/' + file, pretendToBeVisual: true });
const w = dom.window;
global.window = w;
global.document = w.document;

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){ pass++; console.log('  PASS ' + name); } else { fail++; console.log('  FAIL ' + name); } }

function run(){
  try {
    // 1. 默认视图：一级台账可见，二级详情隐藏
    ok('view-score 默认可见', !document.getElementById('view-score').classList.contains('hidden'));
    ok('view-score-detail 默认隐藏', document.getElementById('view-score-detail').classList.contains('hidden'));
    ok('子标签栏默认可见', document.getElementById('subtabs').style.display !== 'none');

    // 2. 台账渲染 8 名党员
    const rows = document.getElementById('scoreLedger').children;
    ok('台账渲染 8 行党员', rows.length === 8);

    // 3. 顶部 KPI 计算正确
    ok('KPI 在册人数=8', document.getElementById('kpiCount').textContent === '8');
    ok('KPI 平均积分=73.9', document.getElementById('kpiAvg').textContent === '73.9');
    ok('KPI 达标率=25%', document.getElementById('kpiRate').textContent === '25%');
    ok('KPI 预警人数=2', document.getElementById('kpiWarn').textContent === '2');

    // 4. 排名与状态计算（聚合规则）
    const led = w.buildLedger();
    const m003 = led.find(r => r.id === 'M003'); // 85 达标
    const m006 = led.find(r => r.id === 'M006'); // 62 预警
    ok('M003 当前积分=85 排名1', m003.cur === 85 && m003.rank === 1);
    ok('M003 状态=达标', m003.status === '达标');
    ok('M006 当前积分=62 排名末位', m006.cur === 62 && m006.rank === 8);
    ok('M006 状态=预警', m006.status === '预警');
    const m001 = led.find(r => r.id === 'M001'); // 73 正常
    ok('M001 当前积分=73(60+19-6) 状态=正常', m001.cur === 73 && m001.status === '正常');

    // 5. 组织筛选
    document.getElementById('scOrg').value = '机关支部';
    w.renderScoreLedger();
    ok('按机关支部筛选后仅 2 行', document.getElementById('scoreLedger').children.length === 2);
    document.getElementById('scOrg').value = '';
    w.renderScoreLedger();

    // 6. 状态筛选
    document.getElementById('scStatus').value = '达标';
    w.renderScoreLedger();
    ok('按达标筛选后仅 2 行', document.getElementById('scoreLedger').children.length === 2);
    document.getElementById('scStatus').value = '';
    w.renderScoreLedger();

    // 7. 下钻二级页
    w.openScoreDetail('M001');
    ok('openScoreDetail → 二级页可见', !document.getElementById('view-score-detail').classList.contains('hidden'));
    ok('openScoreDetail → 一级台账隐藏', document.getElementById('view-score').classList.contains('hidden'));
    ok('openScoreDetail → 子标签栏隐藏', document.getElementById('subtabs').style.display === 'none');
    ok('openScoreDetail → 面包屑更新', document.getElementById('crumbSub').textContent === '党员积分 / 详情');
    ok('二级页明细按 M001 过滤(8 条日志)', document.getElementById('scoreRows').children.length === 8);
    ok('二级页 KPI 显示当前积分 73', /73/.test(document.getElementById('scoreDetailKpi').textContent));
    ok('二级页申诉备注绑定 M001(无申诉)', /暂无进行中申诉/.test(document.getElementById('appealNote').textContent));

    // 8. 含申诉人员（赵* M004）备注绑定
    w.openScoreDetail('M004');
    ok('M004 申诉备注显示 SS-2026-007', /SS-2026-007/.test(document.getElementById('appealNote').textContent));

    // 9. 返回台账
    w.backToLedger();
    ok('返回 → 一级台账可见', !document.getElementById('view-score').classList.contains('hidden'));
    ok('返回 → 二级页隐藏', document.getElementById('view-score-detail').classList.contains('hidden'));
    ok('返回 → 子标签栏恢复可见', document.getElementById('subtabs').style.display === '');
    ok('返回 → 面包屑恢复', document.getElementById('crumbSub').textContent === '党员积分');

    // 10. switchSub 切换其他子标签时收起二级页
    w.openScoreDetail('M002');
    w.switchSub('assess');
    ok('switchSub(assess) → 二级页隐藏', document.getElementById('view-score-detail').classList.contains('hidden'));
    ok('switchSub(assess) → 子标签栏恢复', document.getElementById('subtabs').style.display === '');

  } catch (e) {
    fail++;
    console.log('  EXCEPTION ' + e.message + '\n' + e.stack);
  }
  console.log('\n=== verify_04 结果: ' + pass + ' 通过 / ' + fail + ' 失败 ===');
  process.exit(fail > 0 ? 1 : 0);
}

setTimeout(run, 200);
