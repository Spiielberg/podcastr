import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
  duration: number;
  durationAsString: string;
};

type EpisodeProps = {
  episode: Episode;
};

const Episode: React.FC<EpisodeProps> = ({ episode }): React.ReactElement => {
  const { play } = usePlayer();

  return (
    <>
      <Head>
        <title>Podcastr - {episode.title}</title>
      </Head>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href='/'>
            <button type='button'>
              <img src='/arrow-left.svg' alt='Voltar' />
            </button>
          </Link>
          <Image
            width={700}
            height={160}
            objectFit='cover'
            src={episode.thumbnail}
          />
          <button type='button' onClick={() => play(episode)}>
            <img src='/play.svg' alt='Tocar episódio' />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ctx => {
  const { slug } = ctx.params;

  const { data } = await api.get(`episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR,
    }),
    thumbnail: data.thumbnail,
    description: data.description,
    url: data.file.url,
    duration: data.file.duration,
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

export default Episode;
