/**
 * Auto-seeds the default admin account on first startup.
 * Credentials are read from environment variables:
 *   ADMIN_EMAIL    (default: admin@smartleads.com)
 *   ADMIN_PASSWORD (default: admin123)
 *   ADMIN_NAME     (default: Admin)
 *
 * Only runs if no admin user exists in the database.
 */

import User from './models/User';

export const seedAdmin = async (): Promise<void> => {
  const existing = await User.findOne({ role: 'admin' });
  if (existing) return;

  const email = process.env.ADMIN_EMAIL ?? 'admin@smartleads.com';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';
  const name = process.env.ADMIN_NAME ?? 'Admin';

  await User.create({ name, email, password, role: 'admin' });
  console.log(`🌱 Default admin created: ${email}`);
  console.log('⚠️  Change the admin password after first login!');
};
