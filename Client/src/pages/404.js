import Link from 'next/link';
import Head from 'next/head';
const Custom404 = () => {
  return (
    <>
      <Head>
        <title>404 Not Found</title>
      </Head>
      <div className="flex flex-col h-screen justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Go Back
        </Link>
      </div>
    </>
  );
};

export default Custom404;
