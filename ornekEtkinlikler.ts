import { Etkinlik } from "./types";

const ornekEtkinlikler: Etkinlik[] = [
	{
		id: "1",
		ad: "React Native Workshop",
		baslangicTarihi: new Date("2025-06-15T10:00:00"),
		bitisTarihi: new Date("2025-06-15T17:00:00"),
		tip: "Yüz Yüze",
		aciklama:
			"React Native ile mobil uygulama geliştirme workshopu. Temel kavramlar ve uygulamalı örnekler.",
		egitmen: "Ahmet Yılmaz",
		konum: "Time2Learn İstanbul Merkez",
		kontenjan: 20,
		ucret: 500,
		telefon: "+905551234567",
	},
	{
		id: "2",
		ad: "TypeScript Eğitimi",
		baslangicTarihi: new Date("2025-06-20T19:00:00"),
		bitisTarihi: new Date("2025-06-20T21:00:00"),
		tip: "Online",
		aciklama: "TypeScript temelleri ve ileri seviye kullanım örnekleri.",
		egitmen: "Mehmet Kaya",
		onlineLink: "https://zoom.us/j/123456789",
		telefon: "+905556789012",
	},
];

export default ornekEtkinlikler;
