import React from 'react';

import { establishPeerCall } from '../lib/webrtc';

class VideoChat extends React.Component {
  constructor(props) {
    super(props);

      /*
upload file/blob directly using XMLHTTPRequest, as the send method supports 
Blobs. (Note: you can't use a blob url, you need the Blob itself.)
http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
xhttp.open("POST", "ajax_test.asp", true);
xhttp.setRequestHeader("Content-type", "application/json");
xhttp.send("fname=Henry&lname=Ford");
      */
    this.state = {
      localStream: null,
    };

    this.setUpVideoStream = this.setUpVideoStream.bind(this);
  }

  componentDidMount() {
    const constraints = {
      audio: true,
      video: true,
    };
    /*
    Navigator.mediaDevices: read-only prop returns MediaDevicesObj: access connected media devices (cameras microphones, screensharing)*/
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream) {
        console.log('stream as passed', stream);        
        console.log('streamID', stream.id);
        //can we begin and end a stream every XX seconds? 
        //can we to write a file with fs (video data?)
        // $.ajax({
        //   url: `api.kairos.com/media/`,
        //   method: 'POST',
        //   query: stream.id,
        //   data: stream,
        //   'Content-Type': 'application/json',
        //   app_id: window.app_id,
        //   app_key:window.app_key,
        //   success: function (emotions){
        //     console.log('success. THIS IS HOW YOU FEEL', emotions);
        //     //write this to a variable that we can access in otherr places
        //   }, 
        //   error: function (err){
        //     console.log('error sending stream', err);
        //   }
        // })
      })
      //   // var recordedBlobs = [];
      //   // var blob = new Blob(recordedBlobs, {type: 'video/webm'})
      //   var video = document.querySelector('video');
      //   // video.src = window.URL.createObjectURL(blobs);

      //   video.src = window.URL.createObjectURL(stream);
      //   console.log ('videoSRC', video.src);
      //   //MAKE REQUEST HERE OR SEND TO UTIL THAT WILL DO THAT 

      .then(this.setUpVideoStream) 
      .catch(console.error.bind(console));
  }


  setUpVideoStream(localStream) {
    const localVideo = document.querySelector('.local-video');
    localVideo.srcObject = localStream;
    // var userMedia = localStream.getUserMedia({
    //       audio: false,
    //       video: true
    // });
    // console.log(userMedia);

    establishPeerCall(localStream, this.props.isSource ? null : this.props.peerId)
      .then((remoteStream) => {
        console.log(remoteStream);
        // var remoteMedia = remoteStream.getUserMedia({
        //   audio: false,
        //   video: true
        // });
        // console.log(remoteMedia);

        const remoteVideo = document.querySelector('.remote-video');
        remoteVideo.srcObject = remoteStream;
      })
      .catch(console.error.bind(console));
  }

  render() {
    return (
      <div>
        <video className="local-video" autoPlay></video>
        <video className="remote-video" autoPlay></video>
      </div>
    );
  }
}

VideoChat.propTypes = {
  isSource: React.PropTypes.bool.isRequired,
  peerId: React.PropTypes.string,
};

export default VideoChat;



///*ajax atmpt*/

        // $.ajax({
        //   url: `api.kairos.com/media/`, //to what does source refer? 
        //   method: 'POST',
        //   query: stream.id,
        //   data: stream,
        //   'Content-Type': 'application/json',
        //   app_id: window.app_id,
        //   app_key:window.app_key,
        //   success: function (emotions){
        //     console.log('success. THIS IS HOW YOU FEEL', emotions);
        //     //write this to a variable that we can access in otherr places
        //   }, 
        //   error: function (err){
        //     console.log('error sending stream', err);
        //   }
        // })

                // fetch(url, {options}).then().catch
        // fetch(`https://api.kairos.com/media/`, {
        //   query: stream.id,
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     app_id: window.app_id,
        //     app_key:window.app_key
        //   },
        //   body: stream,
        //   mode: 'cors',
        // })
        // .then( (res) => {
        //     return res.json();
        // }).then( (emotions) => {
        //     console.log('success. THIS IS HOW YOU FEEL', emotions);
        //     //remember to revoke the blob! 
        // }).catch( (err) => {
        //    console.log('FAIL. MORE OF A LOSER THAN THAT BECK VIDEO', err)
        // }); 
