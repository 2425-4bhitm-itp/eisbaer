package at.htlleonding;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.sql.*;

@Path("/Articles")
public class ArticleResource {

    @GET
    @Path("/getArticle/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getArticle(@PathParam("id") Long id) {
        try (Connection connection = DriverManager.getConnection("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE")) {
            String query = "SELECT * FROM ARTIKEL where FKARTIKELID = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setLong(1, id);

            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getString("Stellplatz");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return "Article not found";
    }
}
