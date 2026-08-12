import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { rentalsAPI, uploadAPI } from '../../services/api';
import { useAlert } from '../../context/AlertContext';
import {
  DZD, computeBilledDays, localDT, fmtDatetime,
} from '../../utils/format';
import RentalTypeSelector from './RentalTypeSelector';
import LocationSelect from './LocationSelect';
import LicenseUpload from './LicenseUpload';
import PriceSummary from './PriceSummary';
import AvailabilityCalendar from './AvailabilityCalendar';

export default function BookingForm({ car, user, locations, surcharges, tiers, onSuccess }) {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [startDT, setStartDT]               = useState('');
  const [endDT, setEndDT]                   = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [rentalType, setRentalType]         = useState('personnel');
  const [notes, setNotes]                   = useState('');
  const [licenseFile, setLicenseFile]       = useState(null);
  const [licenseUrl, setLicenseUrl]         = useState('');
  const [licenseFileId, setLicenseFileId]   = useState('');
  const [licenseNumber, setLicenseNumber]   = useState('');
  const [uploading, setUploading]           = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [error, setError]                   = useState('');

  /* ── Derived values ── */
  const billedDays   = computeBilledDays(startDT, endDT);

  const realMs   = startDT && endDT ? Math.max(0, new Date(endDT) - new Date(startDT)) : 0;
  const remHours = Math.floor((realMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const hasExtra = remHours > 0;

  const surchargeRate =
    rentalType === 'avec_chauffeur' ? (surcharges.chauffeur_surcharge ?? 40) / 100
    : rentalType === 'entreprise'   ? (surcharges.entreprise_surcharge ?? 0)  / 100
    : 0;

  // Tier discount — pick highest matching threshold (tiers sorted descending by days)
  const tierDiscount = (() => {
    if (!billedDays || !tiers.length) return { discount: 0, label: '' };
    const match = tiers.find(t => billedDays >= t.days);
    if (match) return { discount: match.discount || 0, label: match.label || '' };
    return { discount: 0, label: '' };
  })();

  const pricePerDayBase = Math.round(car.pricePerDay * (1 + surchargeRate));
  const pricePerDay     = Math.round(pricePerDayBase * (1 - tierDiscount.discount / 100));
  const totalPrice      = billedDays * pricePerDay;

  const surchargeLabel =
    rentalType === 'avec_chauffeur' && (surcharges.chauffeur_surcharge ?? 40) > 0
      ? `+${surcharges.chauffeur_surcharge ?? 40}% chauffeur inclus`
    : rentalType === 'entreprise' && (surcharges.entreprise_surcharge ?? 0) > 0
      ? `+${surcharges.entreprise_surcharge}% tarif entreprise`
    : null;

  /* ── Handlers ── */
  // Calendar click still works: it feeds back into the same state as the inputs
  const handleCalendarChange = ({ startDT: s, endDT: e }) => {
    setStartDT(s);
    setEndDT(e);
  };

  const handleStartChange = (val) => {
    setStartDT(val);
    if (endDT && val >= endDT) setEndDT('');
  };

  const handleLicenseChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLicenseFile(file);
    setUploading(true);
    setError('');
    try {
      const { data } = await uploadAPI.uploadImage(file, 'licenses');
      setLicenseUrl(data.url);
      setLicenseFileId(data.fileId || '');
    } catch (err) {
      const msg = "Impossible d'uploader le permis. Vérifiez votre connexion.";
      setError(msg);
      showAlert(msg, { type: 'error', title: 'Échec de l\'upload' });
      setLicenseFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) return navigate('/login');

    let validationMsg = '';
    if (!startDT || !endDT)      validationMsg = 'Veuillez choisir vos dates de départ et de retour.';
    else if (billedDays < 1)     validationMsg = 'La date/heure de retour doit être après la date/heure de départ.';
    else if (!licenseUrl)        validationMsg = 'Votre permis de conduire (photo) est requis.';
    else if (!licenseNumber.trim()) validationMsg = 'Votre numéro de permis de conduire est requis.';

    if (validationMsg) {
      setError(validationMsg);
      showAlert(validationMsg, { type: 'error', title: 'Formulaire incomplet' });
      return;
    }

    setSubmitting(true);
    try {
      await rentalsAPI.create({
        carId: car._id,
        startDateTime: startDT,
        endDateTime:   endDT,
        licenseImage:  licenseUrl,
        licenseFileId,
        licenseNumber,
        rentalType,
        pickupLocation,
        returnLocation,
        additionalNotes: notes,
      });
      onSuccess({ rentalType, startDT, endDT, billedDays, totalPrice });
    } catch (err) {
      const msg = err.response?.data?.message || 'Une erreur est survenue lors de la réservation.';
      setError(msg);
      showAlert(msg, { type: 'error', title: 'Réservation impossible' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-box">
      {/* Price header */}
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: '#1a56db' }}>{DZD(pricePerDay)}</span>
        <span style={{ color: '#6b7280', fontSize: 14 }}> / jour facturé</span>
        {surchargeLabel && (
          <div style={{ fontSize: 12, color: '#92400e', background: '#fef3c7', borderRadius: 6, padding: '4px 10px', marginTop: 6, display: 'inline-block' }}>
            {surchargeLabel}
          </div>
        )}
        {tierDiscount.discount > 0 && (
          <div style={{ fontSize: 12, color: '#065f46', background: '#d1fae5', borderRadius: 6, padding: '4px 10px', marginTop: 6, marginLeft: 6, display: 'inline-block' }}>
            🎁 -{tierDiscount.discount}% tarif {tierDiscount.label}
          </div>
        )}
      </div>

      {!user ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
            Vous devez être connecté pour réserver ce véhicule.
          </p>
          <Link to="/login" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '13px', fontSize: 15 }}>
            Se connecter pour réserver
          </Link>
          <p style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>
            Pas de compte ?{' '}
            <Link to="/register" style={{ color: '#1a56db', fontWeight: 600 }}>S'inscrire</Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <RentalTypeSelector value={rentalType} onChange={setRentalType} />

          {/* ── Dates : toujours visibles, comme avant ── */}
          <div className="field">
            <label>📅 Date et heure de départ *</label>
            <input
              type="datetime-local"
              value={startDT}
              min={localDT()}
              onChange={(e) => handleStartChange(e.target.value)}
              required
            />
            {startDT && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{fmtDatetime(startDT)}</div>}
          </div>

          <div className="field">
            <label>📅 Date et heure de retour *</label>
            <input
              type="datetime-local"
              value={endDT}
              min={startDT || localDT(60)}
              onChange={(e) => setEndDT(e.target.value)}
              required
            />
            {endDT && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{fmtDatetime(endDT)}</div>}
          </div>

          {/* Calendrier — repère visuel des dates indisponibles (rouge) */}
          <div className="field">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              🗓️ Disponibilité du véhicule
              <span style={{ fontSize: 11, fontWeight: 400, color: '#9ca3af' }}>(cliquez pour sélectionner rapidement)</span>
            </label>
            <AvailabilityCalendar
              carId={car._id}
              startDT={startDT}
              endDT={endDT}
              onChange={handleCalendarChange}
            />
          </div>

          <PriceSummary
            billedDays={billedDays}
            hasExtra={hasExtra}
            remHours={remHours}
            car={car}
            surchargeRate={surchargeRate}
            rentalType={rentalType}
            surcharges={surcharges}
            tierDiscount={tierDiscount}
            pricePerDayBase={pricePerDayBase}
            totalPrice={totalPrice}
          />

          <LocationSelect
            label="🏁 Lieu de prise en charge"
            value={pickupLocation}
            onChange={setPickupLocation}
            locations={locations}
            placeholder="Ex: Alger - Aéroport"
          />
          <LocationSelect
            label="🏴 Lieu de retour"
            value={returnLocation}
            onChange={setReturnLocation}
            locations={locations}
            placeholder="Ex: Oran - Gare routière"
          />

          <LicenseUpload
            licenseNumber={licenseNumber}
            onNumberChange={setLicenseNumber}
            licenseFile={licenseFile}
            uploading={uploading}
            onFileChange={handleLicenseChange}
          />

          <div className="field">
            <label>💬 Notes (optionnel)</label>
            <textarea placeholder="Informations supplémentaires..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting || uploading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, opacity: submitting || uploading ? 0.7 : 1 }}
          >
            {submitting ? '⏳ Envoi...' : '✅ Envoyer ma demande'}
          </button>

          <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
            En soumettant, vous acceptez nos conditions. L'admin traitera votre demande sous 24h.
          </p>
        </form>
      )}
    </div>
  );
}
