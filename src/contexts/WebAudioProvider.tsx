import { createContext, useContext } from "react";
import { useWebAudio, type useWebAudioReturn } from "../hooks/useWebAudio";

interface WebAudioProviderProps extends React.HTMLAttributes<HTMLDivElement> {}

const WebAudioContext = createContext<useWebAudioReturn | null>(null);

const WebAudioProvider = ({ children }: WebAudioProviderProps): any => {
  const audio = useWebAudio();

  return (
    <WebAudioContext.Provider value={audio}>
      {children}
    </WebAudioContext.Provider>
  );
};

export const useWebAudioContext = () => {
  const context = useContext(WebAudioContext);
  if (!context) {
    throw new Error("no valid web audio provider");
  }
  return context;
};

export default WebAudioProvider;
