package at.htlleonding.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ArtikelTest {

    @Test
    void givenArtikel_whenCreated_thenFieldsAreSetCorrectly() {
        Artikel artikel = new Artikel("Schraube", "M8x20", 20.0, 8.0, 5.0, 0.0, "Lager A", "50", "Stück", "Regal 3");

        assertEquals(1L, artikel.getFKArtikelid());
        assertEquals("Schraube", artikel.getBezeichnung1());
        assertEquals("M8x20", artikel.getBezeichnung2());
        assertEquals(20.0, artikel.getLaenge());
        assertEquals(8.0, artikel.getBreite());
        assertEquals(5.0, artikel.getHoehe());
        assertEquals(0.0, artikel.getDurchmesser());
        assertEquals("Lager A", artikel.getLagerort());
        assertEquals("50", artikel.getLagerstand());
        assertEquals("Stück", artikel.getLagereinheitBez());
        assertEquals("Regal 3", artikel.getStellplatz());
    }

    @Test
    void givenArtikel_whenDefaultConstructorCalled_thenObjectIsNotNull() {
        Artikel artikel = new Artikel();
        assertNotNull(artikel);
    }

    @Test
    void givenArtikel_whenToStringCalled_thenReturnsCorrectString() {
        Artikel artikel = new Artikel("Schraube", "M8x20", 20.0, 8.0, 5.0, 0.0, "Lager A", "50", "Stück", "Regal 3");
        String expectedString = "Artikel{Bezeichnung1='Schraube', FKArtikelid=1}";
        assertEquals(expectedString, artikel.toString());
    }
}
