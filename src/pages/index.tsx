// File: /pages/index.tsx
import { JSX, useEffect, useState } from 'react';
import axios from 'axios';

interface Member {
  _id: string;
  name: string;
  gender?: string;
  dob?: string;
  photo?: string;
  parentId?: string;
  spouse?: string;
  children?: Member[];
}

export default function HomePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [tree, setTree] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/members`).then((res) => {
      const flatMembers = res.data;
      setMembers(flatMembers);
      setTree(buildTree(flatMembers));
    });
  }, []);

  function buildTree(members: Member[]): Member[] {
    const memberMap: { [key: string]: Member } = {};
    const roots: Member[] = [];

    members.forEach((m) => {
      memberMap[m._id] = { ...m, children: [] };
    });

    members.forEach((m) => {
      if (m.parentId) {
        const parent = memberMap[m.parentId];
        if (parent) {
          parent.children?.push(memberMap[m._id]);
        }
      } else {
        roots.push(memberMap[m._id]);
      }
    });

    return roots;
  }

  const mainMember = tree[0];

  function handleClick(member: Member) {
    setSelectedMember(member);
  }

  function renderMemberCard(member: Member): JSX.Element {
    return (
      <div
        key={member._id}
        onClick={() => handleClick(member)}
        style={{
          cursor: 'pointer',
          border: '1px solid #dce1e7',
          borderRadius: '12px',
          padding: '16px',
          width: '220px',
          textAlign: 'center',
          margin: '12px',
          background: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        }}
      >
        {member.photo && (
          <img
            src={member.photo}
            alt={member.name}
            width="100"
            style={{ borderRadius: '8px', marginBottom: '10px', objectFit: 'cover', height: '100px' }}
          />
        )}
        <h4 style={{ color: '#2c3e50', marginBottom: '6px', fontSize: '16px' }}>{member.name}</h4>
        {member.dob && <p style={{ fontSize: '13px', color: '#7f8c8d' }}>🎂 {new Date(member.dob).toLocaleDateString()}</p>}
        {member.gender && <p style={{ fontSize: '13px', color: '#7f8c8d' }}>⚧ {member.gender}</p>}
        {member.spouse && <p style={{ fontSize: '13px', color: '#7f8c8d' }}>💍 Spouse: {member.spouse}</p>}
      </div>
    );
  }

  function renderSelectedMember(member: Member): JSX.Element {
    return (
      <div key={member._id} style={{ marginTop: '30px' }}>
        <h3 style={{ textAlign: 'center', color: '#34495e' }}>👤 {member.name}'s Children</h3>

        {member.spouse && (
          <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '15px', color: '#555' }}>
            💍 Spouse: {member.spouse}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {member.children && member.children.map((child) => renderMemberCard(child))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 30, fontFamily: 'Segoe UI, sans-serif', background: '#f4f7fb', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>🌳 Family Tree Viewer</h1>

      {mainMember && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              border: '2px solid #3498db',
              borderRadius: '14px',
              padding: '24px',
              display: 'inline-block',
              background: '#eaf4fd',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            }}
          >
            {mainMember.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainMember.photo}
                alt={mainMember.name}
                width="120"
                style={{ borderRadius: '10px', marginBottom: '10px', objectFit: 'cover', height: '120px' }}
              />
            )}
            <h2 style={{ color: '#2c3e50', fontSize: '22px' }}>{mainMember.name}</h2>
            {mainMember.dob && <p style={{ color: '#555' }}>🎂 DOB: {new Date(mainMember.dob).toLocaleDateString()}</p>}
            {mainMember.gender && <p style={{ color: '#555' }}>⚧ Gender: {mainMember.gender}</p>}
            {mainMember.spouse && <p style={{ color: '#555' }}>💍 Spouse: {mainMember.spouse}</p>}
          </div>

          <h3 style={{ marginTop: '40px', color: '#34495e' }}>👶 Children of {mainMember.name}</h3>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {mainMember.children && mainMember.children.map((child) => renderMemberCard(child))}
          </div>
        </div>
      )}

      {selectedMember && renderSelectedMember(selectedMember)}
    </div>
  );
}
