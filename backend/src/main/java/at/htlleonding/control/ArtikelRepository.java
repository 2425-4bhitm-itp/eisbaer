package at.htlleonding.control;

import at.htlleonding.entity.Artikel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import org.apache.lucene.analysis.*;
import org.apache.lucene.analysis.de.GermanAnalyzer;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;

import java.io.IOException;
import java.io.StringReader;
import java.util.*;

import java.util.List;

@ApplicationScoped
public class ArtikelRepository implements PanacheRepository<Artikel>{

    public static List<String> negativeKeywords = List.of("nicht", "keine", "keinem", "keinen", "keiner", "keines", "kein", "ohne");

    public List<Artikel> findByKeyword(String searchTerm) {
        String likePattern = "%" + searchTerm + "%";
        return find("CONCAT(FKArtikelid, '') LIKE ?1 OR " +
                        "Bezeichnung1 LIKE ?1 OR " +
                        "Bezeichnung2 LIKE ?1 OR " +
                        "CONCAT(Laenge, '') LIKE ?1 OR " +
                        "CONCAT(Breite, '') LIKE ?1 OR " +
                        "CONCAT(Hoehe, '') LIKE ?1 OR " +
                        "CONCAT(Durchmesser, '') LIKE ?1",
                likePattern).list();
    }

