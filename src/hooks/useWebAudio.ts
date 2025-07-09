export interface useWebAudioReturn {
  audioContext: AudioContext;
  getMediaDevices: () => any;
  testF: () => any;
}

export const useWebAudio = (): useWebAudioReturn => {
  const audioContext = new AudioContext();

  const getMediaDevices = async () => {
    if (navigator.mediaDevices) {
      try {
        const dev = await navigator.mediaDevices.getUserMedia({ audio: true });
        return dev;
      } catch (error) {
        console.error(error);
      }
    }
    return "none";
  };
  ("");

  const testF = () => {
    console.log("work");
    return;
  };

  return { audioContext, getMediaDevices, testF };
};
