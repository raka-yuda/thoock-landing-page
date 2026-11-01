import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { pricingEnabled } from './pricing';

const PricingAvailability = createContext<{ visible: boolean; setVisible: Dispatch<SetStateAction<boolean>> }>({ visible: pricingEnabled, setVisible: () => {} });

export function PricingAvailabilityProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(pricingEnabled);
  return <PricingAvailability.Provider value={{ visible, setVisible }}>{children}</PricingAvailability.Provider>;
}

export const usePricingAvailability = () => useContext(PricingAvailability);
