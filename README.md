# aniplus-helper
Aniplus helper

## features

* [x] download 
* [x] search 

## prepare
`npm install`

## usage
### download
1. execute launcher server. `node server.js`
2. execute aniplus downloader. `node download.js 1335`. `1335` is contentSerial.

### search
basic search command : `node search.js <keyword>`

```
$ node search.js 주문
search keyword [주문]
1812    주문은 토끼입니까?
1823    주문은 토끼입니까?? (2기)
```

search with spacebar : `node search.js "<keyword>"`

```
$ node search.js "주문은 토끼입니까"
search keyword [주문은 토끼입니까]
1812    주문은 토끼입니까?
1823    주문은 토끼입니까?? (2기)
```

search multiple keyword : `node search.js <keyword1> <keyword2> ...`
```
$ node search.js "주문은 토끼입니까" "기어와라"
search keyword [주문은 토끼입니까]
1812    주문은 토끼입니까?
1823    주문은 토끼입니까?? (2기)
search keyword [기어와라]
1248    기어와라! 냐루코양
1335    기어와라! 냐루코양 W
```

## content serial
* example url : http://www.aniplustv.com/#/tv/program_view.asp?gCode=TV&sCode=010&contentSerial=1335
    * content serial is 1335

