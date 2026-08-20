/**
 * FARGO — EVIDENCE REPORT GENERATOR & JSON EXPORTER
 * Produces structured printable evidence packages & compliant DIT-FORENSICS-2.0 JSON downloads
 * Dead Internet Theory
 */

class FargoReportGenerator {
  /**
   * Render HTML formatted report into the preview modal
   * @param {Object} forensicData DIT-FORENSICS-2.0 JSON Object
   * @param {HTMLElement} container 
   */
  static renderReportPreview(forensicData, container) {
    if (!forensicData || !container) return;

    const m = forensicData.media;
    const a = forensicData.overall_assessment;
    const s = forensicData.forensic_signals;
    const mType = forensicData.media_type || "image";

    const findingsHtml = (forensicData.findings || []).map(f => `
      <tr>
        <td><strong>${f.id}</strong></td>
        <td><span class="badge ${f.severity_type === 'ai' ? 'badge-ai' : (f.severity_type === 'real' ? 'badge-real' : 'badge-warning')}">${f.severity}</span></td>
        <td><strong>${f.title}</strong><br><small style="color:#64748b;">${f.observation}</small></td>
        <td>${f.interpretation}</td>
        <td><strong>${f.confidence}</strong></td>
      </tr>
    `).join('');

    const timelineHtml = (forensicData.timeline || []).map(t => `
      <div style="margin-bottom: 0.5rem; font-size: 0.8rem;">
        <span style="font-family: monospace; color: #64748b;">[${t.time}]</span> 
        <strong>${t.step}</strong>: ${t.detail}
      </div>
    `).join('');

    let telemetryGridHtml = '';
    if (mType === 'video') {
      telemetryGridHtml = `
        <div class="report-doc-grid">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 4px;">
            <div style="font-weight: 700; font-size: 0.8rem; color: #0284c7; text-transform: uppercase; margin-bottom: 0.5rem;">Container & Stream</div>
            <div style="font-size: 0.82rem; line-height: 1.6;">
              • Codec: <strong>${m.codec || 'H.264 / AVC'}</strong><br>
              • Resolution: <strong>${m.dimensions || '1920x1080'}</strong><br>
              • Duration: <strong>${m.duration || '00:15'}</strong><br>
              • Bitrate: <strong>${m.bitrate || '12 Mbps'}</strong>
            </div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 4px;">
            <div style="font-weight: 700; font-size: 0.8rem; color: #0284c7; text-transform: uppercase; margin-bottom: 0.5rem;">Temporal Frame Analysis</div>
            <div style="font-size: 0.82rem; line-height: 1.6;">
              • Frames Evaluated: <strong>${forensicData.frame_analysis.total_frames_analyzed || 360}</strong><br>
              • Optical Flow: <strong>${forensicData.frame_analysis.optical_flow_coherence || 'Evaluated'}</strong><br>
              • Temporal Flicker: <strong>${forensicData.frame_analysis.temporal_flicker_score || 'Analyzed'}</strong><br>
              • Compression Matrix: <strong>${s.compression.quantization_tables}</strong>
            </div>
          </div>
        </div>
      `;
    } else if (mType === 'audio') {
      telemetryGridHtml = `
        <div class="report-doc-grid">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 4px;">
            <div style="font-weight: 700; font-size: 0.8rem; color: #0284c7; text-transform: uppercase; margin-bottom: 0.5rem;">Acoustic Stream & Encoding</div>
            <div style="font-size: 0.82rem; line-height: 1.6;">
              • Format: <strong>${m.format || 'MP3'} (${m.mime_type || 'audio/mpeg'})</strong><br>
              • Duration: <strong>${m.duration || '00:35'}</strong><br>
              • Samplerate: <strong>${m.samplerate || '44.1 kHz'}</strong><br>
              • Peak Dynamics: <strong>${s.metadata.peak_amplitude || '-0.5 dBFS'}</strong>
            </div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 4px;">
            <div style="font-weight: 700; font-size: 0.8rem; color: #0284c7; text-transform: uppercase; margin-bottom: 0.5rem;">Spectral & Vocoder Analysis</div>
            <div style="font-size: 0.82rem; line-height: 1.6;">
              • Cutoff Frequency: <strong>${forensicData.audio_analysis.spectral_cutoff_frequency || '22,050 Hz'}</strong><br>
              • Vocoder Artifacts: <strong>${forensicData.audio_analysis.vocoder_artifacts || 'None'}</strong><br>
              • Formant Resonance: <strong>${forensicData.audio_analysis.formant_transitions || 'Evaluated'}</strong><br>
              • Pitch Micro-Tremor: <strong>${forensicData.audio_analysis.pitch_modulation_variance || 'Natural'}</strong>
            </div>
          </div>
        </div>
      `;
    } else {
      telemetryGridHtml = `
        <div class="report-doc-grid">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 4px;">
            <div style="font-weight: 700; font-size: 0.8rem; color: #0284c7; text-transform: uppercase; margin-bottom: 0.5rem;">Metadata Analysis</div>
            <div style="font-size: 0.82rem; line-height: 1.6;">
              • EXIF Present: <strong>${s.metadata.exif_present ? 'Yes' : 'Not Present'}</strong><br>
              • Camera: <strong>${s.metadata.camera_make} ${s.metadata.camera_model}</strong><br>
              • Software: <strong>${s.metadata.software}</strong><br>
              • Timestamp: <strong>${s.metadata.modification_date}</strong>
            </div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 4px;">
            <div style="font-weight: 700; font-size: 0.8rem; color: #0284c7; text-transform: uppercase; margin-bottom: 0.5rem;">Image Statistics</div>
            <div style="font-size: 0.82rem; line-height: 1.6;">
              • Shannon Entropy: <strong>${s.image_statistics.entropy} bits/px</strong><br>
              • Brightness / Contrast: <strong>${s.image_statistics.brightness} / ${s.image_statistics.contrast}</strong><br>
              • Noise Variance: <strong>${s.image_statistics.noise_variance}</strong><br>
              • Laplacian Variance: <strong>${s.image_statistics.laplacian_variance}</strong>
            </div>
          </div>
        </div>
      `;
    }

    const html = `
      <div class="report-document-sheet" id="printable-report-sheet">
        <div class="report-doc-header">
          <div>
            <div style="font-family: monospace; font-size: 0.75rem; letter-spacing: 0.12em; color: #0284c7; text-transform: uppercase; font-weight: 700;">
              DEAD INTERNET THEORY / DIGITAL EVIDENCE LABORATORY
            </div>
            <h1 class="report-doc-title">FORENSIC MEDIA EXAMINATION REPORT</h1>
            <div style="font-size: 0.9rem; color: #475569; margin-top: 0.25rem;">
              Case Reference: <strong>${forensicData.analysis_id}</strong> (${mType.toUpperCase()})
            </div>
          </div>
          <div class="report-doc-meta">
            <div><strong>Schema:</strong> ${forensicData.schema_version}</div>
            <div><strong>Date:</strong> ${new Date(forensicData.timestamp).toUTCString()}</div>
            <div><strong>Examiner:</strong> Lead Digital Examiner (ID: #7829)</div>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 1.25rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: #0f172a;">Executive Assessment</h3>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
            <div>
              <div style="font-size: 0.72rem; color: #64748b; text-transform: uppercase; font-family: monospace;">Verdict</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: ${a.verdict_type === 'ai' ? '#dc2626' : (a.verdict_type === 'real' ? '#16a34a' : '#d97706')};">
                ${a.verdict}
              </div>
            </div>
            <div>
              <div style="font-size: 0.72rem; color: #64748b; text-transform: uppercase; font-family: monospace;">Confidence</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">
                ${a.confidence_score}%
              </div>
            </div>
            <div>
              <div style="font-size: 0.72rem; color: #64748b; text-transform: uppercase; font-family: monospace;">Risk Level</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">
                ${a.risk_level}
              </div>
            </div>
            <div>
              <div style="font-size: 0.72rem; color: #64748b; text-transform: uppercase; font-family: monospace;">Agreement</div>
              <div style="font-size: 0.85rem; font-weight: 600; color: #334155; margin-top: 0.2rem;">
                ${a.model_agreement}
              </div>
            </div>
          </div>
        </div>

        <h4 style="margin-bottom: 0.75rem; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; color: #334155;">1. Media Ingestion & Cryptographic Chain of Custody</h4>
        <table class="report-doc-table">
          <tr>
            <th style="width: 25%;">Target Filename</th>
            <td>${m.filename}</td>
            <th style="width: 20%;">File Size</th>
            <td>${m.file_size_formatted} (${m.file_size_bytes} bytes)</td>
          </tr>
          <tr>
            <th>Dimensions / Duration</th>
            <td>${m.dimensions || m.duration || 'N/A'}</td>
            <th>Media Format</th>
            <td>${m.format} (${m.mime_type})</td>
          </tr>
          <tr>
            <th>SHA-256 Hash</th>
            <td colspan="3" style="font-family: monospace; font-size: 0.8rem; word-break: break-all; color: #0369a1;">
              ${m.sha256}
            </td>
          </tr>
        </table>

        <h4 style="margin-bottom: 0.75rem; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; color: #334155;">2. Forensic Signals & Telemetry</h4>
        ${telemetryGridHtml}

        <h4 style="margin-bottom: 0.75rem; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; color: #334155;">3. Structured Forensic Findings</h4>
        <table class="report-doc-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Severity</th>
              <th>Observed Evidence</th>
              <th>Forensic Interpretation</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            ${findingsHtml}
          </tbody>
        </table>

        <h4 style="margin-bottom: 0.75rem; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; color: #334155;">4. Investigative Audit Trail</h4>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem;">
          ${timelineHtml}
        </div>

        <div class="report-doc-disclaimer">
          <strong>FORENSIC PLATFORM NOTICE:</strong>
          ${forensicData.limitations}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Trigger print view
   */
  static printReport() {
    const printContent = document.getElementById('printable-report-sheet');
    if (!printContent) return;

    const printWin = window.open('', '_blank', 'width=900,height=800');
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fargo Forensic Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.85rem; }
            th, td { border: 1px solid #cbd5e1; padding: 0.55rem 0.75rem; text-align: left; }
            th { background: #f1f5f9; }
            .badge { padding: 2px 6px; border-radius: 3px; font-weight: 600; font-size: 0.75rem; }
            .badge-ai { background: #fee2e2; color: #991b1b; }
            .badge-real { background: #dcfce7; color: #166534; }
            .badge-warning { background: #fef3c7; color: #92400e; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  }

  /**
   * Download real DIT-FORENSICS-2.0 JSON file to user disk
   */
  static downloadJson(forensicData) {
    if (!forensicData) return;
    const jsonStr = JSON.stringify(forensicData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${forensicData.analysis_id || 'FARGO-FORENSIC-REPORT'}_DIT-FORENSICS-2.0.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
