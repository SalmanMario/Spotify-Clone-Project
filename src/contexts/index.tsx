import type {ReactNode} from 'react';
import {
  SpotifyUserContextProvider,
  SpotifyUserLoader,
} from './SpotifyUser/SpotifyUserContextProvider';

function ApplyContext(props: {
  contexts: Array<(c: {children: ReactNode}) => JSX.Element | null>;
  children: ReactNode;
}) {
  return props.contexts.reduce(
    (children, Component) => <Component>{children}</Component>,
    props.children,
  ) as JSX.Element;
}

export function ContextsProvider({children}: {children: ReactNode}) {
  return (
    // order matters here, if your context is dependent on another context place it BEFORE the dependent context
    // e.g [dependentOnContext,context]
    <ApplyContext contexts={[SpotifyUserLoader, SpotifyUserContextProvider]}>
      {children}
    </ApplyContext>
  );
}
