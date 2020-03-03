package io.rtdi.hanawebapp.rest;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Configuration;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import io.rtdi.hanaappserver.utils.ErrorMessage;
import io.rtdi.hanaappserver.utils.HanaSQLException;
import io.rtdi.hanaappserver.utils.SessionHandler;
import io.rtdi.hanaappserver.utils.Util;

@Path("/")
public class ObjectDependencies {
	protected final Logger log = LogManager.getLogger(this.getClass().getName());

	@Context
    private Configuration configuration;

	@Context 
	private ServletContext servletContext;
	
	@Context 
	private HttpServletRequest request;

	/**
	 * Should generate a json object like
	 * series.data = [{
				  "name": "First",
				  "value": 1,
				  "link": ["Second"]
				}, {
				  "name": "Second",
				  "value": 1,
				  "link": ["Third"]
				}, {
				  "name": "Third",
				  "value": 1,
				  "link": ["First"]
				}];
	 * @param schema
	 * @param name
	 * @return
	 */
	@GET
	@Path("objectdependencies/{schema}/{name}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getObjectDependencies(@PathParam("schema") String schemaraw, @PathParam("name") String nameraw) {
		String schema = Util.decodeURIfull(schemaraw);
		String name = Util.decodeURIfull(nameraw);
		try (Connection conn = SessionHandler.handleSession(request, log);) {
			String sql = "SELECT distinct \r\n" +
					"   NODE_ID AS Node,\r\n" + 
					"   PARENT_ID AS Parent,\r\n" + 
					"   base_schema_name, base_object_name, base_object_type, \r\n" + 
					"   dependent_schema_name, dependent_object_name, dependent_object_type \r\n" +
					" FROM HIERARCHY (SOURCE ( \r\n" + 
					" 		SELECT \r\n" + 
					" 			base_schema_name||'.'||base_object_name as node_id, \r\n" + 
					" 			dependent_schema_name||'.'||dependent_object_name as parent_id, \r\n" + 
					" 			base_schema_name, base_object_name, base_object_type, \r\n" + 
					" 			dependent_schema_name, dependent_object_name, dependent_object_type \r\n" + 
					" 		FROM object_dependencies where dependency_type = 1 ORDER BY 1,2) \r\n" + 
					" 	START WHERE base_schema_name = ? and base_object_name = ?) \r\n" + 
					" order by node, parent";
			try (PreparedStatement stmt = conn.prepareStatement(sql);) {
				stmt.setString(1, schema);
				stmt.setString(2, name);
				Map<String, Node> nodes = new HashMap<>();
				try (ResultSet rs = stmt.executeQuery(); ) {
					while (rs.next()) {
						String nodeid = rs.getString(1);
						Node n = nodes.get(nodeid);
						if (n == null) {
							n = new Node(rs.getString(1), rs.getString(3), rs.getString(4), rs.getString(5));
							nodes.put(nodeid, n);
						}
						n.addLink(rs.getString(2), rs.getString(6), rs.getString(7), rs.getString(8), nodes);
					}
					return Response.ok(nodes.values()).build();
				}
			} catch (SQLException e) {
				throw new HanaSQLException(e, sql, "Executed SQL statement threw an error");
			}
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(new ErrorMessage(e)).build();
		}
	}


	public static class Node {

		private String schemaname;
		private String objectname;
		private String objecttype;
		private String nodeid;
		private Set<String> link;
		
		public Node(String nodeid, String schemaname, String objectname, String objecttype) {
			this.nodeid = nodeid;
			this.schemaname = schemaname;
			this.objectname = objectname;
			this.objecttype = objecttype;
		}

		public void addLink(String nodeid, String schemaname, String objectname, String objecttype, Map<String, Node> nodes) {
			if (!nodes.containsKey(nodeid)) {
				Node n = new Node(nodeid, schemaname, objectname, objecttype);
				nodes.put(nodeid, n);
			}
			if (link == null) {
				link = new HashSet<>();
			}
			link.add(nodeid);
		}

		public String getSchemaname() {
			return schemaname;
		}

		public String getObjectname() {
			return objectname;
		}

		public String getObjecttype() {
			return objecttype;
		}

		public String getNodeid() {
			return nodeid;
		}

		public Set<String> getLink() {
			return link;
		}

	}
}
