import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  BookMarked,
  Sparkles,
  Filter
} from 'lucide-react';
import { mythsData } from '../data/mythsData';
import { Badge } from '../components/common/Badge';
import EthicalDisclaimer from '../components/common/EthicalDisclaimer';

export default function MythBusterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fertility', 'Nutrition', 'Medical Treatments', 'Diagnosis', 'Metabolism', 'Weight & Body Composition'];

  const filteredMyths = mythsData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EFEAF4] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#292431]">PCOS Myth Buster & Learning Hub</h2>
            <Badge variant="pink" size="xs">Evidence-Based</Badge>
          </div>
          <p className="text-xs text-[#77717F] mt-1">
            Demystify common misconceptions with peer-reviewed clinical guidelines and compassionate guidance.
          </p>
        </div>

        <span className="text-xs font-semibold text-[#7950A8] bg-[#EDE5F7] px-3 py-1.5 rounded-full">
          Citing ACOG & Monash Guidelines
        </span>
      </div>

      {/* Search Bar matching Mockup Screen 8 ("PCOS means I can't get pregnant? 🔍") */}
      <div className="bg-white rounded-3xl border border-[#EFEAF4] p-5 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-[#9E98A8] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PCOS claims, e.g., 'PCOS means I can't get pregnant?' or 'Does dairy cause PCOS?'"
            className="w-full text-xs sm:text-sm pl-12 pr-4 py-3 rounded-2xl border border-[#EFEAF4] focus:outline-none focus:border-[#7950A8] bg-[#FAF9FC]/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-xs text-[#77717F] hover:text-[#292431]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-[#7950A8] text-white shadow-2xs'
                  : 'bg-[#FAF9FC] text-[#77717F] hover:bg-[#EDE5F7]/40 hover:text-[#7950A8] border border-[#EFEAF4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Myth Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredMyths.map((item) => {
          const isMyth = item.classification === 'Myth';
          const isFact = item.classification === 'Fact';

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#EFEAF4] p-6 shadow-xs hover:border-[#DFCDEE] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Classification Badge matching Mockup Screen 8 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {isMyth && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        Myth
                      </span>
                    )}
                    {isFact && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Fact
                      </span>
                    )}
                    {!isMyth && !isFact && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Misleading / Nuanced
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-[#9E98A8] font-medium">{item.category}</span>
                </div>

                {/* Question and Verdict */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#292431]">{item.question}</h3>
                  <p className="text-xs font-semibold text-[#7950A8] mt-1">{item.verdictShort}</p>
                </div>

                {/* Explanation */}
                <p className="text-xs text-[#77717F] leading-relaxed">
                  {item.explanation}
                </p>
              </div>

              {/* Trustworthy Citation Footer */}
              <div className="pt-3 border-t border-[#FAF9FC] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#9E98A8]">
                <div className="flex items-center gap-1 truncate">
                  <BookMarked className="w-3.5 h-3.5 text-[#7950A8] shrink-0" />
                  <span className="truncate">{item.citation}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMyths.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#EFEAF4] p-6">
          <BookOpen className="w-10 h-10 text-[#DFCDEE] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#292431]">No matching health claims found</h3>
          <p className="text-xs text-[#77717F] mt-1">Try another search term or reset category filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-3 px-4 py-1.5 text-xs font-semibold text-[#7950A8] bg-[#EDE5F7] rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      <EthicalDisclaimer title="Medical Guidelines Standards">
        All educational articles and myth classifications in PCOS360 are referenced against peer-reviewed international guidelines (Monash 2023, ACOG, Endocrine Society). Individual medical advice should always be verified with your physician.
      </EthicalDisclaimer>
    </div>
  );
}
