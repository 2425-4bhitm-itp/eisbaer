package at.htlleonding.control;

import at.htlleonding.entity.Artikel;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

@QuarkusTest
class ArtikelRepositoryTest {

    @Inject
    ArtikelRepository artikelRepository;

    @BeforeEach
    @Transactional
    void setup() {
        artikelRepository.deleteAll();
        artikelRepository.getEntityManager().flush();
        artikelRepository.getEntityManager().clear();
        System.out.println(artikelRepository.count());
        artikelRepository.persist(new Artikel("Schraube M8x20", "", 20.0, 8.0, 5.0, 0.0, "Lager A", "50", "Stück", "Regal 3"));
        artikelRepository.persist(new Artikel("Mutter M8", "", 10.0, 10.0, 5.0, 0.0, "Lager B", "30", "Stück", "Regal 1"));
    }

    @Test
    void givenKeyword_whenFindByKeyword_thenReturnMatchingArticles() {
        // Given
        String keyword = "Schraube";

        // When
        List<Artikel> result = artikelRepository.findByKeyword(keyword);

        // Then
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Schraube M8x20", result.get(0).getBezeichnung1());
    }

    @Test
    void givenText_whenExtractTokens_thenReturnTokenList() {
        // Given
        String text = "Schraube M8x20 nicht groß";

        // When
        List<String> tokens = ArtikelRepository.extractTokens(text);

        System.out.println(tokens);
        // Then
        assertNotNull(tokens);
        assertTrue(tokens.contains("schraub"));
        assertTrue(tokens.contains("m8x20"));
        assertTrue(tokens.contains("gross"));
        assertTrue(tokens.contains("nicht"));
    }

    @Test
    void givenSearchString_whenSearch_thenReturnFilteredResults() {
        // Given
        String searchString = "M8 nicht Mutter";

        // When
        List<Artikel> result = artikelRepository.search(searchString);

        System.out.print(result);
        // Then
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Schraube M8x20", result.get(0).getBezeichnung1());
        assertFalse(result.stream().anyMatch(a -> a.getBezeichnung1().equals("Mutter"))); // Mutter sollte ausgeschlossen werden
    }
}
