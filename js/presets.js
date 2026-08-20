/**
 * FARGO — DIGITAL MEDIA FORENSICS
 * DIT-FORENSICS-2.0 Presets and Test Cases
 * Dead Internet Theory
 */

const FARGO_PRESETS = {
  // IMAGE PRESETS
  image_ai: {
    schema_version: "DIT-FORENSICS-2.0",
    platform: "Fargo Forensic Laboratory / Dead Internet Theory",
    analysis_id: "FARGO-2026-AI-8829",
    media_type: "image",
    timestamp: new Date().toISOString(),
    media: {
      filename: "evidence_image.webp",
      file_size_bytes: 489240,
      file_size_formatted: "477.8 KB",
      dimensions: "1024 x 1024 px",
      format: "WEBP",
      mime_type: "image/webp",
      color_space: "sRGB",
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    overall_assessment: {
      verdict: "LIKELY AI-GENERATED",
      verdict_type: "ai",
      confidence_score: 87,
      synthetic_likelihood_score: 0.87,
      risk_level: "MEDIUM",
      interpretation_quality: "Multi-Spectral Heuristic Assessment",
      model_agreement: "High (2/2 Detectors Flagged)"
    },
    models: {
      primary_detector: {
        name: "Reju983/ai-generated-image-detector",
        version: "v2.1-fp16",
        status: "Available (Runtime Evaluated)",
        output_score: 0.892,
        class_label: "synthetic"
      },
      secondary_detector: {
        name: "Smogy/SMOGY-Ai-images-detector",
        version: "Swin-Transformer-B",
        status: "Available",
        output_score: 0.854,
        class_label: "synthetic"
      }
    },
    forensic_signals: {
      metadata: {
        exif_present: false,
        camera_make: "Unavailable",
        camera_model: "Unavailable",
        lens_model: "Unavailable",
        software: "Not detected",
        color_profile: "sRGB IEC61966-2.1",
        modification_date: "Unavailable",
        gps_data: "Not present"
      },
      image_statistics: {
        brightness: 48.9,
        contrast: 55.0,
        entropy: 5.54,
        noise_variance: 9.30,
        edge_density: 0.042,
        laplacian_variance: 184.2,
        chroma_subsampling: "4:2:0"
      },
      compression: {
        jpeg_structure: "Non-standard quantization",
        quantization_tables: "Synthetic distribution (Non-camera matrix)",
        double_compression: "No primary DCT grid detected",
        encoding_indicators: "Neural upsample & bilinear smoothing detected"
      }
    },
    frame_analysis: {
      status: "NOT_APPLICABLE"
    },
    audio_analysis: {
      status: "NOT_APPLICABLE"
    },
    findings: [
      {
        id: "FND-01",
        severity: "HIGH",
        severity_type: "ai",
        category: "Detector Consensus",
        title: "Strong Neural Diffusion Signatures",
        observation: "Primary and secondary Swin classifiers both yielded high probability (>0.85) of synthetic synthesis.",
        interpretation: "High confidence indicator of generative diffusion synthesis (e.g. Midjourney / Stable Diffusion architecture).",
        confidence: "87%"
      },
      {
        id: "FND-02",
        severity: "MEDIUM",
        severity_type: "warning",
        category: "Frequency Spectrum",
        title: "High-Frequency Checkerboard Anomalies",
        observation: "FFT power spectrum analysis revealed periodic grid peaks characteristic of neural deconvolution / upsampling layers.",
        interpretation: "Synthetic generator upsampling artifacts without natural optical lens MTF falloff.",
        confidence: "82%"
      },
      {
        id: "FND-03",
        severity: "LOW",
        severity_type: "info",
        category: "Metadata Audit",
        title: "No EXIF Hardware Metadata Present",
        observation: "Media file is devoid of camera manufacturer headers, lens focal length, exposure time, or sensor serialization.",
        interpretation: "Absence of metadata is consistent with direct AI rendering or social web stripping. Does not solely prove synthetic origin.",
        confidence: "100%"
      }
    ],
    timeline: [
      { step: "MEDIA INGESTED", time: "00:00:01", status: "completed", detail: "SHA-256 cryptographic hash calculated and locked into memory" },
      { step: "METADATA EXAMINED", time: "00:00:02", status: "completed", detail: "EXIF, XMP, and JFIF header segment scan completed — no hardware markers found" },
      { step: "IMAGE SIGNALS ANALYZED", time: "00:00:04", status: "completed", detail: "Spatial entropy (5.54), Laplacian variance (184.2), and noise distribution mapped" },
      { step: "DETECTOR OUTPUT RECEIVED", time: "00:00:06", status: "completed", detail: "Primary and secondary detector inference matched with composite confidence" },
      { step: "EVIDENCE PACKAGE COMPILED", time: "00:00:07", status: "completed", detail: "DIT-FORENSICS-2.0 structured payload assembled with 3 forensic findings" },
      { step: "ASSESSMENT READY", time: "00:00:08", status: "completed", detail: "Investigative evidence report finalized for qualified examiner review" }
    ],
    limitations: "Fargo is an investigative forensic-assistance platform. Analysis outputs should be reviewed by certified digital forensics examiners and are not, by themselves, definitive proof of authenticity or legal admissibility."
  },

  image_real: {
    schema_version: "DIT-FORENSICS-2.0",
    platform: "Fargo Forensic Laboratory / Dead Internet Theory",
    analysis_id: "FARGO-2026-REAL-4109",
    media_type: "image",
    timestamp: new Date().toISOString(),
    media: {
      filename: "evidence_image.jpg",
      file_size_bytes: 3421500,
      file_size_formatted: "3.26 MB",
      dimensions: "3840 x 2560 px",
      format: "JPEG",
      mime_type: "image/jpeg",
      color_space: "Adobe RGB (1998)",
      sha256: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
    },
    overall_assessment: {
      verdict: "AUTHENTIC PHOTOGRAPHIC RECORD",
      verdict_type: "real",
      confidence_score: 93,
      synthetic_likelihood_score: 0.07,
      risk_level: "LOW",
      interpretation_quality: "High Precision Optical Verification",
      model_agreement: "High (Both Detectors Cleared)"
    },
    models: {
      primary_detector: {
        name: "Reju983/ai-generated-image-detector",
        version: "v2.1-fp16",
        status: "Available",
        output_score: 0.068,
        class_label: "authentic"
      },
      secondary_detector: {
        name: "Smogy/SMOGY-Ai-images-detector",
        version: "Swin-Transformer-B",
        status: "Available",
        output_score: 0.082,
        class_label: "authentic"
      }
    },
    forensic_signals: {
      metadata: {
        exif_present: true,
        camera_make: "Canon",
        camera_model: "EOS 5D Mark IV",
        lens_model: "EF24-70mm f/2.8L II USM",
        software: "Hardware Capture Engine",
        color_profile: "Adobe RGB (1998)",
        modification_date: "2026-03-14T14:22:18Z",
        gps_data: "Verified"
      },
      image_statistics: {
        brightness: 62.4,
        contrast: 48.2,
        entropy: 7.68,
        noise_variance: 16.85,
        edge_density: 0.091,
        laplacian_variance: 420.5,
        chroma_subsampling: "4:2:2"
      },
      compression: {
        jpeg_structure: "Standard Camera DQT tables",
        quantization_tables: "Authentic Hardware Sensor Profile",
        double_compression: "Single generation capture detected",
        encoding_indicators: "Consistent Poisson-Gaussian sensor noise"
      }
    },
    frame_analysis: {
      status: "NOT_APPLICABLE"
    },
    audio_analysis: {
      status: "NOT_APPLICABLE"
    },
    findings: [
      {
        id: "FND-01",
        severity: "LOW",
        severity_type: "real",
        category: "Sensor Noise",
        title: "Consistent Optical PRNU & Noise Floor",
        observation: "Photo-Response Non-Uniformity (PRNU) and photon shot noise follow expected Poisson-Gaussian physical distribution.",
        interpretation: "Natural physical optical capture without generative smoothing or latent hallucination.",
        confidence: "94%"
      },
      {
        id: "FND-02",
        severity: "LOW",
        severity_type: "real",
        category: "Hardware Metadata",
        title: "Intact Manufacturer EXIF & Quantization",
        observation: "Verified camera firmware signature matching DCT baseline quantization matrix.",
        interpretation: "High consistency between EXIF claims and binary compression artifacts.",
        confidence: "98%"
      },
      {
        id: "FND-03",
        severity: "LOW",
        severity_type: "real",
        category: "Edge Gradients",
        title: "Natural Optical Lens Blur Falloff",
        observation: "Point spread function (PSF) depth-of-field transition correlates precisely with physical aperture optics.",
        interpretation: "Authentic physical lens bokeh characteristics.",
        confidence: "92%"
      }
    ],
    timeline: [
      { step: "MEDIA INGESTED", time: "00:00:01", status: "completed", detail: "SHA-256 cryptographic hash calculated and locked into memory" },
      { step: "METADATA EXAMINED", time: "00:00:02", status: "completed", detail: "EXIF tags verified: camera hardware markers match quantization matrix" },
      { step: "IMAGE SIGNALS ANALYZED", time: "00:00:03", status: "completed", detail: "Natural PRNU noise (16.85) and optical MTF gradient confirmed" },
      { step: "DETECTOR OUTPUT RECEIVED", time: "00:00:05", status: "completed", detail: "Both AI detectors returned <0.10 synthetic likelihood" },
      { step: "EVIDENCE PACKAGE COMPILED", time: "00:00:06", status: "completed", detail: "DIT-FORENSICS-2.0 structured payload assembled with 3 forensic findings" },
      { step: "ASSESSMENT READY", time: "00:00:07", status: "completed", detail: "Investigative evidence report finalized for qualified examiner review" }
    ],
    limitations: "Fargo is an investigative forensic-assistance platform. Analysis outputs should be reviewed by certified digital forensics examiners and are not, by themselves, definitive proof of authenticity or legal admissibility."
  },

  image_inconclusive: {
    schema_version: "DIT-FORENSICS-2.0",
    platform: "Fargo Forensic Laboratory / Dead Internet Theory",
    analysis_id: "FARGO-2026-INC-7731",
    media_type: "image",
    timestamp: new Date().toISOString(),
    media: {
      filename: "evidence_image.jpg",
      file_size_bytes: 812400,
      file_size_formatted: "793.3 KB",
      dimensions: "1920 x 1080 px",
      format: "JPEG",
      mime_type: "image/jpeg",
      color_space: "sRGB",
      sha256: "3b98c5691f6874e44b5847e3bf8e27c813d39eb2b896937e2ab709b4395632a2"
    },
    overall_assessment: {
      verdict: "INCONCLUSIVE / ELEVATED RISK",
      verdict_type: "warning",
      confidence_score: 49,
      synthetic_likelihood_score: 0.49,
      risk_level: "ELEVATED",
      interpretation_quality: "Degraded Signal / Multi-generation recompression",
      model_agreement: "Split / Ambiguous Divergence"
    },
    models: {
      primary_detector: {
        name: "Reju983/ai-generated-image-detector",
        version: "v2.1-fp16",
        status: "Available",
        output_score: 0.512,
        class_label: "ambiguous"
      },
      secondary_detector: {
        name: "Smogy/SMOGY-Ai-images-detector",
        version: "Swin-Transformer-B",
        status: "Available",
        output_score: 0.478,
        class_label: "ambiguous"
      }
    },
    forensic_signals: {
      metadata: {
        exif_present: true,
        camera_make: "Adobe Systems",
        camera_model: "Editor Export",
        lens_model: "Unavailable",
        software: "Image Post-Processing Application",
        color_profile: "sRGB IEC61966-2.1",
        modification_date: "2026-07-19T09:11:45Z",
        gps_data: "Not present"
      },
      image_statistics: {
        brightness: 54.1,
        contrast: 61.8,
        entropy: 6.12,
        noise_variance: 5.40,
        edge_density: 0.068,
        laplacian_variance: 112.4,
        chroma_subsampling: "4:2:0"
      },
      compression: {
        jpeg_structure: "Multiple JPEG grid misalignments detected",
        quantization_tables: "Save-for-Web Q80 Table",
        double_compression: "High probability of local region splicing",
        encoding_indicators: "Ghost DCT boundaries and localized variance drop"
      }
    },
    frame_analysis: {
      status: "NOT_APPLICABLE"
    },
    audio_analysis: {
      status: "NOT_APPLICABLE"
    },
    findings: [
      {
        id: "FND-01",
        severity: "HIGH",
        severity_type: "warning",
        category: "Compression Artifacts",
        title: "Double JPEG Compression Discrepancies",
        observation: "Error Level Analysis (ELA) exhibits prominent luminescence variations around target subject boundaries.",
        interpretation: "Evidence of localized compositing or multiple saving cycles with differing compression matrices.",
        confidence: "88%"
      },
      {
        id: "FND-02",
        severity: "MEDIUM",
        severity_type: "warning",
        category: "Metadata Audit",
        title: "Editing Software Header Detected",
        observation: "Metadata indicates post-capture editing and re-export.",
        interpretation: "Media was post-processed prior to submission; original sensor fidelity is unverified.",
        confidence: "100%"
      },
      {
        id: "FND-03",
        severity: "MEDIUM",
        severity_type: "warning",
        category: "Detector Divergence",
        title: "Ambiguous Machine Learning Classification",
        observation: "Detectors produced diverging scores falling near the 0.50 threshold decision boundary.",
        interpretation: "Heavy re-compression and splicing obscure high-frequency synthetic detector features.",
        confidence: "49%"
      }
    ],
    timeline: [
      { step: "MEDIA INGESTED", time: "00:00:01", status: "completed", detail: "SHA-256 cryptographic hash calculated and locked into memory" },
      { step: "METADATA EXAMINED", time: "00:00:02", status: "completed", detail: "Post-processing software tag found" },
      { step: "IMAGE SIGNALS ANALYZED", time: "00:00:03", status: "completed", detail: "Localized ELA noise disparity and DCT boundary shifts recorded" },
      { step: "DETECTOR OUTPUT RECEIVED", time: "00:00:05", status: "completed", detail: "Classifiers yielded split verdict due to multi-pass recompression" },
      { step: "EVIDENCE PACKAGE COMPILED", time: "00:00:06", status: "completed", detail: "DIT-FORENSICS-2.0 structured payload assembled with 3 warning flags" },
      { step: "ASSESSMENT READY", time: "00:00:07", status: "completed", detail: "Investigative evidence report finalized for qualified examiner review" }
    ],
    limitations: "Fargo is an investigative forensic-assistance platform. Analysis outputs should be reviewed by certified digital forensics examiners and are not, by themselves, definitive proof of authenticity or legal admissibility."
  },

  // VIDEO PRESETS
  video_ai: {
    schema_version: "DIT-FORENSICS-2.0",
    platform: "Fargo Forensic Laboratory / Dead Internet Theory",
    analysis_id: "FARGO-2026-VID-AI-9102",
    media_type: "video",
    timestamp: new Date().toISOString(),
    media: {
      filename: "evidence_video.mp4",
      file_size_bytes: 8492000,
      file_size_formatted: "8.1 MB",
      dimensions: "1920 x 1080 px",
      duration: "00:00:12",
      format: "MP4",
      mime_type: "video/mp4",
      codec: "H.264 / AVC (High@L4.0)",
      bitrate: "5.6 Mbps",
      framerate: "30.00 fps",
      sha256: "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"
    },
    overall_assessment: {
      verdict: "LIKELY AI-GENERATED",
      verdict_type: "ai",
      confidence_score: 89,
      synthetic_likelihood_score: 0.89,
      risk_level: "HIGH",
      interpretation_quality: "Temporal Multi-Frame Neural Analysis",
      model_agreement: "High (Frame Consistency Divergence)"
    },
    models: {
      primary_detector: {
        name: "Fargo-Temporal-Swin-V2",
        version: "v2.4-video",
        status: "Available (Evaluated 360 frames)",
        output_score: 0.912,
        class_label: "synthetic"
      },
      secondary_detector: {
        name: "OpticalFlow-Morphology-Net",
        version: "v1.8",
        status: "Available",
        output_score: 0.865,
        class_label: "synthetic"
      }
    },
    forensic_signals: {
      metadata: {
        exif_present: false,
        camera_make: "Unavailable",
        camera_model: "Unavailable",
        container: "MPEG-4 Base Media v1 (isom/iso2/mp41)",
        software: "Not detected",
        creation_date: "Unavailable",
        audio_stream: "AAC-LC 128kbps (Muted/Silent)"
      },
      image_statistics: {
        brightness: 51.2,
        contrast: 57.8,
        entropy: 5.82,
        noise_variance: 7.40,
        edge_density: 0.051,
        laplacian_variance: 165.8,
        chroma_subsampling: "4:2:0"
      },
      compression: {
        jpeg_structure: "H.264 CABAC Encoding",
        quantization_tables: "Temporal Smoothing Matrix",
        double_compression: "No optical sensor cadence detected",
        encoding_indicators: "Generative frame interpolation warping"
      }
    },
    frame_analysis: {
      status: "COMPLETED",
      total_frames_analyzed: 360,
      keyframe_interval: 30,
      optical_flow_coherence: "0.64 (Significant micro-warping in background geometry)",
      temporal_flicker_score: "0.88 (Phase inconsistency between frames 45-90)",
      face_warp_artifacts: "Detected in 82% of facial keypoints",
      synthetic_motion_vectors: "High variance non-physical velocity"
    },
    audio_analysis: {
      status: "NOT_APPLICABLE"
    },
    findings: [
      {
        id: "FND-01",
        severity: "HIGH",
        severity_type: "ai",
        category: "Temporal Consistency",
        title: "Optical Flow & Warp Inconsistencies",
        observation: "Non-rigid background morphing observed across continuous tracking vectors.",
        interpretation: "Characteristic marker of generative video models (e.g. Sora / Gen-2 / Runway).",
        confidence: "91%"
      },
      {
        id: "FND-02",
        severity: "HIGH",
        severity_type: "ai",
        category: "Frame Interpolation",
        title: "Synthetic Micro-Flicker & Latent Drift",
        observation: "High-frequency textural drift in fine geometry (hair, text, foliage) across consecutive I-frames.",
        interpretation: "Lack of physical temporal coherence inherent to frame-by-frame diffusion.",
        confidence: "88%"
      },
      {
        id: "FND-03",
        severity: "MEDIUM",
        severity_type: "warning",
        category: "Container Telemetry",
        title: "No Hardware Camera Timecode",
        observation: "MP4 container lacks SMPTE timecode track, sensor metadata, or manufacturer atoms.",
        interpretation: "Direct export from neural rendering pipeline.",
        confidence: "95%"
      }
    ],
    timeline: [
      { step: "INGESTING VIDEO", time: "00:00:01", status: "completed", detail: "SHA-256 cryptographic hash calculated and video bitstream locked" },
      { step: "READING CONTAINER METADATA", time: "00:00:02", status: "completed", detail: "Parsed MP4 container atoms, video track, and audio streams" },
      { step: "ANALYZING VIDEO STREAM", time: "00:00:03", status: "completed", detail: "H.264 bitstream bitrate and keyframe GOP cadence mapped" },
      { step: "EXAMINING FRAME CHARACTERISTICS", time: "00:00:04", status: "completed", detail: "Sampled 360 frames for optical flow coherence and texture drift" },
      { step: "CHECKING COMPRESSION SIGNALS", time: "00:00:05", status: "completed", detail: "Temporal motion vector residuals and macroblock quantization audited" },
      { step: "EVALUATING FORENSIC SIGNALS", time: "00:00:06", status: "completed", detail: "Multi-frame neural detectors flagged non-physical optical flow (0.91)" },
      { step: "COMPILING EVIDENCE", time: "00:00:07", status: "completed", detail: "DIT-FORENSICS-2.0 structured payload assembled" },
      { step: "ASSESSMENT READY", time: "00:00:08", status: "completed", detail: "Investigative evidence package finalized for qualified examiner review" }
    ],
    limitations: "Fargo is an investigative forensic-assistance platform. Analysis outputs should be reviewed by certified digital forensics examiners and are not, by themselves, definitive proof of authenticity or legal admissibility."
  },

  video_real: {
    schema_version: "DIT-FORENSICS-2.0",
    platform: "Fargo Forensic Laboratory / Dead Internet Theory",
    analysis_id: "FARGO-2026-VID-REAL-3140",
    media_type: "video",
    timestamp: new Date().toISOString(),
    media: {
      filename: "evidence_video.mp4",
      file_size_bytes: 18450000,
      file_size_formatted: "17.6 MB",
      dimensions: "1920 x 1080 px",
      duration: "00:00:15",
      format: "MP4",
      mime_type: "video/mp4",
      codec: "H.264 / AVC (Main@L4.1)",
      bitrate: "12.2 Mbps",
      framerate: "29.97 fps",
      sha256: "1f2e3d4c5b6a70899887766554433221100ffeeddccbbaa99887766554433221"
    },
    overall_assessment: {
      verdict: "AUTHENTIC VIDEO RECORD",
      verdict_type: "real",
      confidence_score: 92,
      synthetic_likelihood_score: 0.08,
      risk_level: "LOW",
      interpretation_quality: "Hardware Optical Stream Verification",
      model_agreement: "High (Temporal Consistency Confirmed)"
    },
    models: {
      primary_detector: {
        name: "Fargo-Temporal-Swin-V2",
        version: "v2.4-video",
        status: "Available",
        output_score: 0.075,
        class_label: "authentic"
      },
      secondary_detector: {
        name: "OpticalFlow-Morphology-Net",
        version: "v1.8",
        status: "Available",
        output_score: 0.082,
        class_label: "authentic"
      }
    },
    forensic_signals: {
      metadata: {
        exif_present: true,
        camera_make: "Sony",
        camera_model: "Alpha 7S III",
        container: "MPEG-4 / QuickTime (Sony XAVC-S format)",
        software: "Hardware Capture Firmware v2.1",
        creation_date: "2026-05-12T11:40:02Z",
        audio_stream: "LPCM 48kHz 24-bit Stereo"
      },
      image_statistics: {
        brightness: 58.4,
        contrast: 52.1,
        entropy: 7.45,
        noise_variance: 14.20,
        edge_density: 0.084,
        laplacian_variance: 380.2,
        chroma_subsampling: "4:2:2"
      },
      compression: {
        jpeg_structure: "Hardware AVC High Profile",
        quantization_tables: "Sony Professional Encoder Matrix",
        double_compression: "Single generation camera recording",
        encoding_indicators: "Consistent physical motion blur & optical shutter"
      }
    },
    frame_analysis: {
      status: "COMPLETED",
      total_frames_analyzed: 450,
      keyframe_interval: 15,
      optical_flow_coherence: "0.96 (Natural physical rigid motion vectors)",
      temporal_flicker_score: "0.04 (Consistent lighting and shutter speed)",
      face_warp_artifacts: "None detected",
      synthetic_motion_vectors: "None"
    },
    audio_analysis: {
      status: "NOT_APPLICABLE"
    },
    findings: [
      {
        id: "FND-01",
        severity: "LOW",
        severity_type: "real",
        category: "Motion Physics",
        title: "Rigid Optical Motion Vectors",
        observation: "Camera pan and subject motion conform precisely to 180-degree physical rotary shutter angle physics.",
        interpretation: "Natural optical video capture without neural warping or frame hallucination.",
        confidence: "94%"
      },
      {
        id: "FND-02",
        severity: "LOW",
        severity_type: "real",
        category: "Temporal Sensor Noise",
        title: "Continuous Fixed Pattern Sensor Noise",
        observation: "Consistent temporal noise floor detected across all 450 frames matching Sony Exmor sensor.",
        interpretation: "Authentic physical sensor readout.",
        confidence: "96%"
      }
    ],
    timeline: [
      { step: "INGESTING VIDEO", time: "00:00:01", status: "completed", detail: "SHA-256 cryptographic hash calculated and video bitstream locked" },
      { step: "READING CONTAINER METADATA", time: "00:00:02", status: "completed", detail: "Hardware metadata and XAVC-S tags verified" },
      { step: "ANALYZING VIDEO STREAM", time: "00:00:03", status: "completed", detail: "Continuous 29.97 fps cadence confirmed" },
      { step: "EXAMINING FRAME CHARACTERISTICS", time: "00:00:04", status: "completed", detail: "450 frames evaluated for rigid optical coherence (0.96)" },
      { step: "CHECKING COMPRESSION SIGNALS", time: "00:00:05", status: "completed", detail: "Single-pass hardware encoder quantization verified" },
      { step: "EVALUATING FORENSIC SIGNALS", time: "00:00:06", status: "completed", detail: "Detectors returned <0.08 synthetic likelihood" },
      { step: "COMPILING EVIDENCE", time: "00:00:07", status: "completed", detail: "DIT-FORENSICS-2.0 structured payload assembled" },
      { step: "ASSESSMENT READY", time: "00:00:08", status: "completed", detail: "Investigative evidence package finalized" }
    ],
    limitations: "Fargo is an investigative forensic-assistance platform. Analysis outputs should be reviewed by certified digital forensics examiners and are not, by themselves, definitive proof of authenticity or legal admissibility."
  },

  // AUDIO PRESETS
  audio_ai: {
    schema_version: "DIT-FORENSICS-2.0",
    platform: "Fargo Forensic Laboratory / Dead Internet Theory",
    analysis_id: "FARGO-2026-AUD-AI-6504",
    media_type: "audio",
    timestamp: new Date().toISOString(),
    media: {
      filename: "evidence_audio.mp3",
      file_size_bytes: 1420000,
      file_size_formatted: "1.35 MB",
      duration: "00:00:35",
      format: "MP3",
      mime_type: "audio/mpeg",
      codec: "MPEG-1 Layer 3",
      bitrate: "320 kbps",
      samplerate: "44.1 kHz",
      channels: "2 (Stereo)",
      sha256: "8e7d6c5b4a3928170f1e2d3c4b5a69788796a5b4c3d2e1f0a9b8c7d6e5f4a3b2"
    },
    overall_assessment: {
      verdict: "LIKELY SYNTHETIC AUDIO",
      verdict_type: "ai",
      confidence_score: 91,
      synthetic_likelihood_score: 0.91,
      risk_level: "HIGH",
      interpretation_quality: "Neural Vocoder & Phase Acoustic Analysis",
      model_agreement: "High (Voice Clone Signatures Detected)"
    },
    models: {
      primary_detector: {
        name: "Fargo-Voice-Synthesis-Classifier",
        version: "v3.1-acoustic",
        status: "Available (Evaluated 35.2s audio)",
        output_score: 0.925,
        class_label: "synthetic"
      },
      secondary_detector: {
        name: "HiFi-GAN-Vocoder-Detector",
        version: "v2.0",
        status: "Available",
        output_score: 0.895,
        class_label: "synthetic"
      }
    },
    forensic_signals: {
      metadata: {
        container: "ID3v2.4 Audio Stream",
        encoder: "LAME3.100 / Synthetic Pipeline",
        duration_seconds: 35.2,
        peak_amplitude: "-0.2 dBFS",
        rms_level: "-16.4 dBFS"
      },
      image_statistics: {
        brightness: 0,
        contrast: 0,
        entropy: 4.85,
        noise_variance: 3.2,
        edge_density: 0,
        laplacian_variance: 0,
        chroma_subsampling: "N/A"
      },
      compression: {
        jpeg_structure: "N/A",
        quantization_tables: "MP3 Modified Discrete Cosine Transform (MDCT)",
        double_compression: "Resampled from 24kHz neural vocoder output",
        encoding_indicators: "High-frequency brickwall cutoff above 12kHz"
      }
    },
    frame_analysis: {
      status: "NOT_APPLICABLE"
    },
    audio_analysis: {
      status: "COMPLETED",
      vocoder_artifacts: "Strong periodic phase discontinuities matching HiFi-GAN / BigVGAN vocoder",
      spectral_cutoff_frequency: "12,000 Hz (Artificial zero-energy band above 12kHz)",
      breath_acoustic_consistency: "Absence of natural aerodynamic vocal tract turbulence",
      pitch_modulation_variance: "Sub-natural fundamental frequency (F0) micro-tremor",
      formant_transitions: "Abrupt synthetic co-articulation boundaries detected"
    },
    findings: [
      {
        id: "FND-01",
        severity: "HIGH",
        severity_type: "ai",
        category: "Acoustic Vocoder",
        title: "Neural Vocoder Phase Artifacts",
        observation: "Phase spectrogram analysis revealed regular harmonic comb filtering characteristic of neural speech synthesis vocoders.",
        interpretation: "High confidence voice cloning / TTS generation (e.g. ElevenLabs / VALL-E / Tortoise).",
        confidence: "93%"
      },
      {
        id: "FND-02",
        severity: "HIGH",
        severity_type: "ai",
        category: "Spectral Distribution",
        title: "Artificial 12kHz Bandwidth Limit",
        observation: "Sharp spectral energy dropoff above 12kHz despite 44.1kHz container encoding.",
        interpretation: "Audio was synthesized at 24kHz native model resolution and upsampled to standard MP3.",
        confidence: "95%"
      },
      {
        id: "FND-03",
        severity: "MEDIUM",
        severity_type: "warning",
        category: "Biometric Voice",
        title: "Non-Physical Phoneme Formant Jumps",
        observation: "Rapid F1/F2 formant shifts violating human physiological vocal tract constraints.",
        interpretation: "Synthetically concatenated phoneme transitions.",
        confidence: "88%"
      }
    ],
    timeline: [
      { step: "INGESTING AUDIO", time: "00:00:01", status: "completed", detail: "SHA-256 cryptographic hash calculated and PCM audio stream locked" },
      { step: "READING AUDIO METADATA", time: "00:00:02", status: "completed", detail: "ID3 headers and bitstream encoding parameters mapped" },
      { step: "ANALYZING WAVEFORM", time: "00:00:03", status: "completed", detail: "RMS energy, peak dynamics, and zero-crossing rates calculated" },
      { step: "EXAMINING FREQUENCY SPECTROGRAM", time: "00:00:04", status: "completed", detail: "FFT power spectrum revealed 12kHz cutoff and vocoder comb filter" },
      { step: "ANALYZING ACOUSTIC SIGNALS", time: "00:00:05", status: "completed", detail: "F0 fundamental frequency and vocal tract formants evaluated" },
      { step: "EVALUATING FORENSIC INDICATORS", time: "00:00:06", status: "completed", detail: "Voice clone classifiers confirmed synthetic speech (0.92)" },
      { step: "COMPILING EVIDENCE", time: "00:00:07", status: "completed", detail: "DIT-FORENSICS-2.0 structured payload assembled" },
      { step: "ASSESSMENT READY", time: "00:00:08", status: "completed", detail: "Investigative evidence package finalized for qualified examiner review" }
    ],
    limitations: "Fargo is an investigative forensic-assistance platform. Analysis outputs should be reviewed by certified digital forensics examiners and are not, by themselves, definitive proof of authenticity or legal admissibility."
  },

  audio_real: {
    schema_version: "DIT-FORENSICS-2.0",
    platform: "Fargo Forensic Laboratory / Dead Internet Theory",
    analysis_id: "FARGO-2026-AUD-REAL-1892",
    media_type: "audio",
    timestamp: new Date().toISOString(),
    media: {
      filename: "evidence_audio.wav",
      file_size_bytes: 6150000,
      file_size_formatted: "5.86 MB",
      duration: "00:00:35",
      format: "WAV",
      mime_type: "audio/wav",
      codec: "Linear PCM (16-bit)",
      bitrate: "1411 kbps",
      samplerate: "44.1 kHz",
      channels: "2 (Stereo)",
      sha256: "3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e"
    },
    overall_assessment: {
      verdict: "AUTHENTIC AUDIO RECORD",
      verdict_type: "real",
      confidence_score: 94,
      synthetic_likelihood_score: 0.06,
      risk_level: "LOW",
      interpretation_quality: "Physical Acoustic & Room Impulse Verification",
      model_agreement: "High (Natural Vocal Acoustics Confirmed)"
    },
    models: {
      primary_detector: {
        name: "Fargo-Voice-Synthesis-Classifier",
        version: "v3.1-acoustic",
        status: "Available",
        output_score: 0.055,
        class_label: "authentic"
      },
      secondary_detector: {
        name: "HiFi-GAN-Vocoder-Detector",
        version: "v2.0",
        status: "Available",
        output_score: 0.062,
        class_label: "authentic"
      }
    },
    forensic_signals: {
      metadata: {
        container: "RIFF / Broadcast Wave Format (BWF)",
        encoder: "Hardware Recording Device",
        duration_seconds: 35.0,
        peak_amplitude: "-1.8 dBFS",
        rms_level: "-19.2 dBFS"
      },
      image_statistics: {
        brightness: 0,
        contrast: 0,
        entropy: 6.92,
        noise_variance: 8.5,
        edge_density: 0,
        laplacian_variance: 0,
        chroma_subsampling: "N/A"
      },
      compression: {
        jpeg_structure: "N/A",
        quantization_tables: "Uncompressed Linear PCM",
        double_compression: "Single generation hardware capture",
        encoding_indicators: "Natural ambient room reverberation & acoustic noise floor"
      }
    },
    frame_analysis: {
      status: "NOT_APPLICABLE"
    },
    audio_analysis: {
      status: "COMPLETED",
      vocoder_artifacts: "None detected",
      spectral_cutoff_frequency: "22,050 Hz (Full Nyquist frequency spectrum populated)",
      breath_acoustic_consistency: "Natural sub-glottal pressure & aerodynamic airflow",
      pitch_modulation_variance: "Natural human micro-intonation & vocal jitter (1.2%)",
      formant_transitions: "Continuous physical vocal tract resonance"
    },
    findings: [
      {
        id: "FND-01",
        severity: "LOW",
        severity_type: "real",
        category: "Vocal Physiology",
        title: "Physiological Vocal Micro-Tremor",
        observation: "Fundamental pitch trajectory exhibits natural human biomechanical tremor and glottal pulses.",
        interpretation: "Authentic human vocal tract acoustic emission.",
        confidence: "95%"
      },
      {
        id: "FND-02",
        severity: "LOW",
        severity_type: "real",
        category: "Room Acoustics",
        title: "Continuous Ambient Reverberation",
        observation: "Consistent room impulse response (RIR) and broadband microphone diaphragm thermal noise.",
        interpretation: "Single continuous acoustic recording environment.",
        confidence: "97%"
      }
    ],
    timeline: [
      { step: "INGESTING AUDIO", time: "00:00:01", status: "completed", detail: "SHA-256 cryptographic hash calculated and uncompressed PCM locked" },
      { step: "READING AUDIO METADATA", time: "00:00:02", status: "completed", detail: "RIFF / BWF hardware timestamp chunks validated" },
      { step: "ANALYZING WAVEFORM", time: "00:00:03", status: "completed", detail: "Continuous dynamic range and natural vocal envelope verified" },
      { step: "EXAMINING FREQUENCY SPECTROGRAM", time: "00:00:04", status: "completed", detail: "Full 22.05 kHz bandwidth and natural room reflections confirmed" },
      { step: "ANALYZING ACOUSTIC SIGNALS", time: "00:00:05", status: "completed", detail: "Vocal jitter, shimmer, and physical formant resonance verified" },
      { step: "EVALUATING FORENSIC INDICATORS", time: "00:00:06", status: "completed", detail: "Detectors returned <0.06 synthetic likelihood" },
      { step: "COMPILING EVIDENCE", time: "00:00:07", status: "completed", detail: "DIT-FORENSICS-2.0 structured payload assembled" },
      { step: "ASSESSMENT READY", time: "00:00:08", status: "completed", detail: "Investigative evidence package finalized" }
    ],
    limitations: "Fargo is an investigative forensic-assistance platform. Analysis outputs should be reviewed by certified digital forensics examiners and are not, by themselves, definitive proof of authenticity or legal admissibility."
  }
};
