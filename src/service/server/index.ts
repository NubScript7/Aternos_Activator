import { Hono } from "hono"
import { dev } from "./development.js";
import { messenger } from "../messenger/index.js";
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from "@hono/node-server";

export const server = new Hono()

server.route("/aternos", dev)
server.route("/messenger", messenger)
server.use('/static/*', serveStatic({ root: './' }))
