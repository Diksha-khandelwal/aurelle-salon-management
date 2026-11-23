import React, { useState } from 'react';
import { Service } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, Edit2, Check, Clock, IndianRupee } from 'lucide-react';

interface ServiceManagerProps {
  services: Service[];
  onUpdateService: (id: string, partial: Partial<Service>) => void;
  onAddService: (newService: Omit<Service, 'id'>) => void;
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({
  services,
  onUpdateService,
  onAddService,
}) => {
  const { language, t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<number>(0);

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNameEn, setNewNameEn] = useState('');
  const [newNameGu, setNewNameGu] = useState('');
  const [newDuration, setNewDuration] = useState(30);
  const [newPrice, setNewPrice] = useState(500);

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setEditPrice(s.priceINR);
    setEditDuration(s.durationMinutes);
  };

  const saveEdit = (id: string) => {
    onUpdateService(id, { priceINR: editPrice, durationMinutes: editDuration });
    setEditingId(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameEn.trim()) return;

    onAddService({
      nameEn: newNameEn.trim(),
      nameGu: newNameGu.trim() || newNameEn.trim(),
      durationMinutes: Number(newDuration),
      priceINR: Number(newPrice),
      category: 'Hair',
      description: 'Custom salon grooming treatment.',
      enabled: true,
    });

    setNewNameEn('');
    setNewNameGu('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E7E2D8] p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#162E25]">
            {t('serviceCatalogue')}
          </h3>
          <p className="text-xs text-stone-500">
            Control salon service durations, catalog visibility, and INR pricing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-semibold bg-[#162E25] text-[#C5A880] hover:bg-[#0F221B] px-3 py-1.5 rounded-full flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('addService')}</span>
        </button>
      </div>

      {/* Add Service Modal/Inline Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="p-4 bg-[#F5F2EB] rounded-xl border border-stone-300 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#162E25]">New Service Entry</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <input
              type="text"
              placeholder="English Name"
              value={newNameEn}
              onChange={e => setNewNameEn(e.target.value)}
              className="p-2 border rounded bg-white text-stone-800"
              required
            />
            <input
              type="text"
              placeholder="Gujarati Name"
              value={newNameGu}
              onChange={e => setNewNameGu(e.target.value)}
              className="p-2 border rounded bg-white text-stone-800"
            />
            <input
              type="number"
              placeholder="Duration (mins)"
              value={newDuration}
              onChange={e => setNewDuration(Number(e.target.value))}
              className="p-2 border rounded bg-white text-stone-800"
              min={5}
              max={180}
            />
            <input
              type="number"
              placeholder="Price (INR ₹)"
              value={newPrice}
              onChange={e => setNewPrice(Number(e.target.value))}
              className="p-2 border rounded bg-white text-stone-800"
              min={50}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 rounded text-xs border text-stone-600 bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded text-xs font-bold bg-[#162E25] text-[#C5A880]"
            >
              Save Service
            </button>
          </div>
        </form>
      )}

      {/* Service Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-600">
          <thead className="bg-[#F5F2EB] text-[#162E25] uppercase font-semibold text-[11px]">
            <tr>
              <th className="p-2.5 rounded-l-lg">Service</th>
              <th className="p-2.5">Category</th>
              <th className="p-2.5">Duration</th>
              <th className="p-2.5">Price (INR)</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5 rounded-r-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {services.map(s => {
              const isEditing = editingId === s.id;
              const name = language === 'gu' ? s.nameGu : s.nameEn;

              return (
                <tr key={s.id} className="hover:bg-stone-50">
                  <td className="p-2.5 font-medium text-[#1C1917]">
                    {name}
                  </td>
                  <td className="p-2.5">
                    <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px]">
                      {s.category}
                    </span>
                  </td>
                  <td className="p-2.5">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editDuration}
                        onChange={e => setEditDuration(Number(e.target.value))}
                        className="w-16 border rounded p-1 text-xs"
                      />
                    ) : (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-[#C5A880]" />
                        {s.durationMinutes} mins
                      </span>
                    )}
                  </td>
                  <td className="p-2.5">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={e => setEditPrice(Number(e.target.value))}
                        className="w-20 border rounded p-1 text-xs"
                      />
                    ) : (
                      <span className="font-semibold text-[#162E25]">
                        ₹{s.priceINR}
                      </span>
                    )}
                  </td>
                  <td className="p-2.5">
                    <button
                      type="button"
                      onClick={() => onUpdateService(s.id, { enabled: !s.enabled })}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {s.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="p-2.5 text-right">
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() => saveEdit(s.id)}
                        className="text-emerald-700 bg-emerald-50 border border-emerald-300 p-1 rounded hover:bg-emerald-100"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(s)}
                        className="text-stone-500 hover:text-[#162E25] p-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
