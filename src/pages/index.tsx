const Home: React.FC = (): React.ReactElement => {
  return (
    <>
      <h1>Podcastr</h1>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const response = await fetch(
    'https://my-json-server.typicode.com/Spiielberg/podcastr-server/episodes'
  );
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  };
}
