import { AppProps } from 'next/app';

import '../styles/global.scss';

const MyApp: React.FC<AppProps> = ({
  Component,
  pageProps,
}): React.ReactElement => {
  return <Component {...pageProps} />;
};

export default MyApp;
