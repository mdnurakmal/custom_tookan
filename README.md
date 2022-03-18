
# Instructions

```
GOOGLE_APPLICATION_CREDENTIALS=./key.json
add API Key in .env
```


```
ps -ef | grep node
sudo kill $(ps aux | grep 'app.js' | awk '{print $2}')
sudo forever start app.js
```

https://courrio.docs.apiary.io/

