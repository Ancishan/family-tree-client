import { useState, useEffect } from 'react';
import axios from 'axios';

interface Member {
  _id: string;
  name: string;
}

export default function AdminPage() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [photo, setPhoto] = useState('');
  const [spouse, setSpouse] = useState('');
  const [parentId, setParentId] = useState('');
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/members`)
      .then((res) => setMembers(res.data))
      .catch((err) => console.error('Failed to fetch members', err));
  }, []);

  const handleAdd = async () => {
    if (!name || !gender || !dob) {
      alert('Name, Gender, and DOB are required!');
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/members`, {
        name,
        gender,
        dob,
        parentId: parentId || null,
        spouse: spouse || '',
        photo: photo || '',
      });

      alert('Member added successfully');

      // Reset form
      setName('');
      setGender('');
      setDob('');
      setPhoto('');
      setSpouse('');
      setParentId('');
    } catch (err) {
      console.error('Error adding member:', err);
      alert('Failed to add member');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Add Family Member</h2>

      <div style={{ backgroundColor: '#f9f9f9', padding: 20, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Full Name</label>
        <input
          placeholder="Enter full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <label style={{ display: 'block', marginBottom: 6 }}>Gender</label>
        <input
          placeholder="male / female"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={inputStyle}
        />

        <label style={{ display: 'block', marginBottom: 6 }}>Date of Birth</label>
        <input
          placeholder="YYYY-MM-DD"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          style={inputStyle}
        />

        <label style={{ display: 'block', marginBottom: 6 }}>Spouse Name</label>
        <input
          placeholder="Spouse name (optional)"
          value={spouse}
          onChange={(e) => setSpouse(e.target.value)}
          style={inputStyle}
        />

        <label style={{ display: 'block', marginBottom: 6 }}>Photo URL</label>
        <input
          placeholder="Photo URL (optional)"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          style={inputStyle}
        />

        <label style={{ display: 'block', marginBottom: 6 }}>Parent</label>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="">-- Select Parent (Optional) --</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <button onClick={handleAdd} style={buttonStyle}>
          ➕ Add Member
        </button>
      </div>
    </div>
  );
}

// Inline styles
const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
};
