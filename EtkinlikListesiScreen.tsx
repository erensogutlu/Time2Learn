import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	FlatList,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./App";
import { Etkinlik, EtkinlikTipi, Filtreler } from "./types";
import EtkinlikKarti from "./EtkinlikKarti";
import { Picker } from "@react-native-picker/picker";
import ornekEtkinlikler from "./ornekEtkinlikler";

type Props = {
	navigation: StackNavigationProp<RootStackParamList, "EtkinlikListesi">;
};

const EtkinlikListesiScreen: React.FC<Props> = ({ navigation }) => {
	const [etkinlikler, setEtkinlikler] = useState<Etkinlik[]>([]);
	const [filtrelenmisEtkinlikler, setFiltrelenmisEtkinlikler] = useState<
		Etkinlik[]
	>([]);
	const [filtreler, setFiltreler] = useState<Filtreler>({ aramaMetni: "" });
	const [yukleniyor, setYukleniyor] = useState(true);

	useEffect(() => {
		const yukleEtkinlikler = async () => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setEtkinlikler(ornekEtkinlikler);
				setFiltrelenmisEtkinlikler(ornekEtkinlikler);
			} catch (error) {
				console.error("Etkinlikler yüklenirken hata:", error);
			} finally {
				setYukleniyor(false);
			}
		};

		yukleEtkinlikler();
	}, []);

	useEffect(() => {
		const filtreleEtkinlikler = () => {
			let sonuc = [...etkinlikler];

			if (filtreler.aramaMetni) {
				sonuc = sonuc.filter(
					(etkinlik) =>
						etkinlik.ad
							.toLowerCase()
							.includes(filtreler.aramaMetni.toLowerCase()) ||
						etkinlik.egitmen
							.toLowerCase()
							.includes(filtreler.aramaMetni.toLowerCase())
				);
			}

			if (filtreler.tip) {
				sonuc = sonuc.filter((etkinlik) => etkinlik.tip === filtreler.tip);
			}

			setFiltrelenmisEtkinlikler(sonuc);
		};

		filtreleEtkinlikler();
	}, [filtreler, etkinlikler]);

	if (yukleniyor) {
		return (
			<View style={styles.yukleniyorContainer}>
				<ActivityIndicator size="large" color="#4CAF50" />
				<Text style={styles.yukleniyorText}>Etkinlikler yükleniyor...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.filtrelerContainer}>
				<TextInput
					style={styles.aramaInput}
					placeholder="Etkinlik veya eğitmen ara..."
					placeholderTextColor="#999"
					value={filtreler.aramaMetni}
					onChangeText={(text) =>
						setFiltreler({ ...filtreler, aramaMetni: text })
					}
				/>

				<Picker
					selectedValue={filtreler.tip}
					style={styles.picker}
					dropdownIconColor="#4CAF50"
					onValueChange={(itemValue) =>
						setFiltreler({ ...filtreler, tip: itemValue })
					}
				>
					<Picker.Item label="Tüm Etkinlik Tipleri" value={undefined} />
					<Picker.Item label="Yüz Yüze" value="Yüz Yüze" />
					<Picker.Item label="Hibrit" value="Hibrit" />
					<Picker.Item label="Online" value="Online" />
				</Picker>
			</View>

			<FlatList
				data={filtrelenmisEtkinlikler}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContainer}
				renderItem={({ item }) => (
					<EtkinlikKarti
						etkinlik={item}
						onPress={() =>
							navigation.navigate("EtkinlikDetay", { etkinlik: item })
						}
					/>
				)}
				ListEmptyComponent={
					<View style={styles.bosListe}>
						<Text style={styles.bosListeText}>
							Filtreleme kriterlerinize uygun etkinlik bulunamadı.
						</Text>
					</View>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		paddingHorizontal: 15,
		paddingTop: 15,
	},
	yukleniyorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
	},
	yukleniyorText: {
		marginTop: 10,
		color: "#555",
	},
	filtrelerContainer: {
		marginBottom: 15,
	},
	aramaInput: {
		height: 45,
		backgroundColor: "#fff",
		borderRadius: 8,
		paddingHorizontal: 15,
		fontSize: 16,
		color: "#333",
		marginBottom: 12,
		elevation: 2,
	},
	picker: {
		backgroundColor: "#fff",
		borderRadius: 8,
		marginBottom: 12,
		elevation: 2,
	},
	listContainer: {
		paddingBottom: 20,
	},
	bosListe: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 30,
	},
	bosListeText: {
		color: "#666",
		fontSize: 16,
		textAlign: "center",
	},
});

export default EtkinlikListesiScreen;
