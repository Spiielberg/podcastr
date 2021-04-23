import React, { createContext, useCallback, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
};

export const PlayerContext = createContext<PlayerContextData>(
  {} as PlayerContextData
);

export const PlayerContextProvider: React.FC = ({
  children,
}): React.ReactElement => {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const setPlayingState = useCallback((state: boolean) => {
    setIsPlaying(state);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        play,
        togglePlay,
        setPlayingState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
