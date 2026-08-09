import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiShield, FiCheck, FiCopy } from 'react-icons/fi';
import { useAuthContext } from '@context/AuthContext';
import { useEnableTwoFactor, useDisableTwoFactor } from '@hooks/useAdmin';
import { authApi } from '@api/authApi';
import { cn } from '@lib/utils';

const inputCls = 'w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-2.5 text-sm outline-none focus:border-accent';
const labelCls = 'mb-2 block text-sm font-medium text-text-secondary';

export default function Profile() {
  const { admin } = useAuthContext();
  const enableTwoFactor = useEnableTwoFactor();
  const disableTwoFactor = useDisableTwoFactor();

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileStatus, setProfileStatus] = useState(null);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState(null);

  const [twoFactorSetup, setTwoFactorSetup] = useState(null);
  const [disablePassword, setDisablePassword] = useState('');

  useEffect(() => {
    document.title = 'My Profile — Admin';
  }, []);

  useEffect(() => {
    if (admin) setProfileForm({ name: admin.name, email: admin.email });
  }, [admin]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileStatus(null);
    try {
      await authApi.updateProfile(profileForm);
      setProfileStatus({ type: 'success', message: 'Profile updated successfully' });
    } catch (err) {
      setProfileStatus({ type: 'error', message: err.message });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);
    try {
      await authApi.changePassword(passwordForm);
      setPasswordStatus({ type: 'success', message: 'Password changed successfully. Please log in again next time.' });
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err.message });
    }
  };

  const handleEnable2FA = async () => {
    const res = await enableTwoFactor.mutateAsync();
    setTwoFactorSetup(res.data.data);
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) return;
    await disableTwoFactor.mutateAsync(disablePassword);
    setDisablePassword('');
    setTwoFactorSetup(null);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">My Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your account details and security settings.</p>
      </div>

      <motion.form
        onSubmit={handleProfileSave}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <FiUser className="h-4 w-4 text-accent" />
          <h2 className="font-display text-base font-semibold">Account Details</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <input className={inputCls} value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input className={inputCls} value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Role</label>
            <p className="text-sm capitalize text-text-secondary">{admin?.role?.replace('-', ' ')}</p>
          </div>
        </div>
        {profileStatus && (
          <p className={cn('mt-4 text-sm', profileStatus.type === 'success' ? 'text-success' : 'text-danger')}>
            {profileStatus.message}
          </p>
        )}
        <button type="submit" className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground">
          Save Profile
        </button>
      </motion.form>

      <motion.form
        onSubmit={handlePasswordChange}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-2xl p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <FiLock className="h-4 w-4 text-accent" />
          <h2 className="font-display text-base font-semibold">Change Password</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <input
              type="password"
              className={inputCls}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input
              type="password"
              className={inputCls}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <p className="mt-1.5 text-xs text-text-muted">Minimum 8 characters, one uppercase letter, one number.</p>
          </div>
        </div>
        {passwordStatus && (
          <p className={cn('mt-4 text-sm', passwordStatus.type === 'success' ? 'text-success' : 'text-danger')}>
            {passwordStatus.message}
          </p>
        )}
        <button type="submit" className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground">
          Update Password
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-2xl p-6 sm:p-8"
      >
        <div className="mb-4 flex items-center gap-2">
          <FiShield className="h-4 w-4 text-accent" />
          <h2 className="font-display text-base font-semibold">Two-Factor Authentication</h2>
        </div>
        <p className="mb-4 text-sm text-text-secondary">
          Add an extra layer of security to your account with backup codes.{' '}
          <span className="text-text-muted">
            (Scaffold: enables the flag and issues backup codes; full authenticator-app verification is a follow-up
            enhancement.)
          </span>
        </p>

        {admin?.twoFactorEnabled ? (
          <div className="space-y-3">
            <p className="inline-flex items-center gap-1.5 text-sm text-success">
              <FiCheck className="h-4 w-4" /> Two-factor authentication is enabled
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Enter password to disable"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className={inputCls}
              />
              <button
                onClick={handleDisable2FA}
                disabled={disableTwoFactor.isPending}
                className="shrink-0 rounded-lg border border-danger/40 px-4 py-2 text-sm text-danger hover:bg-danger/10"
              >
                Disable
              </button>
            </div>
          </div>
        ) : twoFactorSetup ? (
          <div className="space-y-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
            <p className="text-sm font-medium">Save these backup codes somewhere safe:</p>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {twoFactorSetup.backupCodes.map((code) => (
                <span key={code} className="rounded bg-bg-surface px-2 py-1">{code}</span>
              ))}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(twoFactorSetup.backupCodes.join('\n'))}
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
            >
              <FiCopy className="h-3 w-3" /> Copy all codes
            </button>
          </div>
        ) : (
          <button
            onClick={handleEnable2FA}
            disabled={enableTwoFactor.isPending}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-50"
          >
            {enableTwoFactor.isPending ? 'Enabling...' : 'Enable Two-Factor Authentication'}
          </button>
        )}
      </motion.div>
    </div>
  );
}
