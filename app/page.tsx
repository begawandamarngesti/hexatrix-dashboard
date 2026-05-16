'use client';
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Zap, Sun, Thermometer, FileText, User, AlertTriangle, Printer, Download, Share2 } from 'lucide-react';

interface DataPoint {
  name: string;
  kwh: number;
  alert?: number;
}

interface ProfileState {
  nama: string;
  email: string;
  perusahaan: string;
  unitElektro: number;
  unitSolar: number;
  unitThermal: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const dashboardData = {
    hariIni: 100,
    estimasiPijakan: "45.210 Pijakan",
    peakHour: "12:00 - 14:00",
    energiDigunakan: 85,
    karbonTereduksi: 84.4,
    nilaiKarbon: 126600,
    reduksiSampah: "12.3 kg",
    peakHourReduksi: "13:00",
    dataHari: [
      { name: '00:00', kwh: 10 }, { name: '04:00', kwh: 15 },
      { name: '08:00', kwh: 30 }, { name: '12:00', kwh: 100 },
      { name: '16:00', kwh: 65 }, { name: '20:00', kwh: 20 }
    ] as DataPoint[],
    dataBulan: [
      { name: 'Jan', kwh: 2800, alert: 1 }, { name: 'Feb', kwh: 3100, alert: 3 },
      { name: 'Mar', kwh: 2900, alert: 2 }, { name: 'Apr', kwh: 3300, alert: 0 },
      { name: 'Mei', kwh: 3000, alert: 4 }, { name: 'Jun', kwh: 3400, alert: 1 }
    ] as DataPoint[],
    dataTahun: [
      { name: '2025', kwh: 36500 }, { name: '2026', kwh: 38200 }, { name: '2027 (Est.)', kwh: 41000 }
    ] as DataPoint[]
  };

  const [profile, setProfile] = useState<ProfileState>({
    nama: "Begawan Damar", email: "ceo@hexatrix.com", perusahaan: "Aruna Business Team",
    unitElektro: 50, unitSolar: 50, unitThermal: 50
  });

  const getFactor = (): number => {
    if (activeTab === 'elektro') return 0.5;
    if (activeTab === 'solar') return 0.3;
    if (activeTab === 'thermal') return 0.2;
    return 1.0;
  };

  const f = getFactor();
  const totalUnit = profile.unitElektro + profile.unitSolar + profile.unitThermal;

