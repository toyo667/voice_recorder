import React, { useCallback, useEffect, useRef, useState } from "react";

export const Recorder = () => {
  const [recorder, setRecorder] = useState<MediaRecorder>();

  /**録音開始 */
  const recordStartEv = useCallback(async () => {
    // Recorderオブジェクトの作成
    const rec = await setupRecorder();
    setRecorder(rec);
    console.log("startRecording...");
    rec.start();
  }, []);

  /**録音停止 */
  const recordStopEv = useCallback(async () => {
    console.log("stopRecording...");
    recorder && recorder.stop();
    setRecorder(undefined);
  }, [recorder]);

  return (
    <div>
      <div>
        {recorder ? (
          <button onClick={recordStopEv}>Stop</button>
        ) : (
          <button onClick={recordStartEv}>Record</button>
        )}
      </div>
    </div>
  );
};

const setupRecorder = async () => {
  const chunks: Blob[] = [];
  const audioCtx = new AudioContext();
  const audioStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  const mediaRecorder = new MediaRecorder(audioStream, {
    mimeType: "audio/webm",
  });

  /** データ読み込み完了 */
  mediaRecorder.addEventListener("dataavailable", (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  });

  /** 録音終了 */
  mediaRecorder.addEventListener("stop", (e) => {
    const blob = new Blob(chunks);
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = () => {
      if (!(reader.result instanceof ArrayBuffer)) return;
      audioCtx.decodeAudioData(reader.result).then((buf) => {
        const b = buf.getChannelData(0);
        console.log(b);
      });
    };
  });
  return mediaRecorder;
};
