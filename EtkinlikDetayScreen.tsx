import React from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Linking,
	TouchableOpacity,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./App";
import { Etkinlik } from "./types";
import * as Calendar from "expo-calendar";
import * as Sharing from "expo-sharing";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

type Props = {
	navigation: StackNavigationProp<RootStackParamList, "EtkinlikDetay">;
	route: { params: { etkinlik: Etkinlik } };
};

const EtkinlikDetayScreen: React.FC<Props> = ({ route }) => {
	const { etkinlik } = route.params;

	const tarihFormatla = (date: Date) => {
		return new Date(date).toLocaleDateString("tr-TR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const telefonAra = () => {
		if (etkinlik.telefon) {
			Linking.openURL(`tel:${etkinlik.telefon}`);
		}
	};

	const whatsappAc = () => {
		if (etkinlik.telefon) {
			Linking.openURL(`https://wa.me/${etkinlik.telefon}`);
		}
	};

	const haritadaAc = async () => {
		if (etkinlik.konum) {
			const location = await Location.geocodeAsync(etkinlik.konum);
			if (location.length > 0) {
				const { latitude, longitude } = location[0];
				Linking.openURL(
					`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
				);
			}
		}
	};

	const onlineLinkAc = () => {
		if (etkinlik.onlineLink) {
			Linking.openURL(etkinlik.onlineLink);
		}
	};

	const takvimeEkle = async () => {
		const { status } = await Calendar.requestCalendarPermissionsAsync();
		if (status === "granted") {
			const calendarId = await Calendar.getDefaultCalendarAsync();

			await Calendar.createEventAsync(calendarId.id, {
				title: etkinlik.ad,
				startDate: new Date(etkinlik.baslangicTarihi),
				endDate: new Date(etkinlik.bitisTarihi),
				location: etkinlik.konum,
				notes: etkinlik.aciklama,
			});
		}
	};

	const icsPaylas = async () => {
		const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${etkinlik.ad}
DTSTART:${new Date(etkinlik.baslangicTarihi)
			.toISOString()
			.replace(/[-:]/g, "")
			.replace(/\.\d{3}/, "")}
DTEND:${new Date(etkinlik.bitisTarihi)
			.toISOString()
			.replace(/[-:]/g, "")
			.replace(/\.\d{3}/, "")}
LOCATION:${etkinlik.konum || etkinlik.onlineLink || ""}
DESCRIPTION:${etkinlik.aciklama}
END:VEVENT
END:VCALENDAR`;

		const fileUri = `${FileSystem.cacheDirectory}${etkinlik.id}.ics`;
		await FileSystem.writeAsStringAsync(fileUri, icsContent);
		await Sharing.shareAsync(fileUri, {
			mimeType: "text/calendar",
			dialogTitle: "Takvime Ekle",
		});
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.baslik}>{etkinlik.ad}</Text>
				<Text style={styles.egitmen}>{etkinlik.egitmen}</Text>

				<View style={styles.tipContainer}>
					<Text
						style={[
							styles.tip,
							{
								backgroundColor:
									etkinlik.tip === "Yüz Yüze"
										? "#4CAF50"
										: etkinlik.tip === "Hibrit"
										? "#FFC107"
										: "#2196F3",
							},
						]}
					>
						{etkinlik.tip}
					</Text>
				</View>
			</View>

			<View style={styles.tarihContainer}>
				<View style={styles.tarihItem}>
					<Ionicons name="time-outline" size={20} color="#555" />
					<Text style={styles.tarihText}>
						{tarihFormatla(etkinlik.baslangicTarihi)}
					</Text>
				</View>
				<View style={styles.tarihItem}>
					<Ionicons name="time-outline" size={20} color="#555" />
					<Text style={styles.tarihText}>
						{tarihFormatla(etkinlik.bitisTarihi)}
					</Text>
				</View>
			</View>

			{etkinlik.konum && (
				<View style={styles.bilgiKutusu}>
					<Ionicons name="location-outline" size={20} color="#555" />
					<Text style={styles.bilgiText}>{etkinlik.konum}</Text>
				</View>
			)}

			{etkinlik.onlineLink && (
				<TouchableOpacity style={styles.bilgiKutusu} onPress={onlineLinkAc}>
					<Ionicons name="link-outline" size={20} color="#555" />
					<Text style={[styles.bilgiText, { color: "#2196F3" }]}>
						{etkinlik.onlineLink}
					</Text>
				</TouchableOpacity>
			)}

			<View style={styles.aciklamaContainer}>
				<Text style={styles.aciklama}>{etkinlik.aciklama}</Text>
			</View>

			<View style={styles.ekBilgiler}>
				{etkinlik.kontenjan && (
					<View style={styles.ekBilgiItem}>
						<Ionicons name="people-outline" size={20} color="#555" />
						<Text style={styles.ekBilgiText}>
							Kontenjan: {etkinlik.kontenjan}
						</Text>
					</View>
				)}
				{etkinlik.ucret && (
					<View style={styles.ekBilgiItem}>
						<Ionicons name="pricetag-outline" size={20} color="#555" />
						<Text style={styles.ekBilgiText}>Ücret: {etkinlik.ucret} TL</Text>
					</View>
				)}
			</View>

			<View style={styles.aksiyonlar}>
				{etkinlik.telefon && (
					<>
						<TouchableOpacity style={styles.aksiyonButton} onPress={telefonAra}>
							<Ionicons name="call-outline" size={24} color="#fff" />
							<Text style={styles.aksiyonText}>Ara</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.aksiyonButton} onPress={whatsappAc}>
							<Ionicons name="logo-whatsapp" size={24} color="#fff" />
							<Text style={styles.aksiyonText}>WhatsApp</Text>
						</TouchableOpacity>
					</>
				)}

				{etkinlik.konum && (
					<TouchableOpacity style={styles.aksiyonButton} onPress={haritadaAc}>
						<Ionicons name="map-outline" size={24} color="#fff" />
						<Text style={styles.aksiyonText}>Harita</Text>
					</TouchableOpacity>
				)}

				<TouchableOpacity style={styles.aksiyonButton} onPress={takvimeEkle}>
					<Ionicons name="calendar-outline" size={24} color="#fff" />
					<Text style={styles.aksiyonText}>Takvim</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.aksiyonButton} onPress={icsPaylas}>
					<Ionicons name="share-outline" size={24} color="#fff" />
					<Text style={styles.aksiyonText}>Paylaş</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	header: {
		marginBottom: 20,
	},
	baslik: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 5,
	},
	egitmen: {
		fontSize: 16,
		color: "#666",
		marginBottom: 10,
	},
	tipContainer: {
		alignSelf: "flex-start",
	},
	tip: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 15,
		color: "#fff",
		fontWeight: "bold",
		fontSize: 14,
	},
	tarihContainer: {
		marginBottom: 15,
	},
	tarihItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 5,
	},
	tarihText: {
		marginLeft: 10,
		fontSize: 15,
		color: "#555",
	},
	bilgiKutusu: {
		flexDirection: "row",
		alignItems: "center",
		padding: 15,
		backgroundColor: "#f5f5f5",
		borderRadius: 8,
		marginBottom: 15,
	},
	bilgiText: {
		marginLeft: 10,
		fontSize: 15,
		flex: 1,
	},
	aciklamaContainer: {
		marginBottom: 20,
	},
	aciklama: {
		fontSize: 16,
		lineHeight: 24,
		color: "#333",
	},
	ekBilgiler: {
		marginBottom: 20,
	},
	ekBilgiItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	ekBilgiText: {
		marginLeft: 10,
		fontSize: 15,
		color: "#555",
	},
	aksiyonlar: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginTop: 20,
	},
	aksiyonButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#4CAF50",
		paddingVertical: 12,
		paddingHorizontal: 15,
		borderRadius: 8,
		marginBottom: 10,
		minWidth: "48%",
	},
	aksiyonText: {
		color: "#fff",
		marginLeft: 8,
		fontWeight: "bold",
	},
});

export default EtkinlikDetayScreen;
