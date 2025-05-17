# AI Data Agent

This is an advanced conversational interface that answers complex business questions from SQL databases. It translates natural language questions into SQL queries, executes them, and provides natural language answers with visualizations.

## Features

- Natural language query processing
- SQL query generation using OpenAI
- Visualization of results with charts and tables
- Interactive conversational UI
- Sample business database with complex relationships

## Architecture

The application consists of:

1. **Frontend**: React application with visualization components using Recharts
2. **Backend**: NestJS API server
3. **Database**: PostgreSQL database with sample business data
4. **AI Integration**: OpenAI's GPT-4 Turbo for query generation and result explanation

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v13+)
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-data-agent.git
   cd ai-data-agent
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies (if in a separate directory)
   cd frontend
   npm install
   cd ..
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and add your OpenAI API key and database connection string.

4. Set up the database:
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Push schema to database
   npm run prisma:push

   # Seed the database with sample data
   npm run seed
   ```

5. Start the development server:
   ```bash
   # Start backend
   npm run start:dev

   # Start frontend (if in a separate directory)
   cd frontend
   npm start
   ```

## Sample Questions

The AI Data Agent can handle complex analytical questions such as:

1. "What were our total sales by product category last quarter?"
2. "Compare customer retention rates between regions over the past 2 years."
3. "Which departments have the highest employee turnover and what's the trend?"
4. "What is the correlation between marketing spend and revenue growth?"
5. "Show me the profitability analysis of our top 5 customers."

## Database Schema

The database includes tables for:
- Products and Categories
- Customers and Regions
- Orders and Order Items
- Employees and Departments
- Marketing Campaigns
- Sales Performance
- Financial Metrics
