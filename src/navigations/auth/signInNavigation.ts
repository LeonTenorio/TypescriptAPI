import { signInHandler } from '../../handlers/auth/signInHandler';
import Navigation from '../../structure/navigation';

export const signInNavigation = new Navigation([signInHandler]);
