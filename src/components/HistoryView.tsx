/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine } from 'lucide-react';
import { Screen, Stock, Transaction } from '../types';

type HistoryFilter = 'Semua' | 'Beli' | 'Jual' | 'Berhasil' | 'Gagal';
type HistoryStatus = 'Berhasil' | 'Gagal';

interface HistoryViewProps {
  orders: Transaction[];
  stocks: Stock[];
  onNavigate: (screen: Screen) => void;
}

interface HistoryItem {
  id: string;
  stockCode: string;
  stockName: string;
  type: 'Beli' | 'Jual';
  status: HistoryStatus;
  amount: number;
  time: string;
  group: string;
}

const seedHistory: HistoryItem[] = [
  {
    id: 'hist-bmri-sell',
    stockCode: 'BMRI',
    stockName: 'Bank Mandiri',
    type: 'Jual',
    status: 'Berhasil',
    amount: 5120000,
    time: '09:15',
    group: 'HARI INI',
  },
  {
    id: 'hist-goto-failed',
    stockCode: 'GOTO',
    stockName: 'GoTo Gojek Tokopedia',
    type: 'Beli',
    status: 'Gagal',
    amount: 1500000,
    time: '11:05',
    group: '12 MEI 2024',
  },
];

const filters: HistoryFilter[] = ['Semua', 'Beli', 'Jual', 'Berhasil', 'Gagal'];

function formatIDR(value: number) {
  return 'Rp ' + value.toLocaleString('id-ID');
}

function shortStockName(stock?: Stock) {
  if (!stock) return 'Saham Indonesia';
  return stock.name
    .replace(/\s*Tbk\.?/i, '')
    .replace(/\s*\(Persero\)/i, '')
    .replace('Bank Central Asia', 'Bank Central Asia')
    .trim();
}

export default function HistoryView({ orders, stocks, onNavigate }: HistoryViewProps) {
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>('Semua');

  const historyItems = useMemo(() => {
    const liveItems: HistoryItem[] = orders.map((order, index) => {
      const stock = stocks.find((item) => item.code === order.stockCode);
      const type = order.type === 'BUY' ? 'Beli' : 'Jual';
      return {
        id: order.id,
        stockCode: order.stockCode,
        stockName: shortStockName(stock),
        type,
        status: 'Berhasil',
        amount: order.totalPayment,
        time: index === 0 ? '14:30' : '13:05',
        group: 'HARI INI',
      };
    });

    const existingCodes = new Set(liveItems.map((item) => item.stockCode + item.type + item.status));
    const supportingItems = seedHistory.filter(
      (item) => !existingCodes.has(item.stockCode + item.type + item.status)
    );

    return [...liveItems, ...supportingItems];
  }, [orders, stocks]);

  const filteredItems = historyItems.filter((item) => {
    if (activeFilter === 'Semua') return true;
    return item.type === activeFilter || item.status === activeFilter;
  });

  const groupedItems = filteredItems.reduce<Record<string, HistoryItem[]>>((groups, item) => {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
    return groups;
  }, {});

  return (
    <div id="history-view" className="h-full overflow-y-auto bg-surface-bg pb-6 no-scrollbar">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
        <div className="border-b border-gray-100 bg-surface-bg px-5 pb-4 pt-5">
          <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('Home')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/5 active:scale-95"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5 stroke-[2.4]" />
          </button>
            <h1 className="text-xl font-bold tracking-tight text-primary">Riwayat Transaksi</h1>
          </div>
        </div>

        <div className="px-5 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`h-9 shrink-0 rounded-full px-4 text-xs font-bold transition-all active:scale-95 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 pt-4">
          {Object.entries(groupedItems).map(([group, items]) => (
            <section key={group}>
              <h2 className="mb-2.5 text-[10px] font-bold tracking-[0.18em] text-slate-700">{group}</h2>
              <div className="flex flex-col gap-2.5">
                {items.map((item) => {
                  const isBuy = item.type === 'Beli';
                  const isFailed = item.status === 'Gagal';
                  const iconClasses = isFailed
                    ? 'bg-red-100 text-red-700'
                    : isBuy
                      ? 'bg-blue-100 text-primary'
                      : 'bg-green-100 text-green-700';
                  const badgeClasses = isFailed
                    ? 'bg-red-100 text-red-700'
                    : isBuy
                      ? 'bg-sky-200 text-sky-900'
                      : 'bg-green-100 text-green-700';

                  return (
                    <article
                      key={item.id}
                      className="flex min-h-24 items-center justify-between rounded-2xl bg-white px-3.5 py-3 soft-shadow border border-gray-100"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClasses}`}>
                          {isBuy ? (
                            <ArrowDownToLine className="h-4 w-4 stroke-[2.5]" />
                          ) : (
                            <ArrowUpFromLine className="h-4 w-4 stroke-[2.5]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-black leading-tight text-gray-950">{item.stockCode}</h3>
                          <p className="max-w-28 truncate text-[11px] font-semibold leading-tight text-slate-700">
                            {item.stockName}
                          </p>
                          <span className={`mt-2 inline-flex rounded-md px-2 py-0.5 text-[9px] font-bold ${badgeClasses}`}>
                            {item.type} • {item.status}
                          </span>
                        </div>
                      </div>

                      <div className="min-w-[96px] shrink-0 text-right">
                        <p className={`text-sm font-black tracking-tight ${isFailed ? 'text-gray-500' : 'text-gray-950'}`}>
                          {formatIDR(item.amount)}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-slate-700">{item.time}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          {filteredItems.length === 0 && (
            <div className="rounded-3xl bg-white p-8 text-center text-sm font-semibold text-gray-500 shadow-sm">
              Tidak ada riwayat untuk filter ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
