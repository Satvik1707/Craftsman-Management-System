import Link from 'next/link';
import Head from 'next/head';

const Unauthorized = () => {
  return (
    <>
      <Head>
        <title>Unauthorized Access</title>
      </Head>
      <div className="flex flex-col h-screen justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-lg mb-8">
          You do not have permission to access this page.
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

export default Unauthorized;
