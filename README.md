
# Trace Data Quality Analyser

Created with [Nx](https://nx.dev).

## Requirements

- [Git](https://git-scm.com/) - Version 2 or higher
- [Node.js](https://nodejs.org/) - Version 16 or higher
- [Docker]() - Docker Compose

## Setup

1. Clone the repository and change directory

   ```bash
   git clone https://github.com/Teclead-Ventures/tlv-timemanagement.git
   ```

   ```bash
   cd trace-data-quality-analyser
   ```

2. Setup MongoDB Docker Instance
   ```bash
   docker-compose up -d
   ```

3. Install dependencies
   ```bash
   npm install
   ```
4. Setup [Environment Variables](#environment-variables)
5. Start the local development server

   ```bash
   # starts frontend & backend concurrently
   npm run dev
   ```

   ```bash
   # starts one of frontend or backend
   npm start backend
   npm start frontend
   ```

6. Open the browser and open
  1. http://localhost:4200 for frontend
  2. http://localhost:3000/api for backend

### Environment Variables

create a `.env` in the root of the project with the following content. The values wrapped in curly brackets you need to ask one of the maintainers of the project.

```bash
NODE_ENV='development'
PORT='3000'
NX_API_URL='http://localhost:3000'
NX_APP_URL='http://localhost:4200'
NX_DB_URL='{{DB_URL}}'
NX_LOOPS_API_KEY='{{LOOPS_API_KEY}}'
NX_GITHUB_TOKEN='{{GITHUB_TOKEN}}'
NX_GITHUB_REPO='{{GITHUB_REPO}}'
NX_GITHUB_OWNER='{{GITHUB_OWNER}}'
ELASTICSEARCH_INDEX='{{ELASTICSEARCH_INDEX}}'
ELASTICSEARCH_URL='{{ELASTICSEARCH_URL}}'
ELASTICSEARCH_USERNAME='{{ELASTICSEARCH_USERNAME}}'
ELASTICSEARCH_PASSWORD='{{ELASTICSEARCH_PASSWORD}}'
```


## Connecting to an Observed System

To connect the Trace Data Quality Analyser to your system for trace data analysis, you need to set up Elasticsearch as the backend for trace data and configure an exporter in your system's OpenTelemetry (OTel) setup. Follow these steps:

### Prerequisites
Ensure you have Elasticsearch set up and accessible. You will need the Elasticsearch URL, index, username, and password.

### Step 1: Configure Elasticsearch in `.env`
1. Obtain the necessary credentials and endpoint information for your Elasticsearch instance.
2. Update the `.env` file in the root of the Trace Data Quality Analyser project with the Elasticsearch details:

   ```bash
   ELASTICSEARCH_URL='your_elasticsearch_endpoint'
   ELASTICSEARCH_INDEX='your_index_name'
   ELASTICSEARCH_USERNAME='your_username'
   ELASTICSEARCH_PASSWORD='your_password'
   ```

### Step 2: Setup OTel Configuration for the Observed System
1. In your observed system, locate or create an OTel configuration file (often named `otel-config.yml`).
2. Configure the OTel to export trace data to your Elasticsearch instance by adding an Elasticsearch exporter. Use the following template, replacing the placeholders with your actual Elasticsearch credentials and endpoint:

   ```yaml
   exporters:
     elasticsearch/trace:
       endpoints: [ "your_elasticsearch_endpoint" ]
       traces_index: your_index_name
       api_key: your_api_key
   service:
     pipelines:
       traces:
         exporters: [elasticsearch/trace]
   ```

### Step 3: Verify Connection
- Ensure your observed system is correctly configured to send trace data to Elasticsearch.
- Start the Trace Data Quality Analyser and verify it is correctly reading and analyzing trace data from Elasticsearch.

### Additional Notes
- The OTel collector configuration might vary based on the specific setup and version of the OTel collector used. Ensure to consult the OTel documentation for the most accurate configuration options.

