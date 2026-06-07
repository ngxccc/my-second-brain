Hãy mở các file trong thư mục packages/database/src/services/ và liệt kê toàn bộ các câu lệnh query:                                                                            
 - Cột nào xuất hiện trong điều kiện .where(...)? -> Cần Index.                                                                                                                  
 - Cột nào xuất hiện trong các câu lệnh .join(...)? -> Cần Index.                                                                                                                
 - Cột nào xuất hiện trong .orderBy(...)? -> Cần Index (hoặc composite index).                                                                                                   
                                                                                                                                                                                 
 #### Bước 2: Tự bổ sung các index thiếu vào Schema                                                                                                                              
                                                                                                                                                                                 
 Ví dụ, bạn cần mở file packages/database/src/schemas/order.schema.ts và bổ sung thủ công index cho khóa ngoại:                                                                  
                                                                                                                                                                                 
 ```typescript                                                                                                                                                                   
   // Sửa đổi phần định nghĩa bảng orders:                                                                                                                                       
   export const orders = snakeCase.table(                                                                                                                                        
     "order",                                                                                                                                                                    
     {                                                                                                                                                                           
       ...baseEntity,                                                                                                                                                            
       userId: uuid().notNull().references(() => users.id),                                                                                                                      
       status: orderStatusEnum().notNull().default("pending"),                                                                                                                   
       shippingFee: numeric({ precision: 15, scale: 2 }).notNull(),                                                                                                              
       shippingAddress: text().notNull(),                                                                                                                                        
       totalAmount: numeric({ precision: 15, scale: 2 }).notNull(),                                                                                                              
     },                                                                                                                                                                          
     (table) => [                                                                                                                                                                
       index("order_user_id_idx").on(table.userId), // Bổ sung thủ công                                                                                                          
       index("order_status_idx").on(table.status),   // Bổ sung nếu thường xuyên lọc theo trạng thái đơn hàng                                                                    
     ]                                                                                                                                                                           
   );                                                                                                                                                                            
 ```                                                                                                                                                                             
                                                                                                                                                                                 
 Thực hiện tương tự cho orderItems, quoteItems, quotes, và warehouseStocks (thêm index cho productId).                                                                           
                                                                                                                                                                                 
 #### Bước 3: Tạo và kiểm tra Migration                                                                                                                                          
                                                                                                                                                                                 
 Chạy công cụ migration của dự án để sinh mã SQL và áp dụng vào database local:                                                                                                  
                                                                                                                                                                                 
 ```bash                                                                                                                                                                         
   # Tạo file migration dựa trên thay đổi schema của bạn                                                                                                                         
   bun --filter=database drizzle-kit generate                                                                                                                                    
                                                                                                                                                                                 
   # Áp dụng migration vào database local                                                                                                                                        
   bun --filter=database drizzle-kit migrate                                                                                                                                     
 ```                                                                                                                                                                             
                                                                                                                                                                                 
 Hãy đọc file SQL sinh ra trong thư mục drizzle/ để hiểu chính xác câu lệnh CREATE INDEX hoạt động thế nào.                                                                      
                                                                                                                                                                                 
 #### Bước 4: Kiểm tra hiệu năng thực tế bằng EXPLAIN                                                                                                                            
                                                                                                                                                                                 
 Để chắc chắn index hoạt động, hãy kết nối vào PostgreSQL Client và chạy thử câu lệnh truy vấn của bạn kèm theo từ khóa EXPLAIN ANALYZE:                                         
                                                                                                                                                                                 
 ```sql                                                                                                                                                                          
   EXPLAIN ANALYZE SELECT * FROM "order" WHERE user_id = 'uuid-cua-user';                                                                                                        
 ```                                                                                                                                                                             
                                                                                                                                                                                 
 - Nếu kết quả hiển thị Seq Scan (Sequential Scan): Nghĩa là database đang quét toàn bộ bảng, index của bạn chưa hoạt động hoặc chưa được tạo đúng.                              
 - Nếu kết quả hiển thị Index Scan hoặc Bitmap Index Scan: Nghĩa là truy vấn đã được tối ưu hóa thành công nhờ index bạn tự tay cấu hình.        