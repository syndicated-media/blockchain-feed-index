#!/bin/bash

nonce=$RANDOM
url='http://rss.acast.com/varvet#'${nonce}
urlA='http://rss.acast.com/varvet#'${nonce}a
urlB="${url}b"
urlC="${url}c"

./test.sh create $urlA
./test.sh update $urlA $urlB
./test.sh delete $urlB
./test.sh create $urlC
./test.sh transfer $urlC 03f811d3e806e6d093a4bcce49c145ba78f9a4b2fbd167753ecab2a13530b081f8
