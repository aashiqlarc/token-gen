'use client'

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

interface Entry {
  name: string;
  phone: string;
  token: number
}

export default function Home() {
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  useEffect(()=>{
    const saved = localStorage.getItem('tokens');
    if(saved){
      setEntries(JSON.parse(saved));
    }
  },[]);

  const handleGenerate = () =>{
    if(!name || !phone) return;
    const token = entries.length + 1;
    const newEntry = {name, phone, token};
    const updated = [...entries, newEntry];

    setEntries(updated);
    localStorage.setItem('tokens',JSON.stringify(updated));
    setName('');
    setPhone('');

  }

  const handleExport = () =>{
    const worksheet = XLSX.utils.json_to_sheet(entries, {
      header: ['name', 'phone', 'token'],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tokens');
    XLSX.writeFile(workbook, 'tokens.xlsx');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Token Generator</h1>

      <div className="flex flex-col lg:flex-row gap-8 justify-center">
        {/* Left: Form */}
        <div className="bg-white p-6 rounded shadow w-full lg:w-1/3">
          <h2 className="text-xl font-semibold mb-4 text-black">Add Entry</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border p-2 rounded w-full mb-3 text-black"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            pattern="[0-9]{3} [0-9]{3} [0-9]{4}"
            onChange={e => setPhone(e.target.value)}
            className="border p-2 rounded w-full mb-4 text-black"
          />
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Generate Token
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded w-full mt-4"
          >
            Export as Excel
          </button>
        </div>

        {/* Right: List */}
        <div className="bg-white p-6 rounded shadow w-full lg:w-2/3">
          <h2 className="text-xl font-semibold mb-4 text-black">Generated Tokens</h2>
          <ul className="space-y-3 max-h-[400px] overflow-auto">
            {entries.map((entry, idx) => (
              <li key={idx} className="border rounded p-3 flex justify-between text-black">
                <span>{entry.name}</span>
                <span>{entry.phone}</span>
                <span className="font-bold">#{entry.token}</span>
              </li>
            ))}
            {entries.length === 0 && (
              <p className="text-gray-500 text-center">No entries yet</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
