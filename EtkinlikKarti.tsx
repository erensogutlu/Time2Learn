import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Etkinlik } from "./types";

interface Props {
	etkinlik: Etkinlik;
	onPress: () => void;
}

const EtkinlikKarti: React.FC<Props> = ({ etkinlik, onPress }) => {
	const tarihFormatla = (date: Date) => {
		return new Date(date).toLocaleDateString("tr-TR", {
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const tipRenkleri = {
		"Yüz Yüze": "#4CAF50",
		Hibrit: "#FFC107",
		Online: "#2196F3",
	};

	return (
		<TouchableOpacity onPress={onPress} style={styles.kart}>
			<View
				style={[
					styles.tipIndicator,
					{ backgroundColor: tipRenkleri[etkinlik.tip] },
				]}
			/>

			<View style={styles.kartIcerik}>
				<Text style={styles.baslik}>{etkinlik.ad}</Text>
				<Text style={styles.egitmen}>{etkinlik.egitmen}</Text>

				<View style={styles.tarihContainer}>
					<Text style={styles.tarih}>
						{tarihFormatla(etkinlik.baslangicTarihi)}
					</Text>
					<Text style={styles.tarih}>
						{tarihFormatla(etkinlik.bitisTarihi)}
					</Text>
				</View>

				<View style={styles.bilgiContainer}>
					<Text style={[styles.tip, { color: tipRenkleri[etkinlik.tip] }]}>
						{etkinlik.tip}
					</Text>
					{etkinlik.kontenjan && (
						<Text style={styles.kontenjan}>{etkinlik.kontenjan} kişilik</Text>
					)}
					{etkinlik.ucret && (
						<Text style={styles.ucret}>{etkinlik.ucret} TL</Text>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	kart: {
		backgroundColor: "#fff",
		borderRadius: 8,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
		flexDirection: "row",
	},
	tipIndicator: {
		width: 5,
		borderTopLeftRadius: 8,
		borderBottomLeftRadius: 8,
	},
	kartIcerik: {
		flex: 1,
		padding: 15,
	},
	baslik: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	egitmen: {
		fontSize: 14,
		color: "#666",
		marginBottom: 10,
	},
	tarihContainer: {
		marginBottom: 10,
	},
	tarih: {
		fontSize: 13,
		color: "#555",
	},
	bilgiContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	tip: {
		fontWeight: "bold",
	},
	kontenjan: {
		color: "#666",
	},
	ucret: {
		fontWeight: "bold",
		color: "#E91E63",
	},
});

export default EtkinlikKarti;
