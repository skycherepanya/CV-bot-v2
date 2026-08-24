FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# The puppeteer image uses user 'pptruser'. We need root to install/chown stuff if needed, but it's better to stick to pptruser
USER pptruser

# Copy package files
COPY --chown=pptruser:pptruser package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY --chown=pptruser:pptruser . .

# Start the bot
CMD ["npm", "start"]
