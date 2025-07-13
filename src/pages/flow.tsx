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
  children?: Member[];
}

export default function HomePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [tree, setTree] = useState<Member[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/members`)
      .then(res => {
        const flatMembers = res.data;
        setMembers(flatMembers);
        setTree(buildTree(flatMembers));
      });
  }, []);

  function buildTree(members: Member[]): Member[] {
    const memberMap: { [key: string]: Member } = {};
    const roots: Member[] = [];

    members.forEach(m => {
      memberMap[m._id] = { ...m, children: [] };
    });

    members.forEach(m => {
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

  function getParentName(parentId: string | undefined): string {
    if (!parentId) return 'N/A';
    const parent = members.find(m => m._id === parentId);
    return parent ? parent.name : 'Unknown';
  }

  function renderTree(node: Member): JSX.Element {
    return (
      <div key={node._id} style={{ marginLeft: '20px', borderLeft: '2px solid #ccc', paddingLeft: '10px', marginTop: '10px' }}>
        
        <div style={{ fontWeight: 'bold', color: '#4a90e2', background: '#f0f4ff', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>{node.name}</div>

        <div style={{ fontSize: '14px', marginTop: '4px', color: '#555' }}>
         
          <p>👤 Parent: <strong>{getParentName(node.parentId)}</strong></p>
          {node.dob && <p>🎂 DOB: {new Date(node.dob).toLocaleDateString()}</p>}
          {node.gender && <p>⚧ Gender: {node.gender}</p>}
        </div>

        {node.children && node.children.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {node.children.map(child => renderTree(child))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 30, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>🌳 Family Tree Viewer</h1>
      {tree.length > 0 ? (
        <div>
          {tree.map(member => renderTree(member))}
        </div>
      ) : (
        <p>Loading tree...</p>
      )}
    </div>
  );
}
