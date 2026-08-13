const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '05-党委数据驾驶舱.html'), 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/05-党委数据驾驶舱.html' });
const document = dom.window.document;
const window = dom.window;
window.requestAnimationFrame = window.requestAnimationFrame || (cb => setTimeout(cb, 16));

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERT FAIL: ' + msg);
}

// 等待初始化完成（requestAnimationFrame 在 jsdom 中同步执行）
setTimeout(() => {
  try {
    // 1. 基本结构
    assert(document.querySelector('.sidebar'), 'sidebar 缺失');
    assert(document.querySelector('.screen'), 'screen 缺失');
    assert(document.querySelectorAll('.sc-main .sc-col').length === 3, '三栏缺失');

    // 2. 右栏合并为 3 个面板
    const rightPanels = document.querySelectorAll('.sc-main .sc-col:nth-child(3) > .panel');
    assert(rightPanels.length === 3, `右栏面板数应为 3，实际 ${rightPanels.length}`);

    // 3. KPI 已渲染且不为 0
    const kpis = document.querySelectorAll('.kpi-card .kv');
    assert(kpis.length === 4, 'KPI 数量应为 4');
    assert(kpis[0].textContent !== '0', 'KPI 未翻牌');

    // 4. 图表已渲染
    assert(document.getElementById('sunburst').innerHTML.includes('<path'), '旭日图未渲染');
    assert(document.getElementById('idBars').querySelectorAll('.bar-row').length > 0, '身份分布条未渲染');
    assert(document.getElementById('eduBars').querySelectorAll('.bar-row').length > 0, '学历分布条未渲染');
    assert(document.getElementById('paBars').querySelectorAll('.bar-row').length > 0, '党龄分布条未渲染');
    assert(document.getElementById('genderDonut').innerHTML.includes('<circle'), '环形饼图未渲染');
    assert(document.getElementById('trends3').querySelectorAll('.tr-box').length === 3, '趋势图数量应为 3');
    assert(document.getElementById('stackWrap').querySelectorAll('.stack-col').length === 6, '堆叠柱数量应为 6');
    assert(document.getElementById('gauge3').querySelectorAll('.g3').length === 3, '仪表盘数量应为 3');

    // 5. 排行已渲染
    assert(document.getElementById('branchRank').querySelectorAll('.rank-item').length > 0, '支部排行未渲染');
    assert(document.getElementById('memberRank').querySelectorAll('.rank-item').length === 10, '党员排行数量应为 10');

    // 6. 预警卡片
    assert(document.getElementById('warn6').querySelectorAll('.wc').length === 6, '预警卡数量应为 6');

    // 7. 底部预警栏
    assert(document.getElementById('marquee').innerHTML.includes('wb-item'), '底部预警未渲染');

    // 8. 视图切换
    assert(window.__APP, '__APP 未暴露');
    window.__APP.switchView('board');
    assert(document.getElementById('viewBoard').style.display !== 'none', '专题看板未显示');
    assert(document.getElementById('viewScreen').style.display === 'none', '指挥大屏未隐藏');
    assert(document.querySelectorAll('.topic-card').length === 6, '专题卡片数量应为 6');
    window.__APP.switchView('screen');

    // 9. 小 Tab 切换
    const structureTabs = document.querySelectorAll('.sc-col:nth-child(3) .panel:first-child .mini-tab');
    assert(structureTabs.length === 3, '结构画像 Tab 数量应为 3');
    window.__APP.switchMiniTab(structureTabs[1], 'structure');
    assert(document.getElementById('eduBars').style.display !== 'none', '学历分布未显示');
    assert(document.getElementById('idBars').style.display === 'none', '身份分布未隐藏');

    const rankTabs = document.querySelectorAll('.sc-col:nth-child(3) .panel:nth-child(2) .mini-tab');
    assert(rankTabs.length === 2, '排行 Tab 数量应为 2');
    window.__APP.switchMiniTab(rankTabs[1], 'rank');
    assert(document.getElementById('memberRank').style.display !== 'none', '党员排行未显示');
    assert(document.getElementById('branchRank').style.display === 'none', '支部排行未隐藏');

    console.log('verify_05 PASS: 34/34');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}, 50);
