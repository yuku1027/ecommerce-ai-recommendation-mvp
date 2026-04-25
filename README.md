# AI 推薦功能 MVP

本專案是奇摩購物 AI 推薦功能的面試前測 MVP。現階段目標是建立可展示的前後端骨架，後續會以規則式推薦模擬 AI 推薦體驗，不代表已完成正式 ML 模型。

## 專案結構

```text
.
├── frontend/  # Next.js + TypeScript
├── backend/   # ASP.NET Core Web API
└── docs/      # 開發計畫與紀錄
```

## 前端啟動

```bash
cd frontend
npm install
npm run dev
```

預設網址：

- Frontend: http://localhost:3000
- API base URL: `NEXT_PUBLIC_API_BASE_URL=http://localhost:5163`

可參考 `frontend/.env.example` 建立本機環境設定。

## 後端啟動

```bash
cd backend
dotnet restore
dotnet run --launch-profile http
```

預設網址：

- API: http://localhost:5163
- Health endpoint: http://localhost:5163/health
- OpenAPI document: http://localhost:5163/openapi/v1.json

後端已設定 CORS，允許本機前端開發網址：

- http://localhost:3000
- http://localhost:3001

## Phase 0 驗證

```bash
cd backend
dotnet build

cd ../frontend
npm run lint
npm run build
```

若使用 Node 20.18.0，Next.js 16 的部分 ESLint 相依套件可能提示需要 Node 20.19+。建議本機升級到 Node 20.19 以上或 22 LTS，以避免工具鏈警告。
