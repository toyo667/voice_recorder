import { useCallback, useEffect, useMemo, useState } from "react";

interface useRecorderReturn {
  /** 録音データを再生する。 */
  play: () => void;
  /** 録音データを停止する。 */
  stop: () => void;
  /** 録音データを初期化する。 */
  clear: () => void;
  /** 録音を開始する。 */
  startRecording: (removeOldData: boolean) => void;
  /** 録音を停止する。 */
  stopRecording: () => void;
  /** バッファ */
  buffer?: AudioBuffer;
}

/**
 * 録音機能を提供する。
 */
const useRecorder = (isAutoPlay: boolean): useRecorderReturn => {
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [recorder, setRecorder] = useState<MediaRecorder>();
  const [buffer, setBuffer] = useState<AudioBuffer>();
  const audioCtx = useMemo(() => new AudioContext(), []);
  const [bufferSource, setBufferSource] = useState<AudioBufferSourceNode>();

  /**
   * 録音データを再生する。
   * @param buf 再生するバッファ(bufferより新しいバッファを参照する場合に指定)
   */
  const play = useCallback(
    (buf?: AudioBuffer) => {
      if (buf === undefined && buffer === undefined) return;

      bufferSource?.stop(); // 前の再生を停止

      const newSource = audioCtx.createBufferSource();
      newSource.buffer = buf || (buffer as AudioBuffer); // bufかbufferは必ず存在する
      newSource.connect(audioCtx.destination);
      newSource.start();
      setBufferSource(newSource);
    },
    [audioCtx, buffer, bufferSource]
  );

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

      // 録音終了時に録音データをdecodeして設定する(chunkをblobに追加後)
      mediaRecorder.addEventListener("stop", async () => {
        const blob = new Blob(chunks);
        const data = await blob.arrayBuffer();
        const buf = await audioCtx.decodeAudioData(data);
        setBuffer(buf);
        isAutoPlay && play(buf);
      });

      setChunks(chunks);
      setRecorder(mediaRecorder);
    })();
  }, [audioCtx, chunks, isAutoPlay, play]);

  const stop = useCallback(() => {
    bufferSource?.stop();
  }, [bufferSource]);

  const clear = useCallback(() => {
    chunks.length = 0;
  }, [chunks]);

  const startRecording = useCallback(
    (removeOldData: boolean = true) => {
      if (removeOldData) clear();
      recorder?.start();
    },
    [recorder, clear]
  );

  const stopRecording = useCallback(() => {
    recorder?.stop();
  }, [recorder]);

  return { play, clear, startRecording, stopRecording, stop, buffer };
};

export default useRecorder;
