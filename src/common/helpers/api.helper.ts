import { HttpException } from "@nestjs/common";
import axios from "axios";
import { Module } from "src/auth/enum/module.enum";
import { Log } from "src/log/log.helper";

export type THttpMethod = 'post' | 'get' | 'put' | 'patch' | 'option';

export async function callApi(
    method: THttpMethod,
    url: string,
    bearer: string,
    data?: any,
) {
    try {
        var config = {
            method: method,
            url: url,
            headers: {
                'bearer': bearer,
                'Content-Type': 'application/json'
            },
            data: data && JSON.stringify(data)
        };

        Log.debug({
            type: 'callApi',
            title: 'CallApiReq',
            message: `${method}:${url}`,
            meta: {
                data
            }
        });

        const reqResult = await axios(config);

        Log.debug({
            type: 'callApi',
            title: 'CallApiRes',
            message: `${method}:${url}`,
            meta: {
                data,
                res: reqResult.data
            }
        });

        return reqResult.data;
    }
    catch (err) {
        console.log('err :: ', err);

        const errorCode = err?.response?.data?.statusCode || 500;
        const errorMessage = err?.response?.data?.message || 'Internal error';

        Log.error({
            type: 'callApi',
            title: 'CallApiRes',
            message: `${method}:${url}`,
            meta: {
                data,
                errorCode,
                errorMessage,
                message: err.message,
                stack: err.stack
            }
        });

        throw new HttpException(
            {
                message: errorMessage,
                code: errorCode
            },
            errorCode
        );
    }
}

export async function callModuleApi(
    module: Module,
    method: THttpMethod,
    apiUrl: string,
    data?: any,
) {
    let bearer: string;
    let baseUrl: string;

    if (module === Module.GAME) {
        bearer = process.env.MODULE_GAME_SECRET;
        baseUrl = process.env.MODULE_GAME_BASE_URL;
    }
    else if (module === Module.WEBSITE) {
        bearer = process.env.MODULE_WEBSITE_SECRET;
        baseUrl = process.env.MODULE_WEBSITE_BASE_URL;
    }
    else if (module === Module.CPG) {
        bearer = process.env.MODULE_CPG_SECRET;
        baseUrl = process.env.MODULE_CPG_BASE_URL;
    }
    else if (module === Module.CRASH) {
        bearer = process.env.MODULE_CRASH_SECRET;
        baseUrl = process.env.MODULE_CRASH_BASE_URL;
    }
    else if (module === Module.CRASHLOGS) {
        bearer = process.env.MODULE_CRASHLOGS_SECRET;
        baseUrl = process.env.MODULE_CRASHLOGS_BASE_URL;
    }

    const url = `${baseUrl}/${apiUrl}`;

    return callApi(method, url, bearer, data);
}

