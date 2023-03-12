let { log }  =  require('./log.class.js');

module.exports = LogRoutes = (req, res, next) => {

    log.info(req.method);

    log.info('params', req.url, req.params);
    log.info('query', req.url, req.query);
    
    if(req.method === 'POST') {
        log.info('payload', req.url, req.body);
    }

    return next();
}