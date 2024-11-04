package at.htlleonding;

import at.htlleonding.model.Artikel;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Path("/Articles")
public class ArticleResource {

    private static int MAXIMUM_ARTIKEL_RETURN_COUNT = 50;

    @GET
    @Path("/getArticle/{searchString}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getArticle(@PathParam("searchString") String searchString) {
        try (Connection connection = DriverManager.getConnection("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE")) {
            // select all articles where any field contains search String
            String query = "SELECT * FROM ARTIKEL where Concat(FKArtikelid, ' ', Bezeichnung1, ' ', Bezeichnung2, ' ', Laenge, ' ', Breite, ' ', Hoehe, ' ', Durchmesser, ' ', Lagerort, ' ', Lagerstand, ' ', Lagereinheitbez, ' ', Stellplatz) like concat('%', ?, '%')";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, searchString);

            ResultSet resultSet = preparedStatement.executeQuery();

            int count = 0;
            List<Artikel> matchingArticles = new ArrayList<>();
            while (resultSet.next() && count <= MAXIMUM_ARTIKEL_RETURN_COUNT) {
                long FKArtikelId = resultSet.getLong("FKArtikelid");
                String Bezeichnung1 = resultSet.getString("Bezeichnung1");
                String Bezeichnung2 = resultSet.getString("Bezeichnung2");
                double Laenge = resultSet.getDouble("Laenge");
                double Breite = resultSet.getDouble("Breite");
                double Hoehe = resultSet.getDouble("Hoehe");
                double Durchmesser = resultSet.getDouble("Durchmesser");
                String Lagerort = resultSet.getString("Lagerort");
                String Lagerstand = resultSet.getString("Lagerstand");
                String Lagereinheitbez = resultSet.getString("Lagereinheitbez");
                String Stellplatz = resultSet.getString("Stellplatz");

                Artikel artikel = new Artikel(FKArtikelId, Bezeichnung1, Bezeichnung2, Laenge,
                        Breite, Hoehe, Durchmesser, Lagerort, Lagerstand, Lagereinheitbez, Stellplatz);
                matchingArticles.add(artikel);
            }

            return Response.ok(matchingArticles).build();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return Response.ok("no Article found").build();
    }
}
