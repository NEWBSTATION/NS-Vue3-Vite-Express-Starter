import { renderToString } from 'vue/server-renderer'
import createApp from './app'

/**
 * Creating the Vue app to the server side and rendering it to HTML string.
 */
export const render = async () => {
  const app = await createApp()
  return await renderToString(app)
}
