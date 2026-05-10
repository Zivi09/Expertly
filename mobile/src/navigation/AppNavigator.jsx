import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/AppThemeContext';
import { ExpertListScreen } from '../screens/ExpertListScreen';
import { ExpertDetailScreen } from '../screens/ExpertDetailScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navigationFonts =
  Platform.select({
    web: {
      regular: {
        fontFamily:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontWeight: '400',
      },
      medium: {
        fontFamily:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontWeight: '500',
      },
      bold: {
        fontFamily:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontWeight: '600',
      },
      heavy: {
        fontFamily:
          'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontWeight: '700',
      },
    },
    ios: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '600' },
      heavy: { fontFamily: 'System', fontWeight: '700' },
    },
    default: {
      regular: { fontFamily: 'sans-serif', fontWeight: 'normal' },
      medium: { fontFamily: 'sans-serif-medium', fontWeight: 'normal' },
      bold: { fontFamily: 'sans-serif', fontWeight: '600' },
      heavy: { fontFamily: 'sans-serif', fontWeight: '700' },
    },
  }) ?? {
    regular: { fontFamily: 'sans-serif', fontWeight: 'normal' },
    medium: { fontFamily: 'sans-serif-medium', fontWeight: 'normal' },
    bold: { fontFamily: 'sans-serif', fontWeight: '600' },
    heavy: { fontFamily: 'sans-serif', fontWeight: '700' },
  };

const baseTheme = DefaultTheme ?? { dark: false, colors: {}, fonts: navigationFonts };
const mergedFonts =
  baseTheme.fonts && baseTheme.fonts.regular ? baseTheme.fonts : navigationFonts;

function ExpertStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpertList" component={ExpertListScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="ExpertDetail" component={ExpertDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  const navTheme = useMemo(
    () => ({
      ...baseTheme,
      dark: isDark,
      fonts: mergedFonts,
      colors: {
        ...(baseTheme.colors ?? {}),
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.secondary,
      },
    }),
    [colors, isDark]
  );

  const tabBarHeight = 52 + Math.max(insets.bottom, 12);

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            borderTopWidth: StyleSheet.hairlineWidth,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 12),
            height: tabBarHeight,
          },
          tabBarLabelStyle: { fontWeight: '700', fontSize: 12 },
          tabBarIcon: ({ color, size }) => {
            const name = route.name === 'Experts' ? 'people' : 'calendar';
            return <Ionicons name={name} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Experts" component={ExpertStack} options={{ title: 'Experts' }} />
        <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Bookings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
