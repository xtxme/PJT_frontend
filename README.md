# 📦 PJT Inventory — Frontend (Next.js + React + MUI)

Frontend ของระบบ **PJT Inventory System**  
สร้างด้วย **Next.js 15, React 19, MUI v7, TailwindCSS, Zustand, React Query**  
หน้าที่หลักคือแสดงผลข้อมูลคลังสินค้า การรับ–จ่ายสินค้า การแจ้งเตือนสต็อกต่ำ และรายงานสรุปต่าง ๆ  
โดยเชื่อมต่อกับ Backend ผ่าน REST API

---

## 🧭 เกี่ยวกับโปรเจกต์นี้

**PJT Inventory System** คือระบบจัดการคลังสินค้า เน้นความสะดวกในการดูแลสินค้าคงคลัง 
การแจ้งเตือนสินค้าขาดสต็อก และการออกรายงานอัตโนมัติ เหมาะสำหรับร้านค้าและหน่วยงานขนาดเล็กถึงกลาง
ที่ต้องการระบบภายในควบคุมสต็อก

## 🚀 ขั้นตอนการใช้งาน

### 1️⃣ ติดตั้งเครื่องมือพื้นฐาน
ก่อนเริ่มต้น ควรตรวจสอบว่ามีเครื่องมือเหล่านี้ในเครื่องแล้ว:
- [Node.js 22+](https://nodejs.org/)
- [pnpm](https://pnpm.io) (สามารถเปิดใช้งานผ่าน `corepack enable`)
- [Docker](https://www.docker.com/) และ Docker Compose

---

### 2️⃣ ติดตั้ง Dependencies
ติดตั้งแพ็กเกจทั้งหมดที่จำเป็นสำหรับการพัฒนา:

- pnpm install

### 3️⃣ ตั้งค่า Environment Variables
คัดลอกไฟล์ตัวอย่าง .env.example แล้วแก้ไขค่าตามเครื่องของคุณ:

- cp .env.example .env

### 4️⃣ รันระบบด้วย Docker Compose (โหมด Production)
สร้างและรัน container ของโปรเจกต์ทั้งหมด:

- docker compose up -d

### 5️⃣ รันระบบในโหมดพัฒนา (Local Development)
ถ้าต้องการรันโดยตรงจากเครื่องแทน Docker:

- npm run dev