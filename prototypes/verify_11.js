const fs = require('fs');
const jsdom = require('jsdom');
const html = fs.readFileSync(__dirname + '/11-学习教育管理.html', 'utf8');
const dom = new jsdom.JSDOM(html, { runScripts: 'dangerously', url: 'file://' + __dirname + '/11-学习教育管理.html#resource' });
const document = dom.window.document;
const window = dom.window;

global.document = document;
global.window = window;

let passed = 0, failed = 0;
function ok(msg, cond) {
  if (cond) { passed++; console.log('  ✓ ' + msg); }
  else { failed++; console.log('  ✗ ' + msg); }
}

window.document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    try {
      // 1. 初始列表正常渲染
      ok('resBody has resource rows', document.getElementById('resBody').children.length >= 4);
      ok('taskBody has task rows', document.getElementById('taskBody').children.length >= 3);
      ok('examBody has exam rows', document.getElementById('examBody').children.length >= 3);
      ok('heartBody has heart rows', document.getElementById('heartBody').children.length >= 3);

      // 2. 学习资源查看：打开 drawer，列表不被覆盖
      const resRowCount = document.getElementById('resBody').children.length;
      window.openRes('R001');
      ok('resDrawer is open', document.getElementById('resDrawer').classList.contains('open'));
      ok('resBody still has rows after openRes', document.getElementById('resBody').children.length === resRowCount);
      ok('resDrawerBody contains resource basic info', /类型/.test(document.getElementById('resDrawerBody').innerHTML));
      ok('resDrawerBody contains learning completion summary', /已完成人数/.test(document.getElementById('resDrawerBody').innerHTML));
      window.closeDrawer('resDrawer');
      ok('resDrawer can be closed', !document.getElementById('resDrawer').classList.contains('open'));

      // 3. 学习任务进度：打开 drawer，含人员完成情况
      const taskRowCount = document.getElementById('taskBody').children.length;
      window.openTask('T001');
      ok('taskDrawer is open', document.getElementById('taskDrawer').classList.contains('open'));
      ok('taskBody still has rows after openTask', document.getElementById('taskBody').children.length === taskRowCount);
      ok('taskDrawerBody contains task info', /任务信息/.test(document.getElementById('taskDrawerBody').innerHTML));
      ok('taskDrawerBody contains participant completion table', /范围内人员完成情况/.test(document.getElementById('taskDrawerBody').innerHTML));
      ok('taskDrawerBody has participant rows', (document.getElementById('taskDrawerBody').querySelectorAll('tbody tr').length || 0) >= 1);
      window.closeDrawer('taskDrawer');

      // 4. 在线考试查看：打开 drawer，列表不被覆盖，含参与人员情况
      const examRowCount = document.getElementById('examBody').children.length;
      window.openExam('X001');
      ok('examDrawer is open', document.getElementById('examDrawer').classList.contains('open'));
      ok('examBody still has rows after openExam', document.getElementById('examBody').children.length === examRowCount);
      ok('examDrawerBody contains exam config', /考试配置/.test(document.getElementById('examDrawerBody').innerHTML));
      ok('examDrawerBody contains exam content', /考试内容/.test(document.getElementById('examDrawerBody').innerHTML));
      ok('examDrawerBody contains participant results table', /参与人员考试情况/.test(document.getElementById('examDrawerBody').innerHTML));
      ok('examDrawerBody has participant rows', (document.getElementById('examDrawerBody').querySelectorAll('tbody tr').length || 0) >= 1);
      window.closeDrawer('examDrawer');

      // 5. 心得体会审阅：打开 drawer，列表不被覆盖
      const heartRowCount = document.getElementById('heartBody').children.length;
      window.openHeart('H001');
      ok('heartDrawer is open', document.getElementById('heartDrawer').classList.contains('open'));
      ok('heartBody still has rows after openHeart', document.getElementById('heartBody').children.length === heartRowCount);
      ok('heartDrawerBody contains heart content', /心得内容/.test(document.getElementById('heartDrawerBody').innerHTML));
      ok('heartDrawerBody contains review actions or status', /书记批注|已通过/.test(document.getElementById('heartDrawerBody').innerHTML));
      window.closeDrawer('heartDrawer');

      // 6. 审阅操作可用（通过 H004 待审阅）
      window.openHeart('H004');
      ok('H004 opens review actions', /审阅通过/.test(document.getElementById('heartDrawerBody').innerHTML));
      window.passHeart('H004');
      ok('passHeart updates H004 status to 已通过', window.HEARTS.find(h => h.id === 'H004').status === '已通过');
      window.closeDrawer('heartDrawer');

      console.log('\n' + (failed === 0 ? 'ALL PASS' : 'SOME FAILED') + ' — ' + passed + '/' + (passed + failed));
      process.exit(failed === 0 ? 0 : 1);
    } catch (e) {
      console.error('Test error:', e.message);
      console.error(e.stack);
      process.exit(1);
    }
  }, 300);
});
