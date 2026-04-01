import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class TestApi {
    public static void main(String[] args) throws Exception {
        String key = "AIzaSyAr5qymul6Mvsq6JmwF94ETcyohpidNBWA";
        String[] models = {"gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"};
        
        HttpClient client = HttpClient.newHttpClient();
        String body = "{\"contents\": [{\"parts\": [{\"text\": \"Hi\"}]}]}";
        
        for (String m : models) {
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/" + m + ":generateContent?key=" + key))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
                
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            System.out.println(m + " -> " + res.statusCode() + " | " + res.body().substring(0, Math.min(100, res.body().length())));
        }
    }
}
