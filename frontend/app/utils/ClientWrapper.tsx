'use client';

import { RecoilRoot, useRecoilValue } from 'recoil';
import CartAddedPopup from './CartAddedPopup';
import Footer from '../components/Footer';
import { SessionProvider } from 'next-auth/react';
import { ProductData } from './store';
import Navbar from '../components/Navbar';

export default function ClientWrapper({ children,categories,products }: { children: React.ReactNode,categories:string[],products:ProductData[] }) {
  return (
        <SessionProvider>
          <RecoilRoot>
            <Navbar categories={categories} products={products}/>
            <CartAddedPopup >{children}</CartAddedPopup>
            <Footer />
          </RecoilRoot>
        </SessionProvider>
  );
}
