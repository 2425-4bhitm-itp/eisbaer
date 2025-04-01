package at.htlleonding.boundary;

import at.htlleonding.control.ArtikelRepository;
import at.htlleonding.entity.Artikel;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Path("/Articles")
public class ArticleResource {

    @Inject
    ArtikelRepository artikelRepository;

    private static int MAXIMUM_ARTIKEL_RETURN_COUNT = 5;

    @POST
    @Path("/getArticle")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getArticle(String searchString) {
        List<Artikel> artikelList = artikelRepository.search(searchString);
        artikelList = artikelList.subList(0, Math.min(artikelList.size(), MAXIMUM_ARTIKEL_RETURN_COUNT));
        return Response.ok(artikelList).build();
    }

    @POST
    @Path("/addArticle")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addArticle(Artikel artikel) {
        System.out.println("adding article: " + artikel);
        artikelRepository.persist(artikel);
        return Response.ok().build();
    }
}
