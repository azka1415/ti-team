import Head from "next/head";
import React from "react";
import Navbar from "../../components/navbar/Navbar";
import { trpc } from "../../utils/trpc";

export default function TeamHome() {
  const getTeams = trpc.team.getTeams.useQuery();
  const { data } = getTeams;
  console.log(data);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
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
              className="flex w-fit rounded-md bg-blue-300 p-2"
            >
              <h1>{team.name}</h1>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
