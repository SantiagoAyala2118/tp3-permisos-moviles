import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tema from '@/lib/tema';

type PropsIconoTab = {
  nombre: ComponentProps<typeof Ionicons>['name'];
  enfocado: boolean;
};

/** Ícono de la barra flotante: un círculo que se "enciende" en esmeralda cuando está activo. */
function IconoTab({ nombre, enfocado }: PropsIconoTab) {
  return (
    <View style={[estilos.circuloIcono, enfocado && estilos.circuloActivo]}>
      <Ionicons
        name={nombre}
        size={22}
        color={enfocado ? tema.colores.sobrePrimario : tema.colores.textoSuave}
      />
    </View>
  );
}

/** Acceso a /ajustes-app desde el encabezado de "Reportes". */
function BotonAjustesApp() {
  return (
    <Link href="/ajustes-app" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ajustes de la app"
        hitSlop={tema.espaciado.s}
        style={estilos.botonAjustes}>
        <Ionicons name="settings-outline" size={20} color={tema.colores.texto} />
      </Pressable>
    </Link>
  );
}

/** Tabs: "Reportes" (/), "Avisos" (/avisos) y "Permisos" (/permisos), en una barra flotante. */
export default function LayoutTabs() {
  const margenes = useSafeAreaInsets();

  return (
    <Tabs
      // La barra flota y ya se separa del borde con `bottom`: sin este ajuste, react-navigation
      // le suma por dentro el margen del sistema y los íconos quedan corridos hacia arriba.
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { color: tema.colores.texto, fontWeight: '700', fontSize: 20 },
        headerStyle: { backgroundColor: tema.colores.fondo },
        sceneStyle: { backgroundColor: tema.colores.fondo },
        tabBarShowLabel: false,
        tabBarStyle: [estilos.barra, { bottom: Math.max(margenes.bottom, tema.espaciado.m) }],
        tabBarItemStyle: estilos.itemBarra,
        tabBarIconStyle: estilos.contenedorIcono,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reportes',
          tabBarAccessibilityLabel: 'Reportes',
          tabBarIcon: ({ focused }) => <IconoTab nombre="construct-outline" enfocado={focused} />,
          headerRight: () => <BotonAjustesApp />,
        }}
      />
      <Tabs.Screen
        name="avisos"
        options={{
          title: 'Avisos',
          tabBarAccessibilityLabel: 'Avisos',
          tabBarIcon: ({ focused }) => (
            <IconoTab nombre="notifications-outline" enfocado={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="permisos"
        options={{
          title: 'Permisos',
          tabBarAccessibilityLabel: 'Permisos',
          tabBarIcon: ({ focused }) => (
            <IconoTab nombre="shield-checkmark-outline" enfocado={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  barra: {
    position: 'absolute',
    marginHorizontal: tema.espaciado.xl * 2,
    height: 68,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: tema.radio.pildora,
    borderTopWidth: 1,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    borderTopColor: tema.colores.borde,
    backgroundColor: tema.colores.superficie,
    shadowColor: tema.colores.sombra,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  itemBarra: {
    height: 66,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenedorIcono: {
    width: 46,
    height: 46,
  },
  circuloIcono: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.superficieElevada,
  },
  circuloActivo: {
    backgroundColor: tema.colores.primario,
  },
  botonAjustes: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: tema.espaciado.m,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.superficie,
    borderWidth: 1,
    borderColor: tema.colores.borde,
  },
});
