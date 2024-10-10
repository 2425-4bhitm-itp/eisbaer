package at.htlleonding;

import at.htlleonding.model.Article;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/articles")
public class ArticleResource {
    @Inject
    ArticleRepository articleRepository;

    @GET
    @Path("/getPost/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPost(@PathParam("id") Long id) {
        Article article = articleRepository.findById(id);
        if (article == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(article).build();
    }
}
