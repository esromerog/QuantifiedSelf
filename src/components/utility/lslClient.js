function lslClient(socketUrl, audioContext) {
    const socket = new WebSocket(socketUrl)
  
    socket.addEventListener('message', (message)=>{
  
        console.log(JSON.parse(message.data))
        
        //const audioBufferChunk=audioContext.decodeAudioData(message.data)
        //source = audioContext.createBufferSource();
        //source.buffer = audioBufferChunk;
        //source.connect(audioContext.destination);
        //source.start();
    })
  }