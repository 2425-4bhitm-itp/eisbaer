package at.htlleonding.boundary;

import at.htlleonding.control.ArtikelRepository;
import at.htlleonding.entity.Artikel;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
public class ArticleResourceTest {

    @Inject
    ArtikelRepository artikelRepository;

    @BeforeEach
    @Transactional
    void setup() {
        artikelRepository.deleteAll();
        artikelRepository.persist(new Artikel("Schraube M8x20", "", 20.0, 8.0, 5.0, 0.0, "Lager A", "50", "Stück", "Regal 3"));
        artikelRepository.persist(new Artikel("Mutter M8", "", 10.0, 10.0, 5.0, 0.0, "Lager B", "30", "Stück", "Regal 1"));
    }

    @Test
    void testGetArticle() {
        given()
                .contentType(ContentType.TEXT)
                .body("M8")
                .when()
                .post("/Articles/getArticle")
                .then()
                .statusCode(200)
                .body("$.size()", greaterThan(0))
                .body("[0].bezeichnung1", containsStringIgnoringCase("M8"));
    }

//    @Test
//    @Transactional
//    void testAddArticle() {
//        Artikel artikel = new Artikel("Nagel", "Stahl 50mm", 50.0, 5.0, 5.0, 0.0, "Lager C", "100", "Stück", "Regal 2");
//
//        given()
//                .contentType("Application/JSON")
//                .body(artikel)
//                .when()
//                .post("/Articles/addArticle")
//                .then()
//                .statusCode(200);
//
//        List<Artikel> result = artikelRepository.search("Nagel");
//        assert result.size() == 1;
//        assert result.get(0).getBezeichnung1().equals("Nagel");
//    }
}
