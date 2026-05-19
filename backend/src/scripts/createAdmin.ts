/**
 * One-time script to promote a user to admin or create an admin account.
 * Usage: npx tsx src/scripts/createAdmin.ts admin@example.com
 */
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const email = process.argv[2];
const password = process.argv[3] || 'admin123';
const name = process.argv[4] || 'Admin User';

const run = async (): Promise<void> => {
  if (!email) {
    console.error('Usage: npx tsx src/scripts/createAdmin.ts <email> [password] [name]');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI is not set in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    user.role = 'admin';
    await user.save();
    console.log(`Updated existing user "${email}" to admin.`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
    });
    console.log(`Created admin user "${email}" with password "${password}".`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
