# Hướng dẫn Deploy lên Vercel

## Lưu ý quan trọng về Database

Project này sử dụng 2 database:
1. **PostgreSQL (Prisma)** - Lưu trữ dữ liệu chuyến bay (Flight)
2. **MongoDB** - Lưu trữ dữ liệu đặt vé (Booking)

## Bước 1: Cấu hình Database trên Vercel

### Cấu hình PostgreSQL (cho Prisma/Flight data)

Vercel có tích hợp Postgres miễn phí, hãy làm theo:

1. Vào Vercel Dashboard → Project → Storage
2. Click "Create Database" → chọn "Postgres"
3. Sau khi tạo, Vercel sẽ tự động thêm biến môi trường `POSTGRES_URL`
4. Copy `POSTGRES_URL` và dùng làm `DATABASE_URL` trong Environment Variables

Hoặc bạn có thể dùng các dịch vụ khác:
- **Supabase** (miễn phí): https://supabase.com
- **Neon** (miễn phí): https://neon.tech
- **PlanetScale** (miễn phí): https://planetscale.com

### Cấu hình MongoDB (cho Booking data)

1. Đăng ký MongoDB Atlas (miễn phí): https://www.mongodb.com/cloud/atlas
2. Tạo cluster và database
3. Lấy connection string
4. Thêm vào Environment Variables với tên `MONGODB_URI`

## Bước 2: Thêm Environment Variables vào Vercel

Vào Vercel Dashboard → Project → Settings → Environment Variables, thêm:

```
DATABASE_URL=postgresql://user:password@host:5432/database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key (optional)
```

## Bước 3: Kích hoạt Prisma Data Proxy (Optional)

Nếu không muốn cấu hình PostgreSQL riêng, bạn có thể dùng Prisma Data Proxy:

1. Đăng ký Prisma Cloud: https://www.prisma.io/cloud
2. Lấy API endpoint
3. Thêm vào Environment Variables:
   ```
   PRISMA_CLOUD_API_KEY=your-api-key
   DATABASE_URL="prisma://your-cloud-project-url?api_key=your-api-key"
   ```

## Bước 4: Redeploy

Sau khi cấu hình xong:
1. Vào Vercel Dashboard → Project → Deployments
2. Click "Redeploy" hoặc push code mới lên GitHub

## Lưu ý về Local Development

Để chạy local, bạn cần:
1. Cài đặt PostgreSQL local hoặc dùng Docker
2. Hoặc dùng SQLite local (cần sửa lại prisma/schema.prisma khi dev)

Nếu muốn dùng SQLite cho local dev:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

Sau đó chạy:
```bash
prisma migrate dev
```

## Giải pháp nhanh (Demo)

Nếu chỉ muốn demo nhanh mà không cần database thật:

1. Comment/disabled các API route dùng Prisma:
   - `/api/flights`
   - `/api/cron`
   - `/api/booking/payment` (phần trừ ghế)
2. Hoặc dùng data mock hardcoded trong frontend
