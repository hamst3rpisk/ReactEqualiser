import classes from "./MainPage.module.css";
import cs from "classnames";
import { useWebAudioContext } from "../../../contexts/WebAudioProvider";
import { useEffect, useRef, useState, type Ref } from "react";
interface MainPageProps extends React.HTMLAttributes<HTMLDivElement> {}

const MainPage = ({
  children,
  className,
  ...props
}: MainPageProps): React.JSX.Element => {
  const { audioContext, getMediaDevices } = useWebAudioContext();
  const [frequencies, setFrequencies] = useState<any>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasWidth = 1600;
  const canvasHeight = 900;

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
        canvasContext?.fillRect(
          i * barWidth,
          0,
          barWidth,
          (intervalHeight * element) / 3
        );
      });
      setTimeout(() => {
        canvasContext!.fillStyle = "#242424";
        canvasContext!.fillRect(0, 0, canvasWidth, canvasHeight);
      }, 199);
    }, 200);
  }
  return (
    <div className={cs(classes.container, className)} {...props}>
      <button onClick={controlMedia}>init</button>
      <canvas
        style={{ width: `${canvasWidth}`, height: `${canvasHeight}` }}
        ref={canvasRef}
      />
      {frequencies}
      {children}
    </div>
  );
};

export default MainPage;
