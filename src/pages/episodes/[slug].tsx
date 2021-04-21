import { useRouter } from 'next/router';

const Episode: React.FC = (): React.ReactElement => {
  const router = useRouter();

  return (
    <>
      <h1>{router.query.slug}</h1>
    </>
  );
};

export default Episode;
