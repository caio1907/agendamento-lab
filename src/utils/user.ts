import { auth } from '../services/firebase';

export const loadCurrentUser = async () => {
  const { currentUser } = auth;
  return currentUser;
}
