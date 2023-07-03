import {FC} from 'react';
import {PlaybackSDKContext} from './PlaybackSDKContext';
import {useWebplaySDK} from '../../hooks';

export const PlaybackContextProvider: FC = ({children}) => {
  const playbackContext = useWebplaySDK();
  return (
    <PlaybackSDKContext.Provider value={playbackContext}>
      {children}
    </PlaybackSDKContext.Provider>
  );
};
