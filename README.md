### The Voidback Frontend

> *The nextjs frontend that powers voidback.com*



### Run locally


#### 1) run npm install

```
    $ npm install
```



#### 2) create and setup the ".env.local" file

```
    $ touch .env.local
```

```env
    API_URL=http://0.0.0.0:8000/api/
    GFETCH_URL=http://0.0.0.0:8000/gfetch/
    WS_NOTIFICATIONS_COUNT=ws://0.0.0.0:8000/notifications/count
    WS_ANALYTICS=ws://0.0.0.0:8000/analytics/
```

> Note: change the **0.0.0.0:8000** the django backend url.



#### 3) run dev

```
    $ npx next dev

```




> If you face any issues just create an issue and please contribute to the platform; let's create a community!




- I'll be writing a more comprehensive documentation in a series on **vodiback.com**





