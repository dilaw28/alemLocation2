import React, { useEffect, useState } from 'react';
import { carsAPI, uploadAPI } from '../services/api';

const EMPTY_CAR = {
  brand: '', model: '', year: new Date().getFullYear(), category: 'Économique',
  transmission: 'Automatique', fuel: 'Essence', seats: 5, pricePerDay: '',
  description: '', location: 'Draa El Mizan', isAvailable: true, features: [], images: [],
};

function CarModal({ car, onSave, onClose }) {
  const [form, setForm] = useState(car || EMPTY_CAR);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadAPI.uploadImage(file, 'cars');
      update('images', [...(form.images || []), data.url]);
    } catch (err) { alert('Upload échoué'); }
    finally { setUploading(false); }
  };

  const removeImage = (idx) => update('images', form.images.filter((_, i) => i !== idx));

  const handleSave = async () => {
    if (!form.brand || !form.model || !form.pricePerDay) return alert('Remplissez les champs obligatoires.');
    setSaving(true);
    try {
      if (form._id) await carsAPI.update(form._id, form);
      else await carsAPI.create(form);
      onSave();
    } catch (err) { alert(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>{form._id ? '✏️ Modifier le véhicule' : '➕ Ajouter un véhicule'}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[
            { key: 'brand', label: 'Marque *', placeholder: 'Renault' },
            { key: 'model', label: 'Modèle *', placeholder: 'Clio' },
            { key: 'year', label: 'Année', type: 'number' },
            { key: 'pricePerDay', label: 'Prix/jour (da) *', type: 'number' },
            { key: 'seats', label: 'Places', type: 'number' },
            { key: 'location', label: 'Localisation' },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={(e) => update(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                placeholder={f.placeholder}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[
            { key: 'category', label: 'Catégorie', options: ['Économique', 'Berline', 'SUV', 'Luxe', 'Utilitaire', 'Électrique'] },
            { key: 'transmission', label: 'Transmission', options: ['Automatique', 'Manuelle'] },
            { key: 'fuel', label: 'Carburant', options: ['Essence', 'Diesel', 'Électrique', 'Hybride'] },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <select value={form[f.key]} onChange={(e) => update(f.key, e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}>
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Description</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
        </div>

        {/* Images */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Images</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            {form.images?.map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={url} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 11 }}>✕</button>
              </div>
            ))}
            <label style={{ width: 80, height: 60, border: '2px dashed #d1d5db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20 }}>
              {uploading ? '⏳' : '+'}
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => update('isAvailable', e.target.checked)} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Disponible à la location</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
            {saving ? '...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    carsAPI.getAll().then(({ data }) => setCars(data.cars)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce véhicule ?')) return;
    await carsAPI.delete(id);
    load();
  };

  const filtered = cars.filter(c => `${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>🚗 Véhicules</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>{cars.length} véhicule(s) dans le parc</p>
        </div>
        <button onClick={() => setModal({ car: null })} style={{ padding: '12px 20px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
          ➕ Ajouter un véhicule
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Rechercher un véhicule..."
        style={{ padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, width: '100%', boxSizing: 'border-box', marginBottom: 20 }}
      />

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}>Chargement...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map((car) => (
            <div key={car._id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              {car.images?.[0] ? (
                <img src={car.images[0]} alt="" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 160, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🚗</div>
              )}
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#111827' }}>{car.brand} {car.model}</div>
                  <span style={{ background: car.isAvailable ? '#d1fae5' : '#fee2e2', color: car.isAvailable ? '#065f46' : '#991b1b', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    {car.isAvailable ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 10 }}>{car.year} · {car.category} · {car.transmission}</div>
                <div style={{ fontWeight: 800, color: '#1a56db', fontSize: 18, marginBottom: 14 }}>{car.pricePerDay}da/jour</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setModal({ car })} style={{ flex: 1, padding: '8px', background: '#eff6ff', color: '#1a56db', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>✏️ Modifier</button>
                  <button onClick={() => handleDelete(car._id)} style={{ flex: 1, padding: '8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>🗑️ Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <CarModal
          car={modal.car}
          onSave={() => { setModal(null); load(); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
