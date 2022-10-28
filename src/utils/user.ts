import { auth } from '../services/firebase';
import { User } from '../types';

export const loadCurrentUser = async () => {
  const { currentUser } = auth;
  const user:User = {
    ...currentUser
  }
  return user;
}
