package com.altfinder.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiClient {

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Autowired
    private ObjectMapper objectMapper;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateAlternativeComparison(String softwareName) throws Exception {
        if (apiKey == null || apiKey.trim().isEmpty() || "placeholder".equalsIgnoreCase(apiKey)) {
            throw new IllegalStateException("GEMINI_API_KEY is not set or is invalid. Please set it in application.properties or environment variables.");
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        // Formulate prompt
        String prompt = "Find a free, open-source alternative for the commercial software: \"" + softwareName + "\".\n" +
                "Return the comparison in the following structured JSON schema:\n" +
                "{\n" +
                "  \"slug\": \"unique-url-friendly-slug-combining-names-e.g-commercial-vs-alternative\",\n" +
                "  \"commercialName\": \"exact name of commercial software (properly capitalized)\",\n" +
                "  \"alternativeName\": \"exact name of open-source alternative (properly capitalized)\",\n" +
                "  \"category\": \"category name (use one of: Design, DevTools, CRM, Productivity, Marketing, Finance, Security, Utilities)\",\n" +
                "  \"commercialDescription\": \"short 2-sentence description of the commercial software\",\n" +
                "  \"alternativeDescription\": \"short 2-sentence description of the open-source alternative\",\n" +
                "  \"featuresTableJson\": \"[ {\\\"feature\\\":\\\"Feature Name\\\",\\\"commercial\\\":\\\"Commercial Spec\\\",\\\"alternative\\\":\\\"Alternative Spec\\\",\\\"status\\\":\\\"alt-wins | comm-wins | neutral\\\"} ]\" (JSON string containing 4 side-by-side feature comparisons including pricing),\n" +
                "  \"prosJson\": \"[\\\"pro 1\\\",\\\"pro 2\\\",\\\"pro 3\\\",\\\"pro 4\\\"]\" (JSON array of 3-4 key advantages of switching to the open source tool),\n" +
                "  \"consJson\": \"[\\\"con 1\\\",\\\"con 2\\\",\\\"con 3\\\"]\" (JSON array of 2-3 trade-offs of the open source tool),\n" +
                "  \"whySwitchText\": \"Expert analysis paragraph detailing when to switch, the licensing differences, and key migration advice (around 80-120 words)\",\n" +
                "  \"commercialWebsite\": \"official url for commercial tool\",\n" +
                "  \"alternativeWebsite\": \"official homepage/repo url for open-source tool\",\n" +
                "  \"alternativeRepo\": \"github path in the format 'owner/repo' (e.g. 'gimp/gimp' or 'n8n-io/n8n') for repo details, or empty string if not hosted on GitHub\",\n" +
                "  \"commercialPriceNumeric\": 22.99 (average monthly pricing in USD for single user as a decimal number),\n" +
                "  \"commercialPricePeriod\": \"monthly\" (or \"yearly\"),\n" +
                "  \"seoTitle\": \"SEO optimized title tag (under 60 chars)\",\n" +
                "  \"seoDescription\": \"SEO optimized meta description (under 160 chars)\"\n" +
                "}\n" +
                "Important: Do not wrap the JSON inside markdown code blocks. Output only raw JSON text. Make sure all strings are correctly escaped.";

        // Build Payload
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", List.of(textPart));

        Map<String, Object> contents = new HashMap<>();
        contents.put("contents", List.of(parts));

        // Enforce JSON response type
        Map<String, Object> responseMimeTypeConfig = new HashMap<>();
        responseMimeTypeConfig.put("responseMimeType", "application/json");

        contents.put("generationConfig", responseMimeTypeConfig);

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(contents), headers);

        // Make API Call
        System.out.println("Calling Gemini API for tool: " + softwareName);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode textNode = rootNode.path("candidates").get(0)
                    .path("content").path("parts").get(0).path("text");
            
            return textNode.asText();
        } else {
            throw new RuntimeException("Gemini API call failed with status: " + response.getStatusCode());
        }
    }
}
