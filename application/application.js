var express = require('express')
let server_api = express()

server_api.use(require('./portal/BranchHandler'));
server_api.use(require('./portal/LanguageHandler'));
server_api.use(require('./portal/PermisionsHandler'));
server_api.use(require('./portal/ApplicationsHandler'));
server_api.use(require('./portal/RoleHandler'));
server_api.use(require('./portal/GoogleHandler'));
server_api.use(require('./portal/UserHandler'));
server_api.use(require('./portal/SupplierHandler'));
server_api.use(require('./portal/WorkShopHandler'));
server_api.use(require('./portal/OrderHandler'));
server_api.use(require('./portal/ConfigurationHandler'));
server_api.use(require('./security/SecurityMiddleware'));

module.exports = server_api
