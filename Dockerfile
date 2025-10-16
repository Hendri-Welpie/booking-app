FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pacakge-lock.json
RUN npm ci || true
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPy nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]