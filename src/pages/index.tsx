import { GetStaticProps } from 'next';
import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import { PlayerContext } from '../contexts/PlayerContext';

import styles from './home.module.scss';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  duration: number;
  durationAsString: string;
};

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
};

const Home: React.FC<HomeProps> = ({
  latestEpisodes,
  allEpisodes,
}): React.ReactElement => {
  const { play } = useContext(PlayerContext);

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>
                    <Image
                      width={192}
                      height={192}
                      objectFit='cover'
                      src={episode.thumbnail}
                      alt={episode.title}
                    />
                  </a>
                </Link>

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a className={styles.link}>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type='button' onClick={() => play(episode)}>
                  <img src='/play-green.svg' alt='Tocar episódio' />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>
                        <Image
                          width={120}
                          height={120}
                          objectFit='cover'
                          src={episode.thumbnail}
                          alt={episode.title}
                        />
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a className={styles.link}>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type='button' onClick={() => play(episode)}>
                      <img src='/play-green.svg' alt='Tocar episódio' />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR,
      }),
      thumbnail: episode.thumbnail,
      url: episode.file.url,
      duration: episode.file.duration,
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, // 8 hours
  };
};

export default Home;
