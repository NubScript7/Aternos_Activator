import { Hono } from "hono"
import { dev } from "./development";
import { messenger } from "../messenger/index";
import { serveStatic } from '@hono/node-server/serve-static'

export const devServer = new Hono()

devServer.route("/aternos", dev)
devServer.route("/messenger", messenger)
devServer.use('/static/*', serveStatic({ root: './' }))
