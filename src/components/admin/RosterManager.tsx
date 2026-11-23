import React, { useState } from 'react';
import { Barber, BarberStatus } from '../../types/queue';
import { useLanguage } from '../../context/LanguageContext';
import { Plus } from 'lucide-react';

interface RosterManagerProps {
  barbers: Barber[];
  onSetBarberStatus: (barberId: string, status: BarberStatus) => void;
  onAddBarber: (newBarber: Omit<Barber, 'id' | 'chairNumber' | 'currentTokenId'>) => void;
}

export const RosterManager: React.FC<RosterManagerProps> = ({
  barbers,
  onSetBarberStatus,
  onAddBarber,
}) => {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('Senior Grooming Specialist');
  const [newSpecialty, setNewSpecialty] = useState('Scissor Sculpting');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddBarber({
      name: newName.trim(),
      slug: newName.toLowerCase().replace(/\s+/g, '-'),
      title: newTitle,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      status: 'AVAILABLE',
      rating: 4.8,
      specialties: [newSpecialty],
    });

    setNewName('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E7E2D8] p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#162E25]">
            {t('rosterManagement')}
          </h3>
          <p className="text-xs text-stone-500">
            Control stylist on-duty roster, chair assignments, and break status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(!showAddModal)}
          className="text-xs font-semibold bg-[#162E25] text-[#C5A880] hover:bg-[#0F221B] px-3 py-1.5 rounded-full flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('addStylist')}</span>
        </button>
      </div>

      {showAddModal && (
        <form onSubmit={handleAdd} className="p-4 bg-[#F5F2EB] rounded-xl border border-stone-300 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#162E25]">Add Stylist to Roster</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              placeholder="Stylist Full Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="p-2 border rounded bg-white text-stone-800"
              required
            />
            <input
              type="text"
              placeholder="Professional Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="p-2 border rounded bg-white text-stone-800"
            />
            <input
              type="text"
              placeholder="Primary Specialty"
              value={newSpecialty}
              onChange={e => setNewSpecialty(e.target.value)}
              className="p-2 border rounded bg-white text-stone-800"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1 rounded text-xs border text-stone-600 bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded text-xs font-bold bg-[#162E25] text-[#C5A880]"
            >
              Add Stylist
            </button>
          </div>
        </form>
      )}

      {/* Barbers Roster List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {barbers.map(barber => (
          <div
            key={barber.id}
            className="p-3.5 rounded-xl border border-stone-200 bg-[#FBF9F5] flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <img
                src={barber.avatar}
                alt={barber.name}
                className="w-11 h-11 rounded-full object-cover border border-stone-300"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-mono text-xs font-bold text-stone-500">
                    Chair {barber.chairNumber}:
                  </span>
                  <h4 className="font-semibold text-sm text-[#1C1917]">
                    {barber.name}
                  </h4>
                </div>
                <p className="text-[11px] text-stone-500">
                  {barber.specialties[0]} • Rating {barber.rating}
                </p>
              </div>
            </div>

            {/* Status Selector */}
            <div className="flex items-center space-x-1.5">
              <select
                value={barber.status}
                onChange={e => onSetBarberStatus(barber.id, e.target.value as BarberStatus)}
                className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border outline-none ${
                  barber.status === 'AVAILABLE'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : barber.status === 'BUSY'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="BUSY">BUSY (IN CHAIR)</option>
                <option value="ON_BREAK">ON BREAK</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
