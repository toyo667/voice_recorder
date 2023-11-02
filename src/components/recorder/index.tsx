import { useCallback, useState } from "react";
import useRecorder from "../../hooks/useRecorder";

export const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRecorder();

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
      {recorder && (
        <div>
          {isRecording ? (
            <button onClick={recordStopEv}>Stop</button>
          ) : (
            <button onClick={recordStartEv}>Record</button>
          )}
          <button onClick={() => recorder.play()}>Play</button>
          <button onClick={() => recorder.stop()}>Stop</button>
        </div>
      )}
    </div>
  );
};
