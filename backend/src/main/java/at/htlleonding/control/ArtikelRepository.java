package at.htlleonding.control;

import at.htlleonding.entity.Artikel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

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
}
