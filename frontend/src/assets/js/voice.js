import StompClient from '../../websocket/StompClient';

let stompClient, stream, interval, roomId, nickname, volume;

const constraints = {
    audio: {
        echoCancellation: true, // 에코 취소 활성화
        noiseSuppression: true, // 잡음 억제 활성화
        sampleRate: 8000, // 샘플링 비율을 8000Hz로 낮춤 (전화 품질)
        channelCount: 1, // 채널 수를 1로 설정하여 모노 녹음
    }
};

const options = {
    mimeType: 'audio/webm; codecs=opus',
    audioBitsPerSecond: 8000, // 낮은 비트레이트 설정
}

// ------------------------------------------- 연결 -----------------------------------------------

async function createStream(newRoomId, newNickname){
    roomId = newRoomId;
    nickname = newNickname;
    volume = 1;
    stompClient = StompClient.getInstance();
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('음성채팅 입장', roomId)
}

async function endStream(){
    if(interval) stopRecording()

    if(!stream) return;
    stream.getTracks().forEach(track => {
        track.stop();
    });
    stream = null;
    console.log('음성채팅 나감', roomId)
}

function handleData(stompPayload){
    if(stompPayload.data.nickname == nickname) return;
    
    const blob = base64ToBlob(stompPayload.data.content, { mimeType: 'audio/webm' })
    playAudio(blob)
}

// ------------------------------------------- 녹음 -----------------------------------------------

function startRecording() {
    if(!stream){
        alert('음성채팅방에 입장 해주세요')
        return
    }
    if(!interval){
        interval = setInterval(() => {
            recording();
        }, 1000);
    }
    console.log('마이크 ON')
}

async function recording() {
    const audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    const destination = audioContext.createMediaStreamDestination();

    const lowPassFilter = audioContext.createBiquadFilter();
    lowPassFilter.type = "lowpass"; 
    lowPassFilter.frequency.setValueAtTime(3400, audioContext.currentTime); // 고음 제거
    
    const highPassFilter = audioContext.createBiquadFilter();
    highPassFilter.type = "highpass"; 
    highPassFilter.frequency.setValueAtTime(300, audioContext.currentTime); // 저음 제거

    mediaStreamSource.connect(lowPassFilter);
    lowPassFilter.connect(highPassFilter);
    highPassFilter.connect(destination);
    
    const mediaRecorder = new MediaRecorder(destination.stream, options);
    
    const chunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type : options.mimeType });
        const base64 = await blobToBase64(blob);

        const totalSize = chunks.reduce((acc, chunk) => acc + chunk.size, 0);
        if(totalSize > 900){
            stompClient.sendMessage(
                `/chat.voice`,
                JSON.stringify({
                    type: 'chat.voice',
                    roomId: roomId,
                    sender: nickname,
                    data: {
                        nickname: nickname,
                        content: base64,
                    },
                })
            );
        }else{
            console.log('작아서 전송하지 않음: ',totalSize)
        }
        // 녹음이 완료되면 chunks를 비워 다음 녹음을 준비
        chunks.length = 0;
    };

    mediaRecorder.start(10);
    // 녹음을 1초간 진행
    setTimeout(() => {
        mediaRecorder.stop();
    }, 1030);
}

function stopRecording() {
    if(!interval) return;

    clearInterval(interval)
    interval = null;
    console.log("마이크 OFF");
}

// ------------------------------------------- 재생 -----------------------------------------------

async function playAudio(blob) {
    // Blob 객체로부터 오디오 URL 생성
    const audioURL = URL.createObjectURL(blob);
        
     // 오디오 요소 생성 및 설정
    const audio = new Audio(audioURL);
    audio.volume = volume;
    try {
        await audio.play();
    } catch (error) {
           console.error('재생 중 에러 발생:', error);
    }
}

// ------------------------------------------- 변환 -----------------------------------------------

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
            reject(error);
        };
    });
}

function base64ToBlob(base64, mimeType) {
    // Base64 문자열을 바이너리 데이터로 디코딩
    const binary = atob(base64);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    // Uint8Array를 사용하여 Blob 객체 생성
    return new Blob([new Uint8Array(array)], {type: mimeType});
}

// ------------------------------------------- 변수 동적 관리 -----------------------------------------------

function getStream(){
    return stream;
}

function getInterval(){
    return interval;
}

export {createStream, endStream, handleData, startRecording, stopRecording, getStream, getInterval}
