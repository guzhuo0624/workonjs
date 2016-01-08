module.exports = {
    port: 443,
    sessionKey: 'sess.eatz',
    sessionSecret: 'login_secret',
    sessionTimeout: 1000*60*2,  // 2 minute session timeout
    env: 'dev',   // alternative modes: test, production
    dbhost: 'mathlab.utsc.utoronto.ca',
    dbname: 'guzhuo',
    dbuser: 'guzhuo',
    dbpass: 'guzhuo'
};
