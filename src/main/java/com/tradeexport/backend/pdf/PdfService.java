package com.tradeexport.backend.pdf;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class PdfService {

    private final TemplateEngine templateEngine;

    public byte[] generatePdf(String templateName, Map<String, Object> data) {
        // 1. Render HTML using Thymeleaf
        Context context = new Context();
        context.setVariables(data);
        String html = templateEngine.process(templateName, context);

        // 2. transform HTML string into PDF
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.withHtmlContent(html, null);
        builder.useFont(
                new File("src/main/resources/fonts/NanumGothic-Regular.ttf"),
                "NanumGothic"
        );
        builder.toStream(outputStream);
        try {
            builder.run();
        } catch (Exception e) {
            throw new RuntimeException("PDF 생성 실패", e);
        }

        return outputStream.toByteArray();
    }
}
