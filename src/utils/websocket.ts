// import $store from '../store/modules/appStore'
import { useUserStoreWithOut  } from '@/store/moudules/appStore'
const userStore = useUserStoreWithOut()
export default (onMessage: any) => {
  let socketUrl: any
    let socket: WebSocket;
    let lockReconnect = false;
    let timer: ReturnType<typeof setTimeout>;
    const createSocket = () => {
        try {
          setTimeout(() => {
            socketUrl = 'ws://10.0.79.130:8888/api/ws/plugins/telemetry?token=' + userStore.getToken;
            socket = new WebSocket(socketUrl);
            init();
          }, 1000)
           
        } catch (e) {
            console.log("catch" + e)
            reconnect()
        }
    }
    const reconnect = () => {
        if (lockReconnect) return;
        lockReconnect = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
            createSocket();
        }, 4000);
    }
    
    const init = () => {
        socket.onopen = function (event) {
            // console.log("WebSocket:已连接", event);
          
            //心跳检测重置
             heartCheck.reset().start();
        };
          
        //接收到消息的回调方法
        socket.onmessage = function (event) {
            // console.log("WebSocket:收到一条消息", event.data);
            const isHeart = /pong/.test(event.data)
            if (onMessage && !isHeart) { // 触发自定义onMessage
                onMessage.call(null, event)
            }
             heartCheck.reset().start();
        };

        //连接发生错误的回调方法
        socket.onerror = function (event) {
            console.log("WebSocket:发生错误", event);
            reconnect();
        };

        //连接关闭的回调方法
        socket.onclose = function (event) {
            console.log("WebSocket:已关闭", event);
            heartCheck.reset().start();//心跳检测
            reconnect();
        };

        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function () {
            socket.close();
        };
    }

    var heartCheck = {
        timeout: 5000,
        timeoutObj: setTimeout(() => { }),
        serverTimeoutObj: setInterval(() => { }),
        reset: function () {
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            return this;
        },
        start: function () {
            var self = this;
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            this.timeoutObj = setTimeout(function () {
                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                // //onmessage拿到返回的心跳就说明连接正常
                let params = {
                  type: 'HEART_BEAT_REQUEST',
                  body: { data: 'PING' },
                  wsType: 'jinma',
                }
                socket.send(JSON.stringify(params));
                socket.onmessage = function (event) {
                  // console.log("ping", event.data);
                  clearTimeout(self.serverTimeoutObj);
                  self.reset().start()
                };
                self.serverTimeoutObj = setTimeout(function () { // 如果超过一定时间还没重置，说明后端主动断开了
                    // console.log('关闭服务');
                    socket.close();//如果onclose会执行reconnect，我们执行 websocket.close()就行了.如果直接执行 reconnect 会触发onclose导致重连两次
                }, self.timeout)
            }, this.timeout)
        }
    };
    createSocket();
}
