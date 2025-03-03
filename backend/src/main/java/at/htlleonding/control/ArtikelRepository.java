package at.htlleonding.control;

import at.htlleonding.entity.Artikel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.de.GermanAnalyzer;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import java.util.List;

@ApplicationScoped
public class ArtikelRepository implements PanacheRepository<Artikel>{

    public List<Artikel> search(String searchTerm) {
        String likePattern = "%" + searchTerm + "%";
        return find("CONCAT(FKArtikelid, '') LIKE ?1 OR " +
                        "Bezeichnung1 LIKE ?1 OR " +
                        "Bezeichnung2 LIKE ?1 OR " +
                        "CONCAT(Laenge, '') LIKE ?1 OR " +
                        "CONCAT(Breite, '') LIKE ?1 OR " +
                        "CONCAT(Hoehe, '') LIKE ?1 OR " +
                        "CONCAT(Durchmesser, '') LIKE ?1 OR " +
                        "Lagerort LIKE ?1 OR " +
                        "CONCAT(Lagerstand, '') LIKE ?1 OR " +
                        "LagereinheitBez LIKE ?1 OR " +
                        "Stellplatz LIKE ?1",
                likePattern).list();
    }

    public static List<String> extractTokens(String text) {
        List<String> tokens = new ArrayList<>();
        try (Analyzer analyzer = new GermanAnalyzer()) {
            TokenStream tokenStream = analyzer.tokenStream(null, new StringReader(text));
            tokenStream.reset();
            while (tokenStream.incrementToken()) {
                String token = tokenStream.getAttribute(CharTermAttribute.class).toString();
                tokens.add(token);
            }
            tokenStream.end();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return tokens;
    }
}
