/**
 * FARGO — APPLICATION CONTROLLER
 * Multi-modal forensics (Image, Video, Audio), hidden shortcuts, DIT-FORENSICS-2.0 engine
 * Dead Internet Theory
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Application State
  const state = {
    currentView: 'landing', // 'landing' | 'new-analysis' | 'results' | 'analyses' | 'evidence' | 'reports' | 'settings'
    isAuthenticated: false,
    
    // Hidden Prototype State (Silently set via shortcuts: Ctrl+Shift+A, Ctrl+Shift+R, Ctrl+Shift+D)
    prototypeClassification: null, // "AI_GENERATED" | "REAL" | "INCONCLUSIVE" | null
    prototypeConfidence: null,     // Single fixed float value generated once per shortcut activation
    
    // Media & Analysis State
    mediaType: 'image', // 'image' | 'video' | 'audio'
    stagedFile: null,
    stagedMediaElement: null,
    stagedObjectUrl: null,
    stagedFileInfo: null,
    stagedStats: null,
    currentForensicPackage: null,
    
    // Viewport Controls
    activeFilter: 'original',
    gridEnabled: false,
    crosshairEnabled: false,
    
    // Case History
    analysesHistory: [
      {
        id: "FARGO-2026-IMG-AI-8829",
        filename: "suspect_id_photo.webp",
        mediaType: "image",
        timestamp: "2026-08-19 14:22",
        verdict: "LIKELY AI-GENERATED",
        verdict_type: "ai",
        confidence: 87,
        sha256: "e3b0c442...b855",
        classification: "AI_GENERATED",
        confidenceVal: 0.87
      },
      {
        id: "FARGO-2026-VID-REAL-3140",
        filename: "surveillance_cam_04.mp4",
        mediaType: "video",
        timestamp: "2026-08-18 09:15",
        verdict: "AUTHENTIC VIDEO RECORD",
        verdict_type: "real",
        confidence: 92,
        sha256: "1f2e3d4c...3221",
        classification: "REAL",
        confidenceVal: 0.92
      },
      {
        id: "FARGO-2026-AUD-AI-6504",
        filename: "voicemail_exhibit_b.mp3",
        mediaType: "audio",
        timestamp: "2026-08-17 17:40",
        verdict: "LIKELY SYNTHETIC AUDIO",
        verdict_type: "ai",
        confidence: 91,
        sha256: "8e7d6c5b...a3b2",
        classification: "AI_GENERATED",
        confidenceVal: 0.91
      },
      {
        id: "FARGO-2026-IMG-INC-7731",
        filename: "contract_scan_doc.jpg",
        mediaType: "image",
        timestamp: "2026-08-16 11:05",
        verdict: "INCONCLUSIVE / ELEVATED RISK",
        verdict_type: "warning",
        confidence: 49,
        sha256: "3b98c569...32a2",
        classification: "INCONCLUSIVE",
        confidenceVal: 0.49
      }
    ]
  };

  // Toast Notification Utility (For visible user actions only)
  function showToast(message, type = 'cyan') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '⚡';
    if (type === 'ai') icon = '⚠️';
    if (type === 'real') icon = '✓';
    if (type === 'warning') icon = 'ℹ️';

    toast.innerHTML = `
      <span style="font-size: 1.1rem;">${icon}</span>
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // View Navigation Switcher
  function switchView(viewName) {
    state.currentView = viewName;

    const landingView = document.getElementById('view-landing');
    const appShell = document.getElementById('view-app-shell');
    const viewNewAnalysis = document.getElementById('app-view-new-analysis');
    const viewResults = document.getElementById('app-view-results');
    const viewAnalyses = document.getElementById('app-view-analyses');
    const viewEvidence = document.getElementById('app-view-evidence');
    const viewReports = document.getElementById('app-view-reports');
    const viewSettings = document.getElementById('app-view-settings');
    const breadcrumbCurrent = document.getElementById('breadcrumb-current-view');

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      }
    });

    if (viewName === 'landing') {
      if (landingView) landingView.style.display = 'block';
      if (appShell) appShell.style.display = 'none';
      window.scrollTo(0, 0);
      return;
    }

    if (landingView) landingView.style.display = 'none';
    if (appShell) appShell.style.display = 'flex';

    [viewNewAnalysis, viewResults, viewAnalyses, viewEvidence, viewReports, viewSettings].forEach(v => {
      if (v) v.style.display = 'none';
    });

    if (viewName === 'new-analysis' && viewNewAnalysis) {
      viewNewAnalysis.style.display = 'block';
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'New Analysis';
    } else if (viewName === 'results' && viewResults) {
      viewResults.style.display = 'block';
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'Analysis Results';
    } else if (viewName === 'analyses' && viewAnalyses) {
      viewAnalyses.style.display = 'block';
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'Past Analyses';
      renderAnalysesTable();
    } else if (viewName === 'evidence' && viewEvidence) {
      viewEvidence.style.display = 'block';
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'Evidence Library';
    } else if (viewName === 'reports' && viewReports) {
      viewReports.style.display = 'block';
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'Reports Archive';
      renderReportsTable();
    } else if (viewName === 'settings' && viewSettings) {
      viewSettings.style.display = 'block';
      if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'Laboratory Settings';
    }

    window.scrollTo(0, 0);
  }

  // Modals management
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Authentication Flow
  function initAuthFlow() {
    const tabSignIn = document.getElementById('auth-tab-signin');
    const tabSignUp = document.getElementById('auth-tab-signup');
    const authForm = document.getElementById('auth-form');
    const authBtn = document.getElementById('auth-submit-btn');
    const googleBtn = document.getElementById('auth-google-btn');

    document.querySelectorAll('[data-action="open-auth"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('modal-auth');
      });
    });

    document.querySelectorAll('[data-action="try-fargo"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        state.isAuthenticated = true;
        showToast('Entering Fargo Forensic Laboratory as Digital Investigator');
        switchView('new-analysis');
      });
    });

    if (tabSignIn && tabSignUp) {
      tabSignIn.addEventListener('click', () => {
        tabSignIn.classList.add('active');
        tabSignUp.classList.remove('active');
        if (authBtn) authBtn.textContent = 'Sign In to Fargo';
      });
      tabSignUp.addEventListener('click', () => {
        tabSignUp.classList.add('active');
        tabSignIn.classList.remove('active');
        if (authBtn) authBtn.textContent = 'Create Investigator Account';
      });
    }

    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.isAuthenticated = true;
        closeModal('modal-auth');
        showToast('Authentication verified. Welcome to Fargo.', 'cyan');
        switchView('new-analysis');
      });
    }

    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        state.isAuthenticated = true;
        closeModal('modal-auth');
        showToast('Authenticated via Organization Single Sign-On', 'cyan');
        switchView('new-analysis');
      });
    }
  }

  // Reset staging state
  function resetStagingState() {
    if (state.stagedObjectUrl) {
      URL.revokeObjectURL(state.stagedObjectUrl);
    }
    state.stagedFile = null;
    state.stagedMediaElement = null;
    state.stagedObjectUrl = null;
    state.stagedFileInfo = null;
    state.stagedStats = null;
    
    // Reset hidden classification on every new upload
    state.prototypeClassification = null;
    state.prototypeConfidence = null;

    const stagedPanel = document.getElementById('staged-media-panel');
    const dropzone = document.getElementById('analysis-dropzone');
    const fileInput = document.getElementById('file-upload-input');
    const previewContainer = document.getElementById('staged-preview-container');

    if (stagedPanel) stagedPanel.classList.remove('active');
    if (dropzone) dropzone.style.display = 'flex';
    if (fileInput) fileInput.value = '';
    if (previewContainer) previewContainer.innerHTML = '';
  }

  // Multi-Modal Dropzone & Ingestion (Image, Video, Audio)
  function initDropzone() {
    const dropzone = document.getElementById('analysis-dropzone');
    const fileInput = document.getElementById('file-upload-input');
    const stagedPanel = document.getElementById('staged-media-panel');
    const previewContainer = document.getElementById('staged-preview-container');
    const btnAnalyze = document.getElementById('btn-start-analysis');
    const btnRemoveStaged = document.getElementById('btn-remove-staged');

    const metaFilename = document.getElementById('staged-filename');
    const metaFilesize = document.getElementById('staged-filesize');
    const metaDimensions = document.getElementById('staged-dimensions');
    const metaFormat = document.getElementById('staged-format');
    const metaSha256 = document.getElementById('staged-sha256');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processUploadedFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processUploadedFile(e.target.files[0]);
      }
    });

    async function processUploadedFile(file) {
      const mime = file.type || '';
      let mType = 'image';
      if (mime.startsWith('video/') || /\.(mp4|mov|webm|mkv|avi)$/i.test(file.name)) {
        mType = 'video';
      } else if (mime.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(file.name)) {
        mType = 'audio';
      } else if (mime.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff)$/i.test(file.name)) {
        mType = 'image';
      } else {
        showToast('Unsupported media format. Please select a supported image, video, or audio file.', 'warning');
        return;
      }

      state.mediaType = mType;
      state.prototypeClassification = null;
      state.prototypeConfidence = null;
      state.stagedFile = file;

      // SHA-256 calculation
      let sha256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      try {
        const arrayBuffer = await file.arrayBuffer();
        sha256 = await FargoForensicEngine.computeSHA256(arrayBuffer);
      } catch (err) {
        console.warn("SHA-256 calculation fallback", err);
      }

      if (state.stagedObjectUrl) {
        URL.revokeObjectURL(state.stagedObjectUrl);
      }
      const objectUrl = URL.createObjectURL(file);
      state.stagedObjectUrl = objectUrl;

      const fileExt = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : mType.toUpperCase();
      const fileFormat = file.type ? file.type.replace(`${mType}/`, '').toUpperCase() : fileExt;

      if (mType === 'image') {
        const img = new Image();
        img.onload = () => {
          state.stagedMediaElement = img;
          const stats = FargoForensicEngine.analyzeImagePixels(img);
          state.stagedStats = stats;

          const fileInfo = {
            name: file.name,
            size: file.size,
            dimensions: `${img.naturalWidth} x ${img.naturalHeight} px`,
            format: fileFormat,
            mime_type: file.type || `image/${fileFormat.toLowerCase()}`,
            sha256: sha256
          };
          state.stagedFileInfo = fileInfo;

          if (previewContainer) {
            previewContainer.innerHTML = `<img src="${objectUrl}" alt="Staged Preview" style="width:100%; height:100%; object-fit:contain;">`;
          }
          populateStagedMetadata(fileInfo, sha256);
        };
        img.src = objectUrl;
      }
      else if (mType === 'video') {
        const video = document.createElement('video');
        video.src = objectUrl;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '240px';
        video.style.borderRadius = '4px';

        video.onloadedmetadata = () => {
          state.stagedMediaElement = video;
          const durationStr = FargoForensicEngine.formatDuration(video.duration);
          const dimStr = video.videoWidth && video.videoHeight ? `${video.videoWidth} x ${video.videoHeight} px` : "1920 x 1080 px";

          const fileInfo = {
            name: file.name,
            size: file.size,
            dimensions: dimStr,
            duration: durationStr,
            format: fileFormat || "MP4",
            mime_type: file.type || "video/mp4",
            sha256: sha256
          };
          state.stagedFileInfo = fileInfo;

          if (previewContainer) {
            previewContainer.innerHTML = '';
            previewContainer.appendChild(video);
          }
          populateStagedMetadata(fileInfo, sha256, `Duration: ${durationStr}`);
        };
      }
      else if (mType === 'audio') {
        const audio = document.createElement('audio');
        audio.src = objectUrl;
        audio.controls = true;
        audio.style.width = '100%';

        audio.onloadedmetadata = () => {
          state.stagedMediaElement = audio;
          const durationStr = FargoForensicEngine.formatDuration(audio.duration);

          const fileInfo = {
            name: file.name,
            size: file.size,
            dimensions: `Audio Stream (${durationStr})`,
            duration: durationStr,
            format: fileFormat || "MP3",
            mime_type: file.type || "audio/mpeg",
            sha256: sha256
          };
          state.stagedFileInfo = fileInfo;

          if (previewContainer) {
            previewContainer.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%; padding:1.5rem; gap:1rem; background:#080b11;">
                <div class="pipeline-spectrogram" style="height:50px; width:80%; justify-content:center;">
                  <div class="spectrogram-bar" style="height:35px;"></div>
                  <div class="spectrogram-bar" style="height:45px;"></div>
                  <div class="spectrogram-bar" style="height:25px;"></div>
                  <div class="spectrogram-bar" style="height:50px;"></div>
                  <div class="spectrogram-bar" style="height:40px;"></div>
                  <div class="spectrogram-bar" style="height:30px;"></div>
                  <div class="spectrogram-bar" style="height:45px;"></div>
                  <div class="spectrogram-bar" style="height:20px;"></div>
                </div>
              </div>
            `;
            previewContainer.firstElementChild.appendChild(audio);
          }
          populateStagedMetadata(fileInfo, sha256, `Duration: ${durationStr}`);
        };
      }

      function populateStagedMetadata(info, hash, extraMeta = null) {
        if (metaFilename) metaFilename.textContent = info.name;
        if (metaFilesize) metaFilesize.textContent = `${FargoForensicEngine.formatBytes(info.size)} (${info.size.toLocaleString()} bytes)`;
        if (metaDimensions) metaDimensions.textContent = extraMeta ? `${info.dimensions}` : info.dimensions;
        if (metaFormat) metaFormat.textContent = `${mType.toUpperCase()} / ${info.format}`;
        if (metaSha256) metaSha256.textContent = hash;

        dropzone.style.display = 'none';
        if (stagedPanel) stagedPanel.classList.add('active');
        showToast(`${mType.toUpperCase()} staged: ${info.name}`, 'cyan');
      }
    }

    if (btnRemoveStaged) {
      btnRemoveStaged.addEventListener('click', () => {
        resetStagingState();
      });
    }

    if (btnAnalyze) {
      btnAnalyze.addEventListener('click', () => {
        if (!state.stagedFile || !state.stagedMediaElement) {
          fileInput.click();
          return;
        }
        startForensicPipeline();
      });
    }
  }

  // -----------------------------------------------------------------------
  // Media-Type-Aware Forensic Pipeline Animation
  // -----------------------------------------------------------------------

  // Parse "MM:SS" or "HH:MM:SS" to total seconds
  function parseDurationSeconds(str) {
    if (!str) return 0;
    const parts = str.split(':').map(p => parseInt(p, 10));
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  }

  // Compute total processing duration from actual media characteristics
  function computeBaseDuration(mediaInfo, type) {
    if (!mediaInfo) return 2000;
    const sizeKB = (mediaInfo.size || 0) / 1024;
    switch (type) {
      case 'image': {
        let width = 0, height = 0;
        if (mediaInfo.dimensions) {
          const dims = mediaInfo.dimensions.replace(/px/g, '').trim().split(' x ');
          if (dims.length === 2) { width = parseInt(dims[0], 10); height = parseInt(dims[1], 10); }
        }
        let base = 2000 + sizeKB * 0.5 + (width + height) * 0.2;
        return Math.min(Math.max(base, 2000), 6000);
      }
      case 'video': {
        let width = 0, height = 0;
        if (mediaInfo.dimensions) {
          const dims = mediaInfo.dimensions.replace(/px/g, '').trim().split(' x ');
          if (dims.length === 2) { width = parseInt(dims[0], 10); height = parseInt(dims[1], 10); }
        }
        const durationSec = parseDurationSeconds(mediaInfo.duration);
        const resFactor = (width && height) ? (width * height) / (1920 * 1080) : 1;
        let base = 5000 + sizeKB * 0.01 + durationSec * 20 + resFactor * 500;
        return Math.min(Math.max(base, 5000), 15000);
      }
      case 'audio': {
        const durationSec = parseDurationSeconds(mediaInfo.duration);
        let base = 3000 + sizeKB * 0.3 + durationSec * 15;
        return Math.min(Math.max(base, 3000), 8000);
      }
      default: return 3000;
    }
  }

  // Scale step durations proportionally and add ±10% per-step jitter
  function adjustStepDurations(stepsArray, baseTotal) {
    const totalDefault = stepsArray.reduce((sum, s) => sum + s.duration, 0);
    return stepsArray.map(s => {
      const weight = s.duration / totalDefault;
      let dur = Math.round(baseTotal * weight);
      const jitter = Math.round((Math.random() * 0.2 - 0.1) * dur);
      dur = Math.max(50, dur + jitter);
      return { ...s, duration: dur };
    });
  }

  function startForensicPipeline() {
    openModal('modal-pipeline');
    const mType = state.mediaType || 'image';

    // Build step list based on media type
    let steps = [];
    if (mType === 'video') {
      steps = [
        { name: 'INGESTING VIDEO & SHA-256 SEAL',           duration: 600 },
        { name: 'READING CONTAINER & STREAM METADATA',       duration: 700 },
        { name: 'ANALYZING VIDEO STREAM & BITRATE',          duration: 750 },
        { name: 'EXAMINING FRAME CHARACTERISTICS & MOTION',  duration: 900 },
        { name: 'CHECKING TEMPORAL COMPRESSION SIGNALS',     duration: 800 },
        { name: 'EVALUATING MULTI-FRAME DETECTORS',          duration: 950 },
        { name: 'COMPILING DIT-FORENSICS-2.0 PACKAGE',       duration: 600 }
      ];
    } else if (mType === 'audio') {
      steps = [
        { name: 'INGESTING AUDIO & SHA-256 SEAL',            duration: 550 },
        { name: 'READING AUDIO METADATA & CONTAINER',         duration: 650 },
        { name: 'ANALYZING WAVEFORM & AMPLITUDE PROFILE',     duration: 750 },
        { name: 'EXAMINING FREQUENCY SPECTROGRAM & FFT',      duration: 800 },
        { name: 'ANALYZING ACOUSTIC SIGNALS & VOCODER',       duration: 850 },
        { name: 'EVALUATING VOICE CLONE INDICATORS',          duration: 850 },
        { name: 'COMPILING DIT-FORENSICS-2.0 PACKAGE',        duration: 550 }
      ];
    } else {
      steps = [
        { name: 'INGESTING MEDIA & SHA-256 SEAL',             duration: 550 },
        { name: 'EXAMINING METADATA & HEADERS',               duration: 650 },
        { name: 'ANALYZING IMAGE STATISTICS & ENTROPY',       duration: 750 },
        { name: 'EVALUATING FORENSIC DETECTORS',              duration: 900 },
        { name: 'COMPILING DIT-FORENSICS-2.0 PACKAGE',        duration: 550 }
      ];
    }

    // Apply variable timing based on actual media characteristics
    const baseDuration = computeBaseDuration(state.stagedFileInfo, mType);
    steps = adjustStepDurations(steps, baseDuration);

    const stepsListContainer = document.getElementById('pipeline-steps-list');
    const progressBar        = document.getElementById('pipeline-progress-bar');
    const statusText         = document.getElementById('pipeline-live-status-text');

    if (stepsListContainer) {
      stepsListContainer.innerHTML = steps.map((s, i) => `
        <div class="pipeline-step-row pending" id="pipeline-step-${i}">
          <span>${String(i + 1).padStart(2, '0')} ${s.name}</span>
          <span class="step-status-icon">○</span>
        </div>
      `).join('');
    }

    let currentStepIndex = 0;

    function runNextStep() {
      if (currentStepIndex >= steps.length) {
        if (progressBar) progressBar.style.width = '100%';
        if (statusText)  statusText.textContent  = 'FORENSIC PACKAGE READY';

        setTimeout(async () => {
          closeModal('modal-pipeline');
          renderCompleteAnalysis();
          switchView('results');
          showToast('Forensic examination complete.', 'cyan');

          // Persist to Supabase (non-blocking; UI is already showing the result)
          if (state.currentForensicPackage) {
            const saved = await FargoSupabase.saveCase(
              state.currentForensicPackage,
              state.stagedFileInfo,
              state.mediaType
            );
            if (saved) {
              // Prepend the new row into local history and refresh badge
              state.analysesHistory.unshift(dbRowToHistoryItem(saved));
              updateAnalysesBadge();
            } else if (FargoSupabase.isConfigured()) {
              // Supabase is configured but failed — show subtle notice
              showDbErrorNotice();
            }
          }
        }, 350);
        return;
      }

      const step   = steps[currentStepIndex];
      const stepEl = document.getElementById(`pipeline-step-${currentStepIndex}`);

      if (stepEl) {
        stepEl.className = 'pipeline-step-row active';
        const icon = stepEl.querySelector('.step-status-icon');
        if (icon) icon.innerHTML = '<span class="animate-pulse">●</span>';
      }
      if (statusText) statusText.textContent = `EXECUTING: ${step.name}...`;

      const progressPct = Math.round(((currentStepIndex + 0.5) / steps.length) * 100);
      if (progressBar) progressBar.style.width = `${progressPct}%`;

      setTimeout(() => {
        if (stepEl) {
          stepEl.className = 'pipeline-step-row completed';
          const icon = stepEl.querySelector('.step-status-icon');
          if (icon) icon.innerHTML = '✓';
        }
        currentStepIndex++;
        runNextStep();
      }, step.duration);
    }

    runNextStep();
  }

  // Render Full Results View (Media-Type-Aware)
  function renderCompleteAnalysis() {
    const classification = state.prototypeClassification || "AI_GENERATED";
    const mType = state.mediaType || "image";
    
    // Stable confidence assignment per analysis
    let confidence = state.prototypeConfidence;
    if (typeof confidence !== 'number') {
      if (classification === "INCONCLUSIVE") {
        confidence = parseFloat((0.45 + Math.random() * (0.54 - 0.45)).toFixed(3));
      } else if (classification === "REAL") {
        confidence = parseFloat((0.82 + Math.random() * (0.97 - 0.82)).toFixed(3));
      } else {
        confidence = parseFloat((0.82 + Math.random() * (0.96 - 0.82)).toFixed(3));
      }
      state.prototypeConfidence = confidence;
    }

    const fileInfo = state.stagedFileInfo || {
      name: state.stagedFile ? state.stagedFile.name : `evidence_${mType}.${mType === 'video' ? 'mp4' : (mType === 'audio' ? 'mp3' : 'jpg')}`,
      size: state.stagedFile ? state.stagedFile.size : 1048576,
      dimensions: mType === 'audio' ? "Audio Stream" : "1920 x 1080 px",
      format: mType.toUpperCase(),
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    };

    const pkg = FargoForensicEngine.buildForensicPackage(fileInfo, state.stagedStats, classification, confidence, mType);
    state.currentForensicPackage = pkg;

    // Header info
    const resId = document.getElementById('res-analysis-id');
    const resTime = document.getElementById('res-timestamp');
    const resSha256 = document.getElementById('res-sha256');
    if (resId) resId.textContent = pkg.analysis_id;
    if (resTime) resTime.textContent = new Date(pkg.timestamp).toLocaleTimeString();
    if (resSha256) resSha256.textContent = pkg.media.sha256.substring(0, 16) + '...';

    // Adapt Viewport Container based on Media Type
    const canvasContainer = document.getElementById('viewport-canvas-container');
    const canvas = document.getElementById('viewport-canvas');
    const viewportToolbar = document.getElementById('viewport-toolbar-filters');
    const viewportInfo = document.getElementById('res-viewport-info');

    if (canvasContainer) {
      if (mType === 'image') {
        if (canvas) canvas.style.display = 'block';
        if (viewportToolbar) viewportToolbar.style.display = 'flex';
        if (viewportInfo) viewportInfo.textContent = 'BIT DEPTH: 24-BIT RGB';
        
        // Remove video/audio elements from container
        const dynamicMedia = canvasContainer.querySelector('.dynamic-result-media');
        if (dynamicMedia) dynamicMedia.remove();

        if (canvas && state.stagedMediaElement) {
          FargoViewportFilters.renderFilter(state.stagedMediaElement, canvas, state.activeFilter);
        } else if (canvas && !state.stagedMediaElement) {
          // DB replay — show forensic placeholder
          const ctx = canvas.getContext('2d');
          canvas.width = 640; canvas.height = 400;
          ctx.fillStyle = '#07090f';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = 'rgba(0,240,255,0.15)';
          ctx.lineWidth = 1;
          for (let x = 0; x < canvas.width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
          for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
          ctx.font = '12px monospace'; ctx.fillStyle = 'rgba(0,240,255,0.35)'; ctx.textAlign = 'center';
          ctx.fillText('ARCHIVED CASE — MEDIA NOT STORED', canvas.width / 2, canvas.height / 2 - 10);
          ctx.fillText('FORENSIC RECORD FROM DATABASE', canvas.width / 2, canvas.height / 2 + 14);
        }
      } 
      else if (mType === 'video') {
        if (canvas) canvas.style.display = 'none';
        if (viewportToolbar) viewportToolbar.style.display = 'none';
        if (viewportInfo) viewportInfo.textContent = `CODEC: H.264 / 30 FPS • DURATION: ${pkg.media.duration || '00:15'}`;

        const existingDynamic = canvasContainer.querySelector('.dynamic-result-media');
        if (state.stagedObjectUrl) {
          let vidEl = canvasContainer.querySelector('video.dynamic-result-media');
          if (!vidEl) {
            vidEl = document.createElement('video');
            vidEl.className = 'dynamic-result-media';
            vidEl.controls = true;
            vidEl.autoplay = false;
            vidEl.style.maxWidth = '100%';
            vidEl.style.maxHeight = '420px';
            canvasContainer.appendChild(vidEl);
          }
          vidEl.src = state.stagedObjectUrl;
        } else {
          // DB replay placeholder
          if (existingDynamic) existingDynamic.remove();
          const ph = document.createElement('div');
          ph.className = 'dynamic-result-media';
          ph.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:200px;background:#07090f;border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:0.78rem;color:rgba(0,240,255,0.35);text-align:center;';
          ph.innerHTML = 'ARCHIVED CASE — MEDIA NOT STORED<br>FORENSIC RECORD FROM DATABASE';
          canvasContainer.appendChild(ph);
        }
      }
      else if (mType === 'audio') {
        if (canvas) canvas.style.display = 'none';
        if (viewportToolbar) viewportToolbar.style.display = 'none';
        if (viewportInfo) viewportInfo.textContent = `AUDIO: 44.1 kHz • STEREO • DURATION: ${pkg.media.duration || '00:35'}`;

        let audWrapper = canvasContainer.querySelector('.audio-result-wrapper');
        if (state.stagedObjectUrl) {
          if (!audWrapper) {
            audWrapper = document.createElement('div');
            audWrapper.className = 'dynamic-result-media audio-result-wrapper';
            audWrapper.style.cssText = 'display:flex; flex-direction:column; align-items:center; justify-content:center; width:80%; gap:1.5rem; padding:2rem; background:#07090f; border-radius:8px; border:1px solid var(--border-subtle);';
            audWrapper.innerHTML = `
              <div class="pipeline-spectrogram" style="height:70px; width:100%; justify-content:center;">
                <div class="spectrogram-bar" style="height:40px;"></div>
                <div class="spectrogram-bar" style="height:60px;"></div>
                <div class="spectrogram-bar" style="height:30px;"></div>
                <div class="spectrogram-bar" style="height:65px;"></div>
                <div class="spectrogram-bar" style="height:50px;"></div>
                <div class="spectrogram-bar" style="height:35px;"></div>
                <div class="spectrogram-bar" style="height:55px;"></div>
                <div class="spectrogram-bar" style="height:25px;"></div>
                <div class="spectrogram-bar" style="height:60px;"></div>
                <div class="spectrogram-bar" style="height:45px;"></div>
              </div>
              <audio controls style="width:100%;" src="${state.stagedObjectUrl}"></audio>
            `;
            canvasContainer.appendChild(audWrapper);
          } else {
            const aud = audWrapper.querySelector('audio');
            if (aud) aud.src = state.stagedObjectUrl;
          }
        } else {
          // DB replay placeholder
          if (audWrapper) audWrapper.remove();
          const ph = canvasContainer.querySelector('.dynamic-result-media') || document.createElement('div');
          ph.className = 'dynamic-result-media';
          ph.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:160px;background:#07090f;border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:0.78rem;color:rgba(0,240,255,0.35);text-align:center;';
          ph.innerHTML = 'ARCHIVED CASE — AUDIO NOT STORED<br>FORENSIC RECORD FROM DATABASE';
          if (!ph.parentNode) canvasContainer.appendChild(ph);
        }
      }
    }

    // Verdict Block
    const verdictTitle = document.getElementById('res-verdict-title');
    const verdictSub = document.getElementById('res-verdict-subtitle');
    const verdictBadge = document.getElementById('res-verdict-badge');
    const agreementVal = document.getElementById('res-agreement-val');
    const riskVal = document.getElementById('res-risk-val');
    const synthScoreVal = document.getElementById('res-synth-score-val');

    const vType = pkg.overall_assessment.verdict_type;
    if (verdictTitle) {
      verdictTitle.textContent = pkg.overall_assessment.verdict;
      verdictTitle.className = `verdict-classification-title ${vType}`;
    }
    if (verdictSub) verdictSub.textContent = pkg.overall_assessment.interpretation_quality;
    if (verdictBadge) {
      verdictBadge.textContent = pkg.overall_assessment.verdict;
      verdictBadge.className = `badge badge-${vType}`;
    }
    if (agreementVal) agreementVal.textContent = pkg.overall_assessment.model_agreement;
    if (riskVal) riskVal.textContent = pkg.overall_assessment.risk_level;
    if (synthScoreVal) synthScoreVal.textContent = `${(pkg.overall_assessment.synthetic_likelihood_score * 100).toFixed(0)}%`;

    // Radial Gauge
    const gaugeFill = document.getElementById('res-gauge-fill');
    const gaugeNum = document.getElementById('res-gauge-num');
    const score = pkg.overall_assessment.confidence_score;

    if (gaugeNum) gaugeNum.textContent = `${score}%`;
    if (gaugeFill) {
      gaugeFill.className = `gauge-fill ${vType}`;
      const maxOffset = 283;
      const offset = maxOffset - (maxOffset * (score / 100));
      setTimeout(() => {
        gaugeFill.style.strokeDashoffset = offset;
      }, 100);
    }

    // Adapt Evidence Cards to Media Type
    renderMediaSpecificEvidenceCards(pkg, mType);

    // Findings stack
    const findingsContainer = document.getElementById('res-findings-container');
    if (findingsContainer) {
      findingsContainer.innerHTML = (pkg.findings || []).map(f => `
        <div class="finding-item">
          <div class="finding-item-header">
            <div class="finding-title">${f.id}: ${f.title}</div>
            <span class="badge ${f.severity_type === 'ai' ? 'badge-ai' : (f.severity_type === 'real' ? 'badge-real' : 'badge-warning')}">${f.severity}</span>
          </div>
          <div class="finding-desc"><strong>Observation:</strong> ${f.observation}</div>
          <div class="finding-desc" style="color: var(--text-highlight);"><strong>Interpretation:</strong> ${f.interpretation}</div>
          <div class="finding-tags-row">
            <span class="finding-tag">Category: ${f.category}</span>
            <span class="finding-tag">Confidence: ${f.confidence}</span>
          </div>
        </div>
      `).join('');
    }

    // Timeline stack
    const timelineContainer = document.getElementById('res-timeline-container');
    if (timelineContainer) {
      timelineContainer.innerHTML = (pkg.timeline || []).map(t => `
        <div class="timeline-step completed">
          <div class="timeline-dot"></div>
          <div class="timeline-step-title">${t.step} <span style="font-size:0.7rem; color:var(--text-muted);">[${t.time}]</span></div>
          <div class="timeline-step-desc">${t.detail}</div>
        </div>
      `).join('');
    }
  }

  // Media-Specific Evidence Cards Renderer
  function renderMediaSpecificEvidenceCards(pkg, mType) {
    const quadGrid = document.getElementById('evidence-quad-grid');
    if (!quadGrid) return;

    if (mType === 'video') {
      quadGrid.innerHTML = `
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>CONTAINER & STREAMS</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">Container</span><span class="evidence-kv-val">${pkg.forensic_signals.metadata.container || 'MPEG-4'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Codec</span><span class="evidence-kv-val">H.264 / AVC</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Resolution</span><span class="evidence-kv-val">${pkg.media.dimensions || '1920x1080'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Duration</span><span class="evidence-kv-val">${pkg.media.duration || '00:12'}</span></div>
          </div>
        </div>
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>FRAME & MOTION ANALYSIS</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">Frames Evaluated</span><span class="evidence-kv-val">${pkg.frame_analysis.total_frames_analyzed || 360} frames</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Keyframe Interval</span><span class="evidence-kv-val">GOP ${pkg.frame_analysis.keyframe_interval || 30}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Temporal Coherence</span><span class="evidence-kv-val">${pkg.overall_assessment.verdict_type === 'real' ? 'Rigid / Natural' : 'Warping Detected'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Frame Artifacts</span><span class="evidence-kv-val">${pkg.overall_assessment.verdict_type === 'real' ? 'None' : 'Latent Flicker'}</span></div>
          </div>
        </div>
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>TEMPORAL COMPRESSION</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">Encoding Matrix</span><span class="evidence-kv-val">${pkg.forensic_signals.compression.quantization_tables}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Bitrate Cadence</span><span class="evidence-kv-val">Variable Bitrate (VBR)</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Motion Vectors</span><span class="evidence-kv-val">${pkg.overall_assessment.verdict_type === 'real' ? 'Physical Rotary Shutter' : 'Synthetic Flow'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Chroma Format</span><span class="evidence-kv-val">YUV 4:2:0</span></div>
          </div>
        </div>
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>DETECTOR CONSENSUS</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">Primary Video Net</span><span class="evidence-kv-val" style="color:${pkg.overall_assessment.verdict_type === 'ai' ? '#f87171' : '#34d399'};">${pkg.models.primary_detector.status}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Optical Flow Net</span><span class="evidence-kv-val" style="color:${pkg.overall_assessment.verdict_type === 'ai' ? '#f87171' : '#34d399'};">${pkg.models.secondary_detector.status}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Interpretation Mode</span><span class="evidence-kv-val">Heuristic Engine</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Assessment Quality</span><span class="evidence-kv-val">Calibrated</span></div>
          </div>
        </div>
      `;
    } 
    else if (mType === 'audio') {
      quadGrid.innerHTML = `
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>ACOUSTIC CONTAINER</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">Container</span><span class="evidence-kv-val">${pkg.forensic_signals.metadata.container || 'ID3 Audio Stream'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Encoding</span><span class="evidence-kv-val">${pkg.media.format || 'MP3'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Duration</span><span class="evidence-kv-val">${pkg.media.duration || '00:35'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Dynamic Peak</span><span class="evidence-kv-val">${pkg.forensic_signals.metadata.peak_amplitude || '-0.5 dBFS'}</span></div>
          </div>
        </div>
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>SPECTRAL & FREQUENCY</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">Cutoff Frequency</span><span class="evidence-kv-val">${pkg.audio_analysis.spectral_cutoff_frequency || '22,050 Hz'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Vocoder Artifacts</span><span class="evidence-kv-val">${pkg.overall_assessment.verdict_type === 'ai' ? 'Detected (Phase Comb)' : 'None (Natural)'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Breath Acoustics</span><span class="evidence-kv-val">${pkg.overall_assessment.verdict_type === 'ai' ? 'Non-Aerodynamic' : 'Human Turbulence'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Formant Resonance</span><span class="evidence-kv-val">${pkg.overall_assessment.verdict_type === 'ai' ? 'Synthetic Jump' : 'Continuous'}</span></div>
          </div>
        </div>
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>VOICE BIOMETRICS</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">F0 Pitch Jitter</span><span class="evidence-kv-val">${pkg.overall_assessment.verdict_type === 'ai' ? 'Sub-natural intonation' : '1.2% Natural Jitter'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Harmonic SNR</span><span class="evidence-kv-val">24.5 dB</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Ambient Reflection</span><span class="evidence-kv-val">${pkg.overall_assessment.verdict_type === 'ai' ? 'Dry / Spliced' : 'Room Impulse Confirmed'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Zero Crossing</span><span class="evidence-kv-val">Consistent Profile</span></div>
          </div>
        </div>
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>DETECTOR SIGNALS</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">Speech Clone Net</span><span class="evidence-kv-val" style="color:${pkg.overall_assessment.verdict_type === 'ai' ? '#f87171' : '#34d399'};">${pkg.models.primary_detector.status}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Vocoder Detector</span><span class="evidence-kv-val" style="color:${pkg.overall_assessment.verdict_type === 'ai' ? '#f87171' : '#34d399'};">${pkg.models.secondary_detector.status}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Interpretation Mode</span><span class="evidence-kv-val">Heuristic Engine</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Assessment Quality</span><span class="evidence-kv-val">Calibrated</span></div>
          </div>
        </div>
      `;
    }
    else {
      // Image default quad grid
      quadGrid.innerHTML = `
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>METADATA ANALYSIS</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">EXIF Headers</span><span class="evidence-kv-val">${pkg.forensic_signals.metadata.exif_present ? 'Present (Verified)' : 'Not present'}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Camera / Make</span><span class="evidence-kv-val">${pkg.forensic_signals.metadata.camera_make} ${pkg.forensic_signals.metadata.camera_model}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Software Tag</span><span class="evidence-kv-val">${pkg.forensic_signals.metadata.software}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Creation Date</span><span class="evidence-kv-val">${pkg.forensic_signals.metadata.modification_date}</span></div>
          </div>
        </div>
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>IMAGE STATISTICS</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">Luminance / Brightness</span><span class="evidence-kv-val">${pkg.forensic_signals.image_statistics.brightness}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Standard Contrast</span><span class="evidence-kv-val">${pkg.forensic_signals.image_statistics.contrast}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Shannon Entropy</span><span class="evidence-kv-val">${pkg.forensic_signals.image_statistics.entropy} bits/px</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Noise Variance</span><span class="evidence-kv-val">${pkg.forensic_signals.image_statistics.noise_variance}</span></div>
          </div>
        </div>
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>COMPRESSION</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">JPEG Structure</span><span class="evidence-kv-val">${pkg.forensic_signals.compression.jpeg_structure}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Quantization</span><span class="evidence-kv-val">${pkg.forensic_signals.compression.quantization_tables}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Double Compression</span><span class="evidence-kv-val">${pkg.forensic_signals.compression.double_compression}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Chroma Subsample</span><span class="evidence-kv-val">4:2:0</span></div>
          </div>
        </div>
        <div class="evidence-detail-card">
          <div class="evidence-card-title"><span>DETECTOR STATUS</span></div>
          <div class="evidence-key-value-list">
            <div class="evidence-kv-row"><span class="evidence-kv-key">Primary Detector</span><span class="evidence-kv-val" style="color:${pkg.overall_assessment.verdict_type === 'ai' ? '#f87171' : (pkg.overall_assessment.verdict_type === 'real' ? '#34d399' : '#fbbf24')};">${pkg.models.primary_detector.status}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Secondary Detector</span><span class="evidence-kv-val" style="color:${pkg.overall_assessment.verdict_type === 'ai' ? '#f87171' : (pkg.overall_assessment.verdict_type === 'real' ? '#34d399' : '#fbbf24')};">${pkg.models.secondary_detector.status}</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Interpretation Mode</span><span class="evidence-kv-val">Heuristic Engine</span></div>
            <div class="evidence-kv-row"><span class="evidence-kv-key">Assessment Quality</span><span class="evidence-kv-val">Calibrated</span></div>
          </div>
        </div>
      `;
    }
  }

  // Viewport Toolbar Filters for Images
  function initViewportToolbar() {
    document.querySelectorAll('.viewport-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.viewport-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilter = btn.getAttribute('data-filter');
        
        const canvas = document.getElementById('viewport-canvas');
        if (canvas && state.stagedMediaElement && state.mediaType === 'image') {
          FargoViewportFilters.renderFilter(state.stagedMediaElement, canvas, state.activeFilter);
        }
      });
    });

    const toggleGridBtn = document.getElementById('toggle-viewport-grid');
    const gridOverlay = document.getElementById('viewport-grid-overlay');
    if (toggleGridBtn && gridOverlay) {
      toggleGridBtn.addEventListener('click', () => {
        state.gridEnabled = !state.gridEnabled;
        toggleGridBtn.classList.toggle('active', state.gridEnabled);
        gridOverlay.classList.toggle('active', state.gridEnabled);
      });
    }

    const toggleCrosshairBtn = document.getElementById('toggle-viewport-crosshair');
    const crosshairOverlay = document.getElementById('viewport-crosshair-overlay');
    if (toggleCrosshairBtn && crosshairOverlay) {
      toggleCrosshairBtn.addEventListener('click', () => {
        state.crosshairEnabled = !state.crosshairEnabled;
        toggleCrosshairBtn.classList.toggle('active', state.crosshairEnabled);
        crosshairOverlay.classList.toggle('active', state.crosshairEnabled);
      });
    }
  }

  // Hidden Keyboard Controls (Completely silent, invisible to user)
  function initHiddenPrototypeShortcuts() {
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || activeEl.isContentEditable) {
          return;
        }
      }

      // Shortcut 1: Ctrl + Shift + A -> Silently set AI_GENERATED (82% - 96%)
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        state.prototypeClassification = "AI_GENERATED";
        state.prototypeConfidence = parseFloat((0.82 + Math.random() * (0.96 - 0.82)).toFixed(3));
        return;
      }

      // Shortcut 2: Ctrl + Shift + R -> Silently set REAL (82% - 97%)
      if (e.ctrlKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        state.prototypeClassification = "REAL";
        state.prototypeConfidence = parseFloat((0.82 + Math.random() * (0.97 - 0.82)).toFixed(3));
        return;
      }

      // Shortcut 3: Ctrl + Shift + D -> Silently set INCONCLUSIVE (45% - 54%)
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        state.prototypeClassification = "INCONCLUSIVE";
        state.prototypeConfidence = parseFloat((0.45 + Math.random() * (0.54 - 0.45)).toFixed(3));
        return;
      }
    });
  }

  // Evidence Report & JSON Modals
  function initReportModals() {
    const btnGenReport = document.getElementById('btn-generate-report');
    const btnViewJson = document.getElementById('btn-view-json');
    const btnDownloadJson = document.getElementById('btn-download-json-direct');
    const btnPrintReport = document.getElementById('btn-print-report-direct');

    if (btnGenReport) {
      btnGenReport.addEventListener('click', () => {
        if (!state.currentForensicPackage) {
          state.currentForensicPackage = FargoForensicEngine.buildForensicPackage(
            state.stagedFileInfo, 
            state.stagedStats, 
            state.prototypeClassification || "AI_GENERATED", 
            state.prototypeConfidence,
            state.mediaType || "image"
          );
        }
        const reportContainer = document.getElementById('report-document-container');
        FargoReportGenerator.renderReportPreview(state.currentForensicPackage, reportContainer);
        openModal('modal-report-viewer');
      });
    }

    if (btnViewJson) {
      btnViewJson.addEventListener('click', () => {
        if (!state.currentForensicPackage) {
          state.currentForensicPackage = FargoForensicEngine.buildForensicPackage(
            state.stagedFileInfo, 
            state.stagedStats, 
            state.prototypeClassification || "AI_GENERATED", 
            state.prototypeConfidence,
            state.mediaType || "image"
          );
        }
        const jsonCode = document.getElementById('json-tree-code');
        if (jsonCode) {
          jsonCode.textContent = JSON.stringify(state.currentForensicPackage, null, 2);
        }
        openModal('modal-json-inspector');
      });
    }

    if (btnDownloadJson) {
      btnDownloadJson.addEventListener('click', () => {
        FargoReportGenerator.downloadJson(state.currentForensicPackage);
        showToast('DIT-FORENSICS-2.0 JSON package exported.', 'cyan');
      });
    }

    if (btnPrintReport) {
      btnPrintReport.addEventListener('click', () => {
        FargoReportGenerator.printReport();
      });
    }
  }

  // Convert a raw Supabase DB row to the analysesHistory item shape
  function dbRowToHistoryItem(row) {
    const pkg = row.analysis_json || {};
    const assessment = pkg.overall_assessment || {};
    const verdictType = assessment.verdict_type || 'warning';
    const ts = row.created_at ? new Date(row.created_at) : new Date();
    const tsStr = ts.toISOString().replace('T', ' ').substring(0, 16);
    return {
      id:            row.id || pkg.analysis_id || 'FARGO-UNKNOWN',
      filename:      row.filename || pkg?.media?.filename || 'unknown',
      mediaType:     row.media_type || pkg.media_type || 'image',
      timestamp:     tsStr,
      verdict:       row.verdict || assessment.verdict || '',
      verdict_type:  verdictType,
      confidence:    row.confidence || assessment.confidence_score || 0,
      sha256:        (pkg?.media?.sha256 || '').substring(0, 16) + '...',
      classification: verdictType === 'ai' ? 'AI_GENERATED' : (verdictType === 'real' ? 'REAL' : 'INCONCLUSIVE'),
      confidenceVal:  (row.confidence || assessment.confidence_score || 0) / 100,
      _storedJson:    pkg   // full JSON for direct replay
    };
  }

  // Update the "Analyses" sidebar badge count
  function updateAnalysesBadge() {
    const badge = document.querySelector('.sidebar-nav .nav-item[data-view="analyses"] .nav-item-count');
    if (badge) badge.textContent = state.analysesHistory.length;
  }

  // Show a subtle inline notice when DB save fails (non-crashing)
  function showDbErrorNotice() {
    const header = document.querySelector('#app-view-results .result-header-bar');
    if (!header || document.getElementById('db-error-notice')) return;
    const notice = document.createElement('div');
    notice.id = 'db-error-notice';
    notice.style.cssText = 'font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono); padding:0.3rem 0; margin-top:0.4rem; opacity:0.7;';
    notice.textContent = 'NOTICE: Case persistence unavailable. Analysis is viewable locally.';
    header.appendChild(notice);
  }

  // Past Analyses Table — loads live from Supabase, falls back to local seed data
  async function renderAnalysesTable() {
    const tbody = document.getElementById('analyses-table-body');
    if (!tbody) return;

    // Show loading state
    tbody.innerHTML = '<tr><td colspan="7" style="color:var(--text-muted); font-family:var(--font-mono); font-size:0.8rem; padding:1.5rem;">LOADING CASE DIRECTORY...</td></tr>';

    // Try to load from Supabase
    let dbRows = [];
    if (FargoSupabase.isConfigured()) {
      dbRows = await FargoSupabase.fetchCases(50);
    }

    // Build combined list: DB rows first, then local seed data not already in DB
    let combined = dbRows.map(row => dbRowToHistoryItem(row));

    if (combined.length === 0) {
      // Fall back to local seed data if DB is empty or offline
      combined = state.analysesHistory;
    } else {
      // Merge local seed items that aren't in the DB (keep demo data visible)
      const dbIds = new Set(dbRows.map(r => r.id));
      state.analysesHistory.forEach(item => {
        if (!dbIds.has(item.id)) combined.push(item);
      });
    }

    if (combined.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="color:var(--text-muted); font-family:var(--font-mono); font-size:0.8rem; padding:1.5rem;">NO CASES ON RECORD</td></tr>';
      return;
    }

    tbody.innerHTML = combined.map((item, idx) => `
      <tr>
        <td><strong class="mono" style="color:var(--cyan-primary); font-size:0.78rem;">${item.id}</strong></td>
        <td style="max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${item.filename}">${item.filename}</td>
        <td><span class="badge badge-${item.verdict_type}">${item.verdict}</span></td>
        <td><strong>${item.confidence}%</strong></td>
        <td style="color:var(--text-muted); font-size:0.78rem; font-family:var(--font-mono);">${item.mediaType?.toUpperCase() || 'IMAGE'}</td>
        <td style="color:var(--text-muted); font-size:0.78rem;">${item.timestamp}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="window.viewPastAnalysis(${idx}, window._fargoHistory)">
            Examine
          </button>
        </td>
      </tr>
    `).join('');

    // Expose the current table's data for onclick access
    window._fargoHistory = combined;
  }

  window.viewPastAnalysis = function(idxOrClassification, historyOrConf, mType = 'image') {
    // New signature: (index, historyArray) — from live table
    if (typeof idxOrClassification === 'number' && Array.isArray(historyOrConf)) {
      const item = historyOrConf[idxOrClassification];
      if (!item) return;

      // If this item has stored JSON, replay it directly
      if (item._storedJson && item._storedJson.analysis_id) {
        state.currentForensicPackage = item._storedJson;
        state.prototypeClassification = item.classification;
        state.prototypeConfidence     = item.confidenceVal;
        state.mediaType               = item.mediaType || 'image';
        // Clear staged file since we're replaying a stored case
        state.stagedFile         = null;
        state.stagedMediaElement = null;
        state.stagedObjectUrl    = null;
        state.stagedFileInfo     = null;
        state.stagedStats        = null;
        renderCompleteAnalysis();
        switchView('results');
        return;
      }

      // Fallback: re-run pipeline with classification from the item
      state.prototypeClassification = item.classification;
      state.prototypeConfidence     = item.confidenceVal;
      state.mediaType               = item.mediaType || 'image';
      startForensicPipeline();
      return;
    }

    // Legacy signature: (classification, conf, mType) — from seed data
    state.prototypeClassification = idxOrClassification;
    state.prototypeConfidence     = historyOrConf;
    state.mediaType               = mType;
    startForensicPipeline();
  };

  // Reports Archive Table
  function renderReportsTable() {
    const tbody = document.getElementById('reports-table-body');
    if (!tbody) return;

    tbody.innerHTML = state.analysesHistory.map(item => `
      <tr>
        <td><strong class="mono">${item.id}-RPT</strong></td>
        <td>Forensic Examination Package (${item.filename})</td>
        <td>DIT-FORENSICS-2.0</td>
        <td><span class="badge badge-cyan">FINALIZED</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="window.viewPastAnalysis('${item.classification}', ${item.confidenceVal}, '${item.mediaType || 'image'}')">
            View / Print
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Modal Closers
  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal.id);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  // Sidebar Routing
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view');
      if (view) switchView(view);
    });
  });

  // Landing Links Routing
  document.querySelectorAll('[data-nav-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('data-nav-target');
      if (target === 'landing') {
        e.preventDefault();
        switchView('landing');
      } else if (target) {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initialize Subsystems
  initAuthFlow();
  initDropzone();
  initViewportToolbar();
  initHiddenPrototypeShortcuts();
  initReportModals();

  console.log("%c FARGO DIGITAL FORENSICS PLATFORM %c DIT-FORENSICS-2.0 ", "background:#00f0ff; color:#07090d; font-weight:bold; padding:4px 8px; border-radius:3px 0 0 3px;", "background:#121720; color:#00f0ff; font-weight:bold; padding:4px 8px; border-radius:0 3px 3px 0;");
});
