FROM node:lts-alpine as builder
WORKDIR /observatorio

# Accept backend URL at build time (fallback matches compose host)
ARG BACK_URL=https://back.observatoriopnaes.gru.ifsp.edu.br
ARG VITE_BACK_URL=$BACK_URL
ENV VITE_BACK_URL=$VITE_BACK_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /observatorio/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]