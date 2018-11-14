var RBAC = require('rbac');

const rbac = new RBAC({
    roles: ['superadmin', 'admin', 'user', 'guest'],
    permissions: {
        user: ['create', 'delete'],
        password: ['change', 'forgot'],
        service: ['create'],
        rbac: ['update'],
    },
    grants: {
        guest: ['create_user', 'forgot_passwrd'],
        user: ['change_password'],
        admin: ['user', 'delete_user', update_rbac],
        superadmin: ['admin'],
    },
});
 rbac.init();
module.exports = rbac;