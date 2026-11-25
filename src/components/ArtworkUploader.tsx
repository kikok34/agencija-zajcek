"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { saveArtworkFile, deleteArtworkFile } from "@/lib/indexedDb";

interface ArtworkUploaderProps {
  onFileSelected: (fileData: {
    fileId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    previewUrl?: string;
  } | null) => void;
  currentFileName?: string;
  currentFileSize?: number;
  currentPreviewUrl?: string;
  label?: string;
  maxSizeMb?: number;
}

export const ArtworkUploader: React.FC<ArtworkUploaderProps> = ({
  onFileSelected,
  currentFileName,
  currentFileSize,
  currentPreviewUrl,
  label = "Naložite logotip ali grafiko za tisk (PDF, SVG, PNG, JPG)",
  maxSizeMb = 15,
}) => {
  const [fileName, setFileName] = useState<string | null>(currentFileName || null);
  const [fileSize, setFileSize] = useState<number | null>(currentFileSize || null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPreviewUrl || null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Datoteka presega demo omejitev ${maxSizeMb} MB.`);
      return;
    }

    // Validate type
    const validExtensions = [".pdf", ".svg", ".png", ".jpg", ".jpeg"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      setError("Dovoljeni formati datotek so PDF, SVG, PNG in JPG.");
      return;
    }

    setIsProcessing(true);

    try {
      // Save directly into IndexedDB (safe binary blob storage, no localStorage overflow)
      const record = await saveArtworkFile(file, {
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
      });

      setFileId(record.id);
      setFileName(record.name);
      setFileSize(record.size);
      setFileType(record.type);
      setPreviewUrl(record.dataUrl || null);

      onFileSelected({
        fileId: record.id,
        fileName: record.name,
        fileSize: record.size,
        fileType: record.type,
        previewUrl: record.dataUrl,
      });
    } catch (err) {
      console.error("Napaka pri shranjevanju v IndexedDB", err);
      setError("Napaka pri lokalnem branju datoteke.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    if (fileId) {
      await deleteArtworkFile(fileId);
    }
    setFileId(null);
    setFileName(null);
    setFileSize(null);
    setFileType(null);
    setPreviewUrl(null);
    setError(null);
    onFileSelected(null);
  };

  const isImageRaster =
    previewUrl && (fileType?.includes("png") || fileType?.includes("jpeg") || fileType?.includes("jpg"));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-brand-600" />
          <span>{label}</span>
        </label>
        <span className="text-[11px] text-slate-400">
          Maks. {maxSizeMb} MB
        </span>
      </div>

      {!fileName ? (
        <label className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-brand-50/20 group">
          <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-700 text-center">
            Kliknite za izbiro datoteke ali jo povlecite sem
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            Podprti formati: PDF, SVG, PNG, JPG
          </span>
          <input
            type="file"
            accept=".pdf,.svg,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />
        </label>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 border border-brand-100">
                {isImageRaster ? (
                  <ImageIcon className="w-5 h-5" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {fileName}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>{fileSize ? formatFileSize(fileSize) : ""}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Pripravljeno za naročilo
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Odstrani</span>
            </button>
          </div>

          {/* Safe Image Preview for PNG / JPG */}
          {isImageRaster && (
            <div className="pt-2 border-t border-slate-200/80">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                Informativni predogled motiva
              </div>
              <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center p-1 border border-slate-200 shrink-0">
                  <img
                    src={previewUrl}
                    alt="Predogled logotipa"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                    Informativni prikaz — ni končna priprava za tisk.
                  </p>
                  <p>
                    Pred tiskom vam naš grafični oddelek pošlje uradni vektorski predogled v potrditev.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SVG / PDF Note */}
          {!isImageRaster && (
            <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
              Vektorski format ({fileType?.includes("pdf") ? "PDF" : "SVG"}) je optimalen za kakovosten tisk ali gravuro.
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Localhost / Privacy explanation */}
      <div className="flex items-start gap-1.5 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
        <span>
          Demo opomba: Datoteka ostaja varno shranjena le lokalno v vašem brskalniku (IndexedDB) in se ne pošilja na zunanje strežnike.
        </span>
      </div>
    </div>
  );
};
