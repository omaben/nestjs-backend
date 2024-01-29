import { Injectable } from "@nestjs/common";
import { WebPubSubServiceClient } from "@azure/web-pubsub";
import { Log } from "src/log/log.helper";
import { AuthUser } from "src/auth/interfaces/auth-user.interface";

const connectionString = process.env.PUB_SUB_CONNECTION_STRING;
const pubSubServiceClient = new WebPubSubServiceClient(
    connectionString,
    'USER',
);
const USER_SERVER = 'user-server'
const pubSubUserServerGroup = pubSubServiceClient.group(USER_SERVER);

@Injectable()
export class PubSubService {
    public pubsubSocket: WebSocket;

    private connectToPubSub(): void {
        pubSubServiceClient.getClientAccessToken({
            userId: USER_SERVER,
            expirationTimeInMinutes: 60 * 24 * 365
        })
            .then(hubToken => {
                Log.debug({
                    type: 'PubSub',
                    title: 'connection',
                    message: `USER_SERVER get access token for PubSub.`,
                    tag: `pubsub,token,USER_SERVER,server`,
                    meta: {}
                });

                const WebSocket = require('ws');
                this.pubsubSocket = new WebSocket(hubToken.url, 'json.webpubsub.azure.v1');

                this.pubsubSocket.onerror = async (pubSubEvent) => {
                    Log.error({
                        type: 'PubSub',
                        title: 'connectionError',
                        message: `Socket error.`,
                        tag: `pubsub,token,USER_SERVER,server,error`,
                        meta: { pubSubEvent }
                    });
                }

                this.pubsubSocket.onclose = async (pubSubEvent) => {
                    Log.error({
                        type: 'PubSub',
                        title: 'disconnection',
                        message: `Socket is disconnected from PubSub.`,
                        tag: `pubsub,token,USER_SERVER,server,disconnect`,
                        meta: { pubSubEvent }
                    });

                    //this.connectToPubSub();
                }

                this.pubsubSocket.onopen = async () => {
                    try {
                        await pubSubUserServerGroup.addUser(USER_SERVER);

                        Log.debug({
                            type: 'PubSub',
                            title: 'openSocket',
                            message: `PubSub socket is open for USER_SERVER`,
                            tag: `pubsub,socket,open`,
                            meta: {}
                        });
                    }
                    catch (err) {
                        Log.error({
                            type: 'PubSub',
                            title: 'openSocket',
                            message: `Error in PubSub socket opening for USER_SERVER`,
                            tag: `pubsub,socket,open`,
                            meta: {
                                error: err.message,
                                stack: err.stack
                            }
                        });
                    }
                }

                this.pubsubSocket.onmessage = async (pubSubEvent) => {
                    let message;
                    let event: string;
                    let data: any;

                    try {
                        message = JSON.parse(pubSubEvent.data);

                        const { type, from, group } = message;
                        const userId = message.group;

                        // TODO
                        const user = null; //GlobalService[userId];

                        if (message.data) {
                            event = message.data.event;
                            data = message.data.data;
                        }

                        Log.debug({
                            type: 'PubSub',
                            title: `onMessage[${event}]`,
                            message: `${event || ''} | ${type || ''} | ${from || ''} | ${group || ''} | ${user?.userId || ''}`,
                            tag: `pubsub,onmessage,${type},${from},${group},${event},${user?.userId}`,
                            meta: {
                                message: message,
                                user
                            }
                        });

                        // Messages from servers
                        if (
                            (message.type === 'message')
                            && (message.from === 'server')
                        ) {

                        }
                        // Messages from users
                        else if (
                            (message.type === 'message')
                            && (message.from === 'group')
                        ) {
                        }
                    }
                    catch (err) {
                        Log.error({
                            type: 'PubSub',
                            title: 'onmessage',
                            message: `Error in PubSub onmessage for USER_SERVER`,
                            tag: `pubsub,socket,onmessage,USER_SERVER`,
                            meta: {
                                error: err.message,
                                stack: err.stack,
                                message,
                            }
                        });
                    }
                };
            })
            .catch(err => {
                Log.error({
                    type: 'PubSub',
                    title: 'connection',
                    message: `USER_SERVER try to get access token for PubSub.`,
                    tag: `pubsub,token`,
                    meta: {
                        error: err.message,
                        stack: err.stack
                    }
                });

                console.log(`---------- Connection ERROR to PubSub. ${err}`);
            })
    }

    constructor() {
        setTimeout(() => {
            this.connectToPubSub();            
        }, 2000);
    }

    emitToUser(userId: string, event: string, data: any): void {
        try {
            Log.debug({
                type: 'PubSub',
                title: 'emitToUser',
                message: `Emit ${event} to PubSub for user ${userId}.`,
                tag: `pubsub,emit,${event},${userId},emitToUser`,
                meta: {
                    event,
                    data,
                    userId: userId
                }
            });

            pubSubServiceClient.sendToUser(
                userId,
                {
                    event: event,
                    data: data
                }
            );
        }
        catch (err) {
            Log.error({
                type: 'PubSub',
                title: 'emitToUser',
                message: `Emit ${event} to PubSub for user ${userId}.`,
                tag: `pubsub,emit,${event},${userId},emitToUser`,
                meta: {
                    error: err.message,
                    stack: err.stack,
                    userId: userId
                }
            });
        }
    }

    emitToAll(event: string, data: any): void {
        try {
            Log.debug({
                type: 'PubSub',
                title: 'emitToAll',
                message: `Emit ${event} to PubSub.`,
                tag: `pubsub,emit,all,${event}`,
                meta: {
                    event,
                    data
                }
            });

            pubSubServiceClient.sendToAll({
                event,
                data
            });
        }
        catch (err) {
            Log.error({
                type: 'PubSub',
                title: 'emitToAll',
                message: `Emit ${event} to PubSub.`,
                tag: `pubsub,emit,all,${event}`,
                meta: {
                    error: err.message,
                    stack: err.stack
                }
            });
        }
    }

    async generatePubSubConnectionUrl(authUser: AuthUser): Promise<string> {
        try {
            Log.debug({
                type: 'PubSub',
                title: 'generatePubSubToken',
                message: `Generate PubSub token for user ${authUser.username}.`,
                meta: {
                    authUser
                }
            });

            const pubsubToken = await pubSubServiceClient.getClientAccessToken({
                userId: authUser.userId,
                expirationTimeInMinutes: parseInt(process.env.EXPIRATION_TIME_IN_MINUTES || (60 * 24).toString()),
                roles: [
                    `webpubsub.sendToGroup.${authUser.userId}`,
                    `webpubsub.joinLeaveGroup.${authUser.userId}`
                ]
            });

            return pubsubToken.url;
        }
        catch (err) {
            Log.error({
                type: 'PubSub',
                title: 'generatePubSubToken',
                message: `Generate PubSub token for user ${authUser.username}.`,
                meta: {
                    error: err.message,
                    stack: err.stack,
                    authUser
                }
            });

            return 'error';
        }
    }
}