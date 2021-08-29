
const twit = require('twit')

require('dotenv').config();

const config = {
    consumer_key: process.env.API_Key,
    consumer_secret: process.env.API_Secret_Key,
    access_token: process.env.Access_Token,
    access_token_secret: process.env.Access_Token_Secret

}

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const T = new twit(config)

function retweet(searchText) {

    let params = {
        q: searchText + '',
        result_type: 'mixed',
        count: 50,
    }

    T.get('search/tweets', params, function (err_search, data_search, response_search) {

        let tweets = data_search.statuses
        if (!err_search) {
            let tweetIDList = []
            for (let tweet of tweets) {
                tweetIDList.push(tweet.id_str);
            }

            // Call the 'statuses/retweet/:id' API endpoint for retweeting EACH of the tweetID
            for (let tweetID of tweetIDList) {
                T.post('statuses/retweet/:id', { id: tweetID }, function (err_rt, data_rt, response_rt) {
                    if (!err_rt) {
                        // console.log("\n\nRetweeted!)
                    }
                    else {
                        // console.log("\nError... Duplication maybe... " + tweetID)
                        console.log("Error = " + err_rt)
                    }
                })
            }
        }
        else {
            console.log("Error while searching" + err_search)
            process.exit(1)
        }
    })
}

// Run every 60 seconds
setInterval(function () { retweet('#100DaysOfCode'); }, 600000)
setInterval(function () { retweet('#60daysofdsa'); }, 600000/2)
// setInterval(function () { retweet('#zeel11'); }, 600)


app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })