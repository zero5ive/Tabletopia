# 1단계: 빌드
FROM node:20-alpine AS builder
WORKDIR /app

# admin 폴더로 이동해서 빌드
COPY admin/package*.json ./admin/
WORKDIR /app/admin
RUN npm install

# user 폴더도 복사 (useWebSocket 참조 때문에)
COPY user/ /app/user/
COPY admin/ /app/admin/

RUN npm run build

# 2단계: nginx 서빙
FROM nginx:alpine
COPY --from=builder /app/admin/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]