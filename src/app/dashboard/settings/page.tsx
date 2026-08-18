'use client';

import { useState } from 'react';
import { User, Building2, Bell, Lock, CreditCard, Key, Save, Eye, EyeOff, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { useRole } from '@/hooks/useRole';

type SettingsTab = 'profile' | 'organization' | 'notifications' | 'security' | 'billing';

const TABS: { value: SettingsTab; label: string; icon: React.ElementType }[] = [
  { value: 'profile',       label: 'Profile',        icon: User },
  { value: 'organization',  label: 'Organization',   icon: Building2 },
  { value: 'notifications', label: 'Notifications',  icon: Bell },
  { value: 'security',      label: 'Security',       icon: Lock },
  { value: 'billing',       label: 'Billing',        icon: CreditCard },
];

const NOTIF_PREFS = [
  { key: 'billing_updates',    label: 'Billing Updates',        desc: 'Invoices, payment receipts, plan changes' },
  { key: 'team_activity',      label: 'Team Activity',          desc: 'Member joins, role changes, invitations' },
  { key: 'security_alerts',    label: 'Security Alerts',        desc: 'Login attempts, anomalies, API usage' },
  { key: 'product_updates',    label: 'Product Updates',        desc: 'New features, releases, improvements' },
  { key: 'weekly_digest',      label: 'Weekly Digest',          desc: 'Weekly summary of your analytics' },
  { key: 'marketing_emails',   label: 'Marketing Emails',       desc: 'Tips, use-cases, and best practices' },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div className={`toggle ${on ? 'on' : ''}`} onClick={onToggle} role="switch" aria-checked={on} />
  );
}

export default function SettingsPage() {
  const { currentUser } = useRole();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({
    billing_updates: true,
    team_activity: true,
    security_alerts: true,
    product_updates: false,
    weekly_digest: true,
    marketing_emails: false,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleNotif(key: string) {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 860 }}>
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle">Manage your account, organization, and preferences</p>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Tab List */}
        <div style={{ width: 190, flexShrink: 0 }}>
          <div className="glass-card" style={{ padding: '10px 8px', overflow: 'hidden' }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  id={`settings-tab-${tab.value}`}
                  onClick={() => setActiveTab(tab.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '10px 12px',
                    background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                    border: 'none', borderRadius: 9,
                    cursor: 'pointer', marginBottom: 2,
                    color: active ? '#f1f5f9' : '#64748b',
                    fontSize: 13.5, fontWeight: active ? 600 : 500,
                    textAlign: 'left', transition: 'all 0.15s',
                    borderLeft: `2px solid ${active ? '#6366f1' : 'transparent'}`,
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div className="glass-card" style={{ padding: 28 }}>

            {/* Profile */}
            {activeTab === 'profile' && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Profile Information</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                  <Avatar name={currentUser.name} size="lg" />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{currentUser.name}</div>
                    <div style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>{currentUser.email}</div>
                    <Button variant="outline" size="sm" style={{ marginTop: 10 }}>Change Photo</Button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>First Name</label>
                    <input className="form-input" defaultValue={currentUser.name.split(' ')[0]} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Name</label>
                    <input className="form-input" defaultValue={currentUser.name.split(' ')[1] ?? ''} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                  <input className="form-input" type="email" defaultValue={currentUser.email} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Title</label>
                  <input className="form-input" defaultValue="Head of Analytics" />
                </div>
                <Button variant="primary" size="md" onClick={handleSave}>
                  {saved ? <><Check size={14} />Saved!</> : <><Save size={14} />Save Changes</>}
                </Button>
              </div>
            )}

            {/* Organization */}
            {activeTab === 'organization' && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Organization Settings</div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organization Name</label>
                  <input className="form-input" defaultValue="CloudMetrics Inc." />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Domain</label>
                  <input className="form-input" defaultValue="cloudmetrics.io" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timezone</label>
                  <select className="form-input">
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                    <option>Asia/Tokyo (JST)</option>
                  </select>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fiscal Year Start</label>
                  <select className="form-input">
                    <option>January 1</option>
                    <option>April 1</option>
                    <option>July 1</option>
                    <option>October 1</option>
                  </select>
                </div>
                <Button variant="primary" size="md" onClick={handleSave}>
                  {saved ? <><Check size={14} />Saved!</> : <><Save size={14} />Save Changes</>}
                </Button>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>Notification Preferences</div>
                <div style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Choose which emails and alerts you receive</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {NOTIF_PREFS.map((pref, i) => (
                    <div key={pref.key} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px 0',
                      borderBottom: i < NOTIF_PREFS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 3 }}>{pref.label}</div>
                        <div style={{ fontSize: 12.5, color: '#475569' }}>{pref.desc}</div>
                      </div>
                      <Toggle on={notifPrefs[pref.key]} onToggle={() => toggleNotif(pref.key)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Security Settings</div>

                {/* 2FA */}
                <div className="glass-card" style={{ padding: '18px 20px', marginBottom: 16, background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                        Two-Factor Authentication
                        {twoFA && <Badge variant="success" size="sm" style={{ marginLeft: 8 }}>Enabled</Badge>}
                      </div>
                      <div style={{ fontSize: 12.5, color: '#475569' }}>Add an extra layer of security to your account</div>
                    </div>
                    <Toggle on={twoFA} onToggle={() => setTwoFA(v => !v)} />
                  </div>
                </div>

                {/* Change Password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Password</label>
                  <input className="form-input" type="password" placeholder="••••••••" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Password</label>
                    <input className="form-input" type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm</label>
                    <input className="form-input" type="password" placeholder="••••••••" />
                  </div>
                </div>

                {/* API Key */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>API Key</label>
                  <div style={{ position: 'relative' }}>
                    <Key size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                    <input
                      className="form-input"
                      readOnly
                      value={showKey ? 'cm_live_sk_4x9mP2kqRtY8nLv3wJhB6cZdA1eUoN7' : '••••••••••••••••••••••••••••••••'}
                      style={{ paddingLeft: 32, paddingRight: 42, fontFamily: showKey ? 'monospace' : 'inherit', fontSize: showKey ? 12 : undefined }}
                    />
                    <button
                      onClick={() => setShowKey(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}
                    >
                      {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <Button variant="primary" size="md" onClick={handleSave}>
                  {saved ? <><Check size={14} />Saved!</> : <><Save size={14} />Update Security</>}
                </Button>
              </div>
            )}

            {/* Billing */}
            {activeTab === 'billing' && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>Billing & Subscription</div>

                {/* Current Plan */}
                <div style={{
                  padding: '20px 22px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
                  border: '1px solid rgba(99,102,241,0.25)',
                  marginBottom: 20,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Badge variant="violet" size="md">Enterprise Plan</Badge>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginTop: 10, letterSpacing: '-0.02em' }}>
                        $290,316
                        <span style={{ fontSize: 15, fontWeight: 400, color: '#64748b' }}>/year</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Renews August 25, 2027</div>
                    </div>
                    <Button variant="outline" size="sm">Manage Plan</Button>
                  </div>
                </div>

                {/* Plan Features */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Included Features</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {['Unlimited users','Custom dashboards','API access','Priority support','SLA guarantee','Advanced security','Custom reports','Data export'].map(feat => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                        <Check size={13} color="#10b981" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Payment Method</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>VISA</div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#e2e8f0' }}>•••• •••• •••• 4242</div>
                        <div style={{ fontSize: 12, color: '#475569' }}>Expires 09/2028</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Update</Button>
                  </div>
                </div>

                <Button variant="danger" size="sm">Cancel Subscription</Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
