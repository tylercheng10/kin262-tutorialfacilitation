import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  UserPlus, 
  Building2, 
  Activity, 
  Home, 
  Award, 
  DollarSign, 
  RotateCcw, 
  Play, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Eye,
  Trophy,
  HelpCircle,
  Users,
  AlertCircle,
  RefreshCw,
  Zap,
  TrendingDown,
  Percent
} from 'lucide-react';

const TOTAL_BUDGET_BILLIONS = 500; // $500B CAD Total 10-Year Allocation Envelope

// OPTIMAL BENCHMARK ALLOCATION
const OPTIMAL_ALLOCATION = {
  postEr: 175,   // $175B (35%) - Solves ALC bed blocking & frees acute hospital capacity
  complex: 125,  // $125B (25%) - Keeps high-utilizer complex patients out of ER
  doctors: 125,  // $125B (25%) - Long-term GP pipeline & burnout reduction
  hospital: 75   // $75B  (15%) - Targeted acute upgrades without over-expansion
};

const ISSUE_INFO = {
  doctors: {
    title: "1. Doctor Shortage & Primary Care",
    icon: UserPlus,
    color: "amber",
    bgColor: "bg-amber-50/70",
    borderColor: "border-amber-200",
    accentColor: "text-amber-700",
    barColor: "bg-amber-600",
    desc: "Family physicians, specialists, residency expansion, international credentialing, and GP clinic overhead support."
  },
  hospital: {
    title: "2. Lack of Hospital Space",
    icon: Building2,
    color: "red",
    bgColor: "bg-red-50/70",
    borderColor: "border-red-200",
    accentColor: "text-red-700",
    barColor: "bg-red-600",
    desc: "Acute care ward expansion, ER bay upgrades, ICU beds, and physical hospital infrastructure."
  },
  complex: {
    title: "3. Medically Complex Patient Care",
    icon: Activity,
    color: "blue",
    bgColor: "bg-blue-50/70",
    borderColor: "border-blue-200",
    accentColor: "text-blue-700",
    barColor: "bg-blue-600",
    desc: "Out-of-hospital chronic care clinics, proactive geriatric management, and multi-morbidity community triage."
  },
  postEr: {
    title: "4. Post-ER Care & ALC Discharge Facilities",
    icon: Home,
    color: "emerald",
    bgColor: "bg-emerald-50/70",
    borderColor: "border-emerald-200",
    accentColor: "text-emerald-700",
    barColor: "bg-emerald-600",
    desc: "Long-Term Care (LTC) beds, sub-acute rehab centers, transitional beds, and home care to resolve ALC bed-blocking."
  }
};

