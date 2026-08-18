'use client';

import { useState } from 'react';
import { UserPlus, Mail, Shield, Check, X, MoreHorizontal, Trash2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { mockTeamMembers } from '@/lib/mockData';
import { formatDate, formatRelative, getStatusColor, getRoleColor } from '@/lib/utils';
import type { TeamMember, UserRole } from '@/lib/types';

const ROLE_PERMISSIONS: Record<UserRole, { label: string; perms: string[] }> = {
  admin:   { label: 'Administrator', perms: ['View all data','Export reports','Manage team','Billing access','Edit settings','API access'] },
  analyst: { label: 'Analyst',       perms: ['View all data','Export reports','Create dashboards','Use filters'] },
  viewer:  { label: 'Viewer',        perms: ['View dashboard','View reports'] },
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  function handleInvite() {
    if (!inviteEmail) return;
    setShowInvite(false);
    setInviteEmail('');
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 className="page-title">Team Management</h2>
          <p className="page-subtitle">Manage team members, roles, and permissions</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowInvite(true)}>
          <UserPlus size={15} />
          Invite Member
        </Button>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <>
          <div
            onClick={() => setShowInvite(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 60, width: 420,
            background: '#131d30',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 18,
            padding: 28,
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>Invite Team Member</div>
              <button onClick={() => setShowInvite(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
              {(['admin','analyst','viewer'] as UserRole[]).map(role => (
                <div
                  key={role}
                  onClick={() => setInviteRole(role)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 10,
                    border: `1px solid ${inviteRole === role ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                    background: inviteRole === role ? 'rgba(99,102,241,0.1)' : 'transparent',
                    cursor: 'pointer', marginBottom: 6, transition: 'all 0.15s',
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: role === 'admin' ? '#6366f1' : role === 'analyst' ? '#06b6d4' : '#475569' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#e2e8f0', textTransform: 'capitalize' }}>{ROLE_PERMISSIONS[role].label}</div>
                    <div style={{ fontSize: 11.5, color: '#475569' }}>{ROLE_PERMISSIONS[role].perms.slice(0, 2).join(' · ')}</div>
                  </div>
                  {inviteRole === role && <Check size={15} color="#6366f1" />}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="ghost" size="md" style={{ flex: 1 }} onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button variant="primary" size="md" style={{ flex: 1 }} onClick={handleInvite}>Send Invite</Button>
            </div>
          </div>
        </>
      )}

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Members',  value: members.length, color: '#6366f1' },
          { label: 'Active',         value: members.filter(m => m.status === 'active').length, color: '#10b981' },
          { label: 'Admins',         value: members.filter(m => m.role === 'admin').length, color: '#8b5cf6' },
          { label: 'Pending Invites',value: members.filter(m => m.status === 'pending').length, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} className="glass-card glass-card-lift" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Members Table */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Members ({members.length})</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th>Sessions</th>
                <th>Last Active</th>
                <th>Joined</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ position: 'relative' }}>
                        <Avatar name={member.name} size="md" />
                        <div style={{
                          position: 'absolute', bottom: 0, right: 0,
                          width: 10, height: 10, borderRadius: '50%',
                          background: member.status === 'active' ? '#10b981' : member.status === 'pending' ? '#f59e0b' : '#475569',
                          border: '2px solid #0d1424',
                        }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 13.5 }}>{member.name}</div>
                        <div style={{ fontSize: 12, color: '#475569' }}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getRoleColor(member.role)}`} style={{ textTransform: 'capitalize' }}>
                      {member.role}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusColor(member.status)}`} style={{ textTransform: 'capitalize' }}>
                      {member.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#6366f1' }}>{member.sessionsThisMonth}</td>
                  <td style={{ color: '#64748b', fontSize: 13 }}>{formatRelative(member.lastActive)}</td>
                  <td style={{ color: '#475569', fontSize: 13 }}>{formatDate(member.joinedAt)}</td>
                  <td>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#334155', padding: '4px 6px', borderRadius: 6, transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                        onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {activeMenu === member.id && (
                        <div style={{
                          position: 'absolute', right: 0, top: '100%', marginTop: 4,
                          background: '#131d30', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 10, overflow: 'hidden', zIndex: 20, minWidth: 160,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        }}>
                          <button
                            onClick={() => setActiveMenu(null)}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#e2e8f0', textAlign: 'left' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <Shield size={13} />
                            Change Role
                          </button>
                          <button
                            onClick={() => { setMembers(prev => prev.filter(m => m.id !== member.id)); setActiveMenu(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#ef4444', textAlign: 'left' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <Trash2 size={13} />
                            Remove Member
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Role Permissions</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Permission</th>
                <th style={{ textAlign: 'center' }}>Admin</th>
                <th style={{ textAlign: 'center' }}>Analyst</th>
                <th style={{ textAlign: 'center' }}>Viewer</th>
              </tr>
            </thead>
            <tbody>
              {['View all data','Export reports','Create dashboards','Manage team','Billing access','Edit settings','API access'].map(perm => (
                <tr key={perm}>
                  <td style={{ color: '#e2e8f0', fontWeight: 500 }}>{perm}</td>
                  {(['admin','analyst','viewer'] as UserRole[]).map(role => {
                    const has = ROLE_PERMISSIONS[role].perms.includes(perm);
                    return (
                      <td key={role} style={{ textAlign: 'center' }}>
                        {has
                          ? <Check size={16} color="#10b981" style={{ margin: '0 auto' }} />
                          : <X size={16} color="#334155" style={{ margin: '0 auto' }} />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
