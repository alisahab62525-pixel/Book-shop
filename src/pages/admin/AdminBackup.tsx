import React, { useState } from 'react';
import {
  Download,
  Upload,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Database,
  FileCode,
} from 'lucide-react';
import { BackupService, AppBackupData } from '../../services/backupService.ts';
import { useApp } from '../../context/AppContext.tsx';

export const AdminBackup: React.FC = () => {
  const { showToast, refreshSettings } = useApp();

  const [importJsonText, setImportJsonText] = useState('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    summary?: string;
    data?: AppBackupData;
    error?: string;
  } | null>(null);

  const handleExport = () => {
    const jsonString = BackupService.exportFullBackup();
    BackupService.downloadJSONFile(jsonString, `beyond-notebooks-backup-${new Date().toISOString().slice(0, 10)}.json`);
    showToast('Full application data exported as JSON file', 'success');
  };

  const handleValidateImport = () => {
    if (!importJsonText.trim()) {
      showToast('Please paste valid JSON backup data', 'error');
      return;
    }
    const result = BackupService.validateBackupJSON(importJsonText);
    setValidationResult(result);
  };

  const handleConfirmRestore = () => {
    if (!validationResult || !validationResult.valid || !validationResult.data) return;

    if (
      window.confirm(
        'WARNING: Restoring this backup will replace current local orders, products, and settings. Proceed?'
      )
    ) {
      const ok = BackupService.restoreBackup(validationResult.data);
      if (ok) {
        refreshSettings();
        setImportJsonText('');
        setValidationResult(null);
        showToast('Backup restored successfully!', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        showToast('Failed restoring backup data', 'error');
      }
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all data to default demo state? All local customer orders will be cleared.'
      )
    ) {
      BackupService.resetToDefaultDemoData();
      showToast('App reset to clean demo state', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-8 text-xs">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-editorial font-bold text-slate-900 dark:text-white">
          Data Backup, Export & Disaster Recovery
        </h1>
        <p className="text-slate-500">
          Safeguard your local catalog, customer orders, custom requests, and pricing rules
        </p>
      </div>

      {/* Local Storage Limitations Card */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-2 text-amber-900 dark:text-amber-300">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Local Storage Persistence Limitations</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800 dark:text-amber-400">
          <li>Local records belong to this specific web browser and device.</li>
          <li>Clearing browser cache or changing computers will not automatically carry over records.</li>
          <li>We strongly recommend regular JSON backup downloads to keep permanent local archives.</li>
        </ul>
      </div>

      {/* Export Section */}
      <div className="p-6 bg-slate-50 dark:bg-neutral-900 rounded-2xl border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              1. Download Complete JSON Snapshot
            </h2>
            <p className="text-slate-500 mt-0.5">
              Exports all products, categories, orders, design requests, inventory movements, and shop configuration.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-[#1b3022] hover:bg-[#25422f] text-white font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="p-6 bg-slate-50 dark:bg-neutral-900 rounded-2xl border space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            2. Restore Data from Backup File
          </h2>
          <p className="text-slate-500 mt-0.5">
            Paste the JSON backup file contents below to inspect and restore records.
          </p>
        </div>

        <textarea
          rows={5}
          value={importJsonText}
          onChange={(e) => {
            setImportJsonText(e.target.value);
            setValidationResult(null);
          }}
          placeholder="Paste JSON text here..."
          className="w-full p-3 bg-white dark:bg-neutral-800 border rounded font-mono text-[11px]"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleValidateImport}
            className="px-4 py-2 bg-slate-900 text-white rounded font-semibold flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Validate & Preview JSON</span>
          </button>

          {validationResult?.valid && (
            <button
              onClick={handleConfirmRestore}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & Overwrite Data</span>
            </button>
          )}
        </div>

        {validationResult && (
          <div
            className={`p-3 rounded-lg border ${
              validationResult.valid
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {validationResult.valid ? (
              <div>
                <strong>Validation Passed:</strong> {validationResult.summary}
              </div>
            ) : (
              <div>
                <strong>Validation Failed:</strong> {validationResult.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Danger Zone: Reset to Factory Demo */}
      <div className="p-6 bg-rose-50/50 dark:bg-rose-950/10 rounded-2xl border border-rose-200 dark:border-rose-900/30 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-rose-700">
          Reset Application to Default Demo State
        </h2>
        <p className="text-slate-500">
          Restores default sample stationery catalog, categories, and settings, and purges local customer test orders.
        </p>
        <button
          onClick={handleResetDefaults}
          className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Demo Data</span>
        </button>
      </div>
    </div>
  );
};
