import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import SideNav from "~/components/SideNav";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <SessionProvider session={session}>

      <Head>
        <title>Social App</title>
        <meta name="description" content="This is a twitter clone by webdevsimplified" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head>

    <div className="container mx-auto flex items-start sm:pr-4">
      <SideNav />
        <main className="min-h-screen flex-grow border-x">
         <Component {...pageProps} />
        </main>
    </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
