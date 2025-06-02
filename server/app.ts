import { Hono } from 'hono'
import { logger } from 'hono/logger';
import { expensesRoute } from './routes/expenses';
import { serveStatic } from 'hono/bun';

const app = new Hono()


app.use(logger())

app.route("/api/expenses", expensesRoute)

app.get('*', serveStatic({ root: './FrontEnd/dist' }))
app.get('*', serveStatic({ path: './FrontEnd/dist/index.html' }))

export default app;  