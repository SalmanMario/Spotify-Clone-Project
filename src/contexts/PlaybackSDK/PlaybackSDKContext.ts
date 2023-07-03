import {createContext, useContext} from 'react';
import {useWebplaySDK} from '../../hooks';

export const PlaybackSDKContext = createContext<
  ReturnType<typeof useWebplaySDK>  
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
>(null!);

export const usePlaybackSDKContext = () => useContext(PlaybackSDKContext);
