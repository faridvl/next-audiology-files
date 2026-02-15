import React from 'react';
import Head from 'next/head';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { BoxedLayoutStyle } from '@/components/common/layout/boxed-container/boxed-container';
import { Package, AlertCircle, ShoppingCart } from 'lucide-react';

const ProductCard = ({ brand, model, stock, price }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Package size={20} />
            </div>
            {stock < 5 && (
                <span className="flex items-center gap-1 text-[9px] font-black bg-red-50 text-red-500 px-2 py-1 rounded-lg uppercase italic border border-red-100 animate-pulse">
                    <AlertCircle size={10} /> Stock Bajo
                </span>
            )}
        </div>
        <h4 className="font-black text-slate-800 leading-tight">{brand}</h4>
        <p className="text-xs text-slate-400 font-bold mb-4 uppercase">{model}</p>
        <div className="flex justify-between items-end border-t border-slate-50 pt-4">
            <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Existencia</p>
                <p className="text-lg font-black text-slate-700">{stock} <small className="text-[10px] text-slate-400">uds</small></p>
            </div>
            <p className="text-blue-600 font-black text-xl">{price}</p>
        </div>
    </div>
);

const Inventory: React.FC = () => {
    return (
        <>
            <Head><title>Inventario | AudiologyFiles</title></Head>
            <DashboardLayout isMainPage contentStyle={BoxedLayoutStyle.FULL} title="Control de Inventario">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ProductCard brand="Phonak" model="Audéo L-R" stock={3} price="$1,200" />
                    <ProductCard brand="Rayovac" model="Pilas Mod 312" stock={540} price="$15" />
                    <ProductCard brand="Starkey" model="Evolv AI 2400" stock={12} price="$2,100" />
                    <ProductCard brand="Widex" model="Moment 440" stock={2} price="$1,850" />
                </div>
            </DashboardLayout>
        </>
    );
};

export const getServerSideProps = authorizeServerSidePage();
export default Inventory;