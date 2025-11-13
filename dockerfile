# Étape 1 : construction du projet React
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : servir le site avec Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Port exposé
EXPOSE 80

# Démarre Nginx
CMD ["nginx", "-g", "daemon off;"]
