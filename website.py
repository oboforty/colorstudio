from os.path import realpath, dirname, join
from flask import render_template, request, Response

from eme.entities import load_settings
from eme.website import WebsiteApp


class HomeController:
    def __init__(self, server):
        #self.server = server
        self.group = "Home"

    def index(self):
        return render_template('/index.html', err=request.args.get('err'))

    def post_save(self):
        path = f'public/project.json'
        content = request.form['content']
        with open(path, 'w') as fh:
            fh.write(content)
        return '{}'


class GeoEditor(WebsiteApp):

    def __init__(self):
        # eme/examples/simple_website is the working directory.
        script_path = dirname(realpath(__file__))
        conf = load_settings(join(script_path, 'config.ini'))

        super().__init__(conf, script_path)

        self.load_controllers({
            "Home": HomeController(self)
        }, conf['routing'])


if __name__ == "__main__":
    g = GeoEditor()
    g.start()
