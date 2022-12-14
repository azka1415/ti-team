import Head from "next/head";
import React from "react";
import Navbar from "../../components/navbar/Navbar";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default function TeamHome() {
  const getTeams = trpc.team.getTeams.useQuery();
  const { data } = getTeams;

  if (getTeams.error) {
    return <div>{getTeams.error.message}</div>;
  }

  return (
    <>
      <Head>
        <title>Teams</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex h-full w-full flex-col bg-inherit">
        <div className="flex h-full w-full p-2">
          <h1 className="text-3xl font-bold">Teams</h1>
          <div className="flex w-full items-center justify-end">
            <button className="rounded-lg bg-purple-500 p-2 text-sm transition-all hover:bg-purple-600">
              Create Team
            </button>
          </div>
        </div>
        <div className="flex flex-col px-2">
          {getTeams.isLoading && <div>Loading...</div>}
          {data?.teams.map((team) => (
            <div
              key={team.id}
              className="flex w-fit flex-col rounded-md bg-blue-300 p-2"
            >
              <h1>{team.name}</h1>
              <p>{team.description}</p>
              <p>{new Date(team.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
