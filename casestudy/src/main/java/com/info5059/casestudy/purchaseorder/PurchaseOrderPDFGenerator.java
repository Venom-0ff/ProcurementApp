package com.info5059.casestudy.purchaseorder;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.vendor.Vendor;
import com.info5059.casestudy.vendor.VendorRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.net.URL;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * PurchaseOrderPDFGenerator - a class for creating a dynamic product
 * purchaseorder in
 * PDF
 * format using the iText 7 library
 */
public class PurchaseOrderPDFGenerator {
    public static ByteArrayInputStream generatePurchaseOrder(String poid,
            PurchaseOrderRepository purchaseorderRepository, VendorRepository vendorRepository,
            ProductRepository productRepository) throws IOException {

        URL imageUrl = PurchaseOrderPDFGenerator.class.getResource("/static/images/SK Logo Transparent.png");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);

            // Initialize PDF document to be written to a stream not a file
            PdfDocument pdf = new PdfDocument(writer);

            // Document is the main object
            Document document = new Document(pdf);

            PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            Locale locale = Locale.of("en", "US");
            NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);

            // add the logo to the document
            Image img = new Image(ImageDataFactory.create(imageUrl))
                    .scaleAbsolute(125, 125)
                    .setFixedPosition(50, 710);
            document.add(img);

            Optional<PurchaseOrder> optpo = purchaseorderRepository.findById(Long.parseLong(poid));
            if (optpo.isPresent()) {
                PurchaseOrder purchaseorder = optpo.get();

                // add a PO heading
                document.add(new Paragraph(String.format("Purchase Order"))
                        .setFont(font)
                        .setFontSize(24)
                        .setMarginRight(75)
                        .setTextAlignment(TextAlignment.RIGHT)
                        .setBold());

                // then a PO number
                document.add(new Paragraph("# " + poid)
                        .setFont(font)
                        .setFontSize(16)
                        .setBold()
                        .setMarginRight(150)
                        .setMarginTop(-10)
                        .setTextAlignment(TextAlignment.RIGHT));
                document.add(new Paragraph("\n\n"));

                // add the vendor info for the PO here
                Table vendorTable = new Table(2).setWidth(new UnitValue(UnitValue.PERCENT, 30))
                        .setHorizontalAlignment(HorizontalAlignment.LEFT);

                Cell cell = new Cell().add(new Paragraph("Vendor:")
                        .setFont(font)
                        .setFontSize(12)
                        .setBold())
                        .setBorder(Border.NO_BORDER)
                        .setTextAlignment(TextAlignment.CENTER);
                vendorTable.addCell(cell);

                Optional<Vendor> optv = vendorRepository.findById(purchaseorder.getVendorid());
                if (optv.isPresent()) {
                    Vendor vendor = optv.get();

                    cell = new Cell().add(new Paragraph(vendor.getName())
                            .setFont(font)
                            .setFontSize(12)
                            .setBold())
                            .setBorder(Border.NO_BORDER)
                            .setTextAlignment(TextAlignment.LEFT)
                            .setBackgroundColor(ColorConstants.LIGHT_GRAY);
                    vendorTable.addCell(cell);

                    cell = new Cell().setBorder(Border.NO_BORDER);
                    vendorTable.addCell(cell);

                    cell = new Cell().add(new Paragraph(vendor.getAddress1())
                            .setFont(font)
                            .setFontSize(12)
                            .setBold())
                            .setBorder(Border.NO_BORDER)
                            .setTextAlignment(TextAlignment.LEFT)
                            .setBackgroundColor(ColorConstants.LIGHT_GRAY);
                    vendorTable.addCell(cell);

                    cell = new Cell().setBorder(Border.NO_BORDER);
                    vendorTable.addCell(cell);

                    cell = new Cell().add(new Paragraph(vendor.getCity())
                            .setFont(font)
                            .setFontSize(12)
                            .setBold())
                            .setBorder(Border.NO_BORDER)
                            .setTextAlignment(TextAlignment.LEFT)
                            .setBackgroundColor(ColorConstants.LIGHT_GRAY);
                    vendorTable.addCell(cell);

                    cell = new Cell().setBorder(Border.NO_BORDER);
                    vendorTable.addCell(cell);

                    cell = new Cell().add(new Paragraph(vendor.getProvince())
                            .setFont(font)
                            .setFontSize(12)
                            .setBold())
                            .setBorder(Border.NO_BORDER)
                            .setTextAlignment(TextAlignment.LEFT)
                            .setBackgroundColor(ColorConstants.LIGHT_GRAY);
                    vendorTable.addCell(cell);

                    cell = new Cell().setBorder(Border.NO_BORDER);
                    vendorTable.addCell(cell);

                    cell = new Cell().add(new Paragraph(vendor.getEmail())
                            .setFont(font)
                            .setFontSize(12)
                            .setBold())
                            .setBorder(Border.NO_BORDER)
                            .setTextAlignment(TextAlignment.LEFT)
                            .setBackgroundColor(ColorConstants.LIGHT_GRAY);
                    vendorTable.addCell(cell);
                }

                document.add(vendorTable);
                document.add(new Paragraph("\n"));

                // now a 5-column PO-line-item table
                Table table = new Table(5);
                table.setWidth(new UnitValue(UnitValue.PERCENT, 100));

                // table headings
                cell = new Cell().add(new Paragraph("Product Code")
                        .setFont(font)
                        .setFontSize(12)
                        .setBold())
                        .setTextAlignment(TextAlignment.CENTER);
                table.addCell(cell);

                cell = new Cell().add(new Paragraph("Description")
                        .setFont(font)
                        .setFontSize(12)
                        .setBold())
                        .setTextAlignment(TextAlignment.CENTER);
                table.addCell(cell);

                cell = new Cell().add(new Paragraph("Qty")
                        .setFont(font)
                        .setFontSize(12)
                        .setBold())
                        .setTextAlignment(TextAlignment.CENTER);
                table.addCell(cell);

                cell = new Cell().add(new Paragraph("Price")
                        .setFont(font)
                        .setFontSize(12)
                        .setBold())
                        .setTextAlignment(TextAlignment.CENTER);
                table.addCell(cell);

                cell = new Cell().add(new Paragraph("Ext. Price")
                        .setFont(font)
                        .setFontSize(12)
                        .setBold())
                        .setTextAlignment(TextAlignment.CENTER);
                table.addCell(cell);

                BigDecimal sub = new BigDecimal(0.0);
                BigDecimal tax = new BigDecimal(0.0);
                BigDecimal tot = new BigDecimal(0.0);

                // dump out the line items
                for (PurchaseOrderLineitem line : purchaseorder.getItems()) {
                    Optional<Product> optp = productRepository.findById(line.getProductid());

                    if (optp.isPresent()) {
                        Product product = optp.get();

                        // product details
                        cell = new Cell().add(new Paragraph(product.getId())
                                .setFont(font)
                                .setFontSize(12)
                                .setTextAlignment(TextAlignment.CENTER));
                        table.addCell(cell);

                        cell = new Cell().add(new Paragraph(product.getName())
                                .setFont(font)
                                .setFontSize(12)
                                .setTextAlignment(TextAlignment.CENTER));
                        table.addCell(cell);

                        cell = new Cell().add(new Paragraph(((Integer) product.getQoo()).toString())
                                .setFont(font)
                                .setFontSize(12)
                                .setTextAlignment(TextAlignment.CENTER));
                        table.addCell(cell);

                        cell = new Cell().add(new Paragraph(formatter.format(product.getCostprice()))
                                .setFont(font)
                                .setFontSize(12)
                                .setTextAlignment(TextAlignment.RIGHT));
                        table.addCell(cell);

                        MathContext mc = new MathContext(9, RoundingMode.DOWN);
                        BigDecimal qty = new BigDecimal(product.getQoo());
                        cell = new Cell().add(new Paragraph(formatter.format(product.getCostprice().multiply(qty, mc)))
                                .setFont(font)
                                .setFontSize(12)
                                .setTextAlignment(TextAlignment.RIGHT));
                        table.addCell(cell);

                        sub = sub.add(product.getCostprice().multiply(qty, mc), mc);
                        tax = sub.multiply(new BigDecimal(0.13), mc);
                        tot = sub.add(tax, mc);
                    }
                }

                // purchaseorder totals
                cell = new Cell(1, 4).add(new Paragraph("Sub Total:"))
                        .setBorder(Border.NO_BORDER)
                        .setTextAlignment(TextAlignment.RIGHT);
                table.addCell(cell);

                cell = new Cell().add(new Paragraph(formatter.format(sub)))
                        .setTextAlignment(TextAlignment.RIGHT);
                table.addCell(cell);

                cell = new Cell(1, 4).add(new Paragraph("Tax:"))
                        .setBorder(Border.NO_BORDER)
                        .setTextAlignment(TextAlignment.RIGHT);
                table.addCell(cell);

                cell = new Cell().add(new Paragraph(formatter.format(tax)))
                        .setTextAlignment(TextAlignment.RIGHT);
                table.addCell(cell);

                cell = new Cell(1, 4).add(new Paragraph("PO Total:"))
                        .setBorder(Border.NO_BORDER)
                        .setTextAlignment(TextAlignment.RIGHT);
                table.addCell(cell);

                cell = new Cell().add(new Paragraph(formatter.format(tot)))
                        .setTextAlignment(TextAlignment.RIGHT)
                        .setBackgroundColor(ColorConstants.YELLOW);
                table.addCell(cell);

                document.add(table);
            }

            document.add(new Paragraph("\n\n"));
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd h:mm a");
            document.add(new Paragraph(dateFormatter.format(LocalDateTime.now()))
                    .setTextAlignment(TextAlignment.CENTER));

            document.close();
        } catch (Exception ex) {
            Logger.getLogger(PurchaseOrderPDFGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }

        // finally send stream back to the controller
        return new ByteArrayInputStream(baos.toByteArray());
    }
} // PurchaseOrderPDFGenerator
