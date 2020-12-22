FROM node:14 as builder
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN yarn
RUN yarn run build

# production environment
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 