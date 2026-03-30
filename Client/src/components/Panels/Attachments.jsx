import { useState, useRef } from "react";
import { File, Upload, FileText, FileImage, X } from "lucide-react";

const FILE_TYPE_OPTIONS = [
  { label: "PDF", value: "application/pdf", accept: ".pdf" },
  { label: "Word", value: "application/msword", accept: ".doc,.docx" },
  { label: "Image", value: "image/png", accept: ".png,.jpg,.jpeg" },
];

const FILE_ICONS = {
  "application/pdf": <FileText size={14} className="text-red-400" />,
  "application/msword": <FileText size={14} className="text-blue-400" />,
  "image/png": <FileImage size={14} className="text-green-400" />,
};

export default function Attachments({ attachments, onUpload, onCancel, isDark, T }) {
  const inputRef = useRef(null);
  const [fileType, setFileType] = useState(FILE_TYPE_OPTIONS[0]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    files.forEach(file => {
      onUpload({
        file_name: file.name,
        file_size: file.size,
        mime_type: fileType.value,
        file,
        pending: true,
      });
    });
    e.target.value = '';
  };

  const handleTypeSelect = (opt) => {
    setFileType(opt);
    inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-3">

      {attachments.length === 0 ? (
        <p className="text-xs mt-3" style={{ color: T.muted }}>No attachments yet.</p>
      ) : (
        <ul className="flex flex-col gap-2 list-none p-0 m-0">
          {attachments.map((a, i) => (
            <li
              key={a.id ?? i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{
                background: T.tagBg,
                border: `1px solid ${T.tagBord}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: T.cardBg, border: `1px solid ${T.cardBord}` }}
              >
                {FILE_ICONS[a.mime_type] ?? <File size={14} style={{ color: T.muted }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate m-0" style={{ color: T.head }}>{a.file_name}</p>
                <p className="text-[10px] m-0" style={{ color: T.muted }}>
                  {FILE_TYPE_OPTIONS.find(opt => opt.value === a.mime_type)?.label ?? a.mime_type}
                  {a.file_size ? ` · ${Math.round(a.file_size / 1024)} KB` : ''}
                </p>
              </div>
              {a.pending && (
                <span className="text-[10px] font-medium shrink-0" style={{ color: '#f59e0b' }}>Pending</span>
              )}
              {a.pending && (
                <button
                  onClick={() => onCancel(a.id)}
                  className="p-1 rounded-lg transition-all shrink-0 border-none cursor-pointer"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(248,113,113,0.10)' : '#fff1f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <X size={13} style={{ color: T.muted }} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        {FILE_TYPE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleTypeSelect(opt)}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all border-none cursor-pointer"
            style={{
              background: fileType.value === opt.value
                ? isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff'
                : T.tagBg,
              color: fileType.value === opt.value ? '#6366f1' : T.muted,
              border: `1px solid ${fileType.value === opt.value
                ? isDark ? 'rgba(99,102,241,0.35)' : '#a5b4fc'
                : T.tagBord}`,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={fileType.accept}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all border-none cursor-pointer"
        style={{
          background: 'transparent',
          border: `2px dashed ${T.inputBord}`,
          color: T.muted,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = isDark ? 'rgba(99,102,241,0.4)' : '#a5b4fc';
          e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.06)' : '#eef2ff';
          e.currentTarget.style.color = '#6366f1';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = T.inputBord;
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = T.muted;
        }}
      >
        <Upload size={14} /> Attach a {fileType.label} file
      </button>

    </div>
  );
}