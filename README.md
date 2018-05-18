# paperview-js

## Purpose and usage

The javascript client for [paperview-server](https://github.com/adadgio/paperview-server) which allows to view any transformed document in any browser (or mobi browser). A ideal
replacement solution for the legacy *Crocodoc* and *Box View API* clients.

This library is able to display converted assets (see also **paperview-server**) as well as legacy Crocodoc or Box View legacy (svg/html) assets.

## Viewer containers, width, height and scale

The only requirement is to have a container wrapper (ex `#viewer`) with a fixed width and height.

## Example and usage

Check `dist/index.html` and `dist/assets/example1` for code and usage but everything is essentially kept dead simple.

```
<!DOCTYPE html>
...
<style type="text/css">
    body { margin: 0; padding: 0 }
    #viewer { width:100%; height:100% }
</style>
<script src="./paperview.min.js"></script>
</head>
<body>
    <div id="viewer"></div>
    <script type="text/javascript">
        var options = {
            url: './assets/example1/assets',
        }

        var viewer = new PaperView()
        viewer.createViewer('#viewer', options)
        viewer.load()
    </script>
</body>
</html>
```

## Developement

Run `npm run watch` and point a virtual host to `/dist/index.html` (otherwise won't work because of cross origin requests browser constraints).
