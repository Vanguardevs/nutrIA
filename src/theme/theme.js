import { useColorScheme } from 'react-native';

// Cores básicas do tema (claro)
const baseColors = {
    primary: '#2E8331',
    secondary: '#4ECDC4',
    accent: '#FF6B35',
    background: '#FFFFFF',
    surface: '#F8F9FB',
    card: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    textTertiary: '#C7C7CC',
    border: '#E5E5EA',
    inputBorder: '#E5E5EA',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    messageUser: '#2E8331',
    messageBot: '#F2F2F7',
    messageText: '#1C1C1E',
    messageTextSecondary: '#888',
    inputBackground: '#F2F2F7',
    inputText: '#1C1C1E',
    placeholder: '#8E8E93',
    buttonPrimary: '#2E8331',
    buttonSecondary: '#F2F2F7',
    tabBar: '#F2F2F2',
    tabBarActive: 'green',
    tabBarInactive: 'gray',
};

// Cores para tema escuro (mesma estrutura)
const baseDarkColors = {
    ...baseColors,
    background: '#1C1C1E',
    surface: '#2C2C2E',
    card: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#48484A',
    border: '#38383A',
    inputBorder: '#38383A',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
    messageUser: '#2E8331',
    messageBot: '#2C2C2E',
    messageText: '#FFFFFF',
    messageTextSecondary: '#8E8E93',
    inputBackground: '#2C2C2E',
    inputText: '#FFFFFF',
    placeholder: '#8E8E93',
    buttonPrimary: '#2E8331',
    buttonSecondary: '#2C2C2E',
    tabBar: '#1C1C1E',
    tabBarActive: 'green',
    tabBarInactive: 'gray',
};

export const colors = baseColors;
export const darkColors = baseDarkColors;

// Hook para usar o tema completo
export const useTheme = () => {
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? baseDarkColors : baseColors;
    return {
        colors: themeColors,
        spacing: {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24,
            xl: 32,
            xxl: 48,
        },
        borderRadius: {
            sm: 4,
            md: 8,
            lg: 12,
            xl: 16,
            xxl: 24,
            round: 50,
        },
        typography: {
            h1: {
                fontSize: 32,
                fontWeight: 'bold',
            },
            h2: {
                fontSize: 24,
                fontWeight: 'bold',
            },
            h3: {
                fontSize: 20,
                fontWeight: '600',
            },
            body: {
                fontSize: 16,
                fontWeight: 'normal',
            },
            caption: {
                fontSize: 14,
                fontWeight: 'normal',
            },
            small: {
                fontSize: 12,
                fontWeight: 'normal',
            },
        },
        font: {
            fontFamily: 'System',
            fontSize: {
                xs: 12,
                sm: 14,
                md: 16,
                lg: 18,
                xl: 20,
                xxl: 24,
                xxxl: 32,
            },
            fontWeight: {
                light: '300',
                regular: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
            },
        },
        shadows: {
            small: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
            },
            medium: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 4,
            },
            large: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 8,
            },
        },
    };
};

// Configurações de fonte
export const font = {
    fontFamily: 'System',
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },
    fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
};

// Sombras
export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
};

// Espaçamentos
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

// Bordas
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 50,
};