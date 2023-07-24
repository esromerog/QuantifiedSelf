import React, { useEffect, useRef, useState } from 'react';

function computePower(arr, returnRelative) {
  /**
  * a function that returns the avg power for each frequency band, with the option of returning relative power.
  */
  let powerArr = [0,0,0,0,0]  // this saves the sum of power values (theta, alpha, beta, betaH, gamma) across channels
  for (let i = 0; i < arr.length; i ++) {
      powerArr[i % 5] += arr[i]  // updating the sums
    }
  let numChn = arr.length / 5
  // dividing the number of channels
  for (let k = 0; k < powerArr.length; k++) {
    powerArr[k] /= numChn;
  }
    return powerArr

}
  //cortex stuff
function log(message) {
    // var paragraph = document.getElementById("elementA");
    // var text = document.createTextNode(message);
    // var lineBreak = document.createElement("br");
    // paragraph.appendChild(text);
    // paragraph.appendChild(lineBreak);
    // let logElement = this.logElement
    // const newContent = createSpan(message);
    // logElement.child(newContent);
    // console.log(message)
  }
class Cortex {
      constructor (user, socketUrl) {
          // create socket
          this.socket = new WebSocket(socketUrl)
          this.socketUrl=socketUrl;
          // read user infor
          this.user = user
      }

      queryHeadsetId(){
          const QUERY_HEADSET_ID = 2
          let socket = this.socket
          let queryHeadsetRequest =  {
              "jsonrpc": "2.0", 
              "id": QUERY_HEADSET_ID,
              "method": "queryHeadsets",
              "params": {}
          }
          return new Promise(function(resolve, reject){
              socket.send(JSON.stringify(queryHeadsetRequest));
              socket.addEventListener('message', (message)=>{
                  try {
                      let data = message.data;
                      if(JSON.parse(data)['id']==QUERY_HEADSET_ID){
                          log(JSON.parse(data)['result'])
                          if(JSON.parse(data)['result'].length > 0){
                              let headsetId = JSON.parse(data)['result'][0]['id']
                              resolve(headsetId)
                          }
                          else{
                              log('No have any headset, please connect headset with your pc.')
                          }
                      }

                  } catch (error) {
                    log(error)
                  }
              })
          })
      }

      requestAccess(){
          let socket = this.socket
          let user = this.user
          log("requesting")
          return new Promise(function(resolve, reject){
              const REQUEST_ACCESS_ID = 1
              let requestAccessRequest = {
                  "jsonrpc": "2.0", 
                  "method": "requestAccess", 
                  "params": { 
                      "clientId": user.clientId, 
                      "clientSecret": user.clientSecret
                  },
                  "id": REQUEST_ACCESS_ID
              }
              // this.log('requesting access') //debug
              socket.send(JSON.stringify(requestAccessRequest));

              socket.addEventListener('message', (data)=>{
                  try {
                      if(JSON.parse(data.data)['id']==REQUEST_ACCESS_ID){
                          resolve(data)
                      }
                  } catch (error) {
                      log(error) //debug

                  }
              })
          })
      }

      manipulate(parsedData){}

      authorize(){
          let socket = this.socket
          let user = this.user
          log('authorizing...');
          return new Promise(function(resolve, reject){
              const AUTHORIZE_ID = 4
              let authorizeRequest = { 
                  "jsonrpc": "2.0", "method": "authorize", 
                  "params": { 
                      "clientId": user.clientId, 
                      "clientSecret": user.clientSecret, 
                      "license": user.license,
                      "debit": user.debit
                  },
                  "id": AUTHORIZE_ID
              };
              socket.send(JSON.stringify(authorizeRequest))
              socket.addEventListener('message', (message)=>{
                  try {
                      let data = message.data;
                      if(JSON.parse(data)['id']==AUTHORIZE_ID){
                          log(JSON.stringify(data))
                          let cortexToken = JSON.parse(data)['result']['cortexToken']
                          resolve(cortexToken)
                      }
                  } catch (error) {
                      log(error) //debug

                  }
              })
              log('authorized.') //debug

          })
      }

