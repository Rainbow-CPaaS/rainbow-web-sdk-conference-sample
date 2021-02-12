import rainbowSDK from 'rainbow-web-sdk';
import { config } from './config';
import '../styles.css';

/* ALLOW MANIPULATING SDK FROM THE BROWSER CONSOLE */
window.r = rainbowSDK;

/* CHANGE TO FALSE IF YOU WANT TO REMOVE RAINBOW LOGS */
const sdkConfig = {
    verboseLog: false,
};

/* GLOBAL VARIABLES */
let bubble;
let conferenceSession;

/* LOAD THE SDK */
let onLoaded = function onLoaded() {
    console.log('On SDK Loaded !');
};

/* SIGN IN METHOD */
function signIn() {
    console.log(document.getElementById('login').value);
    rainbowSDK
        .initialize(config.appId, config.appSecret)
        .then(() => {
            console.log('[DEMO] :: Rainbow SDK is initialized!');
            let login = document.getElementById('login').value;
            let password = document.getElementById('password').value;
            let host = 'openrainbow.com';
            /*
             */
            rainbowSDK.connection.signinOnRainbowOfficial(login, password).then(account => {
                console.log('User Connected >', account.userData.displayName);
                document.getElementById('loginForm').innerHTML =
                    '<div id="connectedUser"><h4>Connected as: ' + account.userData.displayName + '</h4></div>';
                document.getElementById('apiList').style.display = 'table';
            });
        })
        .catch(err => {
            console.log('[DEMO] :: Something went wrong with the SDK.', err);
        });
}

/* RAINBOW WEB SDK CONFERENCE METHODS */

function createBubble() {
    console.log(`Create bubble with a name of ${config.bubbleName}`);

    rainbowSDK.bubbles
        .createBubble(config.bubbleName, 'Test', true, false, null, true)
        .then(bubble => {
            console.log(`Bubble created: ${config.bubbleName}`);
        })
        .catch(error => {
            console.error(`Error: `, error);
        });
}

function getBubble() {
    console.log(`Get bubble with a name of ${config.bubbleName}`);

    const allBubbles = rainbowSDK.bubbles.getAllBubbles();
    for (let i = 0; i < allBubbles.length; i++) {
        if (allBubbles[i].name === config.bubbleName) {
            console.log('Found the bubble');
            bubble = allBubbles[i];
            document.getElementById('conferenceMethods').style.display = 'table';
            //rainbowSDK.bubbles.setActiveSpeakerValue(true);
            //console.log('Active speaker activated');
        }
    }
    if (!bubble) {
        console.warn(`No bubble with following name found: ${config.bubbleName}`);
    }
}

function startOrJoinWebConference() {
    rainbowSDK.conferences
        .startOrJoinWebConference(bubble)
        .then(bubble => {
            console.log(`Conference started in a bubble ${bubble.name}`);
        })
        .catch(err => {
            console.log(err);
        });
}

function delegateConferenceToParticipant() {
    rainbowSDK.conferences
        .delegateConferenceToParticipant(conferenceSession.id, conferenceSession.participants[1].participantId)
        .then(res => console.log('Delegated conference', res))
        .catch(err => console.log(err));
}

function stopWebConference() {
    rainbowSDK.conferences
        .stopWebConference()
        .then(() => {
            console.log('Conference Stopped');
            conferenceSession = null;
        })
        .catch(err => console.log(err));
}

function addVideoToConference() {
    rainbowSDK.conferences.addVideoToConference(conferenceSession);
    console.log('Added media to conferenceSession');
}

function addSharingToConference() {
    console.log('Add sharing');
    rainbowSDK.conferences.addSharingToConference(conferenceSession);
}

function removeSharingFromConference() {
    console.log('Remove sharing');
    rainbowSDK.conferences.removeSharingFromConference(conferenceSession);
}

function removeVideoFromConference() {
    rainbowSDK.conferences.removeVideoFromConference(conferenceSession);
}

function showLocalVideo() {
    rainbowSDK.conferences.showLocalVideo(conferenceSession);
}

function showRemoteVideo() {
    console.log('Add distant video stream to conference');
    rainbowSDK.conferences.showRemoteVideo(conferenceSession);
}

function changeGallery(id) {
    console.log('changeGallery ', this.id);
    console.log('changeGallery ', this.id.substring(this.id.length - 1, this.id.length));
    let nb = parseInt(this.id.substring(this.id.length - 1, this.id.length));
    console.log('changeGallery ', nb - 1);
    console.log('changeGallery ', conferenceSession.videoGallery[nb - 1]);
    rainbowSDK.conferences.updateMainVideoSession(conferenceSession.id, conferenceSession.videoGallery[nb - 1]);
}

