/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stock, LearnModule, UserProfile, PortfolioItem } from './types';

export const INITIAL_STOCKS: Stock[] = [
  {
    code: 'BBCA',
    name: 'Bank Central Asia Tbk.',
    price: 10250,
    prevPrice: 10125,
    changePercent: 1.2,
    changeAmount: 125,
    category: 'perbankan',
    aiConfidence: 82,
    aiRecommendation: 'BUY',
    riskLevel: 'Rendah',
    fundamental: 'Fundamental kuat didukung pertumbuhan kredit solid. Sentimen positif dari laporan laba Q3 dan posisi likuiditas yang sangat memadai di tengah fluktuasi suku bunga.',
    pe: '22.4x',
    pbv: '4.1x',
    roe: '24.2%',
    divYield: '2.5%',
    peClassification: 'Premium (vs Industri 18.2x)',
    pbvClassification: 'Normal',
    roeClassification: 'Outperform',
    divYieldClassification: 'Normal',
    bullCase: 11500,
    bearCase: 9200,
    drivers: [
      'Pertumbuhan solid pada segmen kredit korporasi dan konsumer.',
      'Efisiensi operasional tertinggi di industri (CASA Ratio > 80%).',
      'Ekosistem pembayaran digital yang sangat mendominasi di Indonesia.'
    ],
    chartData: [
      { label: 'Week 1', price: 9200 },
      { label: 'Week 2', price: 9400 },
      { label: 'Week 3', price: 9350 },
      { label: 'Week 4', price: 9700 },
      { label: 'Week 5', price: 9650 },
      { label: 'Week 6', price: 10050 },
      { label: 'Week 7', price: 10250 }
    ],
    orderBook: [
      { bidLot: '12,450', bidPrice: 10225, askPrice: 10250, askLot: '9,800' },
      { bidLot: '8,300', bidPrice: 10200, askPrice: 10275, askLot: '14,200' },
      { bidLot: '15,100', bidPrice: 10175, askPrice: 10300, askLot: '22,500' },
      { bidLot: '5,200', bidPrice: 10150, askPrice: 10325, askLot: '6,100' },
      { bidLot: '21,000', bidPrice: 10125, askPrice: 10350, askLot: '18,900' }
    ]
  },
  {
    code: 'BBRI',
    name: 'Bank Rakyat Indonesia Tbk.',
    price: 5450,
    prevPrice: 5385,
    changePercent: 1.2,
    changeAmount: 65,
    category: 'perbankan',
    aiConfidence: 78,
    aiRecommendation: 'BUY',
    riskLevel: 'Rendah',
    fundamental: 'Kinerja prima ditopang oleh pertumbuhan kredit mikro dan ultra mikro melalui holding PNM dan Pegadaian. Manajemen risiko terjaga sehat.',
    pe: '14.5x',
    pbv: '2.5x',
    roe: '18.5%',
    divYield: '4.8%',
    peClassification: 'Undervalued',
    pbvClassification: 'Normal',
    roeClassification: 'Good Performance',
    divYieldClassification: 'High Yield',
    bullCase: 6200,
    bearCase: 4900,
    drivers: [
      'Ekspansi super cepat dari integrasi segmen Kupedes dan PNM Mekaar.',
      'Margin bunga bersih (NIM) yang solid di atas rata-rata industri (> 7.5%).'
    ],
    chartData: [
      { label: 'Week 1', price: 5100 },
      { label: 'Week 2', price: 5200 },
      { label: 'Week 3', price: 5150 },
      { label: 'Week 4', price: 5350 },
      { label: 'Week 5', price: 5300 },
      { label: 'Week 6', price: 5400 },
      { label: 'Week 7', price: 5450 }
    ],
    orderBook: [
      { bidLot: '42,500', bidPrice: 5425, askPrice: 5450, askLot: '28,100' },
      { bidLot: '35,100', bidPrice: 5400, askPrice: 5475, askLot: '33,500' },
      { bidLot: '19,200', bidPrice: 5375, askPrice: 5500, askLot: '45,200' },
      { bidLot: '56,000', bidPrice: 5350, askPrice: 5525, askLot: '12,900' },
      { bidLot: '82,000', bidPrice: 5325, askPrice: 5550, askLot: '38,000' }
    ]
  },
  {
    code: 'BMRI',
    name: 'Bank Mandiri (Persero) Tbk.',
    price: 6850,
    prevPrice: 6725,
    changePercent: 1.85,
    changeAmount: 125,
    category: 'perbankan',
    aiConfidence: 85,
    aiRecommendation: 'BUY',
    riskLevel: 'Rendah',
    fundamental: 'Efisiensi operasional digital yang sangat baik melalui Livin by Mandiri. Likuiditas yang kuat dan efisiensi biaya dana (CoF) menopang profitabilitas tinggi.',
    pe: '11.8x',
    pbv: '2.1x',
    roe: '21.4%',
    divYield: '5.2%',
    peClassification: 'Sangat Menarik',
    pbvClassification: 'Normal',
    roeClassification: 'Sangat Sehat',
    divYieldClassification: 'High Yield',
    bullCase: 7800,
    bearCase: 6100,
    drivers: [
      'Pertumbuhan luar biasa dari pengguna aktif platform Livin dan Kopra.',
      'Sinergi korporasi BUMN yang kuat dengan biaya dana yang sangat bersaing.'
    ],
    chartData: [
      { label: 'Week 1', price: 6300 },
      { label: 'Week 2', price: 6450 },
      { label: 'Week 3', price: 6400 },
      { label: 'Week 4', price: 6600 },
      { label: 'Week 5', price: 6550 },
      { label: 'Week 6', price: 6750 },
      { label: 'Week 7', price: 6850 }
    ],
    orderBook: [
      { bidLot: '22,400', bidPrice: 6825, askPrice: 6850, askLot: '14,900' },
      { bidLot: '18,300', bidPrice: 6800, askPrice: 6875, askLot: '22,100' },
      { bidLot: '31,000', bidPrice: 6775, askPrice: 6900, askLot: '42,500' },
      { bidLot: '15,200', bidPrice: 6750, askPrice: 6925, askLot: '11,100' },
      { bidLot: '29,000', bidPrice: 6725, askPrice: 6950, askLot: '19,900' }
    ]
  },
  {
    code: 'TLKM',
    name: 'Telkom Indonesia Tbk.',
    price: 3820,
    prevPrice: 3840,
    changePercent: -0.52,
    changeAmount: -20,
    category: 'teknologi',
    aiConfidence: 65,
    aiRecommendation: 'HOLD',
    riskLevel: 'Rendah',
    fundamental: 'Arus kas yang melimpah dan kepemimpinan pasar infrastruktur konektivitas digital yang sangat kuat di Indonesia. Sentimen jangka pendek tertekan pengeluaran belanja modal 5G.',
    pe: '15.8x',
    pbv: '3.2x',
    roe: '16.5%',
    divYield: '4.2%',
    peClassification: 'Normal',
    pbvClassification: 'Normal',
    roeClassification: 'Normal',
    divYieldClassification: 'Menarik',
    bullCase: 4300,
    bearCase: 3500,
    drivers: [
      'Dominasi pasar broadband Fiber Optic IndiHome yang terus berekspansi di wilayah rural.',
      'Sinergi pusat data (Data Center) NeutraDC yang melayani korporasi global.'
    ],
    chartData: [
      { label: 'Week 1', price: 4050 },
      { label: 'Week 2', price: 3980 },
      { label: 'Week 3', price: 3950 },
      { label: 'Week 4', price: 3880 },
      { label: 'Week 5', price: 3910 },
      { label: 'Week 6', price: 3850 },
      { label: 'Week 7', price: 3820 }
    ],
    orderBook: [
      { bidLot: '65,000', bidPrice: 3810, askPrice: 3820, askLot: '54,200' },
      { bidLot: '43,000', bidPrice: 3800, askPrice: 3830, askLot: '38,100' },
      { bidLot: '82,100', bidPrice: 3790, askPrice: 3845, askLot: '72,500' },
      { bidLot: '22,400', bidPrice: 3780, askPrice: 3865, askLot: '24,000' },
      { bidLot: '95,000', bidPrice: 3770, askPrice: 3880, askLot: '61,300' }
    ]
  },
  {
    code: 'ANTM',
    name: 'Aneka Tambang Tbk.',
    price: 1680,
    prevPrice: 1645,
    changePercent: 2.13,
    changeAmount: 35,
    category: 'energi',
    aiConfidence: 74,
    aiRecommendation: 'BUY',
    riskLevel: 'Sedang',
    fundamental: 'Katalis positif dari proyek hilirisasi nikel dan pabrik baterai kendaraan listrik nasional (IBC). Kenaikan harga emas internasional mendongkrak margin keuntungan emas Antam.',
    pe: '12.1x',
    pbv: '1.8x',
    roe: '14.8%',
    divYield: '3.1%',
    peClassification: 'Cukup Murah',
    pbvClassification: 'Sangat Wajar',
    roeClassification: 'Sehat',
    divYieldClassification: 'Wajar',
    bullCase: 1950,
    bearCase: 1450,
    drivers: [
      'Permintaan nikel kelas baterai berkualitas tinggi yang melonjak dari smelter lokal.',
      'Sertifikasi LBMA pada produk emas batangan yang diakui global menjamin penjualan solid.'
    ],
    chartData: [
      { label: 'Week 1', price: 1580 },
      { label: 'Week 2', price: 1610 },
      { label: 'Week 3', price: 1595 },
      { label: 'Week 4', price: 1630 },
      { label: 'Week 5', price: 1620 },
      { label: 'Week 6', price: 1660 },
      { label: 'Week 7', price: 1680 }
    ],
    orderBook: [
      { bidLot: '88,200', bidPrice: 1675, askPrice: 1680, askLot: '91,000' },
      { bidLot: '42,000', bidPrice: 1670, askPrice: 1685, askLot: '56,200' },
      { bidLot: '105,400', bidPrice: 1665, askPrice: 1690, askLot: '110,500' },
      { bidLot: '61,500', bidPrice: 1660, askPrice: 1695, askLot: '34,900' },
      { bidLot: '121,000', bidPrice: 1655, askPrice: 1700, askLot: '142,000' }
    ]
  },
  {
    code: 'ADRO',
    name: 'Adaro Energy Indonesia Tbk.',
    price: 2850,
    prevPrice: 2800,
    changePercent: 1.78,
    changeAmount: 50,
    category: 'energi',
    aiConfidence: 80,
    aiRecommendation: 'BUY',
    riskLevel: 'Sedang',
    fundamental: 'Diversifikasi agresif ke energi baru terbarukan (EBT) dan smelter aluminium di Kaltara. Arus kas operasional yang luar biasa dan rasio hutang yang sangat rendah mendatangkan dividen besar.',
    pe: '5.2x',
    pbv: '0.9x',
    roe: '19.2%',
    divYield: '8.5%',
    peClassification: 'Sangat Murah',
    pbvClassification: 'Undervalued',
    roeClassification: 'Sangat Tinggi',
    divYieldClassification: 'Sangat Tinggi (Jumbo)',
    bullCase: 3400,
    bearCase: 2450,
    drivers: [
      'Peralihan portofolio ke green aluminum dan pembangunan pembangkit hydro.',
      'Efisiensi tinggi pada jalur logistik batubara internal (Sungai Barito).'
    ],
    chartData: [
      { label: 'Week 1', price: 2600 },
      { label: 'Week 2', price: 2750 },
      { label: 'Week 3', price: 2680 },
      { label: 'Week 4', price: 2810 },
      { label: 'Week 5', price: 2790 },
      { label: 'Week 6', price: 2830 },
      { label: 'Week 7', price: 2850 }
    ],
    orderBook: [
      { bidLot: '51,400', bidPrice: 2840, askPrice: 2850, askLot: '38,900' },
      { bidLot: '34,200', bidPrice: 2830, askPrice: 2860, askLot: '42,500' },
      { bidLot: '95,000', bidPrice: 2820, askPrice: 2870, askLot: '75,100' },
      { bidLot: '22,100', bidPrice: 2810, askPrice: 2880, askLot: '18,300' },
      { bidLot: '74,000', bidPrice: 2800, askPrice: 2890, askLot: '56,000' }
    ]
  },
  {
    code: 'GOTO',
    name: 'GoTo Gojek Tokopedia Tbk.',
    price: 65,
    prevPrice: 67,
    changePercent: -2.98,
    changeAmount: -2,
    category: 'teknologi',
    aiConfidence: 55,
    aiRecommendation: 'HOLD',
    riskLevel: 'Tinggi',
    fundamental: 'Kemitraan strategis dengan TikTok Shop mendongkrak margin bisnis e-commerce. Jalur menuju profitabilitas bersih disokong efisiensi biaya insentif dan operasional GOTO Financial.',
    pe: 'Negative',
    pbv: '0.6x',
    roe: '-12.5%',
    divYield: '0%',
    peClassification: 'Unprofitable',
    pbvClassification: 'Undervalued',
    roeClassification: 'Rugibersih Berkurang',
    divYieldClassification: 'No Dividend',
    bullCase: 90,
    bearCase: 50,
    drivers: [
      'Meningkatnya porsi Take Rate dari transaksi e-commerce Tokopedia-TikTok Shop.',
      'Akselerasi adopsi QRIS dan pinjaman digital GoPay Later di kalangan UMKM.'
    ],
    chartData: [
      { label: 'Week 1', price: 74 },
      { label: 'Week 2', price: 71 },
      { label: 'Week 3', price: 69 },
      { label: 'Week 4', price: 65 },
      { label: 'Week 5', price: 67 },
      { label: 'Week 6', price: 66 },
      { label: 'Week 7', price: 65 }
    ],
    orderBook: [
      { bidLot: '540,500', bidPrice: 64, askPrice: 65, askLot: '620,100' },
      { bidLot: '320,100', bidPrice: 63, askPrice: 66, askLot: '450,200' },
      { bidLot: '980,100', bidPrice: 62, askPrice: 67, askLot: '890,300' },
      { bidLot: '410,200', bidPrice: 61, askPrice: 68, askLot: '220,100' },
      { bidLot: '150,000', bidPrice: 60, askPrice: 69, askLot: '670,400' }
    ]
  }
];

