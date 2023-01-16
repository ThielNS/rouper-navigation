import React, { createContext, PropsWithChildren, useState } from 'react';
import { RouperContextParams, RouperProviderProps } from '../types';

type Claims = string[] | null;
type Props = PropsWithChildren<RouperProviderProps>;

export const RouperContext = createContext({} as RouperContextParams);

const RouperProvider: React.FC<Props> = ({ client, ...props }) => {
  const [claims, _setClaims] = useState<Claims>(client.getClaims);

  function setClaims(passClaims: Claims) {
    _setClaims(() => {
      client.setClaims(passClaims);
      return passClaims;
    });
  }

  return (
    <RouperContext.Provider value={{ claims, setClaims, client }}>
      {props.children}
    </RouperContext.Provider>
  );
};

export default RouperProvider;
