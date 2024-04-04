const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger();
const { 
    parseAsN3Store, 
    readText, 
    makeComponentsManager,
    executePolicies,
    rdfTransformStore,
    topGraphIds,
    storeAddPredicate,
} = require('koreografeye');

const POL_MAIN_SUBJECT = 'https://www.example.org/ns/policy#mainSubject';

log4js.configure({
    appenders: {
      stderr: { type: 'stderr' }
    },
    categories: {
      default: { appenders: ['stderr'], level: process.env.LOG4JS ?? 'INFO' }
    }
});

const timer = ms => new Promise( res => setTimeout(res, ms));

async function handleInbox(path,options) {
    logger.info(`handInbox(${path},...)`);

    while(1) {
        await handleInboxDir(path,options);

        logger.info(`sleep ${options['sleep']}`);
        await timer(1000 * options['sleep']);
    }
}

async function handleInboxDir(path,options) {
    logger.info(`handleInboxDir(${path},...)`);
    fs.readdir(path, (err,files) => {
        files.forEach( async (file) => {
            const fullPath = `${path}/${file}`;
            if (file.match("^\\..*$")) {
                // Ignore
            }
            else if (file.match("^.*\\.jsonld$")) {
                // Process
                logger.info(`found ${fullPath}...`);
                await handleNotification(fullPath,options);
                fs.unlinkSync(fullPath);
            }
            else {
                // Unknown file
                logger.info(`Unknown entry ${fullPath} (deleting)`);
                fs.unlinkSync(fullPath);
            }
        });
    });
}

async function handleNotification(path,options) {
    logger.info(`handleNotification(${path},...)`);

    const store = await parseAsN3Store(path);
    const rules = readRules(options['rules']);

    const topIds = topGraphIds(store);

    topIds.forEach( (id) => {
        logger.info(`adding ${POL_MAIN_SUBJECT} = ${id}`);
        storeAddPredicate(store, POL_MAIN_SUBJECT, id);
    });
    
    const manager = await makeComponentsManager(options['config'],'.');
    const reasoner = await manager.instantiate('urn:koreografeye:reasonerInstance');

    const resultStore = await reasoner.reason(store, rules);

    const resultTxt = await rdfTransformStore(resultStore,'text/n3');

    logger.debug(resultTxt);

    const results = await executePolicies(manager, resultStore);

    let success = 0;
    let errors = 0;

    results?.forEach( (r) => { 
        if (r.result) {
            success += 1;
        }
        else {
            errors += 1;
        }
    });

    logger.info(`found success/error: ${success}/${errors} after processing ${path}`);
}

function readRules(path) {
    logger.info(`readRules(${path})`);
    if (!path || ! fs.existsSync(path)) {
        return [];
    }

    const rules = [];

    fs.readdir(path, (err,files) => {
        files.forEach( async (file) => {
            const fullPath = `${path}/${file}`;
            if (file.match("^\\..*$")) {
                // Ignore
            }
            else if (file.match("^.*\\.n3$")) {
                const n3 = readText(fullPath);
                rules.push(n3);
            }
            else {
                logger.debug(`ignoring ${fullPath}`);
            }
        });
    });

    return rules;
}

module.exports = { handleInbox };