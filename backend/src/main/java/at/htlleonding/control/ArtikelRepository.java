package at.htlleonding.control;

import at.htlleonding.entity.Artikel;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ArtikelRepository implements PanacheRepository<Artikel>{

    public List<Artikel> search(String searchTerm) {
        String likePattern = "%" + searchTerm + "%";
        return find("FKArtikelid LIKE ?1 OR Bezeichnung1 LIKE ?1 OR Bezeichnung2 LIKE ?1 OR " +
                        "Laenge LIKE ?1 OR Breite LIKE ?1 OR Hoehe LIKE ?1 OR Durchmesser LIKE ?1 OR " +
                        "Lagerort LIKE ?1 OR Lagerstand LIKE ?1 OR Lagereinheitbez LIKE ?1 OR Stellplatz LIKE ?1",
                likePattern).list();
    }
}
