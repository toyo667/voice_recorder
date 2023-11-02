import { useCallback, useEffect, useState } from "react";
import useRecorder from "../../hooks/useRecorder";

export const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const recorder = useRecorder(isAutoPlay);

  /**録音開始 */
  const recordStartEv = useCallback(async () => {
    // Recorderオブジェクトの作成
    console.log("startRecording...");
    setIsRecording(true);
    recorder.startRecording();
  }, [recorder]);

  /**録音停止 */
  const recordStopEv = useCallback(async () => {
    console.log("stopRecording...");
    setIsRecording(false);
    recorder.stopRecording();
  }, [recorder]);

  return (
    <div>
      <div>
        {/* Record 開始終了ボタン */}
        {isRecording ? (
          <div>
            <button onClick={recordStopEv}>Stop</button>
          </div>
        ) : (
          <div>
            <button onClick={recordStartEv}>Record</button>
          </div>
        )}
        {/* 再生開始停止初期化ボタン */}
        <div>
          <button onClick={() => recorder.play()}>Play</button>
          <button onClick={() => recorder.stop()}>Stop</button>
          <button onClick={() => recorder.clear()}>Clear</button>
        </div>
        {/* レコード中表示 */}
        {isRecording && (
          <div>
            <span
              style={{
                height: "25px",
                width: "25px",
                backgroundColor: "red",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            <span>Recording...</span>
          </div>
        )}
        <div>
          <label htmlFor="isAutoPlay">Auto Play</label>
          <input
            type="checkbox"
            name="isAutoPlay"
            checked={isAutoPlay}
            onChange={() => setIsAutoPlay((v) => !v)}
          />
        </div>
      </div>
    </div>
  );
};
