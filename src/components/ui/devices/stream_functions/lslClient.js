class LSLReceiver {

    channel_format = {
        0: 'undefined',
        1: 'float32',
        2: 'double64',
        3: 'string',
        4: 'int32',
        5: 'int16',
        6: 'int8',
        7: 'int64'
    }

    constructor() {
        this.isStreaming = false;
    }

    connect(socketUrl) {

        if (this.isConnected) {
            console.log("There is already a socket connection")
            return
        }

        const socket = new WebSocket(socketUrl)
        /*
        if (socket.readyState == 1) {
            this.isConnected = true;
        }
        */

        // Some listener functions
        socket.onopen = () => { 
            this.isConnected = true;
            socket.addEventListener('message', this._parse)
        };
        socket.onclose = (event) => stop(event);
        socket.onerror = (event) => {
            console.log(event);
            this.stop()
        }
    }

    stream() {
        if (!this.isConnected) {
            console.log("Websocket not connected");
            return
        }
        socket.addEventListener('message', this._parse)
    }
    
    // Function that actually manages the message
    _parse(message) {
        console.log(JSON.parse(message.data))
    }

    stop(event) {
        if (!this.isConnected) {
            return
        }
        console.log(event);
        socket.removeEventListener('message', this._parse)
    }

}

export default LSLReceiver