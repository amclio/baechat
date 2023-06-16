# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine as base

LABEL fly_launch_runtime="NodeJS"

# NodeJS app lives here
WORKDIR /app

# Throw-away build stage to reduce size of final image
FROM base as build

# Install PNPM
RUN npm install -g pnpm \
  pnpm setup; \
  mkdir -p /usr/local/share/pnpm &&\
  export PNPM_HOME="/usr/local/share/pnpm" &&\
  export PATH="$PNPM_HOME:$PATH"; \
  pnpm bin -g


# Install node modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


# Copy application code
COPY . .

# Build
RUN pnpm build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

ENV NODE_ENV=production

# Start the server by default, this can be overwritten at runtime
CMD [ "node", "dist/src/app.js" ]
