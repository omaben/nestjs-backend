import { EventHubProducerClient } from '@azure/event-hubs';
import { v4 as uuidv4 } from 'uuid';
import { UserLogCreateDto } from './dto/user-log-create-dto';

const eventHubClient = new EventHubProducerClient(process.env.LOG_EVENT_HUB_CONNECTION_STRING, process.env.LOG_EVENT_HUB_NAME);

interface LogInterface {
    type: string;
    title: string;
    message: string;
    tag?: string;
    meta?: any;
    req?: any;
}

// Version 3.0
const defaultOptionsObj = {
    server: process.env.SERVER_NAME,
    severity: 'info', // 'debug', 'info', 'warning', 'error', 'alert'
    source: '', // '/GetBalance'
    type: '', // 'Provider', 'iMoon', 'User', 'Bot', ...
    title: '', // 'Get Balance'
    message: '', // 'Check User100005 Balance'
    userId: '', // '100005' (Related User or the Callet)
    version: 3, // log Version
    req: {}, // Body.Request
    res: {}, // Response of the API or Method or ...
    meta: {}, // Meta
}

const add = async (logObj) => {
    if (!logObj.source) {
        let stack: string = '';

        try {
            throw new Error('custom error');
        }
        catch (err) {
            stack = err.stack;
        }

        const stackList = stack.split('\n');
        const stackLine = stackList[4];
        const stackParts = stackLine.split(' ');

        let method = '';
        let location = '';

        if (stackParts.length <= 6) {
            location = stackParts[5];
        }
        else {
            method = stackParts[5];
            location = stackParts[6];
            if (location.indexOf('/./') > 0) location = location.split('/./')[1];
            if (location[location.length - 1] == ')') location = location.substring(0, location.length - 1);
        }

        logObj.source = `${method} (${location})`;
    }

    logObj.timestamp = Date.now();

    try {
        logObj.uuid = uuidv4();

        logObj = {
            ...logObj,
            server: process.env.SERVER_NAME,
            //env: gServerEnv,
        }

        if (logObj.req) {
            const { req } = logObj;

            let user;

            if (req.user) {
                user = req.user;
                user.security = {};
                user.permission = {};
            }

            const body = req.body ? req.body : {};

            logObj.req = {
                body: body,
                params: req.params,
                query: req.query,
                originalUrl: req.originalUrl,
                method: req.method,
                headers: req.headers,
                user: user
            }
        }

        const batch = await eventHubClient.createBatch();

        batch.tryAdd({ body: logObj });

        await eventHubClient.sendBatch(batch);
    } catch (err) {
        console.log('logObj::', logObj);
        console.log('Add log error::', err);
    }
};

const addUserLog = async (userLog: UserLogCreateDto) => {
    info({
        type: 'userLog',
        title: `${userLog.module}-${userLog.action}`,
        message: `${userLog.module} | ${userLog.action} | ${userLog.by?.userId}`,
        meta: {
            module: userLog.module,
            moduleId: userLog.moduleId,
            action: userLog.action,
            by: {
                userId: userLog.by?.userId
            },
            clientInfo: {
                userAgent: userLog.request?.headers?.['user-agent'],
                clientIp: userLog.request?.headers?.['client-ip'],
                cfConnectingIp: userLog.request?.headers?.['cf-connecting-ip'],
                trueClientIp: userLog.request?.headers?.['true-client-ip'],
                country: userLog.request?.headers?.['cf-ipcountry'],
            },
            history: userLog.history,
            meta: userLog.meta
        }
    });
}

const debug = (optionsObj) => {
    add({ ...defaultOptionsObj, ...optionsObj, severity: 'debug' });
}
const info = (optionsObj) => {
    add({ ...defaultOptionsObj, ...optionsObj, severity: 'info' });
}
const warning = (optionsObj) => {
    add({ ...defaultOptionsObj, ...optionsObj, severity: 'warning' });
}
const error = (optionsObj) => {
    add({ ...defaultOptionsObj, ...optionsObj, severity: 'error' });
}
const alert = (optionsObj) => {
    add({ ...defaultOptionsObj, ...optionsObj, severity: 'alert' });
}
const success = (optionsObj) => {
    add({ ...defaultOptionsObj, ...optionsObj, severity: 'success' });
}

export class Log {
    static userLog(userLog: UserLogCreateDto) { addUserLog(userLog); }
    static debug(log: LogInterface) { debug(log); }
    static info(log: LogInterface) { info(log); }
    static warning(log: LogInterface) { warning(log); }
    static error(log: LogInterface) { error(log); }
    static alert(log: LogInterface) { alert(log); }
    static success(log: LogInterface) { success(log); }
    static internalError(err: any) {
        error({
            type: 'ERROR',
            title: 'InternalError',
            message: 'InternalError',
            meta: {
                error: err?.message,
                stack: err?.stack
            }
        });
    }
}

