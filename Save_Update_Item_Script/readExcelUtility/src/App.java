// import java.io.*;
// import java.net.HttpURLConnection;
// import java.net.URL;

// import org.apache.poi.ss.usermodel.*;
// import org.json.JSONObject;

// public class App {
//     // Uncomment this when updating exsisting Items
//     private static final String API_ENDPOINT = "/master/updateItemMaster";
//     // Uncomment this when saving new Items
//     // private static final String API_ENDPOINT =
//     // "/master/saveItemMaster";

//     public static void main(String[] args) {
//         String excelFilePath = "/Users/sarthak/Desktop/5Item.xlsx";

//         try (FileInputStream fileInputStream = new FileInputStream(excelFilePath);
//                 Workbook workbook = WorkbookFactory.create(fileInputStream)) {

//             Sheet sheet = workbook.getSheetAt(0); // Assuming the data is in the first sheet

//             // Find the column indices for the columns you want to extract
//             // Only send itemMasterCd column when updating otherwise comment
//             // Only send itemMasterId column when updating otherwise comment
//             int itemMasterId = findColumnIndex(sheet, "ItemMasterId");
//             int itemMasterCd = findColumnIndex(sheet, "Item code");
//             int itemDescription = findColumnIndex(sheet, "Item Description");
//             int uomId = findColumnIndex(sheet, "UOM");
//             int categoryIndex = findColumnIndex(sheet, "CategoryCode");
//             int subCategoryIndex = findColumnIndex(sheet, "SubCategoryCode");
//             int typeIndex = findColumnIndex(sheet, "TypeCode");
//             int disciplinesIndex = findColumnIndex(sheet, "DisciplinesCode");
//             int itemBrandIndex = findColumnIndex(sheet, "ItemBrandCode");
//             int colorIndex = findColumnIndex(sheet, "ColorCode");
//             int usageIndex = findColumnIndex(sheet, "UsageCategoryCode");
//             int quantity = findColumnIndex(sheet, "Quantity");
//             int locatorId = findColumnIndex(sheet, "Locator");
//             int price = findColumnIndex(sheet, "Price");
//             int itemNameIndex = findColumnIndex(sheet, "ItemNameCode");
//             int sizeIndex = findColumnIndex(sheet, "SizeCode");

//             // Iterate over rows starting from the second row
//             for (int i = 1; i <= sheet.getLastRowNum(); i++) {
//                 Row row = sheet.getRow(i);

//                 // Create a JSONObject for the current row
//                 JSONObject jsonPayload = new JSONObject();
//                 // Uncomment this when Adding a new Item and comment the one which sends the
//                 // value of the Cell
//                 // jsonPayload.put("itemMasterId", 0);
//                 // Uncomment this when Updating an Item and Comment the one above.
//                 jsonPayload.put("itemMasterId", getCellValue(row.getCell(itemMasterId)));
//                 // Send itemMasterCd with value 0 when adding new Item
//                 // jsonPayload.put("itemMasterCd", 0);
//                 // Send itemMasterCd with the value of the Column when Updating Exsisting Items.
//                 jsonPayload.put("itemMasterCd", getCellValue(row.getCell(itemMasterCd)));
//                 jsonPayload.put("itemMasterDesc", getCellValue(row.getCell(itemDescription)));
//                 jsonPayload.put("uomId", getCellValue(row.getCell(uomId)));
//                 jsonPayload.put("category", getCellValue(row.getCell(categoryIndex)));
//                 jsonPayload.put("subCategory", getCellValue(row.getCell(subCategoryIndex)));
//                 jsonPayload.put("type", getCellValue(row.getCell(typeIndex)));
//                 jsonPayload.put("disciplines", getCellValue(row.getCell(disciplinesIndex)));
//                 jsonPayload.put("brandId", getCellValue(row.getCell(itemBrandIndex)));
//                 jsonPayload.put("colorId", getCellValue(row.getCell(colorIndex)));
//                 jsonPayload.put("usageCategory", getCellValue(row.getCell(usageIndex)));
//                 jsonPayload.put("quantity", getCellValue(row.getCell(quantity)));
//                 jsonPayload.put("locationId", 20);
//                 jsonPayload.put("locatorId", getCellValue(row.getCell(locatorId)));
//                 jsonPayload.put("price", getCellValue(row.getCell(price)));
//                 jsonPayload.put("vendorId", 8);
//                 jsonPayload.put("minStockLevel", 5);
//                 jsonPayload.put("maxStockLevel", 20);
//                 jsonPayload.put("itemName", getCellValue(row.getCell(itemNameIndex)));
//                 jsonPayload.put("size", getCellValue(row.getCell(sizeIndex)));
//                 jsonPayload.put("endDate", "2024/05/22");
//                 jsonPayload.put("createUserId", "Sonipat-Inv-Admin");
//                 jsonPayload.put("reOrderPoint", "5");

//                 // Print the JSON payload to the console
//                 System.out.println(jsonPayload.toString());

//                 // Send the JSON payload to your API
//                 sendToApi(jsonPayload.toString());
//             }

//         } catch (IOException e) {
//             e.printStackTrace();
//         }
//     }

//     private static int findColumnIndex(Sheet sheet, String columnName) {
//         Row headerRow = sheet.getRow(0);
//         for (int i = 0; i < headerRow.getLastCellNum(); i++) {
//             Cell cell = headerRow.getCell(i);
//             if (getCellValue(cell).equalsIgnoreCase(columnName)) {
//                 return i;
//             }
//         }
//         return -1; // Column not found
//     }

//     private static String getCellValue(Cell cell) {
//         if (cell == null || cell.getCellType() == CellType.BLANK) {
//             return "";
//         }

//         switch (cell.getCellType()) {
//             case STRING:
//                 return cell.getStringCellValue();
//             case NUMERIC:
//                 if (DateUtil.isCellDateFormatted(cell)) {
//                     // Handle date formatting if needed
//                     return cell.getDateCellValue().toString();
//                 } else {
//                     double numericValue = cell.getNumericCellValue();
//                     long longValue = (long) numericValue;
//                     if (numericValue == longValue) {
//                         return String.valueOf(longValue);
//                     } else {
//                         return String.valueOf(numericValue);
//                     }
//                 }
//             case BOOLEAN:
//                 return String.valueOf(cell.getBooleanCellValue());
//             default:
//                 return "";
//         }
//     }

//     private static void sendToApi(String jsonPayload) {
//         try {
//             URL url = new URL(API_ENDPOINT);
//             HttpURLConnection connection = (HttpURLConnection) url.openConnection();

//             // Set up the connection
//             connection.setRequestMethod("POST");
//             connection.setRequestProperty("Content-Type", "application/json");
//             connection.setDoOutput(true);

//             // Write the JSON payload to the connection's output stream
//             try (OutputStream os = connection.getOutputStream()) {
//                 byte[] input = jsonPayload.getBytes("utf-8");
//                 os.write(input, 0, input.length);
//             }

//             // Get the HTTP response code
//             int responseCode = connection.getResponseCode();
//             System.out.println("API Response Code: " + responseCode);

//             // Print the API response
//             try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
//                 String line;
//                 while ((line = br.readLine()) != null) {
//                     System.out.println(line);
//                 }
//             }

//         } catch (IOException e) {
//             e.printStackTrace();
//         }
//     }
// }
