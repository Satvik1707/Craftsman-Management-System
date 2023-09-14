import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Route-Planner-App</title>
      </Head>
      <main className="m-5 flex justify-center items-center flex-col">
        <h1 className="text-4xl font-bold text-center mb-10">
          Welcome to Craftsman Management System with Route Planning
        </h1>
        <button
          onClick={() => router.push('/auth/login')}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Click Here to Login
        </button>
      </main>
    </>
  );
}
