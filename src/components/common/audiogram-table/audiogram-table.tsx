import React from 'react';

export interface AudiogramData {
  250: { od: string; oi: string };
  500: { od: string; oi: string };
  1000: { od: string; oi: string };
  2000: { od: string; oi: string };
  4000: { od: string; oi: string };
  8000: { od: string; oi: string };
}

export const AUDIOGRAM_FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000] as const;

export type AudiogramFrequency = (typeof AUDIOGRAM_FREQUENCIES)[number];

export function createEmptyAudiogram(): AudiogramData {
  return {
    250: { od: '', oi: '' },
    500: { od: '', oi: '' },
    1000: { od: '', oi: '' },
    2000: { od: '', oi: '' },
    4000: { od: '', oi: '' },
    8000: { od: '', oi: '' },
  };
}

interface AudiogramTableProps {
  data: AudiogramData;
  onChange?: (data: AudiogramData) => void;
  readOnly?: boolean;
}

export function AudiogramTable({ data, onChange, readOnly = false }: AudiogramTableProps) {
  function handleChange(freq: AudiogramFrequency, ear: 'od' | 'oi', value: string) {
    if (!onChange) return;
    onChange({
      ...data,
      [freq]: { ...data[freq], [ear]: value },
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-4 py-2 text-left text-slate-500 font-medium border border-slate-200">
              Frecuencia (Hz)
            </th>
            <th className="px-4 py-2 text-center text-blue-600 font-medium border border-slate-200">
              OD (dB)
            </th>
            <th className="px-4 py-2 text-center text-red-500 font-medium border border-slate-200">
              OI (dB)
            </th>
          </tr>
        </thead>
        <tbody>
          {AUDIOGRAM_FREQUENCIES.map((freq) => (
            <tr key={freq} className="hover:bg-slate-50">
              <td className="px-4 py-2 border border-slate-200 text-slate-700 font-medium">
                {freq}
              </td>
              <td className="px-2 py-1 border border-slate-200 text-center">
                {readOnly ? (
                  <span className="text-blue-700">{data[freq].od || '—'}</span>
                ) : (
                  <input
                    type="number"
                    min={-10}
                    max={120}
                    value={data[freq].od}
                    onChange={(e) => handleChange(freq, 'od', e.target.value)}
                    className="w-20 text-center border border-slate-200 rounded-lg px-2 py-1 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="—"
                  />
                )}
              </td>
              <td className="px-2 py-1 border border-slate-200 text-center">
                {readOnly ? (
                  <span className="text-red-500">{data[freq].oi || '—'}</span>
                ) : (
                  <input
                    type="number"
                    min={-10}
                    max={120}
                    value={data[freq].oi}
                    onChange={(e) => handleChange(freq, 'oi', e.target.value)}
                    className="w-20 text-center border border-slate-200 rounded-lg px-2 py-1 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                    placeholder="—"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
