package at.htlleonding.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
@Entity
public class Artikel {
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

    public long getFKArtikelid() {
        return FKArtikelid;
    }

    public String getBezeichnung1() {
        return Bezeichnung1;
    }

    public String getBezeichnung2() {
        return Bezeichnung2;
    }

    public double getLaenge() {
        return Laenge;
    }

    public double getBreite() {
        return Breite;
    }

    public double getHoehe() {
        return Hoehe;
    }

    public double getDurchmesser() {
        return Durchmesser;
    }

    public String getLagerort() {
        return Lagerort;
    }

    public String getLagerstand() {
        return Lagerstand;
    }

    public String getLagereinheitBez() {
        return LagereinheitBez;
    }

    public String getStellplatz() {
        return Stellplatz;
    }

    public Artikel(long FKArtikelid, String Bezeichnung1, String Bezeichnung2, double Laenge, double Breite, double Hoehe, double Druchmesser, String Lagerort, String Lagerstand, String LagereinheitBez, String Stellplatz) {
        this.FKArtikelid = FKArtikelid;
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

    public Artikel() {

    }
}