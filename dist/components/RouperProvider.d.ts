import React, { PropsWithChildren } from 'react';
import { RouperContextParams, RouperProviderProps } from '../types';
type Props = PropsWithChildren<RouperProviderProps>;
export declare const RouperContext: React.Context<RouperContextParams>;
declare const RouperProvider: React.FC<Props>;
export default RouperProvider;
