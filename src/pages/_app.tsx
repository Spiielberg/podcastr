import { AppProps } from 'next/app';

import '../styles/global.scss';
import styles from '../styles/app.module.scss';

import { PlayerContextProvider } from '../contexts/PlayerContext';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

const MyApp: React.FC<AppProps> = ({
  Component,
  pageProps,
}): React.ReactElement => {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  );
};

export default MyApp;
