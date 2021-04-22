import { useCallback, useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/global.scss';
import styles from '../styles/app.module.scss';

import { PlayerContext } from '../contexts/PlayerContext';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

const MyApp: React.FC<AppProps> = ({
  Component,
  pageProps,
}): React.ReactElement => {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(episode => {
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
    <>
      <Head>
        <title>Podcastr</title>
      </Head>
      <body>
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
          <div className={styles.wrapper}>
            <main>
              <Header />
              <Component {...pageProps} />
            </main>
            <Player />
          </div>
        </PlayerContext.Provider>
      </body>
    </>
  );
};

export default MyApp;
