import classes from "./MainPage.module.css";
import cs from "classnames";
import { useWebAudioContext } from "../../../contexts/WebAudioProvider";
import { useRef, useState } from "react";
import Header from "../../organisms/Header/Header";
interface MainPageProps extends React.HTMLAttributes<HTMLDivElement> {}

const MainPage = ({
  children,
  className,
  ...props
}: MainPageProps): React.JSX.Element => {
  const { audioContext, getMediaDevices } = useWebAudioContext();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [previousEqState, setPreviousEqState] = useState<Uint8Array>(
    new Uint8Array()
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasWidth = 960;
  const canvasHeight = 540;

  const controlMedia = async () => {
    await audioContext.resume();
    const stream = await getMediaDevices();

    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyserRef.current = analyser;

    setIsReady(true);
  };

  if (isReady) {
    const bufferLength = (analyserRef.current as AnalyserNode)
      .frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    let barWidth = canvasWidth / dataArray.length;
    let intervalHeight = canvasHeight / 255;
    setInterval(() => {
      (analyserRef.current as AnalyserNode).getByteFrequencyData(dataArray);

      const canvasContext = (canvasRef.current as HTMLCanvasElement).getContext(
        "2d"
      );
      canvasContext!.fillStyle = "white";

      dataArray.forEach((element, i) => {
        if (dataArray[i] != previousEqState[i]) {
          canvasContext!.fillStyle = "#242424";
          canvasContext!.fillRect(i * barWidth, 0, barWidth, canvasHeight);
          canvasContext!.fillStyle = "white";
          canvasContext?.fillRect(
            i * barWidth,
            0,
            barWidth,
            (intervalHeight * element) / 3
          );
        }
      });
      // setTimeout(() => {
      //   canvasContext!.fillStyle = "#242424";
      //   canvasContext!.fillRect(0, 0, canvasWidth, canvasHeight);
      // }, 49);
      setPreviousEqState(dataArray);
    }, 25);
  }
  return (
    <div className={cs(classes.container, className)} {...props}>
      {/* <Header /> */}
      <div>
        <button onClick={controlMedia}>init</button>
      </div>
      <div>
        <canvas
          // className={classes.canvas}
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
          ref={canvasRef}
        />
      </div>
      {children}
    </div>
  );
};

export default MainPage;
