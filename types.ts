export type EtkinlikTipi = "Yüz Yüze" | "Hibrit" | "Online";

export interface Etkinlik {
	id: string;
	ad: string;
	baslangicTarihi: Date;
	bitisTarihi: Date;
	tip: EtkinlikTipi;
	aciklama: string;
	egitmen: string;
	konum?: string;
	onlineLink?: string;
	kontenjan?: number;
	ucret?: number;
	telefon?: string;
}

export interface Filtreler {
	aramaMetni: string;
	baslangicTarihi?: Date;
	bitisTarihi?: Date;
	tip?: EtkinlikTipi;
}
