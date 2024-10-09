package at.htlleonding;

import at.htlleonding.model.Article;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/Articles")
public class ArticleRessource {
    @Inject
    ArticleRepository articleRepository;

    @GET
    @Path("/getPost/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Article getPost(@PathParam("id") Long id) {
        return articleRepository.findById(id);
    }
}
