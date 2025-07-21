// Skip database initialization if SKIP_DB_INIT is set
process.env.SKIP_DB_INIT = 'true';

const app = require('./backend/src/app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Kpop News Aggregator running on port ${PORT}`);
  console.log('Full-stack application with React frontend and RSS aggregation');
});