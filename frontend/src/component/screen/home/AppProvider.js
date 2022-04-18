import React, {createContext, useState, useEffect} from 'react';
const PlayerContext = createContext(null);

const PlayerProvider = ({children}) => {
  const tracks = [
    {
      url: 'https://c1-ex-swe.nixcdn.com/NhacCuaTui1010/MyWarShingekiNoKyojinTheFinalSeasonOpeningTVSize-ShinseiKamattechan-6931423.mp3?st=bvCxCBwtLFtk6Vj7j-CWxA&e=1650348972&download=true',
      // url: '../../../assets/tracks/aot.mp3',
      title: 'Attack On Titan Season 4 OP',
      artist: 'Hiroyuki Sawano',
    },
    {
      url: 'https://c1-ex-swe.nixcdn.com/NhacCuaTui989/Awaken-LeagueOfLegendsValerieBroussard-5871455.mp3?st=hnBxF9RZYmKCUyRIdFX_ew&e=1650353957&t=1650267559061',
      // url: '../../../assets/tracks/awaken.mp3',
      title: 'Awaken',
      artist: 'League of Legends',
    },
    {
      url: 'https://c1-ex-swe.nixcdn.com/Sony_Audio60/BacktoYou-LouisTomlinsonBebeRexhaDigitalFarmAnimals-5919759.mp3?st=ZMa_Rlzvgn_zOZ5AKZ2bpw&e=1650353825&t=1650267429363',
      // url: '../../../assets/tracks/music.mp3',
      title: 'Back To You',
      artist: 'Louis Tomlinson, Bebe Rexha, Digital Farm Animals',
    },
    {
      url: 'https://data.chiasenhac.com/down2/2188/1/2187011-502a7d5d/128/Cold%20Heart%20PNAU%20Remix_%20-%20Elton%20John_%20Dua.mp3',
      // url: '../../../assets/tracks/coldHeart.mp3',
      title: 'Cold Heart (PNAU Remix)',
      artist: 'Elton John',
    },
    {
      url: 'https://c1-ex-swe.nixcdn.com/Monstercat_Audio1/CrabRave-Noisestorm-6983479.mp3?st=IXh2KIrV7iXWF8wnh2UddQ&e=1650353663&t=1650267264753',
      // url: '../../../assets/tracks/CrabRave.mp3',
      title: 'Crab Rave',
      artist: 'Noisestorm',
    },
  ];

  const [track, setTrack] = useState(tracks[0]);

  return (
    <PlayerContext.Provider value={{tracks, track, setTrack}}>
      {children}
    </PlayerContext.Provider>
  );
};

const usePlayerContext = () => {
  return React.useContext(PlayerContext);
};

export {PlayerProvider, usePlayerContext};
