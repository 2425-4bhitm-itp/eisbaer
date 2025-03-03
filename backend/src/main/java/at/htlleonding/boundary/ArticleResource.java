package at.htlleonding.boundary;

import at.htlleonding.control.ArtikelRepository;
import at.htlleonding.entity.Artikel;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Path("/Articles")
public class ArticleResource {

    @Inject
    ArtikelRepository artikelRepository;

    private static int MAXIMUM_ARTIKEL_RETURN_COUNT = 50;

    @GET
    @Path("/getArticle/{searchString}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getArticle(@PathParam("searchString") String searchString) {
        List<Artikel> artikelList = artikelRepository.search(searchString);
        artikelList.subList(0, Math.min(artikelList.size(), MAXIMUM_ARTIKEL_RETURN_COUNT));
        return Response.ok(artikelList).build();
    }
}
