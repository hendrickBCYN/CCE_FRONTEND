# Stage 1 : Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Injecter le Google Client ID au moment du build Vite
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

COPY . .
RUN npm run build

# Stage 2 : Production 
FROM nginx:stable-alpine

# Copier la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build Vite depuis le stage précédent
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
