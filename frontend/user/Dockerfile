# 1단계: 빌드
FROM node:20-alpine AS builder
WORKDIR /app

COPY user/package*.json ./user/
WORKDIR /app/user
RUN npm install

COPY user/ /app/user/

RUN npm run build

# 2단계: nginx 서빙
FROM nginx:alpine
COPY --from=builder /app/user/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]