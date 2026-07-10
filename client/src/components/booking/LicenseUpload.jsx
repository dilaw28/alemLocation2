import React from 'react';

export default function LicenseUpload({ licenseNumber, onNumberChange, licenseFile, uploading, onFileChange }) {
  return (
    <>
      <div className="field">
        <label>🪪 Numéro de permis de conduire *</label>
        <input
          type="text"
          value={licenseNumber}
          onChange={e => onNumberChange(e.target.value)}
          placeholder="Ex: 12345678"
          required
          style={{ letterSpacing: 2 }}
        />
      </div>

      <div className="field">
        <label>📄 Photo du permis de conduire *</label>
        <label className="upload-zone" style={{ display: 'block', cursor: 'pointer' }}>
          <input type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
          {uploading ? (
            <div style={{ color: '#6b7280', fontSize: 14 }}>⏳ Upload en cours...</div>
          ) : licenseFile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={URL.createObjectURL(licenseFile)} alt="Permis"
                style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 6 }} />
              <div>
                <div style={{ color: '#065f46', fontWeight: 700, fontSize: 14 }}>✅ Permis téléchargé</div>
                <div style={{ color: '#6b7280', fontSize: 12 }}>Cliquer pour changer</div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
              <div style={{ fontWeight: 700, color: '#1a56db', fontSize: 14 }}>Joindre mon permis de conduire</div>
              <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>JPG, PNG · Max 10 MB · Requis</div>
            </>
          )}
        </label>
      </div>
    </>
  );
}
