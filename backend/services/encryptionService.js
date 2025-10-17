import crypto from 'crypto';

class EncryptionService {
  constructor() {
    // In a production environment, these should be stored securely (e.g., environment variables)
    this.algorithm = 'aes-256-gcm';
    this.key = process.env.ENCRYPTION_KEY || crypto.randomBytes(32); // 256 bits
  }

  // Encrypt data
  encrypt(text) {
    try {
      const iv = crypto.randomBytes(16); // Initialization vector
      const cipher = crypto.createCipher(this.algorithm, this.key);
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        success: true,
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Error encrypting data:', error);
      return { success: false, error: error.message };
    }
  }

  // Decrypt data
  decrypt(encryptedData, iv, authTag) {
    try {
      const decipher = crypto.createDecipher(this.algorithm, this.key);
      
      // Set authentication tag
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return {
        success: true,
        decryptedData: decrypted
      };
    } catch (error) {
      console.error('Error decrypting data:', error);
      return { success: false, error: error.message };
    }
  }

  // Hash data (for passwords, tokens, etc.)
  hash(data, saltRounds = 10) {
    try {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(data, salt, saltRounds, 64, 'sha512').toString('hex');
      
      return {
        success: true,
        hash: hash,
        salt: salt
      };
    } catch (error) {
      console.error('Error hashing data:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify hashed data
  verifyHash(data, hash, salt) {
    try {
      const verifyHash = crypto.pbkdf2Sync(data, salt, 10, 64, 'sha512').toString('hex');
      const isValid = verifyHash === hash;
      
      return {
        success: true,
        isValid: isValid
      };
    } catch (error) {
      console.error('Error verifying hash:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate secure token
  generateToken(length = 32) {
    try {
      return {
        success: true,
        token: crypto.randomBytes(length).toString('hex')
      };
    } catch (error) {
      console.error('Error generating token:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate meeting passcode
  generatePasscode(length = 6) {
    try {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let passcode = '';
      
      for (let i = 0; i < length; i++) {
        passcode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      return {
        success: true,
        passcode: passcode
      };
    } catch (error) {
      console.error('Error generating passcode:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EncryptionService();