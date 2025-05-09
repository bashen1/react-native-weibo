/**
 * Created by lvbingru on 1/5/16.
 */

import {NativeModules, Platform, NativeEventEmitter, DeviceEventEmitter} from 'react-native';

const {WeiboAPI} = NativeModules;

// Used only with promisify. Transform callback to promise result.
function translateError(err, result) {
    if (!err) {
        return this.resolve(result);
    }
    if (typeof err === 'object') {
        if (err instanceof Error) {
            return this.reject(ret);
        }
        return this.reject(Object.assign(new Error(err.message), { errCode: err.errCode }));
    } else if (typeof err === 'string') {
        return this.reject(new Error(err));
    }
    this.reject(Object.assign(new Error(), { origin: err }));
}

function wrapApi(nativeFunc) {
    if (!nativeFunc) {
        return undefined;
    }

    return (...args) => {
        return new Promise((resolve, reject) => {
            nativeFunc.apply(this, [...args, (...result) => {
                translateError.apply({
                    resolve,
                    reject
                }, result);
            }]);
        });
    };
}

// Save callback and wait for future event.
let savedCallback = undefined;
function waitForResponse(type) {
    return new Promise((resolve, reject) => {
        if (savedCallback) {
            savedCallback('User canceled.');
        }
        savedCallback = result => {
            if (result.type !== type) {
                return;
            }
            savedCallback = undefined;
            if (result.errCode !== 0) {
                const err = new Error(result.errMsg);
                err.errCode = result.errCode;
                reject(err);
            } else {
                resolve(result);
            }
        };
    });
}


let Emiter;
if (Platform.OS === 'ios') {
    Emiter = new NativeEventEmitter(WeiboAPI);
} else {
    Emiter = DeviceEventEmitter;
}

Emiter.addListener('Weibo_Resp', resp => {
    const callback = savedCallback;
    savedCallback = undefined;
    callback && callback(resp);
});

const defaultScope = "all"
const defaultRedirectURI = "https://api.weibo.com/oauth2/default.html"

function checkData(data) {
    if(!data.redirectURI) {
        data.redirectURI = defaultRedirectURI
    }
    if(!data.scope) {
        data.scope = defaultScope
    }
}

const nativeSendAuthRequest = wrapApi(WeiboAPI.login);
const nativeSendMessageRequest = wrapApi(WeiboAPI.shareToWeibo);

export function login(config={}) {
    checkData(config)
    return Promise.all([waitForResponse('WBAuthorizeResponse'), nativeSendAuthRequest(config)]).then(v=>v[0]);
}

export function share(data) {
    checkData(data)
    return Promise.all([waitForResponse('WBSendMessageToWeiboResponse'), nativeSendMessageRequest(data)]).then(v=>v[0]);
}

export function initSDK(params = {}) {
    if (Platform.OS === 'ios') {
        WeiboAPI.initSDK(params ?? {});
    }
}
