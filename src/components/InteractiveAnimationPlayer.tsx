import React, { useState, useEffect, useRef } from 'react';
import { ConditionAnimationDemo, AnimationPhaseStep, SubjectId } from '../types';
import { ANIMATION_DEMOS } from '../data/animationDemosData';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Layers,
  Sparkles,
  FileText,
  Download,
  Printer,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Activity,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  Share2,
} from 'lucide-react';

interface InteractiveAnimationPlayerProps {
  initialDemoId?: string;
  onOpenSubjectAgent?: (subjectId: SubjectId) => void;
}

export const InteractiveAnimationPlayer: React.FC<InteractiveAnimationPlayerProps> = ({
  initialDemoId,
  onOpenSubjectAgent,
}) => {
  const [selectedDemoId, setSelectedDemoId] = useState<string>(initialDemoId || ANIMATION_DEMOS[0].id);
  const activeDemo = ANIMATION_DEMOS.find((d) => d.id === selectedDemoId) || ANIMATION_DEMOS[0];

  // Animation playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Layer toggles
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showAngles, setShowAngles] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);

  // Active kit tab
  const [activeKitTab, setActiveKitTab] = useState<'video' | 'pocket' | 'flowchart' | 'hep' | 'viva' | 'generator'>('video');

  // Custom AI Video Generator state
  const [customConditionPrompt, setCustomConditionPrompt] = useState<string>('');
  const [customGeneratedStoryboard, setCustomGeneratedStoryboard] = useState<string>('');
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState<boolean>(false);

  const currentPhase: AnimationPhaseStep = activeDemo.phases[currentPhaseIndex] || activeDemo.phases[0];

  // Canvas ref for dynamic biomechanical rendering
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle Play/Pause animation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            // Move to next phase or loop
            if (currentPhaseIndex < activeDemo.phases.length - 1) {
              setCurrentPhaseIndex((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 2 * playbackSpeed;
        });
      }, 50);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentPhaseIndex, activeDemo.phases.length, playbackSpeed]);

  // Voice narration using Web SpeechSynthesis if unmuted
  useEffect(() => {
    if (isPlaying && !isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentPhase.therapistCue);
      utterance.rate = 1.0 * playbackSpeed;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else if (!isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [currentPhaseIndex, isPlaying, isMuted, playbackSpeed, currentPhase.therapistCue]);

  // Render animated canvas simulation based on active demo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.04 * playbackSpeed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Subtle background grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Condition-specific visual rendering
      if (activeDemo.id === 'demo-acl-lachman') {
        // --- LACHMAN TEST SIMULATION ---
        const kneeFlexionAngle = 0.44; // ~25 degrees
        const femurLength = 140;
        const tibiaLength = 140;

        // Hip position
        const hipX = centerX - 120;
        const hipY = centerY - 30;

        // Knee joint center
        const kneeX = hipX + femurLength * Math.cos(kneeFlexionAngle * 0.4);
        const kneeY = hipY + femurLength * Math.sin(kneeFlexionAngle * 0.4) + 40;

        // Ankle joint center
        const ankleX = kneeX + tibiaLength * Math.cos(kneeFlexionAngle * 0.2);
        const ankleY = kneeY + tibiaLength * Math.sin(kneeFlexionAngle * 0.2) + 20;

        // Anterior translation offset (simulating test pull in Phase 2 & 3)
        let anteriorPull = 0;
        if (currentPhaseIndex >= 1) {
          const osc = Math.sin(t * 3);
          anteriorPull = currentPhaseIndex === 1 ? Math.max(0, osc * 12) : 22 + Math.sin(t * 2) * 5;
        }

        // Draw Femur
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.stroke();

        // Femoral Condyle
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Stabilizing Hand (Left hand on femur)
        if (showLandmarks) {
          ctx.fillStyle = '#0f766e';
          ctx.beginPath();
          ctx.arc(kneeX - 35, kneeY - 20, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px sans-serif';
          ctx.fillText('STABILIZE', kneeX - 60, kneeY - 40);
        }

        // Draw Tibia (displaced anteriorly by anteriorPull)
        const displacedKneeX = kneeX - anteriorPull * 0.6;
        const displacedKneeY = kneeY - anteriorPull * 0.9;

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(displacedKneeX, displacedKneeY);
        ctx.lineTo(ankleX, ankleY);
        ctx.stroke();

        // Tibial Plateau
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(displacedKneeX, displacedKneeY, 16, 0, Math.PI * 2);
        ctx.fill();

        // Examining Hand (Right hand pulling tibia anteriorly)
        if (showLandmarks) {
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(displacedKneeX + 30, displacedKneeY + 30, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#d97706';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('ANTERIOR PULL', displacedKneeX + 45, displacedKneeY + 45);
        }

        // ACL Ligament Fibers
        ctx.strokeStyle = currentPhaseIndex === 2 ? '#ef4444' : '#10b981';
        ctx.lineWidth = 4;
        ctx.setLineDash(currentPhaseIndex === 2 ? [4, 4] : []);
        ctx.beginPath();
        ctx.moveTo(kneeX - 5, kneeY - 5);
        ctx.lineTo(displacedKneeX + 5, displacedKneeY + 5);
        ctx.stroke();
        ctx.setLineDash([]);

        // Force vector arrow
        if (showVectors && currentPhaseIndex >= 1) {
          ctx.strokeStyle = '#e11d48';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(displacedKneeX, displacedKneeY + 15);
          ctx.lineTo(displacedKneeX - 35, displacedKneeY - 30);
          ctx.stroke();

          // Arrowhead
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.moveTo(displacedKneeX - 35, displacedKneeY - 30);
          ctx.lineTo(displacedKneeX - 25, displacedKneeY - 20);
          ctx.lineTo(displacedKneeX - 20, displacedKneeY - 32);
          ctx.fill();
        }

        // Angle Protractor Arc
        if (showAngles) {
          ctx.strokeStyle = '#0f766e';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(kneeX, kneeY, 40, 0, 0.5);
          ctx.stroke();
          ctx.fillStyle = '#0f766e';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('25° Knee Flexion', kneeX + 45, kneeY);
          if (anteriorPull > 5) {
            ctx.fillStyle = '#e11d48';
            ctx.fillText(`Displacement: +${Math.round(anteriorPull / 2)} mm`, displacedKneeX - 60, displacedKneeY - 20);
          }
        }
      } else if (activeDemo.id === 'demo-maitland-grades') {
        // --- MAITLAND MOBILIZATION WAVE SIMULATION ---
        const baselineY = centerY + 40;
        const startX = 60;
        const totalW = width - 120;

        // Draw Tissue Resistance Zones (R1 to R2)
        const r1X = startX + totalW * 0.5;
        const r2X = startX + totalW * 0.9;

        // Free range zone
        ctx.fillStyle = 'rgba(241, 245, 249, 0.8)';
        ctx.fillRect(startX, baselineY - 100, r1X - startX, 120);

        // Resistance barrier zone (R1 to R2)
        ctx.fillStyle = 'rgba(254, 243, 199, 0.7)';
        ctx.fillRect(r1X, baselineY - 100, r2X - r1X, 120);

        // Pathological / Overpressure zone (Past R2)
        ctx.fillStyle = 'rgba(254, 226, 226, 0.7)';
        ctx.fillRect(r2X, baselineY - 100, startX + totalW - r2X, 120);

        // Labels
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Available Range', startX + 20, baselineY - 80);
        ctx.fillStyle = '#d97706';
        ctx.fillText('Tissue Resistance (R1 -> R2)', r1X + 20, baselineY - 80);
        ctx.fillStyle = '#dc2626';
        ctx.fillText('Anatomical Limit (R2)', r2X + 10, baselineY - 80);

        // Baseline axis
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, baselineY);
        ctx.lineTo(startX + totalW, baselineY);
        ctx.stroke();

        // R1 and R2 vertical markers
        ctx.strokeStyle = '#d97706';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(r1X, baselineY - 100);
        ctx.lineTo(r1X, baselineY + 20);
        ctx.moveTo(r2X, baselineY - 100);
        ctx.lineTo(r2X, baselineY + 20);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#d97706';
        ctx.fillText('R1', r1X - 8, baselineY + 15);
        ctx.fillText('R2', r2X - 8, baselineY + 15);

        // Active Grade Wave Oscillations
        ctx.strokeStyle = '#0f766e';
        ctx.lineWidth = 3.5;
        ctx.beginPath();

        const grade = currentPhaseIndex + 1; // 1 to 5
        let waveStart = startX;
        let waveWidth = 60;
        let waveAmp = 20;

        if (grade === 1) {
          waveStart = startX;
          waveWidth = 50;
          waveAmp = 15;
        } else if (grade === 2) {
          waveStart = startX + 30;
          waveWidth = r1X - startX - 40;
          waveAmp = 35;
        } else if (grade === 3) {
          waveStart = r1X - 40;
          waveWidth = r2X - r1X + 20;
          waveAmp = 40;
        } else if (grade === 4) {
          waveStart = r2X - 40;
          waveWidth = 35;
          waveAmp = 18;
        } else if (grade === 5) {
          waveStart = r2X - 10;
          waveWidth = 25;
          waveAmp = 55;
        }

        for (let x = waveStart; x <= waveStart + waveWidth; x += 2) {
          const osc = Math.sin(t * 4 + (x - waveStart) * 0.15) * waveAmp;
          if (x === waveStart) {
            ctx.moveTo(x, baselineY - osc);
          } else {
            ctx.lineTo(x, baselineY - osc);
          }
        }
        ctx.stroke();

        // Current hand pressure indicator
        ctx.fillStyle = '#0f766e';
        ctx.beginPath();
        const activeWaveX = waveStart + waveWidth / 2;
        const activeWaveY = baselineY - Math.sin(t * 4) * waveAmp;
        ctx.arc(activeWaveX, activeWaveY, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f766e';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`GRADE ${grade} OSCILLATION`, activeWaveX - 50, activeWaveY - 20);
      } else {
        // --- GENERAL CLINICAL KINEMATIC CYCLE ---
        const cycleProgress = (t % (Math.PI * 2)) / (Math.PI * 2);
        const radius = 80;

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Active phase arc
        ctx.strokeStyle = '#0f766e';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + cycleProgress * Math.PI * 2);
        ctx.stroke();

        // Moving kinetic point
        const ptX = centerX + radius * Math.cos(-Math.PI / 2 + cycleProgress * Math.PI * 2);
        const ptY = centerY + radius * Math.sin(-Math.PI / 2 + cycleProgress * Math.PI * 2);

        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(ptX, ptY, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(activeDemo.title, centerX, centerY - 15);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`Step ${currentPhase.stepNumber}: ${currentPhase.phaseName}`, centerX, centerY + 15);
        ctx.fillText(currentPhase.jointAngleText || 'Biomechanical Alignment', centerX, centerY + 35);
        ctx.textAlign = 'left';
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [activeDemo, currentPhaseIndex, playbackSpeed, showVectors, showAngles, showLandmarks]);

  const handleGenerateCustomStoryboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customConditionPrompt.trim()) return;
    setIsGeneratingStoryboard(true);
    try {
      const res = await fetch('/api/ai/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Physiotherapy Clinical Demonstrations',
          topic: `${customConditionPrompt} - Step-by-Step Biomechanical Animation & Clinical Video Storyboard`,
          level: 'advanced',
          context: 'Provide a 4-phase step-by-step video animation script showing patient positioning, therapist hand holds, directional force vectors, and clinical rationale.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomGeneratedStoryboard(data.content);
      }
    } catch (err) {
      console.error('Storyboard generation error:', err);
    } finally {
      setIsGeneratingStoryboard(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Condition Selector */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
              <span>Interactive Clinical Animations & Media Kits</span>
              <span aria-hidden="true">·</span>
              <span>BPT 5th Semester Biomechanics</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Condition-Wise Animated Clinical Demonstrations
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Synchronized 2D biomechanical motion simulations, audible therapist cues, and full downloadable material kits
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Select Simulation:</span>
            <select
              value={selectedDemoId}
              onChange={(e) => {
                setSelectedDemoId(e.target.value);
                setCurrentPhaseIndex(0);
                setProgressPercent(0);
                setIsPlaying(false);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-teal-700"
            >
              {ANIMATION_DEMOS.map((demo) => (
                <option key={demo.id} value={demo.id}>
                  {demo.title} ({demo.subjectName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Media Kit Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
          <button
            onClick={() => setActiveKitTab('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeKitTab === 'video' ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Biomechanics Simulation</span>
          </button>

          <button
            onClick={() => setActiveKitTab('pocket')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeKitTab === 'pocket' ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Clinical Pocket Card</span>
          </button>

          <button
            onClick={() => setActiveKitTab('flowchart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeKitTab === 'flowchart' ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Biomechanical Flowchart</span>
          </button>

          <button
            onClick={() => setActiveKitTab('hep')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeKitTab === 'hep' ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Patient Home Exercise (HEP) Kit</span>
          </button>

          <button
            onClick={() => setActiveKitTab('viva')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeKitTab === 'viva' ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Viva & Exam Marking Sheet</span>
          </button>

          <button
            onClick={() => setActiveKitTab('generator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto ${
              activeKitTab === 'generator' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:text-amber-800" />
            <span>AI Simulation Script Generator</span>
          </button>
        </div>
      </section>

      {/* TAB 1: INTERACTIVE ANIMATED BIOMECHANICS SIMULATION */}
      {activeKitTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Animation Viewport (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 relative">
              {/* Canvas Renderer */}
              <canvas
                ref={canvasRef}
                width={700}
                height={380}
                className="w-full h-[340px] sm:h-[380px] bg-slate-950 block"
              />

              {/* HUD Overlay: Phase Banner */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white">
                  <span className="text-teal-400 font-bold block uppercase text-[10px]">
                    Step {currentPhase.stepNumber} of {activeDemo.phases.length}
                  </span>
                  <span className="font-semibold">{currentPhase.phaseName}</span>
                </div>

                <div className="bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 rounded-lg px-2.5 py-1 text-right text-xs text-amber-300 font-mono font-semibold">
                  {currentPhase.jointAngleText || 'Phase Target'}
                </div>
              </div>

              {/* HUD Overlay: Layer Controls */}
              <div className="absolute bottom-16 right-3 flex items-center gap-2">
                <button
                  onClick={() => setShowVectors(!showVectors)}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                    showVectors
                      ? 'bg-rose-500/80 text-white border-rose-400'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700'
                  }`}
                >
                  Force Vectors
                </button>
                <button
                  onClick={() => setShowAngles(!showAngles)}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                    showAngles
                      ? 'bg-teal-500/80 text-white border-teal-400'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700'
                  }`}
                >
                  Angle Arc
                </button>
                <button
                  onClick={() => setShowLandmarks(!showLandmarks)}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                    showLandmarks
                      ? 'bg-amber-500/80 text-white border-amber-400'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700'
                  }`}
                >
                  Hand Holds
                </button>
              </div>

              {/* Playback Transport Bar */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4 text-xs">
                {/* Play/Pause & Reset */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center transition-colors shadow-xs"
                    title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPhaseIndex(0);
                      setProgressPercent(0);
                      setIsPlaying(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Reset to Step 1"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
                  </button>
                </div>

                {/* Progress bar scrub */}
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Step {currentPhaseIndex + 1}/{activeDemo.phases.length}
                  </span>
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const pct = (clickX / rect.width) * 100;
                      const phaseTarget = Math.min(
                        activeDemo.phases.length - 1,
                        Math.floor((pct / 100) * activeDemo.phases.length)
                      );
                      setCurrentPhaseIndex(phaseTarget);
                      setProgressPercent(0);
                    }}
                    className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative"
                  >
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{
                        width: `${((currentPhaseIndex + progressPercent / 100) / activeDemo.phases.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Speed toggle */}
                <div className="flex items-center gap-1">
                  {[0.5, 1, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        playbackSpeed === spd
                          ? 'bg-teal-700 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Narration Cue Card */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                  <span>Clinical Instructor Bedside Voiceover & Biomechanical Cue</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Step Duration: ~{currentPhase.durationSeconds}s
                </span>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed bg-teal-50/50 p-3 rounded-lg border border-teal-100">
                "{currentPhase.therapistCue}"
              </p>
              <div className="text-[11px] text-slate-600 pt-1">
                <span className="font-bold text-slate-700">Physiological Mechanism: </span>
                {currentPhase.biomechanicalAction}
              </div>
              {currentPhase.criticalSafetyWarning && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-900 flex items-start gap-1.5 mt-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Clinical Safety Warning: </strong>
                    {currentPhase.criticalSafetyWarning}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Step-by-Step Phase Scrub List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Phase-by-Phase Timeline ({activeDemo.phases.length} Steps)
                </h3>
                <span className="text-[11px] text-slate-500">
                  Click any phase to jump simulation directly
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {activeDemo.phases.map((ph, idx) => (
                  <button
                    key={ph.stepNumber}
                    onClick={() => {
                      setCurrentPhaseIndex(idx);
                      setProgressPercent(0);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-3 rounded-lg text-xs transition-all border ${
                      currentPhaseIndex === idx
                        ? 'bg-teal-50 border-teal-300 text-teal-950 font-semibold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                        Phase 0{ph.stepNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {ph.durationSeconds}s
                      </span>
                    </div>
                    <div className="text-xs font-bold">{ph.phaseName}</div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-normal">
                      {ph.visualHighlight}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Key Anatomical Structures */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs space-y-2">
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                Target Anatomical Structures
              </span>
              <ul className="space-y-1 text-[11px] text-slate-600">
                {activeDemo.keyAnatomicalStructures.map((struct, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    <span>{struct}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLINICAL POCKET REFERENCE CARD */}
      {activeKitTab === 'pocket' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                Bedside Pocket Reference Sheet · {activeDemo.subjectName}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">{activeDemo.title}</h2>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pocket Card</span>
            </button>
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-950 font-medium">
            <span className="font-bold">Summary: </span>
            {activeDemo.materialKit.pocketCardSummary}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                Clinical Examination Protocol
              </h4>
              <p className="text-slate-700 leading-relaxed">{activeDemo.clinicalSignificance}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                University Practical Marking Scheme (10 Marks)
              </h4>
              <ul className="space-y-1 text-slate-700">
                {activeDemo.materialKit.examMarkingPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: BIOMECHANICAL FLOWCHART */}
      {activeKitTab === 'flowchart' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="pb-4 border-b border-slate-200">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
              Step-by-Step Biomechanical & Clinical Pathway
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Flowchart: {activeDemo.title}
            </h2>
          </div>

          <div className="space-y-3">
            {activeDemo.materialKit.flowchartSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: PATIENT HOME EXERCISE (HEP) KIT */}
      {activeKitTab === 'hep' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                Parul Sevashram Hospital · Patient Discharge Handout
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Home Exercise Prescription (HEP)
              </h2>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Patient Handout</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeDemo.materialKit.homeExerciseInstructions.map((inst, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <span className="text-slate-800 font-medium leading-relaxed">{inst}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: VIVA & EXAM BLUEPRINTS */}
      {activeKitTab === 'viva' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="pb-4 border-b border-slate-200">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
              University Viva Voce Examination Blueprints
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              High-Yield Examiner Questions & Model Answers
            </h2>
          </div>

          <div className="space-y-4">
            {activeDemo.materialKit.vivaQuestions.map((v, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-teal-700">Q{idx + 1}:</span>
                  <span>{v.question}</span>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200 text-slate-700 leading-relaxed font-sans">
                  <span className="font-semibold text-slate-900 block mb-0.5">Model Answer Outline:</span>
                  {v.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 6: AI ANIMATED VIDEO & SIMULATION GENERATOR */}
      {activeKitTab === 'generator' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="pb-4 border-b border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI Simulation Storyboard Generator</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Generate Animated Demonstration Script for Any Condition
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Type any specialized clinical test, surgical recovery phase, or manual therapy technique across all 6 subjects to generate a 4-phase animated storyboard breakdown.
            </p>
          </div>

          <form onSubmit={handleGenerateCustomStoryboard} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customConditionPrompt}
                onChange={(e) => setCustomConditionPrompt(e.target.value)}
                placeholder="e.g. Parkinsonian Festinating Gait Freezing, Burns Airplane Splinting, Colles Fracture Closed Reduction..."
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-teal-700 text-slate-900"
              />
              <button
                type="submit"
                disabled={isGeneratingStoryboard}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isGeneratingStoryboard ? (
                  <span>Generating Storyboard...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Video Storyboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {customGeneratedStoryboard && (
            <div className="mt-4 p-5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans shadow-xs">
              {customGeneratedStoryboard}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
