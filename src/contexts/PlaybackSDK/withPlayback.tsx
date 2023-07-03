import {FC} from 'react';
import {PlaybackContextProvider} from './PlaybackSDKContextProvider';

export function withPlabackContext(Content: FC) {
  return function Element() {
    return (
      <PlaybackContextProvider>
        <Content />
      </PlaybackContextProvider>
    );
  };
}
