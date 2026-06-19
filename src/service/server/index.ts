import { Hono } from "hono"
import { dev } from "./development.js";
import { messenger } from "../messenger/index.js";
import { serveStatic } from '@hono/node-server/serve-static'

export const devServer = new Hono()

devServer.route("/aternos", dev)
devServer.route("/messenger", messenger)
devServer.use('/static/*', serveStatic({ root: './' }))
