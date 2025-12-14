export interface User {
  username: string;
  password: string;
  walletAddress: string;
  createdAt: string;
}

export interface CurrentUser {
  username: string;
  walletAddress: string;
}

const STORAGE_KEYS = {
  USERS: 'strictly_users',
  CURRENT_USER: 'strictly_current_user',
} as const;

export const getAllUsers = (): User[] => {
  try {
    const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Fel vid hämtning av användare:', error);
    return [];
  }
};

const saveAllUsers = (users: User[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Fel vid sparande av användare:', error);
  }
};

export const registerUser = (
  username: string,
  password: string,
  walletAddress: string
): { success: boolean; message: string; user?: CurrentUser } => {
  try {
    const users = getAllUsers();

    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Användarnamnet är redan upptaget' };
    }

    if (users.some(user => user.walletAddress.toLowerCase() === walletAddress.toLowerCase())) {
      return { success: false, message: 'Denna wallet är redan registrerad' };
    }

    const newUser: User = {
      username,
      password,
      walletAddress,
      createdAt: new Date().toISOString(),

    };

    users.push(newUser);
    saveAllUsers(users);

    const currentUser: CurrentUser = {
      username: newUser.username,
      walletAddress: newUser.walletAddress,
    };

    setCurrentUser(currentUser);

    return { 
      success: true, 
      message: 'Registrering lyckades!', 
      user: currentUser 
    };
  } catch (error) {
    console.error('Fel vid registrering:', error);
    return { success: false, message: 'Ett fel uppstod vid registrering' };
  }
};

export const loginUser = (
  username: string,
  password: string
): { success: boolean; message: string; user?: CurrentUser } => {
  try {
    const users = getAllUsers();
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, message: 'Felaktigt användarnamn eller lösenord' };
    }

    const currentUser: CurrentUser = {
      username: user.username,
      walletAddress: user.walletAddress,
    };

    setCurrentUser(currentUser);

    return { 
      success: true, 
      message: 'Inloggning lyckades!', 
      user: currentUser 
    };
  } catch (error) {
    console.error('Fel vid inloggning:', error);
    return { success: false, message: 'Ett fel uppstod vid inloggning' };
  }
};

export const getCurrentUser = (): CurrentUser | null => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Fel vid hämtning av inloggad användare:', error);
    return null;
  }
};

export const setCurrentUser = (user: CurrentUser): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (error) {
    console.error('Fel vid sparande av inloggad användare:', error);
  }
};

export const logoutUser = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    console.error('Fel vid utloggning:', error);
  }
};

export const updateWalletAddress = (
  newWalletAddress: string
): { success: boolean; message: string } => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'Ingen användare är inloggad' };
    }

    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.username === currentUser.username);

    if (userIndex === -1) {
      return { success: false, message: 'Användare hittades inte' };
    }

    const walletExists = users.some(
      u => u.username !== currentUser.username && 
      u.walletAddress.toLowerCase() === newWalletAddress.toLowerCase()
    );

    if (walletExists) {
      return { success: false, message: 'Denna wallet används redan av en annan användare' };
    }

    users[userIndex].walletAddress = newWalletAddress;
    saveAllUsers(users);

    currentUser.walletAddress = newWalletAddress;
    setCurrentUser(currentUser);

    return { success: true, message: 'Wallet-adress uppdaterad!' };
  } catch (error) {
    console.error('Fel vid uppdatering av wallet:', error);
    return { success: false, message: 'Ett fel uppstod vid uppdatering' };
  }
};

export const isUserLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};

export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    console.error('Fel vid rensning av data:', error);
  }
};
