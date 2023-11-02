import { useCallback, useEffect, useMemo, useState } from "react";

interface useRecorderReturn {
  /** 録音データを再生する。 */
  play: () => void;
  /** 録音データを停止する。 */
  stop: () => void;
  /** 録音データを初期化する。 */
  clear: () => void;
  /** 録音を開始する。 */
  startRecording: () => void;
  /** 録音を停止する。 */
  stopRecording: () => void;
}

const useRecorder = (): useRecorderReturn => {
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [buffer, setBuffer] = useState<AudioBuffer>();
  const audioCtx = useMemo(() => new AudioContext(), []);
  const [bufferSource, setBufferSource] = useState<AudioBufferSourceNode>();

  useEffect(() => {
    (async () => {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm",
      });

      // 録音データ取得時にchunksにblobを追加する。
      mediaRecorder.addEventListener(
        "dataavailable",
        (e: BlobEvent) => e.data.size && chunks.push(e.data)
      );

      // 録音終了時に録音データをdecodeして設定する。
      mediaRecorder.addEventListener("stop", () => {
        const blob = new Blob(chunks);
        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = async () => {
          if (!(reader.result instanceof ArrayBuffer)) {
            throw new Error(`${typeof reader.result} is unexpected type.`);
          }

          const buf = await audioCtx.decodeAudioData(reader.result);
          setBuffer(buf);
        };
      });

      setChunks(chunks);
      setRecorder(mediaRecorder);
    })();
  }, [audioCtx, chunks]);

  const play = useCallback(() => {
    if (!buffer) return;
    bufferSource?.stop(); // 前の再生を停止

    const newSource = audioCtx.createBufferSource();
    newSource.buffer = buffer;
    newSource.connect(audioCtx.destination);
    newSource.start();
    setBufferSource(newSource);
  }, [audioCtx, buffer, bufferSource]);

  const stop = useCallback(() => {
    bufferSource?.stop();
  }, [bufferSource]);

  const clear = useCallback(() => {
    setChunks([]);
  }, []);

  const startRecording = useCallback(() => {
    recorder?.start();
  }, [recorder]);

  const stopRecording = useCallback(() => {
    recorder?.stop();
  }, [recorder]);

  return { play, clear, startRecording, stopRecording, stop };
};

export default useRecorder;
