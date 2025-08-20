import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import EtkinlikListesiScreen from "./EtkinlikListesiScreen";
import EtkinlikDetayScreen from "./EtkinlikDetayScreen";
import { Etkinlik } from "./types";

SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
	EtkinlikListesi: undefined;
	EtkinlikDetay: { etkinlik: Etkinlik };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	useEffect(() => {
		const hideSplash = async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000)); // 1 saniye göster
			await SplashScreen.hideAsync();
		};

		hideSplash();
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="EtkinlikListesi">
				<Stack.Screen
					name="EtkinlikListesi"
					component={EtkinlikListesiScreen}
					options={{ title: "Time2Learn - Etkinlikler" }}
				/>
				<Stack.Screen
					name="EtkinlikDetay"
					component={EtkinlikDetayScreen}
					options={{ title: "Etkinlik Detayı" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