function run10YearSimulation(allocation) {
  // Baseline stats at Year 0
  let erWaitHours = 20.5;
  let erBedOccupancyPct = 138.0;
  let familyDoctorWaitMonths = 30.0;
  let bedBlockPct = 26.0;
  let physicianBurnoutPct = 72.0;
  let publicApprovalPct = 28.0;

  const pDocs = allocation.doctors / TOTAL_BUDGET_BILLIONS;
  const pHosp = allocation.hospital / TOTAL_BUDGET_BILLIONS;
  const pComp = allocation.complex / TOTAL_BUDGET_BILLIONS;
  const pPost = allocation.postEr / TOTAL_BUDGET_BILLIONS;

  // Simulate 10 years of compounding systemic effects
  for (let year = 1; year <= 10; year++) {
    // 1. Post-ER discharge reduces ALC Bed Blocking
    const postCareImpact = (pPost * 32.0) + (pPost > 0.3 ? 4.0 : 0);
    bedBlockPct = Math.max(4.0, bedBlockPct - (postCareImpact / 10) + 0.8);

    // 2. Hospital Space effectiveness is gated by Bed Blocking (If beds are blocked, new wards stall)
    const unblockedFactor = Math.max(0.35, 1 - (bedBlockPct / 45.0));
    const hospitalImpact = (pHosp * 36.0) * unblockedFactor;
    erBedOccupancyPct = Math.max(82.0, erBedOccupancyPct - (hospitalImpact / 10) + 1.1);

    // 3. Medically Complex Care reduces unnecessary ER inflow
    const complexImpact = pComp * 22.0;
    erWaitHours = Math.max(2.5, erWaitHours - (complexImpact / 10) - (postCareImpact / 12) + 0.9);

    // 4. Doctor Shortage investment compounds heavily in years 4-10 due to residency lag
    const compoundingDocEffect = (pDocs * 24.0) + (year >= 4 ? pDocs * 8.0 : 0);
    familyDoctorWaitMonths = Math.max(1.8, familyDoctorWaitMonths - (compoundingDocEffect / 10) + 0.7);

    const burnoutRelief = (pDocs * 28.0) + (pComp * 10.0);
    physicianBurnoutPct = Math.max(18.0, physicianBurnoutPct - (burnoutRelief / 10) + 1.2);
  }

  // Final Composite System Score (0 - 100)
  // Penalty for unallocated funds or major bottlenecks
  const waitPen = Math.max(0, (erWaitHours - 4) * 2.8);
  const gpPen = Math.max(0, (familyDoctorWaitMonths - 3) * 1.8);
  const blockPen = Math.max(0, (bedBlockPct - 6) * 2.2);
  const burnoutPen = Math.max(0, (physicianBurnoutPct - 25) * 0.6);

  let systemScore = Math.round(100 - (waitPen + gpPen + blockPen + burnoutPen));
  systemScore = Math.min(99, Math.max(15, systemScore));

  // Final Public Approval calculation
  publicApprovalPct = Math.min(96, Math.max(15, Math.round(systemScore * 0.92 + 5)));

  // Determine Letter Grade
  let grade = 'F';
  if (systemScore >= 90) grade = 'S';
  else if (systemScore >= 80) grade = 'A';
  else if (systemScore >= 68) grade = 'B';
  else if (systemScore >= 52) grade = 'C';
  else if (systemScore >= 38) grade = 'D';

  // Specific Auditor General Findings
  const auditFindings = [];

  if (pPost < 0.20) {
    auditFindings.push({
      type: "critical",
      title: "Severe Post-Acute Discharge Bottleneck (ALC)",
      desc: "Underfunding Post-ER discharge facilities left up to 20%+ of acute hospital beds blocked by Alternate Level of Care (ALC) patients. This choked emergency rooms regardless of hospital spending."
    });
  } else {
    auditFindings.push({
      type: "success",
      title: "Effective ALC Unblocking",
      desc: "Strong investment in Long-Term Care and transitional beds cleared acute hospital capacity, allowing ERs to flow smoothly."
    });
  }

  if (pHosp > 0.30 && pPost < 0.25) {
    auditFindings.push({
      type: "warning",
      title: "The Acute-Care Expansion Trap",
      desc: "High expenditure on building new hospital beds was largely negated because the new beds immediately filled with non-acute ALC patients who had nowhere else to go."
    });
  }

  if (pComp < 0.15) {
    auditFindings.push({
      type: "warning",
      title: "Uncontrolled Complex Patient Inflow",
      desc: "Neglecting out-of-hospital complex care meant high-utilizer patients with multi-morbities continued flooding ERs for routine management, inflating wait times."
    });
  } else {
    auditFindings.push({
      type: "success",
      title: "Upstream Crisis Prevention",
      desc: "Proactive community care and complex patient triage successfully deflected unnecessary ER admissions."
    });
  }

  if (pDocs < 0.18) {
    auditFindings.push({
      type: "critical",
      title: "Primary Care Exhaustion & High Doctor Burnout",
      desc: "Inadequate GP funding kept doctor waitlists elevated, leaving millions without family care and driving physician burnout to dangerous levels."
    });
  }

  return {
    systemScore,
    grade,
    erWaitHours: erWaitHours.toFixed(1),
    erBedOccupancyPct: erBedOccupancyPct.toFixed(1),
    familyDoctorWaitMonths: familyDoctorWaitMonths.toFixed(1),
    bedBlockPct: bedBlockPct.toFixed(1),
    physicianBurnoutPct: physicianBurnoutPct.toFixed(1),
    publicApprovalPct: publicApprovalPct,
    auditFindings
  };
}