    public static List<String> extractTokens(String text) {
        List<String> tokens = new ArrayList<>();
        try (Analyzer analyzer = new GermanAnalyzer(createCustomSet())) {
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

    public List<Artikel> search(String searchString) {
        List<String> tokens = extractTokens(searchString);
        List<String> positiveKeywords = new ArrayList<>();
        List<String> negativeTokens = new ArrayList<>();
        boolean excludeNext = false;

        for (String token : tokens) {
            if (negativeKeywords.contains(token.toLowerCase())) {
                excludeNext = true;
            } else {
                if (excludeNext) {
                    negativeTokens.add(token);
                    excludeNext = false;
                } else {
                    positiveKeywords.add(token);
                }
            }
        }

        System.out.println("**********************tokens***************************+");
        System.out.println(tokens);
        System.out.println(positiveKeywords);
        System.out.println(negativeTokens);

        Set<Artikel> artikelSet = new LinkedHashSet<>();
        for (String token : positiveKeywords) {
            artikelSet.addAll(findByKeyword(token));
        }

        System.out.println(artikelSet);
        // remove articles that contain negative keyword
        artikelSet.removeIf(artikel -> negativeTokens.stream().anyMatch(
                neg -> (artikel.getBezeichnung1() != null && artikel.getBezeichnung1().toLowerCase().contains(neg))
                        || (artikel.getBezeichnung2() != null && artikel.getBezeichnung2().toLowerCase().contains(neg))
                        || String.valueOf(artikel.getFKArtikelid()).contains(neg)
        ));

        System.out.println(artikelSet);
        return new ArrayList<>(artikelSet);
    }

    private static CharArraySet createCustomSet() {
        CharArraySet CUSTOM_SET = new CharArraySet(150, true);

        CUSTOM_SET.add("denn");
        CUSTOM_SET.add("daß");
        CUSTOM_SET.add("muss");
        CUSTOM_SET.add("allem");
        CUSTOM_SET.add("allen");
        CUSTOM_SET.add("dem");
        CUSTOM_SET.add("den");
        CUSTOM_SET.add("aller");
        CUSTOM_SET.add("alles");
        CUSTOM_SET.add("der");
        CUSTOM_SET.add("des");
        CUSTOM_SET.add("über");
        CUSTOM_SET.add("ihnen");
        CUSTOM_SET.add("andere");
        CUSTOM_SET.add("meinem");
        CUSTOM_SET.add("durch");
        CUSTOM_SET.add("manchem");
        CUSTOM_SET.add("manchen");
        CUSTOM_SET.add("anderm");
        CUSTOM_SET.add("andern");
        CUSTOM_SET.add("meines");
        CUSTOM_SET.add("am");
        CUSTOM_SET.add("an");
        CUSTOM_SET.add("anderr");
        CUSTOM_SET.add("anders");
        CUSTOM_SET.add("doch");
        CUSTOM_SET.add("welches");
        CUSTOM_SET.add("jene");
        CUSTOM_SET.add("denselben");
        CUSTOM_SET.add("wollen");
        CUSTOM_SET.add("meinen");
        CUSTOM_SET.add("wirst");
        CUSTOM_SET.add("dasselbe");
        CUSTOM_SET.add("ein");
        CUSTOM_SET.add("hatte");
        CUSTOM_SET.add("sollte");
        CUSTOM_SET.add("seine");
        CUSTOM_SET.add("unter");
        CUSTOM_SET.add("mancher");
        CUSTOM_SET.add("mir");
        CUSTOM_SET.add("mit");
        CUSTOM_SET.add("so");
        CUSTOM_SET.add("während");
        CUSTOM_SET.add("anderem");
        CUSTOM_SET.add("anderen");
        CUSTOM_SET.add("meiner");
        CUSTOM_SET.add("dieselben");
        CUSTOM_SET.add("anderes");
        CUSTOM_SET.add("einen");
        CUSTOM_SET.add("einer");
        CUSTOM_SET.add("dazu");
        CUSTOM_SET.add("musste");
        CUSTOM_SET.add("jenem");
        CUSTOM_SET.add("jenen");
        CUSTOM_SET.add("da");
        CUSTOM_SET.add("derer");
        CUSTOM_SET.add("manches");
        CUSTOM_SET.add("jener");
        CUSTOM_SET.add("jenes");
        CUSTOM_SET.add("weil");
        CUSTOM_SET.add("desselben");
        CUSTOM_SET.add("wird");
        CUSTOM_SET.add("die");
        CUSTOM_SET.add("bei");
        CUSTOM_SET.add("hab");
        CUSTOM_SET.add("ist");
        CUSTOM_SET.add("sind");
        CUSTOM_SET.add("dir");
        CUSTOM_SET.add("deinem");
        CUSTOM_SET.add("deinen");
        CUSTOM_SET.add("du");
        CUSTOM_SET.add("zum");
        CUSTOM_SET.add("deiner");
        CUSTOM_SET.add("deines");
        CUSTOM_SET.add("zur");
        CUSTOM_SET.add("um");
        CUSTOM_SET.add("viel");
        CUSTOM_SET.add("hat");
        CUSTOM_SET.add("könnte");
        CUSTOM_SET.add("welche");
        CUSTOM_SET.add("unse");
        CUSTOM_SET.add("derselbe");
        CUSTOM_SET.add("er");
        CUSTOM_SET.add("es");
        CUSTOM_SET.add("das");
        CUSTOM_SET.add("gewesen");
        CUSTOM_SET.add("aber");
        CUSTOM_SET.add("auf");
        CUSTOM_SET.add("ich");
        CUSTOM_SET.add("habe");
        CUSTOM_SET.add("damit");
        CUSTOM_SET.add("mein");
        CUSTOM_SET.add("eines");
        CUSTOM_SET.add("aus");
        CUSTOM_SET.add("einigen");
        CUSTOM_SET.add("wieder");
        CUSTOM_SET.add("ander");
        CUSTOM_SET.add("indem");
        CUSTOM_SET.add("zwar");
        CUSTOM_SET.add("einiges");
        CUSTOM_SET.add("einmal");
        CUSTOM_SET.add("sie");
        CUSTOM_SET.add("diese");
        CUSTOM_SET.add("dann");
        CUSTOM_SET.add("vom");
        CUSTOM_SET.add("von");
        CUSTOM_SET.add("wo");
        CUSTOM_SET.add("vor");
        CUSTOM_SET.add("soll");
        CUSTOM_SET.add("sehr");
        CUSTOM_SET.add("eure");
        CUSTOM_SET.add("alle");
        CUSTOM_SET.add("werde");
        CUSTOM_SET.add("weiter");
        CUSTOM_SET.add("was");
        CUSTOM_SET.add("und");
        CUSTOM_SET.add("würde");
        CUSTOM_SET.add("jedem");
        CUSTOM_SET.add("jeden");
        CUSTOM_SET.add("oder");
        CUSTOM_SET.add("jeder");
        CUSTOM_SET.add("sein");
        CUSTOM_SET.add("uns");
        CUSTOM_SET.add("jede");
        CUSTOM_SET.add("demselben");
        CUSTOM_SET.add("mich");
        CUSTOM_SET.add("haben");
        CUSTOM_SET.add("manche");
        CUSTOM_SET.add("bin");
        CUSTOM_SET.add("dessen");
        CUSTOM_SET.add("bis");
        CUSTOM_SET.add("wenn");
        CUSTOM_SET.add("sondern");
        CUSTOM_SET.add("solche");
        CUSTOM_SET.add("euch");
        CUSTOM_SET.add("jedes");
        CUSTOM_SET.add("ihrem");
        CUSTOM_SET.add("ihren");
        CUSTOM_SET.add("ihrer");
        CUSTOM_SET.add("ihres");
        CUSTOM_SET.add("unsem");
        CUSTOM_SET.add("unsen");
        CUSTOM_SET.add("im");
        CUSTOM_SET.add("in");
        CUSTOM_SET.add("unser");
        CUSTOM_SET.add("unses");
        CUSTOM_SET.add("ihm");
        CUSTOM_SET.add("ihn");
        CUSTOM_SET.add("wollte");
        CUSTOM_SET.add("ihr");
        CUSTOM_SET.add("wir");
        CUSTOM_SET.add("anderer");
        CUSTOM_SET.add("sich");
        CUSTOM_SET.add("dort");
        CUSTOM_SET.add("würden");
        CUSTOM_SET.add("derselben");
        CUSTOM_SET.add("welcher");
        CUSTOM_SET.add("meine");
        CUSTOM_SET.add("warst");
        CUSTOM_SET.add("für");
        CUSTOM_SET.add("nach");
        CUSTOM_SET.add("weg");
        CUSTOM_SET.add("man");
        CUSTOM_SET.add("eine");
        CUSTOM_SET.add("euer");
        CUSTOM_SET.add("solchen");
        CUSTOM_SET.add("machen");
        CUSTOM_SET.add("solches");
        CUSTOM_SET.add("dein");
        CUSTOM_SET.add("hier");
        CUSTOM_SET.add("wie");
        CUSTOM_SET.add("sonst");
        CUSTOM_SET.add("hinter");
        CUSTOM_SET.add("zwischen");
        CUSTOM_SET.add("nun");
        CUSTOM_SET.add("nur");
        CUSTOM_SET.add("hin");
        CUSTOM_SET.add("einem");
        CUSTOM_SET.add("einigem");
        CUSTOM_SET.add("waren");
        CUSTOM_SET.add("ihre");
        CUSTOM_SET.add("jetzt");
        CUSTOM_SET.add("einiger");
        CUSTOM_SET.add("kann");
        CUSTOM_SET.add("auch");
        CUSTOM_SET.add("war");
        CUSTOM_SET.add("dieselbe");
        CUSTOM_SET.add("werden");
        CUSTOM_SET.add("einig");
        CUSTOM_SET.add("hatten");
        CUSTOM_SET.add("dieser");
        CUSTOM_SET.add("als");
        CUSTOM_SET.add("selbst");
        CUSTOM_SET.add("dich");
        CUSTOM_SET.add("einige");
        CUSTOM_SET.add("können");
        CUSTOM_SET.add("gegen");
        CUSTOM_SET.add("seinem");
        CUSTOM_SET.add("deine");
        CUSTOM_SET.add("solchem");
        CUSTOM_SET.add("also");
        CUSTOM_SET.add("solcher");
        CUSTOM_SET.add("zu");
        CUSTOM_SET.add("will");
        CUSTOM_SET.add("ob");
        CUSTOM_SET.add("welchem");
        CUSTOM_SET.add("welchen");
        CUSTOM_SET.add("etwas");
        CUSTOM_SET.add("diesem");
        CUSTOM_SET.add("diesen");
        CUSTOM_SET.add("seinen");
        CUSTOM_SET.add("dieses");
        CUSTOM_SET.add("seiner");
        CUSTOM_SET.add("seines");
        CUSTOM_SET.add("noch");
        CUSTOM_SET.add("eurem");
        CUSTOM_SET.add("euren");
        CUSTOM_SET.add("ins");
        CUSTOM_SET.add("eurer");
        CUSTOM_SET.add("eures");
        CUSTOM_SET.add("dies");
        CUSTOM_SET.add("bist");

        return CUSTOM_SET;
    }
}
