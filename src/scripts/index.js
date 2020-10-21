import rainbowSDK from 'rainbow-web-sdk';
import { config } from './config';
import '../styles.css';

/* ALLOW MANIPULATING SDK FROM THE BROWSER CONSOLE */
window.r = rainbowSDK;

/* CHANGE TO FALSE IF YOU WANT TO REMOVE RAINBOW LOGS */
const sdkConfig = {
    verboseLog: true,
};

/* GLOBAL VARIABLES */
let bubble;
let conferenceSession;

/* LOAD THE SDK */
let onLoaded = function onLoaded() {
    console.log('On SDK Loaded !');
    if (config.login && config.password) {
        document.getElementById('loginForm').innerHTML = `<h4>User credentials found in config: connecting... ${config.login}</h4>`;
        signIn();
    }
};

/* SIGN IN METHOD */
function signIn() {
    let login = config.login ? config.login : document.getElementById('login').value;
    let password = config.password ? config.password : document.getElementById('password').value;

    rainbowSDK
        .initialize(config.appId, config.appSecret)
        .then(() => {
            console.log('[DEMO] :: Rainbow SDK is initialized!');
            rainbowSDK.connection.signin(login, password).then(account => {
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

function getBubble() {
    console.log(`Get bubble with a name of ${config.bubbleName}`);

    const allBubbles = rainbowSDK.bubbles.getAllBubbles();
    for (let i = 0; i < allBubbles.length; i++) {
        if (allBubbles[i].name === config.bubbleName) {
            console.log('Found the bubble');
            bubble = allBubbles[i];
            updateCustomDataForBubble();
            document.getElementById('conferenceMethods').style.display = 'table';
        }
    }
    if (!bubble) {
        console.warn(`No bubble with following name found: ${config.bubbleName}`);
    }
}

function updateCustomDataForBubble() {
    const customData = {
        showAllVideos: true,
        blockUserVideo: false,
    };
    rainbowSDK.bubbles
        .updateCustomDataForBubble(customData, bubble)
        .then(bubble => {
            console.log('Custom data for bubble updated', bubble);
        })
        .catch(err => {
            console.log(err);
        });
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

function updateMainVideoSession() {
    console.log('Update main video session');
    /* Chose one of the sessionIds */
    let conferenceId = conferenceSession.id;
    let sessionId_1 = conferenceSession.videoGallery[0];
    let sessionId_2 = conferenceSession.videoGallery[1];
    let sessionId_3 = conferenceSession.videoGallery[2];
    let sessionId_4 = conferenceSession.videoGallery[3];

    rainbowSDK.conferences.updateMainVideoSession(conferenceId, sessionId_2);
}

/* BUTTON HANDLERS */
let btnGetBubble = document.getElementById('getBubble');
let btnStartOrJoinWebConference = document.getElementById('startOrJoinWebConference');
let bntStopWebConference = document.getElementById('stopWebConference');
let btnAddVideoToConference = document.getElementById('addVideoToConference');
let btnAddSharingToConference = document.getElementById('addSharingToConference');
let btnRemoveSharingFromConference = document.getElementById('removeSharingFromConference');
let btnRemoveVideoFromConference = document.getElementById('removeVideoFromConference');
let btnShowLocalVideo = document.getElementById('showLocalVideo');
let btnShowRemoteVideo = document.getElementById('showRemoteVideo');
let btnUpdateMainVideoSession = document.getElementById('updateMainVideoSession');
let btnSignIn = document.getElementById('signIn');

window.onload = () => {
    btnGetBubble.onclick = getBubble;
    btnStartOrJoinWebConference.onclick = startOrJoinWebConference;
    btnAddVideoToConference.onclick = addVideoToConference;
    btnAddSharingToConference.onclick = addSharingToConference;
    btnRemoveSharingFromConference.onclick = removeSharingFromConference;
    btnRemoveVideoFromConference.onclick = removeVideoFromConference;
    bntStopWebConference.onclick = stopWebConference;
    btnShowLocalVideo.onclick = showLocalVideo;
    btnShowRemoteVideo.onclick = showRemoteVideo;
    btnUpdateMainVideoSession.onclick = updateMainVideoSession;
    btnSignIn.onclick = signIn;
};

/* EVENT LISTENERS */
let onWebConferenceUpdated = function(event) {
    let conference = event.detail;
    console.log('Web Conference Updated', conference);
    conferenceSession = conference;
};

let onBubbleConferenceStarted = function(event) {
    let bubble = event.detail;
    console.log('Web Conference started', bubble);
};

let onReady = function onReady() {
    console.log('On SDK Ready !');
};

document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
document.addEventListener(rainbowSDK.conferences.RAINBOW_ONWEBCONFERENCEUPDATED, onWebConferenceUpdated);
document.addEventListener(rainbowSDK.conferences.RAINBOW_ONBUBBLECONFERENCESTARTED, onBubbleConferenceStarted);

rainbowSDK.load(sdkConfig);