      controlDevice(headsetId){
          let socket = this.socket
          const CONTROL_DEVICE_ID = 3
          let controlDeviceRequest = {
              "jsonrpc": "2.0",
              "id": CONTROL_DEVICE_ID,
              "method": "controlDevice",
              "params": {
                  "command": "connect",
                  "headset": headsetId
              }
          }
          return new Promise(function(resolve, reject){
              socket.send(JSON.stringify(controlDeviceRequest));
              socket.addEventListener('message', (message)=>{
                  let data = message.data;
                  try {
                      if(JSON.parse(data)['id']==CONTROL_DEVICE_ID){
                          resolve(data)
                      }
                  } catch (error) {
                    log(error)
                  }
              })
          }) 
      }

      createSession(authToken, headsetId){
          let socket = this.socket
          const CREATE_SESSION_ID = 5
          let createSessionRequest = { 
              "jsonrpc": "2.0",
              "id": CREATE_SESSION_ID,
              "method": "createSession",
              "params": {
                  "cortexToken": authToken,
                  "headset": headsetId,
                  "status": "active"
              }
          }
          return new Promise(function(resolve, reject){
              socket.send(JSON.stringify(createSessionRequest));
              socket.addEventListener('message', (message)=>{
                  let data = message.data;
                  try {
                      if(JSON.parse(data)['id']==CREATE_SESSION_ID){
                          let sessionId = JSON.parse(data)['result']['id']
                          resolve(sessionId)
                      }
                  } catch (error) {}
              })
          })
      }

      licenseInfo(authToken) {
          let socket = this.socket
          const LICENSE_INFO_ID = 6
          let licenseInfoRequest = {
              "id": LICENSE_INFO_ID,
              "jsonrpc": "2.0",
              "method": "getLicenseInfo",
              "params": {
                  "cortexToken": authToken
              }
          }
          return new Promise(function(resolve, reject){
              socket.send(JSON.stringify(licenseInfoRequest));
              socket.addEventListener('message', (message)=>{
                  let data = message.data;
                  try {
                      if(JSON.parse(data)['id']==LICENSE_INFO_ID){
                          resolve(data)
                      }
                  } catch (error) {
                    log(error)
                  }
              })
          }) 
      }

      subRequest(stream, authToken, sessionId){
          let socket = this.socket
          const SUB_REQUEST_ID = 6 
          let subRequest = { 
              "jsonrpc": "2.0", 
              "method": "subscribe", 
              "params": { 
                  "cortexToken": authToken,
                  "session": sessionId,
                  "streams": stream
              }, 
              "id": SUB_REQUEST_ID
          }
          log('sub eeg request: ', subRequest)
          socket.send(JSON.stringify(subRequest))
          socket.addEventListener('message', (message)=>{
              let data = message.data;
              try {
                let parsedData = JSON.parse(data)
                // computing an average
                this.manipulate(parsedData)

              } catch (error) {
                log('Streaming error as follows:')
                log(error)
              }
          })
      }

      /**
       * - query headset infor
       * - connect to headset with control device request
       * - authentication and get back auth token
       * - create session and get back session id
       */
      async querySessionInfo(){
          log('Start query session info...')
          log('Query headset ID...')
          let headsetId=""
          await this.queryHeadsetId().then((headset)=>{headsetId = headset})
          this.headsetId = headsetId

          log('Query ctResult...')
          let ctResult=""
          await this.controlDevice(headsetId).then((result)=>{ctResult=result})
          this.ctResult = ctResult
          log(JSON.parse(ctResult))

          log('Query authToken...')
          let authToken=""
          await this.authorize().then((auth)=>{authToken = auth})
          this.authToken = authToken

          log('Query license info...')
          let license=""
          await this.licenseInfo(authToken).then((result)=>{license=result})
          log(JSON.stringify(license))

          log('Query sessionID...')
          let sessionId = ""
          await this.createSession(authToken, headsetId).then((result)=>{sessionId=result})
          this.sessionId = sessionId



          log('HEADSET ID -----------------------------------')
          log(this.headsetId)
          log('\r\n')
          log('CONNECT STATUS -------------------------------')
          log(this.ctResult)
          log('\r\n')
          log('AUTH TOKEN -----------------------------------')
          log(this.authToken)
          log('\r\n')
          log('SESSION ID -----------------------------------')
          log(this.sessionId)
          log('\r\n')
      }