export default function App() {
  // Navigation / App State
  const [currentView, setCurrentView] = useState('input'); // 'input' | 'report'
  const [showOptimalModal, setShowOptimalModal] = useState(false);

  // Current Team Input State
  const [teamName, setTeamName] = useState("Group 1");
  const [allocation, setAllocation] = useState({
    doctors: 125,
    hospital: 125,
    complex: 125,
    postEr: 125
  });

  // History / Leaderboard of Simulated Teams
  const [completedTeams, setCompletedTeams] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);

  // Budget Calculations
  const allocatedTotal = useMemo(() => {
    return Object.values(allocation).reduce((sum, v) => sum + Number(v), 0);
  }, [allocation]);

  const unallocatedBudget = useMemo(() => {
    return TOTAL_BUDGET_BILLIONS - allocatedTotal;
  }, [allocatedTotal]);

  // Handle Slider Adjustment
  const handleSliderChange = (key, val) => {
    const numVal = Math.max(0, parseFloat(val) || 0);
    const otherSum = Object.keys(allocation)
      .filter(k => k !== key)
      .reduce((sum, k) => sum + allocation[k], 0);

    let finalVal = numVal;
    if (numVal + otherSum > TOTAL_BUDGET_BILLIONS) {
      finalVal = TOTAL_BUDGET_BILLIONS - otherSum;
    }

    setAllocation(prev => ({ ...prev, [key]: finalVal }));
  };

  // Quick Preset Handlers
  const applyPreset = (presetType) => {
    switch (presetType) {
      case 'equal':
        setAllocation({ doctors: 125, hospital: 125, complex: 125, postEr: 125 });
        break;
      case 'hospitalHeavy':
        setAllocation({ doctors: 75, hospital: 250, complex: 75, postEr: 100 });
        break;
      case 'doctorHeavy':
        setAllocation({ doctors: 250, hospital: 75, complex: 100, postEr: 75 });
        break;
      case 'optimal':
        setAllocation({ ...OPTIMAL_ALLOCATION });
        break;
      default:
        break;
    }
  };

  // Run Simulation for Current Group
  const handleRunSimulation = () => {
    if (!teamName.trim()) return;

    const results = run10YearSimulation(allocation);
    const reportData = {
      id: Date.now(),
      teamName: teamName.trim(),
      allocation: { ...allocation },
      results,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCompletedTeams(prev => [reportData, ...prev]);
    setCurrentReport(reportData);
    setCurrentView('report');
  };

  // Reset for Next Group
  const handlePrepareNextGroup = () => {
    const nextGroupNum = completedTeams.length + 1;
    setTeamName(`Group ${nextGroupNum}`);
    setAllocation({ doctors: 125, hospital: 125, complex: 125, postEr: 125 });
    setCurrentView('input');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* Official Government Header Banner */}
      <header className="bg-slate-900 text-white border-b-4 border-red-600 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {/* Canadian Maple Leaf Icon */}
            <div className="bg-red-600 text-white p-2 rounded-lg shadow-sm flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l1.8 3.6 4-.6-2.4 3.3 2.8 3-4-.5L12 15l-2.2-4.2-4 .5 2.8-3-2.4-3.3 4 .6z" />
                <path d="M12 15v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Government of Canada</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Tutorial Facilitation Model</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                10-Year National Health Budget Allocation Simulator
              </h1>
            </div>
          </div>

          {/* Facilitator Actions & Header Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOptimalModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-semibold text-xs transition shadow-sm"
              title="Click to reveal the theoretical optimal benchmark allocation"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Reveal Optimal Strategy</span>
            </button>

            {completedTeams.length > 0 && (
              <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">Tested Groups:</span>
                <span className="font-bold text-white">{completedTeams.length}</span>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* VIEW 1: GROUP BUDGET INPUT & ALLOCATION SCREEN */}
        {currentView === 'input' && (
          <div className="space-y-6">
            
            {/* Top Info Banner */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-bold text-slate-900">Classroom Group Allocation Entry</h2>
                </div>
                <p className="text-xs text-slate-600">
                  Each team must allocate <strong>$500 Billion CAD</strong> across the 10-year period ($50B/year) to solve Canada's 4 major healthcare crises.
                </p>
              </div>

              {/* Group Name Input */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 shrink-0">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Group / Team Name:</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Group 1"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-md font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-40"
                />
              </div>
            </div>

            {/* Budget Controls & Sliders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Sliders */}
              <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Header & Envelope Gauge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-red-600" />
                      10-Year Healthcare Envelope ($500B CAD Total)
                    </h3>
                    <p className="text-xs text-slate-500">Adjust the funding sliders below to set your group's strategy.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Remaining Budget</div>
                      <div className={`text-xl font-extrabold ${unallocatedBudget < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        ${unallocatedBudget}B <span className="text-xs font-normal text-slate-500">/ $500B</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategy Presets Bar */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-slate-500 mr-1">Quick Presets:</span>
                  <button onClick={() => applyPreset('equal')} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition">
                    Equal Split ($125B each)
                  </button>
                  <button onClick={() => applyPreset('hospitalHeavy')} className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded font-medium transition">
                    Acute Hospital Focused
                  </button>
                  <button onClick={() => applyPreset('doctorHeavy')} className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded font-medium transition">
                    Doctor Recruitment Focused
                  </button>
                </div>

                {/* Sliders Container */}
                <div className="space-y-6 pt-2">
                  {Object.keys(ISSUE_INFO).map((key) => {
                    const info = ISSUE_INFO[key];
                    const Icon = info.icon;
                    const val = allocation[key];
                    const pct = Math.round((val / TOTAL_BUDGET_BILLIONS) * 100);

                    return (
                      <div key={key} className={`p-4 rounded-xl border ${info.bgColor} ${info.borderColor} space-y-3 transition`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg bg-white shadow-sm ${info.accentColor}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{info.title}</h4>
                              <p className="text-xs text-slate-600 max-w-xl">{info.desc}</p>
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className={`text-lg font-black ${info.accentColor}`}>
                              ${val} Billion
                            </span>
                            <span className="text-xs font-semibold text-slate-500 ml-1.5">
                              ({pct}%)
                            </span>
                          </div>
                        </div>

                        {/* Slider Input */}
                        <div className="space-y-1">
                          <input
                            type="range"
                            min="0"
                            max={TOTAL_BUDGET_BILLIONS}
                            step="5"
                            value={val}
                            onChange={(e) => handleSliderChange(key, e.target.value)}
                            className="w-full accent-slate-800 cursor-pointer h-2 bg-slate-200 rounded-lg"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                            <span>$0B</span>
                            <span>$250B</span>
                            <span>$500B</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Launch Simulation Button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={handleRunSimulation}
                    disabled={unallocatedBudget < 0}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-lg rounded-xl shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-3 disabled:bg-slate-400"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    Run 10-Year Simulation for {teamName || "Group"}
                  </button>
                  {unallocatedBudget > 0 && (
                    <p className="text-center text-xs text-amber-600 font-semibold mt-2">
                      ⚠️ Note: You have ${unallocatedBudget}B unallocated budget. Unused funds may penalize your public approval rating!
                    </p>
                  )}
                </div>

              </div>

              {/* Right Column: Allocation Overview & Leaderboard */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* Visual Breakdown Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Allocation Strategy Breakdown
                  </h3>

                  {/* Stacked Percentage Bar */}
                  <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    <div style={{ width: `${(allocation.doctors / TOTAL_BUDGET_BILLIONS) * 100}%` }} className="bg-amber-500" title="Doctors" />
                    <div style={{ width: `${(allocation.hospital / TOTAL_BUDGET_BILLIONS) * 100}%` }} className="bg-red-600" title="Hospital Space" />
                    <div style={{ width: `${(allocation.complex / TOTAL_BUDGET_BILLIONS) * 100}%` }} className="bg-blue-600" title="Complex Care" />
                    <div style={{ width: `${(allocation.postEr / TOTAL_BUDGET_BILLIONS) * 100}%` }} className="bg-emerald-600" title="Post-ER Facilities" />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Doctor Shortage
                      </span>
                      <span className="font-bold text-slate-900">${allocation.doctors}B</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Hospital Space
                      </span>
                      <span className="font-bold text-slate-900">${allocation.hospital}B</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Complex Care
                      </span>
                      <span className="font-bold text-slate-900">${allocation.complex}B</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Post-ER Facilities
                      </span>
                      <span className="font-bold text-slate-900">${allocation.postEr}B</span>
                    </div>
                  </div>
                </div>

                {/* Facilitation Tutorial Leaderboard */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Group Leaderboard
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400">{completedTeams.length} Tested</span>
                  </div>

                  {completedTeams.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      No groups simulated yet. Configure allocations above and run the simulation!
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {completedTeams.map((team, idx) => (
                        <div 
                          key={team.id}
                          onClick={() => {
                            setCurrentReport(team);
                            setCurrentView('report');
                          }}
                          className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <span>#{idx + 1} {team.teamName}</span>
                              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                                Grade {team.results.grade}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              ER Wait: {team.results.erWaitHours}h | ALC: {team.results.bedBlockPct}%
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-base font-black text-red-600">
                              {team.results.systemScore}
                            </span>
                            <span className="text-[10px] text-slate-400 block">/100</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: AUDITOR GENERAL FINAL REPORT SCREEN */}
        {currentView === 'report' && currentReport && (
          <div className="space-y-6 max-w-5xl mx-auto">
            
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold">Auditor General 10-Year Audit Report</span>
              </div>
              <button
                onClick={handlePrepareNextGroup}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Test Next Group Allocation
              </button>
            </div>

            {/* Main Score & Team Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
                    Official Audit Result
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">
                    {currentReport.teamName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Simulated 10-Year Budget Strategy Execution ($500 Billion CAD)
                  </p>
                </div>

                {/* Score & Grade Badge */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-center px-3 border-r border-slate-200">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Letter Grade</div>
                    <div className="text-4xl font-black text-slate-900">{currentReport.results.grade}</div>
                  </div>
                  <div className="text-center px-2">
                    <div className="text-[10px] uppercase font-bold text-slate-500">System Score</div>
                    <div className="text-4xl font-black text-red-600">
                      {currentReport.results.systemScore}
                      <span className="text-sm font-normal text-slate-400">/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group's Budget Allocation Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Group Allocation Breakdown:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="text-amber-800 font-medium">Doctor Shortage</div>
                    <div className="text-base font-bold text-amber-900">${currentReport.allocation.doctors}B</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="text-red-800 font-medium">Hospital Space</div>
                    <div className="text-base font-bold text-red-900">${currentReport.allocation.hospital}B</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-blue-800 font-medium">Complex Care</div>
                    <div className="text-base font-bold text-blue-900">${currentReport.allocation.complex}B</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="text-emerald-800 font-medium">Post-ER Facilities</div>
                    <div className="text-base font-bold text-emerald-900">${currentReport.allocation.postEr}B</div>
                  </div>
                </div>
              </div>

              {/* Final 10-Year Key Health Metrics Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Final System Health Indicators (After 10 Years):
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  
                  {/* Metric 1 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">ER Wait Time</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{currentReport.results.erWaitHours} <span className="text-xs font-normal">hrs</span></div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Target: &lt; 4.0h</div>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">ALC Bed Block</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{currentReport.results.bedBlockPct}%</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Target: &lt; 8.0%</div>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">GP Waitlist</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{currentReport.results.familyDoctorWaitMonths} <span className="text-xs font-normal">mos</span></div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Target: &lt; 4.0m</div>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">ER Occupancy</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{currentReport.results.erBedOccupancyPct}%</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Target: 100%</div>
                  </div>

                  {/* Metric 5 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Doctor Burnout</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{currentReport.results.physicianBurnoutPct}%</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Target: &lt; 30%</div>
                  </div>

                  {/* Metric 6 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Public Approval</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{currentReport.results.publicApprovalPct}%</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Target: &gt; 75%</div>
                  </div>

                </div>
              </div>

              {/* Auditor General Findings & Commentary */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-700" />
                  Auditor General Key Findings:
                </h3>

                <div className="space-y-3">
                  {currentReport.results.auditFindings.map((finding, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border text-xs space-y-1 ${
                        finding.type === 'critical' ? 'bg-red-50 border-red-200 text-red-900' :
                        finding.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                        'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}
                    >
                      <div className="font-bold text-sm flex items-center gap-2">
                        {finding.type === 'critical' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                        {finding.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                        {finding.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        <span>{finding.title}</span>
                      </div>
                      <p className="leading-relaxed opacity-90">{finding.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentView('input')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                >
                  ← Edit / Re-run This Group
                </button>

                <button
                  onClick={handlePrepareNextGroup}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Next Group Allocation
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FACILITATOR MODAL: REVEAL OPTIMAL STRATEGY */}
      {showOptimalModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b-2 border-red-600">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">Facilitator Benchmark: Optimal Allocation Strategy</h3>
              </div>
              <button 
                onClick={() => setShowOptimalModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
              
              {/* Optimal Budget Breakdown Grid */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Theoretical Optimal 10-Year Allocation ($500B CAD Total):
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="font-bold text-emerald-900">1. Post-ER Care (ALC)</div>
                    <div className="text-lg font-black text-emerald-700">$175B</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">(35%)</div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="font-bold text-blue-900">2. Complex Patients</div>
                    <div className="text-lg font-black text-blue-700">$125B</div>
                    <div className="text-[10px] text-blue-600 font-semibold">(25%)</div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="font-bold text-amber-900">3. Doctor Shortage</div>
                    <div className="text-lg font-black text-amber-700">$125B</div>
                    <div className="text-[10px] text-amber-600 font-semibold">(25%)</div>
                  </div>

                  <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="font-bold text-red-900">4. Hospital Space</div>
                    <div className="text-lg font-black text-red-700">$75B</div>
                    <div className="text-[10px] text-red-600 font-semibold">(15%)</div>
                  </div>
                </div>
              </div>

              {/* Explanatory Rationale */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Why This Allocation Produces the Highest Score (Score ~96):
                </h4>

                <ol className="list-decimal pl-4 space-y-2 text-slate-600 leading-relaxed">
                  <li>
                    <strong className="text-slate-900">Unlocks Bed-Blocking (35% to Post-ER):</strong> 20%+ of hospital beds are blocked by Alternate Level of Care (ALC) patients with nowhere to go. Funding long-term care and transitional home beds frees up acute hospital space far faster and cheaper than constructing new hospital wings.
                  </li>
                  <li>
                    <strong className="text-slate-900">Upstream ER Deflection (25% to Complex Care):</strong> Medically complex patients account for a disproportionate number of ER visits. Out-of-hospital community clinics deflect these visits before patients reach the ER.
                  </li>
                  <li>
                    <strong className="text-slate-900">Compounding Primary Care (25% to Doctors):</strong> Physician residency expansion takes 3-5 years to bear fruit. 25% funding guarantees long-term sustainability and reduces doctor burnout across the decade.
                  </li>
                  <li>
                    <strong className="text-slate-900">Avoiding the Hospital Expansion Trap (15% to Hospital Space):</strong> Building hospital beds without fixing post-acute care simply creates new beds that immediately fill with blocked ALC patients. 15% is sufficient for essential upgrades without over-allocating on acute brick-and-mortar.
                  </li>
                </ol>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    setAllocation({ ...OPTIMAL_ALLOCATION });
                    setShowOptimalModal(false);
                    setCurrentView('input');
                  }}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-xs transition"
                >
                  Apply Optimal Numbers to Console
                </button>

                <button
                  onClick={() => setShowOptimalModal(false)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition"
                >
                  Close Window
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          Canada Health System Simulation Model • Facilitation Tool
        </div>
      </footer>

    </div>
  );
}