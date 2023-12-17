import Head from "next/head";
import { ComponentType } from "react";

function withHead<P extends object>(Component: ComponentType<P>, title: string, description: string) {
  const withHeadComponent = ({ ...props }) => {
    return (
      <>
        <Head>
          <title>{`Hoonap | ${title}`}</title>
          <meta name="description" content={`Hoonap의 ${description}`} />
        </Head>

        <Component {...(props as P)} />
      </>
    );
  };

  return withHeadComponent;
}

export default withHead;
