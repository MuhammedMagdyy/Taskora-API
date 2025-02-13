import fs from 'fs';
import path from 'path';

export const getVerifyEmailTemplate = () => {
  const verifyEmailHtmlTemplate = '../templates/verify-email.html';
  const verificationEmailTemplatePath = path.join(
    __dirname,
    verifyEmailHtmlTemplate
  );

  return fs.readFileSync(verificationEmailTemplatePath, 'utf-8');
};
