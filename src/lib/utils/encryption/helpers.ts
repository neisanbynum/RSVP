import CryptoJS from 'crypto-js';

export function encrypt(data: string, key: string): string {
	return CryptoJS.AES.encrypt(data, key).toString();
}

export function decrypt(encrypted: string, key: string): string {
	return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
}
