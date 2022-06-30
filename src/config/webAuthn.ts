
import SimpleWebAuthnServer from '@simplewebauthn/server';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { Authentication } from 'src/auth/entities/autentication.entity';
import { User } from 'src/user/entities/user.entity';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

// Utilitarios de AuthnWeb generateRegistrationsOptions

// Human-readable title for your website
const rpName = 'Sky Calendar App';
// A unique identifier for your website
const rpID = 'sky-calendar-app.vercel';
// The URL at which registrations and authentications should occur
const origin = [`http://${rpID}:4200`,`http://${rpID}:4300`,'https://sky-calendar-app.vercel.app','https://sky-calendar-app.vercel.app:4200'];

export function registerAuthWeb(user: User, userAuthenticators: Authentication[]) {
  return generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id.toString(),
    userName: user.username,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: 'direct',
    // Prevent users from re-registering existing authenticators
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: 'public-key',
    })),
  });
}

export async function verifyAuthWeb(body, expectedChallenge) {
  try {
    return await verifyRegistrationResponse({
      credential: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      
    });
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export async function generateAuthenticationOption(userAuthenticators: Authentication[]) {
 

  return generateAuthenticationOptions({
    // Require users to use a previously-registered authenticator
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: 'public-key',
      transports: [ 'internal' ,'usb' , 'ble' , 'nfc'  ]
    })),
    userVerification: 'preferred',
   
  });
}

export async function verifyAuthenticationOption(body, expectedChallenge, authenticator) {
  try {
    return await verifyAuthenticationResponse({
      credential: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator 
    });
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}