export const INITIAL_MODULES: LearnModule[] = [
  {
    id: 'm1',
    title: 'Dasar Investasi Saham',
    description: 'Pahami konsep dasar saham, risiko, dan potensi keuntungannya sebelum mulai berinvestasi sejak dini.',
    category: 'Pemula',
    modules: 5,
    durationMinutes: 30,
    progress: 35,
    isFeatured: true,
    tagClass: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'm2',
    title: 'Membaca Laporan Keuangan',
    description: 'Pelajari cara menganalisis neraca keuangan, laporan laba rugi, dan arus kas kas perusahaan dengan mudah.',
    category: 'Fundamental',
    modules: 8,
    durationMinutes: 45,
    progress: 0,
    isFeatured: true,
    tagClass: 'bg-cyan-100 text-cyan-700'
  },
  {
    id: 'm3',
    title: 'Mengontrol Emosi Saat Trading',
    description: 'Hindari FOMO (Fear of Missing Out) dan panic selling dengan memahami psikologi investasi yang disiplin.',
    category: 'Psikologi',
    modules: 4,
    durationMinutes: 25,
    progress: 0,
    isFeatured: true,
    tagClass: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'm4',
    title: 'Analisis Teknikal Praktis',
    description: 'Belajar membaca grafik lilin (candlestick), trend line, dan alat bantu indikator seperti Moving Average (MA).',
    category: 'Teknikal',
    modules: 6,
    durationMinutes: 35,
    progress: 0,
    isFeatured: false,
    tagClass: 'bg-purple-100 text-purple-700'
  }
];

export const INITIAL_USER: UserProfile = {
  fullName: 'Talita Wijaya',
  email: 'talita.wijaya@gmail.com',
  phone: '081234567890',
  balance: 50000000, // Rp 50.000.000 (as shown in standard screen)
  riskProfile: 'Moderate',
  isPremium: false,
  biometricsEnabled: true
};

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    stockCode: 'BBCA',
    name: 'Bank Central Asia Tbk.',
    lots: 10,
    avgPrice: 9425,
    currentPrice: 9850
  },
  {
    stockCode: 'BBRI',
    name: 'Bank Rakyat Indonesia Tbk.',
    lots: 5,
    avgPrice: 5260,
    currentPrice: 5200
  }
];

export const INITIAL_WATCHLIST: string[] = ['BBCA', 'BMRI', 'TLKM'];