  const getScaledData = (dataKey: 'dataHari' | 'dataBulan' | 'dataTahun'): DataPoint[] => {
    return dashboardData[dataKey].map(item => ({
      ...item,
      kwh: parseFloat((item.kwh * f).toFixed(1))
    }));
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 w-full">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col py-6 shrink-0">
        <div className="px-6 pb-6 border-b border-slate-200 mb-6">
          <h2 className="text-sky-600 text-2xl font-bold tracking-wide">HEXATRIX</h2>
          <span className="text-xs text-slate-500 font-medium">Engineering IoT Dashboard</span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {[
            { id: 'dashboard', name: 'Dashboard HEXATRIX', icon: LayoutDashboard },
            { id: 'elektro', name: 'Elektromagnetik Compartment', icon: Zap },
            { id: 'solar', name: 'Solar Panel Compartment', icon: Sun },
            { id: 'thermal', name: 'Thermal Energy Compartment', icon: Thermometer },
            { id: 'esg', name: 'Laporan ESG / Emisi', icon: FileText },
            { id: 'profil', name: 'Profil Pengguna', icon: User },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === item.id ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-sky-600'
                }`}
              >
                <Icon size={18} /> {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* KONTEN */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white px-8 py-5 border-b border-slate-200 flex justify-between items-center shrink-0">
          <h1 className="text-xl font-bold text-slate-900 capitalize">
            {activeTab === 'dashboard' ? 'Dashboard Utama' : `${activeTab} Compartment`}
          </h1>
          <div className="text-sm font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-full">
            {profile.perusahaan} | {totalUnit} Unit
          </div>
        </header>

        <div className="p-8 flex-1">
          {['dashboard', 'elektro', 'solar', 'thermal'].includes(activeTab) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Energi Hari Ini</h4>
                  <div className="text-2xl font-bold">{(dashboardData.hariIni * f).toFixed(1)} kWh</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Estimasi Pijakan Kaki</h4>
                  <div className="text-2xl font-bold">{activeTab === 'dashboard' ? dashboardData.estimasiPijakan : '-'}</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Peak Hour</h4>
                  <div className="text-2xl font-bold">{dashboardData.peakHour}</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Jumlah Energi Digunakan</h4>
                  <div className="text-2xl font-bold">{(dashboardData.energiDigunakan * f).toFixed(1)} kWh</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-80">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Grafik Harian (kWh)</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={getScaledData('dataHari')}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Line type="monotone" dataKey="kwh" stroke="#0284c7" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-80">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Grafik Bulanan (kWh)</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={getScaledData('dataBulan')}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="kwh" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-80">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Grafik Tahunan (kWh)</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={getScaledData('dataTahun')}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="kwh" fill="#0369a1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Emisi Karbon Tereduksi</h4>
                  <div className="text-2xl font-bold">{(dashboardData.karbonTereduksi * f).toFixed(1)} kg CO2</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Nilai Emisi Karbon (Rp)</h4>
                  <div className="text-2xl font-bold">Rp {(dashboardData.nilaiKarbon * f).toLocaleString('id-ID')}</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Reduksi Sampah</h4>
                  <div className="text-2xl font-bold">{activeTab === 'dashboard' ? dashboardData.reduksiSampah : '-'}</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Peak Hour Reduksi Emisi</h4>
                  <div className="text-2xl font-bold">{dashboardData.peakHourReduksi}</div>
                </div>
              </div>

              {activeTab !== 'dashboard' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-72 mt-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Grafik Frekuensi Alert Gangguan Bulanan</h3>
                  <ResponsiveContainer width="100%" height="80%">
                    <LineChart data={dashboardData.dataBulan}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Line type="monotone" dataKey="alert" stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-r-xl flex gap-3 items-start mt-6">
                  <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-rose-900 text-sm uppercase">Alert Performa System</h4>
                    <p className="text-rose-700 text-sm mt-1">Terjadi penurunan efisiensi dalam HEXATRIX tipe 450C-I77-KAI2026, segera periksa dan hubungi CS apabila terjadi sebuah kerusakan.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'esg' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex gap-3 mb-6">
                <button onClick={() => window.print()} className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-50"><Printer size={14} /> Print Laporan</button>
                <button onClick={() => alert('Unduh PDF berhasil!')} className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-50"><Download size={14} /> Unduh PDF</button>
                <button onClick={() => window.open('https://api.whatsapp.com/send?text=Laporan ESG HEXATRIX 2026')} className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-50"><Share2 size={14} /> Share WhatsApp</button>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-4">Laporan Reduksi Emisi Karbon Tahun 2026</h3>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-xs border-b border-slate-200">
                    <th className="p-4">Komponen Kompartemen</th>
                    <th className="p-4">Kontribusi (%)</th>
                    <th className="p-4">Capaian Energi (kWh)</th>
                    <th className="p-4">Estimasi Reduksi CO2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="p-4 font-semibold">Elektromagnetik Compartment</td><td className="p-4">50%</td><td className="p-4">19.100 kWh</td><td className="p-4">16.044 kg</td></tr>
                  <tr><td className="p-4 font-semibold">Solar Panel Compartment</td><td className="p-4">30%</td><td className="p-4">11.460 kWh</td><td className="p-4">9.626 kg</td></tr>
                  <tr><td className="p-4 font-semibold">Thermal Energy Compartment</td><td className="p-4">20%</td><td className="p-4">7.640 kWh</td><td className="p-4">6.417 kg</td></tr>
                  <tr className="bg-slate-50 font-bold"><td className="p-4">TOTAL AKUMULASI</td><td className="p-4">100%</td><td className="p-4">38.200 kWh</td><td className="p-4">32.087 kg</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'profil' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-xl">
              <h3 className="text-lg font-bold mb-5">Pengaturan Profil & Kepemilikan Unit</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-semibold mb-1.5">Nama Pengguna</label><input type="text" value={profile.nama} onChange={(e)=>setProfile({...profile, nama: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-semibold mb-1.5">Email</label><input type="email" value={profile.email} onChange={(e)=>setProfile({...profile, email: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-semibold mb-1.5">Nama Perusahaan</label><input type="text" value={profile.perusahaan} onChange={(e)=>setProfile({...profile, perusahaan: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Unit Elektro</label><input type="number" value={profile.unitElektro} onChange={(e)=>setProfile({...profile, unitElektro: parseInt(e.target.value)||0})} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Unit Solar</label><input type="number" value={profile.unitSolar} onChange={(e)=>setProfile({...profile, unitSolar: parseInt(e.target.value)||0})} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">Unit Thermal</label><input type="number" value={profile.unitThermal} onChange={(e)=>setProfile({...profile, unitThermal: parseInt(e.target.value)||0})} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" /></div>
                </div>
                <button onClick={() => alert('Profil Berhasil Diupdate!')} className="mt-2 bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-sky-700">Simpan Perubahan</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}