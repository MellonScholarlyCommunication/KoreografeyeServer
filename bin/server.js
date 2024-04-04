#!/usr/bin/env node

const { program } = require('commander');
const { inbox_server } = require('ldn-inbox-server');
const { handleInbox } = require('../lib/handler.js');

const HOST = 'localhost'
const PORT = 8000;
const PUBLIC_PATH = './public';
const INBOX_PATH = './inbox';
const RULES_PATH = './rules';
const CONFIG_PATH = './config/config.jsonld';
const JSON_SCHEMA_PATH = './config/notification_schema.json';
const SLEEP = 10;

program
  .name('n3dialog')
  .version('1.0.0')
  .description('A demonstration Event Notifications Inbox server');

program
  .command('start-server')
  .option('--host <host>','host',HOST)
  .option('--port <port>','port',PORT)
  .option('--inbox <inbox>','inbox',INBOX_PATH)
  .option('--public <public>','public',PUBLIC_PATH)
  .option('--schema <schema>','json schema',JSON_SCHEMA_PATH)
  .option('--registry <registry>','registry',null)
  .action( (options) => {
    inbox_server(options);
  });

program
  .command('handle-inbox')
  .option('--config <config>','config',CONFIG_PATH)
  .option('--inbox <inbox>','inbox',INBOX_PATH)
  .option('--rules <rules>','N3 rules',RULES_PATH)
  .option('--sleep <seconds>','sleep',SLEEP)
  .action( async(options) => {
    await handleInbox(options['inbox'],options);
  });

program.parse();