import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateSecret = () => {
  const secret = crypto.randomBytes(64).toString('hex');
  console.log(`Generated JWT Secret: ${secret}`);

  const envPath = path.resolve(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');

  if (envContent.includes('JWT_SECRET=')) {
    envContent = envContent.replace(/JWT_SECRET=.*/, `JWT_SECRET=${secret}`);
  } else {
    envContent += `\nJWT_SECRET=${secret}`;
  }

  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('.env file updated with new JWT secret.');
};

generateSecret();