      /**
       * - check if user logined
       * - check if app is granted for access
       * - query session info to prepare for sub and train
       */
      async checkGrantAccessAndQuerySessionInfo(){
          let requestAccessResult = ""
          await this.requestAccess().then((result)=>{requestAccessResult=result})

          let accessGranted = JSON.parse(requestAccessResult.data)

          // check if user is logged in CortexUI
          if ("error" in accessGranted){
              log('You must login on CortexUI before request for grant access then rerun')
              throw new Error('You must login on CortexUI before request for grant access')
          }else{
              log(accessGranted['result']['message'])
              // console.log(accessGranted['result'])
              if(accessGranted['result']['accessGranted']){
                  await this.querySessionInfo()
              }
              else{
                  log('You must accept access request from this app on CortexUI then rerun')
                  throw new Error('You must accept access request from this app on CortexUI')
              }
          }   
      }


      /**
       * 
       * - check login and grant access
       * - subcribe for stream
       * - logout data stream to console or file
       */
      sub(streams){
          this.socket.addEventListener('open',async ()=>{
              await this.checkGrantAccessAndQuerySessionInfo()
              let data_stream = this.subRequest(streams, this.authToken, this.sessionId)  // this is the function that is called every time a message is sent
              // this.socket.addEventListener('message', (data)=>{
                  // This funciton is not used
              // })

          })
      }


      setupProfile(authToken, headsetId, profileName, status){
          const SETUP_PROFILE_ID = 7
          let setupProfileRequest = {
              "jsonrpc": "2.0",
              "method": "setupProfile",
              "params": {
                "cortexToken": authToken,
                "headset": headsetId,
                "profile": profileName,
                "status": status
              },
              "id": SETUP_PROFILE_ID
          }
          // console.log(setupProfileRequest)
          let socket = this.socket
          return new Promise(function(resolve, reject){
              socket.send(JSON.stringify(setupProfileRequest));
              socket.addEventListener('message', (data)=>{
                  if(status=='create'){
                      resolve(data)
                  }

                  try {
                      // console.log('inside setup profile', data)
                      if(JSON.parse(data)['id']==SETUP_PROFILE_ID){
                          if(JSON.parse(data)['result']['action']==status){
                              log('SETUP PROFILE -------------------------------------')
                              log(data)
                              log('\r\n')
                              resolve(data)
                          }
                      }

                  } catch (error) {

                  }

              })
          })
      }

      queryProfileRequest(authToken){
          const QUERY_PROFILE_ID = 9
          let queryProfileRequest = {
              "jsonrpc": "2.0",
              "method": "queryProfile",
              "params": {
                "cortexToken": authToken
              },
              "id": QUERY_PROFILE_ID
          }

          let socket = this.socket
          return new Promise(function(resolve, reject){
              socket.send(JSON.stringify(queryProfileRequest))
              socket.addEventListener('message', (data)=>{
                  try {
                      if(JSON.parse(data)['id']==QUERY_PROFILE_ID){
                          // console.log(data)
                          resolve(data)
                      }
                  } catch (error) {

                  }
              })
          })
      }


  }

class CortexPower extends Cortex {
    
    constructor(user, socketUrl, oldData, handleValue) {
        super(user, socketUrl);
        this.oldData=oldData;
        this.handleValue=handleValue;
        console.log("Built!")
    }

    // Add error handling functino using parsedData to check if there's data. I could also throw a return value from the sub?

    manipulate(parsedData) {
        let power = parsedData['pow'];
        let receivingValue = computePower(power,true)[1]  //theta is 0; alpha is 1
        let newData=(Object.assign({}, this.oldData));
        console.log(receivingValue);
        newData["Muse"]["Alpha"]=receivingValue;
        newData["Muse"]["Beta"]=0;
        this.handleValue(newData);
    }

}



export default CortexPower;


/*
function CortexComp({oldData, handleValue, changeIntervalRef}) {
    clearInterval(changeIntervalRef.current);
    changeIntervalRef.current = setInterval(() => {
        let newData=(Object.assign({}, oldData));
        newData["Muse"]["Alpha"]=Math.round(Math.random()*1000);;
        newData["Muse"]["Beta"]=Math.round(Math.random()*100);;
        handleValue(newData);
    }, 500);
}

export default CortexComp;
*/