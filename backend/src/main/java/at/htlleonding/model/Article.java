package at.htlleonding.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long FKArtikelid;

    private String Bezeichnung1;
    private String Bezeichnung2;
    private double Laenge;
    private double Breite;
    private double Hoehe;
    private double Durchmesser;
    private String Lagerort;
    private String Lagerstand;
    private String LagereinheitBez;
    private String Stellplatz;

    public Article(String Bezeichnung1, String Bezeichnung2, double Laenge, double Breite, double Hoehe, double Druchmesser, String Lagerort, String Lagerstand, String LagereinheitBez, String Stellplatz) {
        this.Bezeichnung1 = Bezeichnung1;
        this.Bezeichnung2 = Bezeichnung2;
        this.Laenge = Laenge;
        this.Breite = Breite;
        this.Hoehe = Hoehe;
        this.Durchmesser = Druchmesser;
        this.Lagerort = Lagerort;
        this.Lagerstand = Lagerstand;
        this.LagereinheitBez = LagereinheitBez;
        this.Stellplatz = Stellplatz;
    }
}
