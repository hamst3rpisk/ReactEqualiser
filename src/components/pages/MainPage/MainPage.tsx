import classes from "./MainPage.module.css";
import cs from "classnames";
import { useWebAudioContext } from "../../../contexts/WebAudioProvider";
import { useRef, useState } from "react";
import Header from "../../organisms/Header/Header";
interface MainPageProps extends React.HTMLAttributes<HTMLDivElement> {}

const compressArray = (
  array: Uint8Array,
  bufferLength: number,
): Uint8Array<ArrayBuffer> => {
  let compressedArray = new Uint8Array(bufferLength / 5);
  let tempSum: number = array[0];
  for (let i = 0; i < array.length - 5; i++) {
    if (i % 5 == 0) {
      compressedArray.set([Math.floor(tempSum / 5)], i / 5);
      tempSum = 0;
    }
    tempSum += array[i];
  }
  return compressedArray;
};
const MainPage = ({
  children,
  className,
  ...props
}: MainPageProps): React.JSX.Element => {
  const { audioContext, getMediaDevices } = useWebAudioContext();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [previousEqState, setPreviousEqState] = useState<
    Uint8Array<ArrayBuffer>
  >(new Uint8Array());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasWidth = 1280;
  const canvasHeight = 540;

  const controlMedia = async () => {
    await audioContext.resume();
    const stream = await getMediaDevices();

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyserRef.current = analyser;

    setIsReady(true);
  };

  if (isReady) {
    const bufferLength = (analyserRef.current as AnalyserNode)
      .frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    let compressedArray = compressArray(dataArray, bufferLength);
    let barWidth = Math.floor(canvasWidth / compressedArray.length);
    let intervalHeight = canvasHeight / 255;
    setInterval(() => {
      (analyserRef.current as AnalyserNode).getByteFrequencyData(dataArray);
      compressedArray = compressArray(dataArray, bufferLength);

      const canvasContext = (canvasRef.current as HTMLCanvasElement).getContext(
        "2d",
      );

      compressedArray.forEach((element, i) => {
        if (compressedArray[i] != previousEqState[i]) {
          canvasContext!.fillStyle = "#F2F2F2";
          canvasContext!.fillRect(i * barWidth, 0, barWidth, canvasHeight);
          canvasContext!.fillStyle = `hsl(340, 86%, ${compressedArray[i] / 2.55}%)`;
          canvasContext?.fillRect(
            i * barWidth,
            0,
            barWidth,
            (intervalHeight * element) / 3,
          );
        }
      });
      setPreviousEqState(compressedArray);
    }, 25);
  }
  return (
    <div className={cs(classes.container, className)} {...props}>
      <Header />
      <button className={classes.mainButton} onClick={controlMedia}>
        initiate
      </button>
      <div>
        <canvas
          className={classes.canvas}
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
          ref={canvasRef}
        />
      </div>
      {children}
    </div>
  );
};

export default MainPage;
