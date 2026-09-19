FROM node:22-alpine

WORKDIR /workspace

# Seed the image with the locked dependency set. The named volume used at
# runtime keeps those dependencies out of the host checkout.
COPY package.json package-lock.json ./
RUN npm ci
