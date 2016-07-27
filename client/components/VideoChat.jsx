import React from 'react';

import { establishPeerCall } from '../lib/webrtc';

class VideoChat extends React.Component {
  constructor(props) {
    super(props);

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
      .then(function(result){
        console.log('mediaStrrm frm vidChat', result);
        return result;
      })
      /*
 
upload file/blob directly using XMLHTTPRequest, as the send method supports 
Blobs. (Note: you can't use a blob url, you need the Blob itself.)
http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
xhttp.open("POST", "ajax_test.asp", true);
xhttp.setRequestHeader("Content-type", "application/json");
xhttp.send("fname=Henry&lname=Ford");
      */
      .then(function (stream) {
        var recordedBlobs = [];
        console.log('stream as passed', stream);        
        console.log('streamID', stream.id);
        var blob = new Blob(recordedBlobs, {type: 'video/webm'})
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(blob);
        console.log ('videoSRC', video.src);
        //MAKE REQUEST HERE OR SEND TO UTIL THAT WILL DO THAT 
        $.ajax({
          url: `api.kairos.com/media/`, //to what does source refer? 
          method: 'POST',
          query: stream.id,
          data: stream,
          'Content-Type': 'application/json',
          app_id: window.app_id,
          app_key:window.app_key,
          success: function (emotions){
            console.log('success. THIS IS HOW YOU FEEL', emotions);
            //write this to a variable that we can access in otherr places
          }, 
          error: function (err){
            console.log('error sending stream', err);
          }
        })
      })
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
