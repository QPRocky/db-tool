import React from 'react';
import { GetServerSideProps, NextPage } from 'next';

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    redirect: {
      destination: '/Search',
      permanent: false,
    },
  };
};

const IndexPage: NextPage = () => {
  return <p>IndexPage</p>;
};

export default IndexPage;
