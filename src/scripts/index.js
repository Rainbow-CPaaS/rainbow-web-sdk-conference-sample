import rainbowSDK from 'rainbow-web-sdk';
import { config } from './config';
import '../styles.css';

/* ALLOW MANIPULATING SDK FROM THE BROWSER CONSOLE */
window.r = rainbowSDK;

/* CHANGE TO FALSE IF YOU WANT TO REMOVE RAINBOW LOGS */
const sdkConfig = {
    verboseLog: true,
};

/* CUSTOM DATA OBJECT FOR A BUBBLE */
const customData = {
    usersWithDisabledVideo: [],
};

/* GLOBAL VARIABLES */
let bubble;
let conferenceSession;
let connectedUser;
let canUseVideoStreamInConference = true;

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
                connectedUser = account;
                console.log('User Connected >', account.userData.displayName);
                document.getElementById('loginForm').innerHTML =
                    '<div id="connectedUser"><h4>Connected as: ' + account.userData.displayName + '</h4><div id="bubbleDetails"></div></div>';
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
            bubble = allBubbles[i];
            console.log('Found the bubble', bubble);
            showBubbleDetails();

            /* Only bubble owner can update customData - do it at each connection to reset it's state */
            if (bubble.owner) {
                updateCustomDataForBubble();
            }
            document.getElementById('conferenceMethods').style.display = 'table';
        }
    }
    if (!bubble) {
        console.warn(`No bubble with following name found: ${config.bubbleName}`);
    }
}

function showBubbleDetails() {
    let bubbleDetails = document.getElementById('bubbleDetails');
    let bubbleName = `<div id="bubbleName"><h4>Bubble: ${bubble.name}</h4></div>`;
    let bubbleOwner = `<div id="owner"><strong>Owner: ${bubble.ownerContact.loginEmail} ${bubble.owner ? ' (you)' : ''}</strong></div>`;
    let bubbleMembers = '';
    bubble.members.forEach(member => {
        bubbleMembers += `<div class="bubbleMember">${member.contact.loginEmail} <button id=${member.contact.id} ${
            bubble.owner ? '' : 'disabled'
        }>Video: true</button> 
        </div>`;
    });

    bubbleDetails.innerHTML = bubbleName + bubbleOwner + bubbleMembers;

    /* ADD EVENT LISTENERS FOR INTERACTIVE CUSTOM DATA CHANGES */
    bubble.members.forEach(member => {
        document.getElementById(member.contact.id).addEventListener('click', toggleVideoAvailabilityForDistantUser);
    });
}

/* UPDATE CUSTOM DATA FROM CONFIG OBJECT */
function updateCustomDataForBubble() {
    rainbowSDK.bubbles
        .updateCustomDataForBubble(customData, bubble)
        .then(bubble => {
            console.log('Custom data for bubble updated', bubble.customData);
        })
        .catch(err => {
            console.log(err);
        });
}

/* UPDATE CUSTOM DATA FROM CLICK EVENT */
function toggleVideoAvailabilityForDistantUser(event) {
    console.log('Update custom data - disable video for user: ', event.srcElement.id);
    let newCustomData = customData;

    if (event.srcElement.innerHTML === 'Video: true') {
        newCustomData.usersWithDisabledVideo.push(event.srcElement.id);
    } else {
        let filteredArray = newCustomData.usersWithDisabledVideo.filter(value => {
            return value !== event.srcElement.id;
        });
        newCustomData.usersWithDisabledVideo = filteredArray;
    }

    rainbowSDK.bubbles
        .updateCustomDataForBubble(newCustomData, bubble)
        .then(bubble => {
            console.log('Custom data for bubble updated', bubble.customData);
            event.srcElement.innerHTML === 'Video: true'
                ? (event.srcElement.innerHTML = 'Video: false')
                : (event.srcElement.innerHTML = 'Video: true');
        })
        .catch(err => {
            console.log(err);
        });
}

function checkIfVideoDisabledForConnectedUser(eventBubble) {
    if (bubble.name === eventBubble.name) {
        let connectedUserFound = false;

        bubble.customData.usersWithDisabledVideo.forEach(user => {
            bubble.members.forEach(member => {
                if (user === member.contact.id) {
                    document.getElementById(user).innerHTML = 'Video: false';
                    if (user === connectedUser.userData.jid_im) {
                        console.log('You have now no right to add video to conference');
                        connectedUserFound = true;
                    }
                }
            });
        });

        if (connectedUserFound) {
            canUseVideoStreamInConference = false;
            btnAddVideoToConference.disabled = true;
        } else {
            canUseVideoStreamInConference = true;
            btnAddVideoToConference.disabled = null;
        }
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

function muteConferenceParticipant() {
    console.log('Mute conference participant');

    /* Mute the first participant on the list - change the number to another one */
    let participantId = conferenceSession.participants[1].participantId;

    rainbowSDK.conferences
        .muteConferenceParticipant(conferenceSession, participantId)
        .then(() => {
            console.log(`Participant ${participantId} muted `);
        })
        .catch(err => {
            console.log(err);
        });
}

function unmuteConferenceParticipant() {
    console.log('Mute conference participant');

    /* Mute the first participant on the list - change the number to another one */
    let participantId = conferenceSession.participants[1].participantId;

    rainbowSDK.conferences
        .unmuteConferenceParticipant(conferenceSession, participantId)
        .then(() => {
            console.log(`Participant ${participantId} unmuted `);
        })
        .catch(err => {
            console.log(err);
        });
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
let btnMuteConferenceParticipant = document.getElementById('muteConferenceParticipant');
let btnUnmuteConferenceParticipant = document.getElementById('unmuteConferenceParticipant');
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
    btnMuteConferenceParticipant.onclick = muteConferenceParticipant;
    btnUnmuteConferenceParticipant.onclick = unmuteConferenceParticipant;
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

let onBubbleUpdated = function(event) {
    let eventBubble = event.detail;
    console.log('On bubble updated', eventBubble);
    /* Update state of videos from distance - only for not owners */
    if (bubble && !bubble.owner) {
        checkIfVideoDisabledForConnectedUser(eventBubble);
    }
};

let onReady = function onReady() {
    console.log('On SDK Ready !');
};

document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded);
document.addEventListener(rainbowSDK.conferences.RAINBOW_ONWEBCONFERENCEUPDATED, onWebConferenceUpdated);
document.addEventListener(rainbowSDK.conferences.RAINBOW_ONBUBBLECONFERENCESTARTED, onBubbleConferenceStarted);
document.addEventListener(rainbowSDK.bubbles.RAINBOW_ONBUBBLEUPDATED, onBubbleUpdated);

rainbowSDK.load(sdkConfig);
