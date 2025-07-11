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
  const [parentId, setParentId] = useState('');
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/members`)
      .then(res => setMembers(res.data))
      .catch(err => console.error('Failed to fetch members', err));
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
        photo: photo || ''
      });

      alert('Member added successfully');
      setName('');
      setGender('');
      setDob('');
      setPhoto('');
      setParentId('');
    } catch (err) {
      console.error('Error adding member:', err);
      alert('Failed to add member');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Family Member</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ display: 'block', margin: '8px 0' }}
      />
      <input
        placeholder="Gender (male/female)"
        value={gender}
        onChange={e => setGender(e.target.value)}
        style={{ display: 'block', margin: '8px 0' }}
      />
      <input
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChange={e => setDob(e.target.value)}
        style={{ display: 'block', margin: '8px 0' }}
      />
      <input
        placeholder="Photo URL (optional)"
        value={photo}
        onChange={e => setPhoto(e.target.value)}
        style={{ display: 'block', margin: '8px 0' }}
      />

      <select value={parentId} onChange={e => setParentId(e.target.value)} style={{ display: 'block', margin: '8px 0' }}>
        <option value="">-- Select Parent (Optional) --</option>
        {members.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name}
          </option>
        ))}
      </select>

      <button onClick={handleAdd}>Add Member</button>
    </div>
  );
}
