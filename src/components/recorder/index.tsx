import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import useRecorder from "../../hooks/useRecorder";
import styled from "@emotion/styled";

export const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const recorder = useRecorder(isAutoPlay);

  /**録音開始 */
  const recordStartEv = useCallback(async () => {
    // Recorderオブジェクトの作成
    console.log("startRecording...");
    setIsRecording(true);
    recorder.startRecording(isAutoPlay);
  }, [recorder, isAutoPlay]);

  /**録音停止 */
  const recordStopEv = useCallback(async () => {
    console.log("stopRecording...");
    setIsRecording(false);
    recorder.stopRecording();
  }, [recorder]);

  return (
    <Container>
      <Box sx={{ mt: 10 }}>
        <Typography variant="h3">
          マイクから音声読み込んで再生するやつ
        </Typography>
        <Typography>英語勉強のスピーキング、リスニング確認用</Typography>
        <Typography>
          AutoPlayにチェックを入れると録音停止時に自動で再生してくれるよ
        </Typography>

        <Box sx={{ mb: 1, mt: 2, display: "flex" }}>
          <Box sx={{ mr: 1 }}>
            {/* Record 開始終了ボタン */}
            {isRecording ? (
              <Button size="large" variant="contained" onClick={recordStopEv}>
                Stop
              </Button>
            ) : (
              <Button size="large" variant="contained" onClick={recordStartEv}>
                Record
              </Button>
            )}
          </Box>

          {/* レコード中表示 */}
          {isRecording && (
            <Box sx={{ display: "flex" }}>
              <Box
                style={{
                  height: "25px",
                  width: "25px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              />
              <Box>Recording...</Box>
            </Box>
          )}
        </Box>
        {/* 再生開始停止初期化ボタン */}
        {!isAutoPlay && (
          <ButtonGroup variant="contained">
            <Button onClick={() => recorder.play()}>Play</Button>
            <Button color="error" onClick={() => recorder.stop()}>
              Stop
            </Button>
            <Button variant="outlined" onClick={() => recorder.clear()}>
              Clear
            </Button>
          </ButtonGroup>
        )}
        {/* 自動再生ボタン */}
        <Box>
          <FormControlLabel
            label="Auto Play"
            control={
              <Checkbox
                name="isAutoPlay"
                checked={isAutoPlay}
                onChange={() => setIsAutoPlay((v) => !v)}
              />
            }
          />
        </Box>
      </Box>
    </Container>
  );
};

const Container = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
