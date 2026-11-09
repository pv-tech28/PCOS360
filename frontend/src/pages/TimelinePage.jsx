import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  FileText,
  Activity,
  Heart,
  Plus,
  Stethoscope,
  Filter,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function TimelinePage() {
  const { timeline, addTimelineEvent, setActiveScreen, setIsLogModalOpen } = useHealth();
  const [filter, setFilter] = useState('All');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // New event form state
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventCategory, setEventCategory] = useState('symptom');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  const filterTabs = ['All', 'Symptoms', 'Cycle', 'Lab', 'Consultation'];

  const filteredTimeline = timeline.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'Symptoms') return item.category === 'symptom';
    if (filter === 'Cycle') return item.category === 'cycle';
    if (filter === 'Lab') return item.category === 'lab';
    if (filter === 'Consultation') return item.category === 'consultation';
    return true;
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addTimelineEvent({
      date: eventDate,
      category: eventCategory,
      title: eventTitle.trim(),
      description: eventDesc.trim() || 'Custom health milestone recorded.',
      badge: eventCategory === 'lab' ? 'Lab Results' : eventCategory === 'cycle' ? 'Menstrual Cycle' : 'Symptom Note',
      badgeColor: eventCategory === 'lab' ? 'purple' : 'amber'
    });

    setEventTitle('');
    setEventDesc('');
    setIsAddEventOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">My Health Timeline</h2>
            <Badge variant="purple" size="xs">Longitudinal History</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Chronological record of menstrual cycles, lab analyses, symptom peaks, and doctor appointments.
          </p>
        </div>

        <button
          onClick={() => setIsAddEventOpen(!isAddEventOpen)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195] transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Health Milestone</span>
        </button>
      </div>

      {/* Add Event Form Modal/Drawer */}
      {isAddEventOpen && (
        <form onSubmit={handleAddEvent} className="bg-white p-6 rounded-3xl border border-[#DFCDEE] shadow-sm space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#FAF9FC]">
            <h3 className="text-sm font-bold text-[#292431]">Record Custom Health Milestone</h3>
            <button
              type="button"
              onClick={() => setIsAddEventOpen(false)}
              className="text-xs text-[#77717F] hover:text-[#292431]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#292431] mb-1">Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292431] mb-1">Category</label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC]"
              >
                <option value="symptom">Symptom Note</option>
                <option value="cycle">Menstrual Cycle</option>
                <option value="lab">Lab Results</option>
                <option value="consultation">Doctor Visit</option>
                <option value="lifestyle">Lifestyle / Supplement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292431] mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Started Inositol, Pelvic Ultrasound..."
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#292431] mb-1">Details & Observations</label>
            <input
              type="text"
              placeholder="Notes on dosage, doctor recommendations, or symptoms..."
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#EFEAF4] bg-[#FAF9FC]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#7950A8] text-white text-xs font-semibold hover:bg-[#694195]"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs matching Mockup Screen 9 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-2xl font-semibold transition-all ${
              filter === tab
                ? 'bg-[#7950A8] text-white shadow-xs'
                : 'bg-white text-[#77717F] hover:bg-[#FAF9FC] border border-[#EFEAF4]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Vertical Timeline Stream matching Mockup Screen 9 */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EFEAF4]">
        {filteredTimeline.map((item, idx) => {
          let Icon = Heart;
          let dotColor = 'bg-[#7950A8]';
          if (item.category === 'lab') {
            Icon = FileText;
            dotColor = 'bg-[#7950A8]';
          } else if (item.category === 'cycle') {
            Icon = Calendar;
            dotColor = 'bg-[#A6417A]';
          } else if (item.category === 'consultation') {
            Icon = Stethoscope;
            dotColor = 'bg-[#1B7878]';
          }

          return (
            <div key={item.id} className="relative group">
              {/* Connector Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-4 w-3.5 h-3.5 rounded-full ${dotColor} ring-4 ring-white shadow-xs transition-transform group-hover:scale-125`}
              />

              {/* Timeline Card */}
              <div className="bg-white rounded-3xl border border-[#EFEAF4] p-5 shadow-xs hover:border-[#DFCDEE] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#FAF9FC]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#7950A8]">{item.date}</span>
                    <Badge variant={item.category === 'lab' ? 'purple' : item.category === 'cycle' ? 'pink' : 'neutral'} size="xs">
                      {item.badge || item.category}
                    </Badge>
                  </div>
                </div>

                <div className="mt-2">
                  <h3 className="text-sm font-bold text-[#292431]">{item.title}</h3>
                  <p className="text-xs text-[#77717F] mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EthicalDisclaimer title="Longitudinal Records Integrity">
        Continuous longitudinal records provide your gynecologist and endocrinologist with objective context, reducing diagnostic delays and avoiding duplicate laboratory testing.
      </EthicalDisclaimer>
    </div>
  );
}
