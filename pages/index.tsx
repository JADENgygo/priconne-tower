import dynamic from 'next/dynamic';
import { GetServerSideProps } from "next";
import { useMemo } from 'react';

export default function Home() {
  const Game = dynamic(() => import('../components/game'), { ssr: false });
  const gameMemo = useMemo(() => <Game />, []);
  return (
    <div className="container">
      <div className="text-center">
        <p>全てのプリンを一番右のお皿に移動させるとクリア！</p>
        <p>大きいプリンは小さいプリンの上には置けないよ</p>
        <p>最小31回でクリアできるよ</p>
      </div>
      <div id="game" className="text-center"></div>
      { gameMemo }
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: {}};
}
