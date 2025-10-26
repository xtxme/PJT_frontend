// 💡 src/lib/api.ts  (ไม่ต้อง "use client")

function stripTrailingSlash(s = "") {
    return s.replace(/\/+$/, "");
}

const isServer = typeof window === "undefined";

/** Base สำหรับฝั่ง Server (หลบ CORS) */
const RAW_ORIGIN =
    (process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL ?? "http://localhost").replace(/\/$/, "");
const RAW_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT ?? "5002";
const SERVER_API_BASE = RAW_PORT
    ? `${stripTrailingSlash(RAW_ORIGIN)}:${RAW_PORT}`
    : stripTrailingSlash(RAW_ORIGIN);

/** ถ้าจำเป็นจริง ๆ ให้ client ยิงออกนอกโดเมน ใช้ตัวนี้ได้ (ปล่อยว่าง = ใช้ rewrites) */
const PUBLIC_ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT ?? "";

/** token ที่ “ไม่ลับ” เท่านั้นถึงจะใส่ได้ (ถ้าลับ อย่าใส่ NEXT_PUBLIC_ เด็ดขาด) */
const PUBLIC_TOKEN = process.env.NEXT_PUBLIC_JWT_SITE_TOKEN || ""; // ถ้าเป็น JWT จริง ๆ ควรย้ายไปฝั่ง server

function buildUrl(path: string) {
    if (/^https?:\/\//i.test(path)) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const base = isServer ? SERVER_API_BASE : stripTrailingSlash(PUBLIC_ENDPOINT);
    return base ? `${base}${normalized}` : normalized; // ถ้าไม่มี base → ใช้ relative path ให้ rewrites ทำงาน
}

type FetchInit = RequestInit & { asJson?: boolean };

async function coreFetch(path: string, init: FetchInit = {}) {
    const { asJson, headers, ...rest } = init;
    const url = buildUrl(path);

    const res = await fetch(url, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(PUBLIC_TOKEN ? { Authorization: `Bearer ${PUBLIC_TOKEN}` } : {}),
            ...(headers || {}),
        },
        cache: rest.cache ?? (isServer ? "no-store" : undefined),
        credentials: rest.credentials ?? "include",
    });

    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
            const j = await res.json();
            msg = j?.message ?? msg;
        } catch {
            try { msg = await res.text(); } catch {}
        }
        throw new Error(msg);
    }

    return asJson === false ? res : res.json();
}

/** ใช้ง่าย ๆ แบบ REST */
export const api = {
    get:  <T = unknown>(path: string, init?: FetchInit) => coreFetch(path, { ...init, method: "GET" }) as Promise<T>,
    post: <T = unknown>(path: string, body?: any, init?: FetchInit) =>
        coreFetch(path, { ...init, method: "POST", body: body != null ? JSON.stringify(body) : undefined }) as Promise<T>,
    put:  <T = unknown>(path: string, body?: any, init?: FetchInit) =>
        coreFetch(path, { ...init, method: "PUT", body: body != null ? JSON.stringify(body) : undefined }) as Promise<T>,
    del:  <T = unknown>(path: string, init?: FetchInit) =>
        coreFetch(path, { ...init, method: "DELETE" }) as Promise<T>,
    patch: <T = unknown>(path: string, body?: any, init?: FetchInit) =>
        coreFetch(path, {
            ...init,
            method: "PATCH",
            body: body != null ? JSON.stringify(body) : undefined,
        }) as Promise<T>,
};

/** ถ้าต้องการ raw Response (เช่นดาวน์โหลดไฟล์) */
export const apiRaw = (path: string, init?: FetchInit) => coreFetch(path, { ...init, asJson: false }) as Promise<Response>;