function changeGalleryBis() {
    console.log('changeGalleryBis ', list);
    let list = rainbowSDK.conferences.getListOfAvailableRemoteVideoPublishers(conferenceSession);
    rainbowSDK.conferences.updateGalleryPublisher(conferenceSession, 'videoGallery_1', list.all[0]);
    rainbowSDK.conferences.updateMainVideoSession(conferenceSession.id, conferenceSession.videoGallery[0]);
}

function setActiveSpeaker() {
    console.log('setActiveSpeaker ');
    rainbowSDK.bubbles.setActiveSpeakerValue(true);
    console.log('Active speaker activated');
}

function removeActiveSpeaker() {
    console.log('removeActiveSpeaker');
    rainbowSDK.bubbles.setActiveSpeakerValue(false);
    console.log('Active speaker deactivated');
}

function getListOfRemoteVideoPublishers() {
    console.log('getListOfRemoteVideoPublishers');
    console.log('List ', rainbowSDK.conferences.getListOfAvailableRemoteVideoPublishers(conferenceSession));
}

/* BUTTON HANDLERS */
let btnCreateBubble = document.getElementById('createBubble');
let btnGetBubble = document.getElementById('getBubble');
let btnStartOrJoinWebConference = document.getElementById('startOrJoinWebConference');
let bntStopWebConference = document.getElementById('stopWebConference');
let bntDelegateConferenceToParticipant = document.getElementById('delegateConferenceToParticipant');
let btnAddVideoToConference = document.getElementById('addVideoToConference');
let btnAddSharingToConference = document.getElementById('addSharingToConference');
let btnRemoveSharingFromConference = document.getElementById('removeSharingFromConference');
let btnRemoveVideoFromConference = document.getElementById('removeVideoFromConference');
let btnShowLocalVideo = document.getElementById('showLocalVideo');
let btnShowRemoteVideo = document.getElementById('showRemoteVideo');
let btnSignIn = document.getElementById('signIn');
let videoGallery_1 = document.getElementById('videoGallery_1');
let btnSetActiveSpeaker = document.getElementById('setActiveSpeaker');
let btnRemoveActiveSpeaker = document.getElementById('removeActiveSpeaker');
let btnGetList = document.getElementById('getListOfRemoteVideoPublishers');

window.onload = () => {
    btnCreateBubble.onclick = createBubble;
    btnGetBubble.onclick = getBubble;
    btnStartOrJoinWebConference.onclick = startOrJoinWebConference;
    btnAddVideoToConference.onclick = addVideoToConference;
    btnAddSharingToConference.onclick = addSharingToConference;
    btnRemoveSharingFromConference.onclick = removeSharingFromConference;
    btnRemoveVideoFromConference.onclick = removeVideoFromConference;
    bntStopWebConference.onclick = stopWebConference;
    bntDelegateConferenceToParticipant.onclick = delegateConferenceToParticipant;
    btnShowLocalVideo.onclick = showLocalVideo;
    btnShowRemoteVideo.onclick = showRemoteVideo;
    btnSignIn.onclick = signIn;
    videoGallery_1.onclick = changeGallery;
    videoGallery_2.onclick = changeGallery;
    videoGallery_3.onclick = changeGalleryBis;
    videoGallery_4.onclick = changeGallery;
    btnSetActiveSpeaker.onclick = setActiveSpeaker;
    btnRemoveActiveSpeaker.onclick = removeActiveSpeaker;
    btnGetList.onclick = getListOfRemoteVideoPublishers;
};

/* EVENT LISTENERS */

let onWebConferenceUpdated = function(event) {
    let conference = event.detail;
    console.log('Web Conference Updated', conference);
    conferenceSession = conference;
};

let onWebConferenceDelegated = function(event) {
    let conference = event.detail;
    console.log('Web Conference Delegated', conference);
    conferenceSession = conference;
};

let onTalkerActive = function(event) {
    let conference = event.detail;
    console.log('onTalkerActive Updated', conference);
};

let onReady = function onReady() {
    console.log('On SDK Ready !', rainbowSDK.webRTC.canMakeAudioVideoCall());
};

let onBubbleUpdated = function(event) {
    let bubble = event.detail;
    console.log('[RainbowSDKService] onBubbleUpdated', bubble.confEndpoints.length);
};
document.addEventListener(rainbowSDK.bubbles.RAINBOW_ONBUBBLEUPDATED, onBubbleUpdated);

document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
document.addEventListener(rainbowSDK.conferences.RAINBOW_ONWEBCONFERENCEUPDATED, onWebConferenceUpdated);
document.addEventListener(rainbowSDK.conferences.RAINBOW_ONWEBCONFERENCEDELEGATED, onWebConferenceDelegated);
document.addEventListener(rainbowSDK.bubbles.RAINBOW_ONBUBBLECONFERENCETALKERACTIVE, onTalkerActive);

rainbowSDK.load(sdkConfig);
