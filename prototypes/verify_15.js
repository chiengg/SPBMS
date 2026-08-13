const fs = require('fs');
const jsdom = require('jsdom');
const html = fs.readFileSync(__dirname + '/15-系统管理.html', 'utf8');
const dom = new jsdom.JSDOM(html, { runScripts: 'dangerously', url: 'file://' + __dirname + '/15-系统管理.html#role' });
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
      const A = window.__APP;
      // 1. 初始渲染
      ok('role cards rendered (6 标准角色)', document.getElementById('roleCards').children.length >= 6);
      ok('user list rendered (7 账号)', document.getElementById('userBody').children.length >= 7);
      ok('user role filter populated', document.getElementById('fUserRole').querySelectorAll('option').length >= 7);
      ok('custom perm tree rendered on init', document.getElementById('crPerms').querySelectorAll('input[type=checkbox]').length > 0);

      // 2. 角色三维：卡片展示平台权限标签
      const cardHtml = document.getElementById('roleCards').innerHTML;
      ok('role card shows 后台管理 platform tag', /后台管理/.test(cardHtml));
      ok('role card shows 前台门户 platform tag', /前台门户/.test(cardHtml));
      ok('role card shows 移动端 platform tag', /移动端/.test(cardHtml));
      ok('role card shows 按钮级权限 count', /项按钮级权限/.test(cardHtml));

      // 3. 角色详情：平台权限 + 按钮级功能树
      window.openRoleDetail('super');
      ok('roleDrawer open', document.getElementById('roleDrawer').classList.contains('open'));
      const rdB = document.getElementById('roleDrawerBody').innerHTML;
      ok('role detail shows 平台权限', /平台权限/.test(rdB));
      ok('role detail shows 按钮级功能', /功能权限（按钮级）/.test(rdB));
      const onCount = document.getElementById('roleDrawerBody').querySelectorAll('.perm-tree .pl.on').length;
      ok('super role __ALL__ => all buttons checked', onCount === A.allPermKeys().length);
      window.closeDrawer('roleDrawer');

      // 3b. 普通党员仅 portal+mobile，无后台管理勾选
      window.openRoleDetail('member');
      const mHtml = document.getElementById('roleDrawerBody').innerHTML;
      ok('member has 前台门户 checked', /✓ 前台门户/.test(mHtml));
      ok('member has 移动端 checked', /✓ 移动端/.test(mHtml));
      ok('member NOT has 后台管理 checked', !/✓ 后台管理/.test(mHtml));
      window.closeDrawer('roleDrawer');

      // 4. 新建角色：平台选择 + 按钮级树 + 保存
      document.getElementById('crName').value = '纪检审核员';
      // 取消“移动端”平台勾选，验证树仅显示勾选平台
      const plats = document.getElementById('crPlatforms').querySelectorAll('input');
      plats.forEach(c => { if (c.value === 'mobile') c.checked = false; });
      window.renderCustomPermTree();
      const checkedBtns = document.getElementById('crPerms').querySelectorAll('input[type=checkbox]').length;
      ok('perm tree shows button-level checkboxes', checkedBtns > 0);
      const before = A.CUSTOM_ROLES.length;
      window.addCustomRole();
      ok('custom role added', A.CUSTOM_ROLES.length === before + 1);
      const nr = A.CUSTOM_ROLES[A.CUSTOM_ROLES.length - 1];
      ok('custom role has platforms (portal+admin)', nr.platforms.indexOf('portal') >= 0 && nr.platforms.indexOf('admin') >= 0 && nr.platforms.indexOf('mobile') < 0);
      ok('custom role has button-level perms', nr.perms.length > 0);
      // 还原移动端勾选，避免影响后续
      plats.forEach(c => { if (c.value === 'mobile') c.checked = true; });

      // 5. 用户管理：查看详情（角色权限聚合）
      const uBefore = document.getElementById('userBody').children.length;
      window.openUserDetail('U001');
      ok('userDrawer open', document.getElementById('userDrawer').classList.contains('open'));
      const udB = document.getElementById('userDrawerBody').innerHTML;
      ok('user detail shows 可访问平台', /可访问平台/.test(udB));
      ok('user detail shows role-derived 按钮级 perms', /功能权限（来自角色/.test(udB));
      ok('userBody not overwritten by detail', document.getElementById('userBody').children.length === uBefore);
      window.closeDrawer('userDrawer');

      // 6. 用户：启用/禁用切换
      const u7 = A.USER_ACCOUNTS.filter(u => u.id === 'U007')[0];
      const st0 = u7.status;
      window.toggleUser('U007');
      ok('toggleUser flips status', A.USER_ACCOUNTS.filter(u => u.id === 'U007')[0].status !== st0);
      window.toggleUser('U007'); // 还原

      // 7. 用户：新建
      const uCount0 = A.USER_ACCOUNTS.length;
      window.openUserModal();
      document.getElementById('uAccount').value = 'newuser';
      document.getElementById('uName').value = '新用户';
      window.saveUser();
      ok('user added via modal', A.USER_ACCOUNTS.length === uCount0 + 1);
      ok('user list re-rendered (+1)', document.getElementById('userBody').children.length >= uCount0 + 1);

      // 8. 用户：重置密码
      window.resetPwd('U002');

      // 9. 路由切换
      window.switchSub('user');
      ok('panel-user visible after switchSub(user)', !document.getElementById('panel-user').classList.contains('hidden'));
      ok('panel-role hidden after switchSub(user)', document.getElementById('panel-role').classList.contains('hidden'));
      window.switchSub('role');
      ok('panel-role visible after switchSub(role)', !document.getElementById('panel-role').classList.contains('hidden'));

      console.log('\n' + (failed === 0 ? 'ALL PASS' : 'HAS FAIL') + ' — ' + passed + '/' + (passed + failed));
      process.exit(failed === 0 ? 0 : 1);
    } catch (e) {
      console.error('ERROR', e);
      process.exit(2);
    }
  }, 200);
});
