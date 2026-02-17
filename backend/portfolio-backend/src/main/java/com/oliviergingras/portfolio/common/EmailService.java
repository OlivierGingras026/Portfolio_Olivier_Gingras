package com.oliviergingras.portfolio.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

/**
 * Service to send emails via Gmail SMTP
 */
@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${app.email.from}")
    private String fromEmail;
    
    @Value("${app.email.to}")
    private String toEmail;
    
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    /**
     * Sends a contact message email with HTML formatting
     * 
     * @param senderName Name of the person sending the message
     * @param senderEmail Email of the person sending the message
     * @param message The message content
     */
    public void sendContactMessage(String senderName, String senderEmail, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("New Contact Message from " + senderName);
            helper.setText(buildHtmlEmail(senderName, senderEmail, message), true);
            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
    
    /**
     * Builds an HTML email template
     */
    private String buildHtmlEmail(String senderName, String senderEmail, String message) {
        // Escape HTML special characters for safety
        String escapedName = escapeHtml(senderName);
        String escapedEmail = escapeHtml(senderEmail);
        String escapedMessage = escapeHtml(message).replace("\n", "<br/>");
        
        return "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
            "    <style>\n" +
            "        * { margin: 0; padding: 0; box-sizing: border-box; }\n" +
            "        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #f5f7fa; }\n" +
            "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n" +
            "        .wrapper { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; }\n" +
            "        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }\n" +
            "        .header h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; color: white; }\n" +
            "        .header p { margin-top: 8px; font-size: 14px; opacity: 0.95; color: white; }\n" +
            "        .content { padding: 40px 30px; }\n" +
            "        .field { margin-bottom: 25px; }\n" +
            "        .field-label { display: block; color: #667eea; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }\n" +
            "        .field-value { font-size: 15px; color: #2c3e50; background: #f8f9fb; padding: 12px 14px; border-radius: 4px; border-left: 3px solid #667eea; }\n" +
            "        .field-value a { color: #667eea; text-decoration: none; }\n" +
            "        .field-value a:hover { text-decoration: underline; }\n" +
            "        .message-field { margin-bottom: 30px; }\n" +
            "        .message-label { display: block; color: #667eea; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }\n" +
            "        .message-value { font-size: 14px; color: #2c3e50; line-height: 1.8; background: #f8f9fb; padding: 16px; border-radius: 4px; border-left: 3px solid #667eea; white-space: pre-wrap; word-wrap: break-word; }\n" +
            "        .button-container { text-align: center; padding-top: 15px; }\n" +
            "        .button { display: inline-block !important; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; color: white !important; padding: 12px 32px; text-decoration: none !important; border-radius: 4px; font-weight: 600; font-size: 14px; transition: transform 0.2s, box-shadow 0.2s; }\n" +
            "        .button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }\n" +
            "        .footer { background: #f8f9fb; padding: 20px 30px; border-top: 1px solid #e8ecf1; text-align: center; color: #999; font-size: 12px; line-height: 1.6; }\n" +
            "    </style>\n" +
            "</head>\n" +
            "<body>\n" +
            "    <div class=\"container\">\n" +
            "        <div class=\"wrapper\">\n" +
            "            <div class=\"header\">\n" +
            "                <h1>New Contact Message</h1>\n" +
            "                <p>From your portfolio website</p>\n" +
            "            </div>\n" +
            "            <div class=\"content\">\n" +
            "                <div class=\"field\">\n" +
            "                    <span class=\"field-label\">Sender Name</span>\n" +
            "                    <div class=\"field-value\">" + escapedName + "</div>\n" +
            "                </div>\n" +
            "                <div class=\"field\">\n" +
            "                    <span class=\"field-label\">Email Address</span>\n" +
            "                    <div class=\"field-value\"><a href=\"mailto:" + escapedEmail + "\">" + escapedEmail + "</a></div>\n" +
            "                </div>\n" +
            "                <div class=\"message-field\">\n" +
            "                    <span class=\"message-label\">Message</span>\n" +
            "                    <div class=\"message-value\">" + escapedMessage + "</div>\n" +
            "                </div>\n" +
            "                <div class=\"button-container\">\n" +
            "                    <a href=\"mailto:" + escapedEmail + "?subject=Re: Contact Message\" class=\"button\" style=\"color: white !important; text-decoration: none !important;\">Reply to Sender</a>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            <div class=\"footer\">\n" +
            "                <p>This message was sent from your portfolio contact form.</p>\n" +
            "                <p>Click 'Reply to Sender' above to respond directly.</p>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>";
    }
    
    /**
     * Escapes HTML special characters for safety
     */
    private String escapeHtml(String text) {
        if (text == null) return "";
        return text
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#39;");
    }
}
