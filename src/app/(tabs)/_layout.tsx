import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import { Pressable, type ColorValue } from 'react-native';

import tema from '@/lib/tema';

type PropsIconoTab = {
  nombre: ComponentProps<typeof Ionicons>['name'];
  color: ColorValue;
  size: number;
};

function IconoTab({ nombre, color, size }: PropsIconoTab) {
  return <Ionicons name={nombre} color={color} size={size} />;
}

/** Acceso a /ajustes-app desde el encabezado de "Reportes". */
function BotonAjustesApp() {
  return (
    <Link href="/ajustes-app" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ajustes de la app"
        hitSlop={tema.espaciado.s}
        style={{ paddingHorizontal: tema.espaciado.m }}>
        <Ionicons name="settings-outline" size={22} color={tema.colores.primario} />
      </Pressable>
    </Link>
  );
}

/** Tabs: "Reportes" (/), "Avisos" (/avisos) y "Permisos" (/permisos). */
export default function LayoutTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tema.colores.primario,
        tabBarInactiveTintColor: tema.colores.textoSuave,
        headerTitleStyle: { color: tema.colores.texto },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reportes',
          tabBarIcon: (props) => <IconoTab nombre="construct-outline" {...props} />,
          headerRight: () => <BotonAjustesApp />,
        }}
      />
      <Tabs.Screen
        name="avisos"
        options={{
          title: 'Avisos',
          tabBarIcon: (props) => <IconoTab nombre="notifications-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="permisos"
        options={{
          title: 'Permisos',
          tabBarIcon: (props) => <IconoTab nombre="shield-checkmark-outline" {...props} />,
        }}
      />
    </Tabs>
  );
}
