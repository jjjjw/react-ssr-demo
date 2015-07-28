from json import dumps as json_dumps
from json import loads as json_loads
from os import path
from tornado import gen
from tornado import ioloop
from tornado import web
from tornado.httpclient import AsyncHTTPClient


http_client = AsyncHTTPClient()
SSR_URL = "http://localhost:8081/render"


@gen.coroutine
def ssr(path, page_data):
    """Post to an external Node service to render React components to HTML."""

    if isinstance(page_data, basestring):
        page_data = json_loads(page_data)

    body = json_dumps(dict(
        page_data=page_data,
        path=path,
    ))

    try:
        response = yield http_client.fetch(SSR_URL,
          headers={"content-type": "application/json"},
          request_timeout=0.5,
          method="POST",
          body=body)
    except Exception as err:
        """The fetch is intentionally fail-soft."""
        raise gen.Return(None)

    raise gen.Return(response.body)


class HelloHandler(web.RequestHandler):

    @gen.coroutine
    @web.removeslash
    def get(self):

        page_data = dict(
            message="Hello world"
        )

        app_html = yield ssr("/hello", page_data)

        self.render("hello.html", app_html=app_html, page_data=json_dumps(page_data))


application = web.Application([
    (r"/hello", HelloHandler),
],
  static_path=path.join(path.dirname(__file__), "static")
)


if __name__ == "__main__":
    application.listen(8080)
    ioloop.IOLoop.current().start()
