#!/bin/bash

endpoint=http://localhost:8000/api/podcasts

header="Content-Type: application/json"

if [ "$1" == "create" ] ; then
	curl $endpoint -H "$header" -X POST \
	-d @<(cat <<EOF
	{
		"method": "$1",
		"url": "$2"
	}
EOF
)
fi
if [ "$1" == "update" ] ; then
        curl $endpoint -H "$header" -X POST \
        -d @<(cat <<EOF
        {
                "method": "$1",
                "currentUrl": "$2",
		"newUrl": "$3"
        }
EOF
)
fi
if [ "$1" == "transfer" ] ; then
        curl $endpoint -H "$header" -X POST \
        -d @<(cat <<EOF
        {
                "method": "$1",
                "url": "$2",
                "newOwnerPublicKey": "$3"
        }
EOF
)
fi
if [ "$1" == "delete" ] ; then
        curl $endpoint -H "$header" -X POST \
        -d @<(cat <<EOF
        {
                "method": "$1",
                "url": "$2"
        }
EOF
)
fi
